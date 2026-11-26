-- 2026-11-27: signed-copy confirmation email (Resend) with the rendered signed PDF.
ALTER TABLE proposal_approvals ADD COLUMN confirmation_status TEXT;
ALTER TABLE proposal_approvals ADD COLUMN confirmation_message_id TEXT;
ALTER TABLE proposal_approvals ADD COLUMN confirmation_pdf_key TEXT;
ALTER TABLE proposal_approvals ADD COLUMN confirmation_checked_at TEXT;
