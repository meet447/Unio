import logging
from typing import List, Dict, Optional
import uuid
from supabase import Client
from openai import AsyncOpenAI
import pypdf
import docx
from fastapi import UploadFile
import io

from config import supabase_admin
from auth.check_key import fetch_api_keys, get_provider_by_name

logger = logging.getLogger(__name__)

class VaultService:
    @staticmethod
    async def get_embedding_client(user_id: str) -> AsyncOpenAI:
        """
        Get OpenAI or OpenRouter client for embeddings.
        """
        # 1. Try OpenAI first
        provider = get_provider_by_name("openai", user_id)
        if provider:
            keys = fetch_api_keys(user_id, provider_id=provider['id'])
            if keys:
                return AsyncOpenAI(api_key=keys[0].get('encrypted_key'))
        
        # 2. Try OpenRouter as fallback
        provider = get_provider_by_name("openrouter", user_id)
        if provider:
            keys = fetch_api_keys(user_id, provider_id=provider['id'])
            if keys:
                # OpenRouter requires base_url
                base_url = "https://openrouter.ai/api/v1"
                return AsyncOpenAI(api_key=keys[0].get('encrypted_key'), base_url=base_url)

        raise ValueError("No API keys found for OpenAI or OpenRouter. Please configure one of them to use Knowledge Vault.")

    @staticmethod
    async def create_vault(user_id: str, name: str, description: str = None) -> Dict:
        res = supabase_admin.table('vaults').insert({
            "user_id": user_id,
            "name": name,
            "description": description
        }).execute()
        return res.data[0]

    @staticmethod
    async def list_vaults(user_id: str) -> List[Dict]:
        res = supabase_admin.table('vaults').select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return res.data

    @staticmethod
    def list_documents(vault_id: str, user_id: str) -> List[Dict]:
        res = supabase_admin.table('vault_documents').select("*").eq("vault_id", vault_id).order("created_at", desc=True).execute()
        return res.data

    @staticmethod
    async def delete_vault(vault_id: str, user_id: str):
        # Verify ownership via RLS or explicit check? Admin client bypasses RLS, so we must be careful.
        # We explicitly check user_id match in delete query.
        res = supabase_admin.table('vaults').delete().eq("id", vault_id).eq("user_id", user_id).execute()
        return res.data

    @staticmethod
    async def upload_document(
        vault_id: str, 
        user_id: str, 
        file: UploadFile
    ) -> Dict:
        content = ""
        filename = file.filename
        
        # Read file into memory
        file_bytes = await file.read()
        file_stream = io.BytesIO(file_bytes)
        
        if filename.lower().endswith(".pdf"):
            try:
                reader = pypdf.PdfReader(file_stream)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        content += text + "\n"
            except Exception as e:
                logger.error(f"Error parsing PDF {filename}: {e}")
                raise ValueError(f"Failed to parse PDF: {e}")
                
        elif filename.lower().endswith(".docx"):
            try:
                doc = docx.Document(file_stream)
                for para in doc.paragraphs:
                    content += para.text + "\n"
            except Exception as e:
                logger.error(f"Error parsing DOCX {filename}: {e}")
                raise ValueError(f"Failed to parse DOCX: {e}")
        else:
            # Assume plain text
            try:
                content = file_bytes.decode("utf-8")
            except UnicodeDecodeError:
                 raise ValueError("File content must be UTF-8 text.")
        
        if not content.strip():
             raise ValueError("Extracted text is empty.")

        # Check if vault belongs to user (Security)
        # Using admin client, so we must verify manually
        v_check = supabase_admin.table('vaults').select("id").eq("id", vault_id).eq("user_id", user_id).execute()
        if not v_check.data:
            raise ValueError("Vault not found or access denied.")

        # Store Document Metadata
        doc_res = supabase_admin.table('vault_documents').insert({
            "vault_id": vault_id,
            "filename": filename,
            "file_type": filename.split('.')[-1] if '.' in filename else 'txt'
        }).execute()
        if not doc_res.data:
             raise ValueError("Failed to create document record.")
             
        document_id = doc_res.data[0]['id']
        
        # Chunking strategy: Simple character split with overlap
        # Ideal: RecursiveCharacterTextSplitter from langchain, but avoiding extra heavy deps for now.
        chunk_size = 1000
        overlap = 200
        chunks = []
        start = 0
        while start < len(content):
            end = start + chunk_size
            chunk_text = content[start:end]
            chunks.append(chunk_text)
            start = end - overlap
            if start < 0: start = 0 # should not happen
        
        # Unique chunks only to save cost/space? No, contexts might differ.
        if not chunks:
             # Content was small
             chunks = [content]

        # Generate Embeddings & Store
        try:
            client = await VaultService.get_embedding_client(user_id)
        except ValueError as e:
            # Clean up document entry if embedding fails
            supabase_admin.table('vault_documents').delete().eq("id", document_id).execute()
            raise e
            
        # Batch processing
        batch_size = 20 # OpenAI limits are high but safe batching is good
        total_chunks = len(chunks)
        
        for i in range(0, total_chunks, batch_size):
            batch = chunks[i : i + batch_size]
            try:
                resp = await client.embeddings.create(input=batch, model="text-embedding-3-small")
                
                rows = []
                for j, emb_data in enumerate(resp.data):
                    rows.append({
                        "vault_id": vault_id,
                        "document_id": document_id,
                        "content": batch[j],
                        "embedding": emb_data.embedding
                    })
                
                supabase_admin.table('vault_embeddings').insert(rows).execute()
            except Exception as e:
                logger.error(f"Embedding generation failed for batch {i}: {e}")
                # continue or fail? If one batch fails, the search might be incomplete.
                # Better to fail and cleanup? Or partial?
                # For now, let's fail hard to ensure consistency
                supabase_admin.table('vault_documents').delete().eq("id", document_id).execute()
                raise ValueError(f"Embedding generation failed: {e}")
            
        return doc_res.data[0]

    @staticmethod
    async def retrieve_context(vault_id: str, user_id: str, query: str, limit: int = 5) -> List[str]:
        # 1. Get client
        try:
            client = await VaultService.get_embedding_client(user_id)
        except ValueError:
            logger.warning("Skipping retrieval: OpenAI provider unavailable.")
            return []

        # 2. Embed query
        try:
            resp = await client.embeddings.create(input=query, model="text-embedding-3-small")
            query_embedding = resp.data[0].embedding
        except Exception as e:
            logger.error(f"Query embedding failed: {e}")
            return []
        
        # 3. Search via RPC
        try:
             res = supabase_admin.rpc(
                 'match_vault_embeddings',
                 {
                     'query_embedding': query_embedding,
                     'match_threshold': 0.4, # Adjust threshold
                     'match_count': limit,
                     'p_vault_id': vault_id
                 }
             ).execute()
             
             # Filter by score if needed, but RPC handles threshold.
             return [item['content'] for item in res.data]
             
        except Exception as e:
            # Check if it is "function not found" error
            if "function" in str(e) and "does not exist" in str(e):
                logger.error("RPC match_vault_embeddings not found in database. Search disabled.")
            else:
                logger.error(f"Vector search failed: {e}")
            return []
