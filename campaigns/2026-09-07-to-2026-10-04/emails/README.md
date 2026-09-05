# Visible Flow EDM package

Two responsive, table-based HTML email templates for the OptiFlows Visible Flow campaign.

## Included

- `email-01-coordination-drag.html` - recognition and 90-second diagnostic
- `email-02-workflow-test.html` - follow-up self-diagnosis and reply prompt
- `assets/email-01-coordination-drag-hero.jpg` - optimized 1200 x 630 email hero
- `assets/email-02-workflow-test-hero.jpg` - optimized 1200 x 630 email hero
- `assets/email-01-coordination-drag-preview.png` - full rendered review image
- `assets/email-02-workflow-test-preview.png` - full rendered review image
- `visible-flow-email-sequence.md` - subjects, preheaders, plain text and send gates
- `visible-flow-email-sequence.csv` - structured subject and campaign handoff

The HTML templates reference their adjacent `assets/` directory, so the package can be previewed locally after extraction. Before sending through an email platform, either upload the supplied images with the template or replace the relative image paths with these stable hosted URLs:

- `https://www.optiflows.com.au/campaigns/2026-09-07-to-2026-10-04/emails/assets/email-01-coordination-drag-hero.jpg`
- `https://www.optiflows.com.au/campaigns/2026-09-07-to-2026-10-04/emails/assets/email-02-workflow-test-hero.jpg`

## Required merge tags

Replace these placeholders with the syntax required by the selected email platform:

- `{{first_name}}`
- `{{consent_context}}`
- `{{unsubscribe_url}}`

Do not send a template while any placeholder remains unresolved.

## Send gate

Before uploading or sending:

1. Record the consent source and lawful send basis for every recipient.
2. Do not use purchased, scraped or harvested addresses.
3. Confirm OptiFlows sender identification and contact details.
4. Test the unsubscribe link and reply-based unsubscribe route.
5. Confirm requests can be actioned within five working days.
6. Suppress prior opt-outs, replies and invalid addresses from Email 2.
7. Send test messages to Gmail, Outlook and a mobile inbox before launch.

Australian guidance:

- https://www.acma.gov.au/avoid-sending-spam
- https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/direct-marketing

## Sequence logic

- Email 1: Day 0, after consent validation
- Email 2: Day +4 business days, only where there is no reply or unsubscribe
- Stop the sequence on reply, unsubscribe, hard bounce or manual suppression

Email sending and list upload remain separate human approval steps.
