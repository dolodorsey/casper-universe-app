-- Fix user_stats table: add brand_id and unlocked columns

-- Add brand_id column
ALTER TABLE user_stats ADD COLUMN brand_id TEXT;

-- Add unlocked column
ALTER TABLE user_stats ADD COLUMN unlocked BOOLEAN DEFAULT false;

-- Add foreign key constraint for brand_id
ALTER TABLE user_stats ADD CONSTRAINT user_stats_brand_fkey FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE;

-- Drop existing primary key
ALTER TABLE user_stats DROP CONSTRAINT user_stats_pkey;

-- Add composite primary key (user_id, brand_id)
ALTER TABLE user_stats ADD PRIMARY KEY (user_id, brand_id);
