CREATE TABLE IF NOT EXISTS publication_write_limits (
  bucket TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS write_limits_expiry ON publication_write_limits(expires_at);
