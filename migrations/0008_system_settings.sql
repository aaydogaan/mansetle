CREATE TABLE IF NOT EXISTS system_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO system_settings (key, value)
VALUES ('system_active', 'true')
ON CONFLICT (key) DO NOTHING;
