-- Initial publication storage schema.
CREATE TABLE IF NOT EXISTS publications (
  public_id TEXT PRIMARY KEY,
  schema_version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
  owner_token_hash TEXT NOT NULL,
  creation_request_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
