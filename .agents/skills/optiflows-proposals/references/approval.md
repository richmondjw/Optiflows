# Signature and PDF behaviour

The existing Calliope implementation uses an HTML signature canvas, explicit consent, a Formspree POST, browser localStorage and `window.print()`. The teamwear implementation is at `776bc/proposals/776bc-custom-teamwear/approval.js`. Inspect the current source before reuse. The endpoint is an existing production destination; do not submit tests to it or copy it into unrelated clients' infrastructure without authorisation.

Required adaptation:
- New proposal identifier, slug, version, date, page title, submission subject and storage key for every proposal/revision.
- Name, role, date, signature and explicit scope/fee consent. Never pre-check consent or manufacture a signature.
- Retain mouse/touch/stylus support and clearing; preserve ink through resizing.
- Submit proposal identity/version, exact consent, fee, payment milestones, scope snapshot, signer details, signature, timestamp, page URL and record ID.
- Disable repeat submission while pending. Show success only after an HTTP success response; failure retains the form and permits deliberate retry. Keep the same record ID on an unchanged retry to aid reconciliation. This is not server-enforced deduplication.
- Keep local persistence proposal/version-specific. Do not restore an approval for changed terms. Use textContent for signer text. Make `[hidden]` authoritative in screen and print CSS so hidden forms or blank signature blocks do not reappear after submission.
- Explain that submission sends details/signature to OptiFlows through Formspree and stores a browser copy. Do not claim identity verification, tamper-proof storage, a central register, or guaranteed email delivery based only on HTTP acceptance.
- Use 'approval submitted' for the local record. A reload of localStorage is evidence of that browser's stored record, not a fresh server verification.

For Discovery with a separate PMA, consent must say approval is in principle, name the scope and fee, and require the PMA before commencement. Keep invoice triggers tied to the correct signing event. Never silently convert proposal approval into execution of the PMA.

PDF controls invoke browser print and instruct users to choose Save as PDF. Do not describe this as a generated downloadable file unless implemented. Show blank acceptance lines before signing and the actual approval record after successful submission. A material proposal change requires a new version and approval; retain an approved version when revising an already accepted proposal.

Test without external side effects using a stubbed fetch/transport. Cover missing fields/ink/consent, failure and retry, in-flight duplicates, successful record rendering, persistence unavailable, reload/version mismatch, and print button invocation. Visual print checks should include both unsigned and signed states. Do not send real or dummy approvals merely to check the endpoint.
