# OptiFlows lead capture runbook

## Architecture

Public forms send only to `POST /api/leads`. The Worker writes the D1 record first with server timestamp, source, status and an idempotency key. A notification contains only the record ID and is asynchronous; failure can never reject or remove a stored lead. No client-side or Worker logging may include submitted fields.

## Deploy in order (approval required)

1. Create the D1 database and apply `workers/schema.sql`.
2. Set `ADMIN_API_TOKEN` and, only if an approved internal notification receiver exists, `NOTIFICATION_WEBHOOK_URL` as Worker secrets. The notification receiver must receive an ID only and use the protected export/read path; do not forward lead contents to third parties.
3. Set `PUBLIC_ORIGIN`, deploy the Worker at the same origin, and verify `POST /api/leads` routes to it **before** publishing the form changes.
4. Restrict the export endpoint to an approved operator channel. It returns personal data and must never be placed in logs, tickets or Asana comments.

## Controlled production verification (explicit approval required)

Use a newly created non-personal test identity. Submit once per form surface (homepage, blog, growth, v4), then use the protected operator path to confirm a matching ID, source, received timestamp, `stored` status and notification status. Repeat the same request ID once and verify it is marked duplicate with no second record. Do not paste the returned lead data into work records.

## Monitoring and recovery

- Alert on `notification_status = failed` and on an absence of stored records only through an approved internal monitor. Alerts contain counts and IDs, never lead content.
- Query records with `notification_status = pending` older than five minutes; retry notification by ID through an approved internal job.
- A form error means the client received no durable-storage acknowledgement. It must not claim success.
- The Worker rejects invalid payloads, too-fast submissions and invalid configured Turnstile challenges. Configure `TURNSTILE_SECRET` only together with an approved widget; otherwise the idempotency key and validation remain the active duplicate/spam controls. Do not restore the autofill-prone honeypot.

## Formspree reconciliation and MX verification (explicit approval required)

Do not call Formspree or modify DNS as part of deployment. An approved operator may export recoverable Formspree submissions, map only records not already represented by an idempotency/source/timestamp reconciliation rule, import them into the first-party store with `source = formspree_backfill`, and record aggregate counts only. Verify the receiving mailbox's MX records and a notification receipt separately; never include addresses or submission contents in tickets.
