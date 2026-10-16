ALTER TABLE news_articles
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_mode TEXT NOT NULL DEFAULT 'auto'
    CHECK (cover_image_mode IN ('auto', 'manual', 'ai', 'none'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('news-covers', 'news-covers', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;
