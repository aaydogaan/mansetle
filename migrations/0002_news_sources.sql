CREATE TABLE news_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE source_feed_items (
  id BIGSERIAL PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES news_sources(id) ON DELETE RESTRICT,
  external_url TEXT NOT NULL,
  external_title TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_id, external_url)
);

CREATE INDEX source_feed_items_source_seen_idx
  ON source_feed_items (source_id, last_seen_at DESC);

CREATE INDEX source_feed_items_published_idx
  ON source_feed_items (published_at DESC NULLS LAST);
