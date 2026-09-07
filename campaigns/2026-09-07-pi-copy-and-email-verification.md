# Peninsula Insider campaign copy and email verification

Date: 7 September 2026

Scope: `peninsula-insider-spring-2026` and `peninsula-insider-october-2026`

Release boundary: private OptiFlows review only

## Finding

The two packs had different completeness problems:

- Spring already contained complete long-form, email, feed and Story writing in its manuscript and structured campaign data. The review page exposed only short summaries, however, and neither motion study had finished overlay copy. It also had no designed email view.
- October contained complete visual exports and short social captions, but its four email entries stopped at subject and preheader. Story sequences and motion overlays were not fully specified, and there was no designed email view.

## Completed repair

- Added four complete, responsive Insider Note email designs to each campaign.
- Added subject, preheader, body, content blocks, CTA, text links, sender hold, subscriber footer, hero alt text and plain-text fallback to all eight emails.
- Added a visible production-copy register to each campaign.
- Completed 22 Spring copy sets: 20 primary channel jobs plus two motion studies.
- Completed 20 October copy sets: website, feed, Story, motion and email for each of four chapters.
- Added copy-to-clipboard handoff controls for complete emails and individual asset briefs.
- Kept volatile event, access, booking, sender, consent and publication checks visible as release gates.
- Kept the October Buffer scheduler unchanged. UI verification blocks every non-GET Buffer request.

## Verification

`node campaigns/verify-pi-campaign-copy.mjs`

- Spring: four emails and 22 complete asset copy sets.
- October: four emails and 20 complete asset copy sets.
- Zero blank required production fields.
- All email hero files exist.
- New production copy contains no em dashes or placeholder text.

`node campaigns/verify-pi-campaign-ui.mjs`

- Desktop and 390 px mobile layouts passed for both campaign packs.
- Four email tabs, one active email, correct asset-register counts and loaded hero media passed.
- Desktop-to-mobile email preview control passed.
- No horizontal overflow or browser console errors were observed.
- Buffer mutation was blocked during verification.

## Authority boundary

This repair makes the two review packs copy-complete and email-design-complete. It does not authorise an email send, social schedule, Peninsula Insider publication, subscriber mutation, spend or removal of any source-read-back gate.
