# 776BC proposal approvals

Custom Teamwear and the 776BC Content & Copy Skill for Claude post to `/api/proposal-approvals`.
The Calliope Telegram Pilot was superseded by the Skill proposal on 30 September 2026: its page now
forwards to `/776bc/proposals/776bc-content-copy-skill/` and no longer ships a signing script, but its
contract stays registered so stored records keep their own terms. The separate Cloudflare Worker
`optiflows-proposal-approvals` uses a dedicated `proposal_approvals` table in the
existing `optiflows-leads` D1 database. It does not change the lead-capture Worker.

The server owns the proposal version, full text, consent, fee and payment terms
in `workers/proposal-contract.json` (Teamwear) and
`workers/proposal-contract-calliope.json` (Calliope) and
`workers/proposal-contract-copy-skill.json` (Content & Copy Skill). Update the matching snapshot with each proposal
version. Never silently reinterpret an earlier signed record against new terms.

Calliope sends `proposal_id: 776bc-calliope-telegram-pilot`; omitted IDs retain the
original Teamwear contract and retry hash. Unknown IDs and mismatched consent or
version are rejected. Notification amounts, scope, next steps and private links
are specific to the stored proposal. Calliope has no Teamwear PMA/payment terms.
The Skill proposal sends `proposal_id: 776bc-content-copy-skill`, version 1.1 (the shortened edition; nobody signed 1.0). It is a full approval of
scope, fixed fee and payment terms (50% on approval, 50% on release to the pilot), not approval in
principle, so its notification reads "approved" and carries the payment line.
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
Content & Copy Skill rollback: restore the forwarding pages and index from the commit before
its publication and the prior Worker version 0ea6c653-f209-42b6-a3f5-e08c7b6ed1cb (the Skill
contract went live in 3861ee9c-24eb-41cc-9ae4-01bf20a75cb2 on 30 September 2026; v1.1 is
Worker version 59c46975-9745-44ac-900e-dfd0c65a7621).
Workbench Feedback Loop (proposal_id 776bc-workbench-feedback-loop, v1.0, A$2,400 ex GST, 15 November 2026):
contract in workers/proposal-contract-workbench-feedback-loop.json, live in Worker version
787b5686-a2b7-4189-8185-307f2b8b10ed; rollback restores 59c46975-9745-44ac-900e-dfd0c65a7621 and the index
from the commit before its publication.
Custom Teamwear v1.8 (18 November 2026, A$16,800 ex GST at A$350/hour, staged-programme framing; nobody signed v1.7):
contract in workers/proposal-contract.json, live in Worker version fad7e1ff-cdaf-4215-8829-bfb2580174e1; rollback restores
787b5686-a2b7-4189-8185-307f2b8b10ed and the proposal page, approval script and index from the commit before its publication.
Custom Teamwear v1.9 (18 November 2026): the approved proposal is itself the agreement for Discover and Design, so it is a full
approval of scope, fee, payment and general terms (first A$8,400 due on approval), no longer approval in principle with a separate PMA.
Its notification reads "approved" and carries the payment line. Live in Worker version e6cd6b40-1d39-4d83-8721-46d5253fe195;
rollback restores fad7e1ff-cdaf-4215-8829-bfb2580174e1 (v1.8) and the proposal page and approval script from the commit before it.
Nobody signed v1.8.
Custom Teamwear v2.0 (18 November 2026): same terms as v1.9, with Outputs 1-4 listed in the Investment section. Live in Worker
version 30a385ab-2e55-42d0-9a38-1c9df8153dc9; rollback restores e6cd6b40-1d39-4d83-8721-46d5253fe195 (v1.9) and the page and
approval script from the commit before it. Nobody signed v1.9.
Preserve all stored approval records and secrets.
Do not revert the database or modify the existing enquiry service.
