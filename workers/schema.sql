CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  received_at TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('stored', 'spam', 'rejected')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  inquiry_type TEXT NOT NULL DEFAULT '',
  cta_location TEXT NOT NULL DEFAULT '',
  estimated_annual_drag TEXT NOT NULL DEFAULT '',
  utm_json TEXT NOT NULL DEFAULT '{}',
  notification_status TEXT NOT NULL CHECK (notification_status IN ('pending', 'sent', 'failed', 'not_configured')),
  notification_checked_at TEXT
);
CREATE INDEX IF NOT EXISTS leads_received_at_idx ON leads(received_at DESC);
