-- Add prompt_hash column for fast exact matching
-- Run this in your Supabase SQL Editor

-- 1. Add the new column
ALTER TABLE semantic_cache ADD COLUMN IF NOT EXISTS prompt_hash TEXT;

-- 2. Create index for lightning-fast lookups (<10ms)
CREATE INDEX IF NOT EXISTS idx_cache_hash 
ON semantic_cache(user_id, model, prompt_hash);

-- 3. Backfill existing rows with hashes (fixed for text columns)
UPDATE semantic_cache 
SET prompt_hash = encode(digest(prompt, 'sha256'), 'hex')
WHERE prompt_hash IS NULL;

-- 4. (Optional) Add NOT NULL constraint after backfill
-- ALTER TABLE semantic_cache ALTER COLUMN prompt_hash SET NOT NULL;

-- Verification query (should return row count)
SELECT COUNT(*) as total_rows, 
       COUNT(prompt_hash) as rows_with_hash 
FROM semantic_cache;
