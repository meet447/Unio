import logging
import json
import hashlib
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
        # 1. Hash-based exact match (fastest, < 10ms with index)
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()
        
        logger.debug(f"🔍 Cache lookup - user_id: {user_id}, model: {model}, hash: {prompt_hash}")
        
        try:
            res = supabase_admin.table('semantic_cache') \
                .select("response, metadata") \
                .eq("user_id", user_id) \
                .eq("model", model) \
                .eq("prompt_hash", prompt_hash) \
                .limit(1) \
                .execute()
            
            logger.debug(f"📊 Hash query executed - data count: {len(res.data) if res.data else 0}")
            
            if res.data:
                logger.info(f"✅ Exact cache hit (hash) for prompt: {prompt[:50]}...")
                return {
                    "response": res.data[0]["response"],
                    "hit_type": "exact",
                    "similarity": 1.0
                }
            else:
                logger.debug(f"❌ Hash lookup returned no results")
        except Exception as e:
            logger.error(f"💥 Hash-based cache lookup failed: {e}")
            import traceback
            logger.error(traceback.format_exc())

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

        # Generate hash for fast exact matching
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()

        try:
            # Store everything as JSON/Text
            # response can be a full OpenAI Response object (dict)
            supabase_admin.table('semantic_cache').insert({
                "user_id": user_id,
                "model": model,
                "prompt": prompt,
                "prompt_hash": prompt_hash,
                "response": response,
                "embedding": embedding,
                "metadata": metadata or {}
            }).execute()
            logger.info(f"Saved response to cache for model: {model}")
        except Exception as e:
            logger.error(f"Failed to save to cache: {e}")
