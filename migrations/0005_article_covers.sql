ALTER TABLE news_articles
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_mode TEXT NOT NULL DEFAULT 'auto'
    CHECK (cover_image_mode IN ('auto', 'manual', 'ai', 'none'));

CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE IF NOT EXISTS storage.buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  public BOOLEAN DEFAULT FALSE
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('news-covers', 'news-covers', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;
