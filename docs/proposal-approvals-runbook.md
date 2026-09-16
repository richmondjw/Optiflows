# 776BC proposal approvals

Both Custom Teamwear and Calliope Telegram Pilot post to `/api/proposal-approvals`. The separate Cloudflare Worker
`optiflows-proposal-approvals` uses a dedicated `proposal_approvals` table in the
existing `optiflows-leads` D1 database. It does not change the lead-capture Worker.

The server owns the proposal version, full text, consent, fee and payment terms
in `workers/proposal-contract.json` (Teamwear) and
`workers/proposal-contract-calliope.json` (Calliope). Update the matching snapshot with each proposal
version. Never silently reinterpret an earlier signed record against new terms.

Calliope sends `proposal_id: 776bc-calliope-telegram-pilot`; omitted IDs retain the
original Teamwear contract and retry hash. Unknown IDs and mismatched consent or
version are rejected. Notification amounts, scope, next steps and private links
are specific to the stored proposal. Calliope has no Teamwear PMA/payment terms.
Calliope's existing commercial content and consent remain unchanged; its stored
contract version is 1.0. Historical browser-only Calliope copies remain under
their original localStorage key; they are not silently promoted or replayed.

The server stores the signature and server timestamp before acknowledging the
browser. Email goes through the existing Formspree form `meelyrkd`, whose email
action is configured for James's Gmail and OptiFlows addresses. Telegram goes
directly through the existing Remy bot to James's private chat. Message previews
are disabled; signatures are not sent in Telegram or the email body.

Private record links use a 256-bit HMAC capability in the URL fragment. Anyone
with the complete link can view the record; treat it as confidential. It is not
indexed, and the API requires the key in a request header. There is no public
record listing. The same proposal page loads and prints the signed record.

## Deploy

Use `workers/wrangler.approvals.jsonc`. Apply `workers/proposal-approvals.sql`
remotely before deploying the Worker. Required encrypted Worker secrets:
`REMY_TELEGRAM_BOT_TOKEN`, `REMY_TELEGRAM_CHAT_ID`, `RECORD_SIGNING_KEY`,
`APPROVAL_ADMIN_TOKEN`. Never put their values in this repository or logs.
Deploy the backend before switching the frontend. Fingerprint the approval.js
URL after every script change to avoid stale CDN copies.

Run `node test/proposal-approvals.test.mjs` (Node 24 with built-in SQLite), plus
`node test/proposal-client.test.mjs` and `node test/lead-capture-contract.test.mjs`. The tests use a real in-memory SQL
database and mocked outbound notifications.

## Verify and recover

GET `/api/proposal-approvals/<uuid>` with `Authorization: Bearer <admin token>`
returns the saved record and each delivery status. `accepted` means the provider
accepted the message, not that the recipient read it. Telegram acceptance also
stores its message ID. Inspect pending/failed/unknown receipts if an alert is
missing. There are deliberately no automatic outbound retries: investigate
provider evidence before an operator resends to avoid duplicates after timeouts.

Repeating the identical submission UUID returns the stored record and does not
send again. Reusing that UUID with changed signer data returns 409.

An authorised live test must use `is_test: true`, the admin bearer token, a
synthetic name containing TEST ONLY, and a synthetic signature. Test records and
all messages remain explicitly labelled; they never represent client approval.
Verify a stored record, both channel receipts, mailbox arrival and a duplicate
submission without extra sends. Public submissions cannot set the test flag.

Calliope rollback: restore its previous frontend and the prior Worker version
4a5f1cf4-63e1-42ae-ad82-734b13d35106; this preserves Teamwear service. Do not
remove the shared approval route when rolling back just one proposal.
Preserve all stored approval records and secrets.
Do not revert the database or modify the existing enquiry service.
