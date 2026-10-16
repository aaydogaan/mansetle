ALTER TABLE source_feed_items
  ADD COLUMN IF NOT EXISTS image_url TEXT;
