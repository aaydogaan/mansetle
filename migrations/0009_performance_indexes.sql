-- 0009_performance_indexes.sql
-- Optimizes category listing and slug lookups for maximum speed

CREATE INDEX IF NOT EXISTS news_articles_status_category_published_idx
  ON news_articles (status, category, published_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS news_articles_slug_idx
  ON news_articles (slug);

CREATE INDEX IF NOT EXISTS news_articles_status_published_idx
  ON news_articles (status, published_at DESC NULLS LAST);
