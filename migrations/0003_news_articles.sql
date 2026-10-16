CREATE TABLE news_articles (
  id BIGSERIAL PRIMARY KEY,
  source_feed_item_id BIGINT NOT NULL UNIQUE REFERENCES source_feed_items(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected')),
  ai_model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX news_articles_status_created_idx
  ON news_articles (status, created_at DESC);

CREATE INDEX news_articles_published_idx
  ON news_articles (published_at DESC NULLS LAST);
