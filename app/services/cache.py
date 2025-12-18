import logging
import json
from typing import List, Dict, Optional, Any
from config import supabase_admin
from services.vault import VaultService

logger = logging.getLogger(__name__)

class CacheService:
    @staticmethod
    async def get_embedding(user_id: str, text: str) -> Optional[List[float]]:
        """
        Generate embedding for the given text using the user's configured provider.
        """
        try:
            client = await VaultService.get_embedding_client(user_id)
            resp = await client.embeddings.create(input=text, model="text-embedding-3-small")
            return resp.data[0].embedding
        except Exception as e:
            logger.error(f"Failed to generate embedding for cache: {e}")
            return None

    @staticmethod
    async def find_in_cache(
        user_id: str, 
        model: str, 
        prompt: str, 
        threshold: float = 0.95
    ) -> Optional[Dict]:
        """
        Search for a similar prompt in the semantic cache.
        """
        # 1. Exact match check (fastest, no embedding needed)
        try:
            res = supabase_admin.table('semantic_cache') \
                .select("response, metadata") \
                .eq("user_id", user_id) \
                .eq("model", model) \
                .eq("prompt", prompt) \
                .limit(1) \
                .execute()
            
            if res.data:
                logger.info(f"Exact cache hit for prompt: {prompt[:50]}...")
                return {
                    "response": res.data[0]["response"],
                    "hit_type": "exact",
                    "similarity": 1.0
                }
        except Exception as e:
            logger.error(f"Exact cache lookup failed: {e}")

        # 2. Semantic match check
        embedding = await CacheService.get_embedding(user_id, prompt)
        if not embedding:
            return None

        try:
            # RPC call to find similar embeddings
            res = supabase_admin.rpc(
                'match_semantic_cache',
                {
                    'query_embedding': embedding,
                    'match_threshold': threshold,
                    'match_count': 1,
                    'p_user_id': user_id,
                    'p_model': model
                }
            ).execute()

            if res.data:
                match = res.data[0]
                logger.info(f"Semantic cache hit (score: {match['similarity']:.4f})")
                return {
                    "response": match["response"],
                    "hit_type": "semantic",
                    "similarity": match["similarity"]
                }
        except Exception as e:
            if "function" in str(e) and "does not exist" in str(e):
                logger.error("RPC match_semantic_cache not found in database.")
            else:
                logger.error(f"Semantic cache lookup failed: {e}")
        
        return None

    @staticmethod
    async def save_to_cache(
        user_id: str, 
        model: str, 
        prompt: str, 
        response: Any, 
        metadata: Optional[Dict] = None
    ):
        """
        Save a response to the semantic cache.
        """
        embedding = await CacheService.get_embedding(user_id, prompt)
        if not embedding:
             return

        try:
            # Store everything as JSON/Text
            # response can be a full OpenAI Response object (dict)
            supabase_admin.table('semantic_cache').insert({
                "user_id": user_id,
                "model": model,
                "prompt": prompt,
                "response": response,
                "embedding": embedding,
                "metadata": metadata or {}
            }).execute()
            logger.info(f"Saved response to cache for model: {model}")
        except Exception as e:
            logger.error(f"Failed to save to cache: {e}")
