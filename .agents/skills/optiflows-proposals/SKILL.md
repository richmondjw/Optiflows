---
name: optiflows-proposals
description: Create, revise and publish OptiFlows client proposals using its branded HTML format, proposal index, signature approval and print-to-PDF workflow.
---

# OptiFlows proposals

Produce a concise, commercially coherent client proposal in James Richmond's OptiFlows design language. Use this for proposal documents and their publication, not for unrelated website pages.

## Establish the offer

Use the client's original brief as the primary statement of need. Treat James's working drafts, discussions and solution ideas as inputs to test unless confirmed. Label assumptions, indicative estimates and agreed facts distinctly.

Lead with the client’s ultimate objective and commercial purpose, then the recommended decision and immediate investment. Describe the future customer or staff experience in simple terms. Keep the full-project ambition distinct from the deliverables being approved now. Define phases, deliverables, scope boundaries, client input, timing dependencies, acceptance, payment and the next decision. Use plain British English, executive brevity and concrete language. Never use em dashes. Avoid technology promises that have not been demonstrated.

Keep the proposal, agreement, index summary, signature consent, submitted record and printed acceptance summary consistent. Distinguish a fixed deliverable fee from a capped time allocation. Discovery can precede a separately scoped build. Do not make a prior rate, fee or duration a universal default. Re-estimate when the delivery approach changes and update every commercial and approval surface.

Prefer gathering facts from existing material and short, role-specific questionnaires. Use live walkthroughs for material uncertainty and practical constraints; ask people to confirm a prepared understanding. Automate collation where useful, with human review before treating it as an agreed requirement. Retain checks that protect the actual business outcome.

## Create the document

Read [references/design.md](references/design.md). Reuse the clean repository HTML of an appropriate approved proposal, rather than a browser-saved copy with extension scripts. Keep business content specific to the new engagement. Do not carry over names, dates, deliverables, commercial figures or approval identities by blind replacement.

Prefer one self-contained HTML proposal with embedded fonts; a local relative JavaScript file is appropriate for approval behaviour. Preserve a usable small-screen layout and print styles. The usual structure is cover, proposal summary, decision card, parameters, numbered scope/delivery sections, commercial terms, approval and next step. Adapt section count to the task.

## Signing and PDF

Read [references/approval.md](references/approval.md) before adding or changing signatures, persistence or printing. Choose explicit approval semantics: proposal approval in principle versus execution of contractual terms. Where a separate agreement is required, do not let a web signature imply it has been executed. Do not sign for the client.

## Publishing

Read [references/publishing.md](references/publishing.md) when publication is requested. Prepare and check the result first. Existing explicit user authorisation to publish is sufficient; do not ask again simply because publishing is an external action. A draft-only request does not authorise publication.

For 776BC, publish to `/776bc/proposals/<slug>/` and maintain `/776bc/proposals/` as the client index. For other clients, use their agreed client-specific proposal directory. The old `/proposals/` addresses redirect to the corresponding 776BC destinations. Preserve unrelated proposals and existing controls. Confirm deployment of the actual commit and report verification limits honestly.

## Quality checks

Review the commercial figures and approval scope across all surfaces. Check local links, JavaScript syntax, empty-field validation, signature clearing, failed submission, double submission, successful submission, reload, revision isolation and unsigned/signed printing. Mock approval transport for tests: do not send synthetic signatures to the real endpoint. Check desktop and mobile layouts when browser access is available. Disclose anything that could not be verified.

Do not add a fake security guarantee: noindex is not access control, browser storage is not a central approval database, and a signature drawing is not verified signer identity.
