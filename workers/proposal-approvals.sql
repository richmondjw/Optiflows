CREATE TABLE IF NOT EXISTS proposal_approvals (
  id TEXT PRIMARY KEY,
  payload_hash TEXT NOT NULL,
  received_at TEXT NOT NULL,
  is_test INTEGER NOT NULL DEFAULT 0,
  record_json TEXT NOT NULL,
  email_status TEXT NOT NULL DEFAULT 'pending',
  telegram_status TEXT NOT NULL DEFAULT 'pending',
  telegram_message_id TEXT,
  notification_checked_at TEXT
);
CREATE INDEX IF NOT EXISTS proposal_approvals_received ON proposal_approvals(received_at);
