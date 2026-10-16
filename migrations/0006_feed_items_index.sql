CREATE INDEX IF NOT EXISTS source_feed_items_last_seen_idx
  ON source_feed_items (last_seen_at DESC);
