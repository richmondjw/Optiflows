---
target: the Where is PI? Case 01 campaign review package
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
target_identity: "file:/mnt/c/Users/James/Projects/optiflows-where-is-pi-review-20260919/campaigns/peninsula-insider-where-is-pi/index.html"
target_fingerprint: "sha256:7642173809b4697bccba285602ed8f5b75679285447f08ea2d151d16112b0d50"
target_path: /mnt/c/Users/James/Projects/optiflows-where-is-pi-review-20260919/campaigns/peninsula-insider-where-is-pi/index.html
timestamp: 2026-09-19T02-06-31Z
slug: campaigns-peninsula-insider-where-is-pi-index-html
---
Method: dual-agent (A: design review · B: detector/evidence), second run after the 2026-09-19 rebuild. Browser inspection unavailable (Chrome extension not connected). Note on ordering: Assessment B returned before A, so the parent saw detector output first; A ran fully isolated and unanchored, which is what the protocol protects.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Status pill, three-stat summary, per-tile badges, Confirmed / Still held / Not authorised. Undercut by a count that disagreed with a calendar item and by never disclosing that the exports are watermarked review renders. |
| 2 | Match system / real world | 3 | Speaks campaign language, but nothing is shown in context (no feed grid, no phone frame) and internal codes leaked into the reader's view. |
| 3 | User control and freedom | 3 | Week filters, lightbox with actual pixels, Esc and backdrop close. Filtering to a week leaves the calendar and evidence on screen, so it is not a week view. |
| 4 | Consistency and standards | 2 | The page contradicted its own artefacts: "PI leaving every frame" (three tiles have no PI), route_in_public_copy false while the calendar named two route stops, prize on eight tiles against a receipt saying four. |
| 5 | Error prevention | 2 | Real engineering (guard, manifest, font assertion, release-badge assertion, per-plate sha256) checking the cheap things. The route check was three hand-written phrases; the palette check read one file's hex literals. The guard printed clean over a pack that published the answer. |
| 6 | Recognition rather than recall | 3 | Counts, dimensions, codes, evidence lists all labelled. To spot the leak the approver had to hold the route in his head and identify towns by sight. |
| 7 | Flexibility and efficiency | 3 | Filters, 1:1 lightbox, keyboard-operable tiles, provenance and renderer linked. No zip, no deep links. |
| 8 | Aesthetic and minimalist design | 3 | Handsome and disciplined. Hero duplicated an asset shown below and cropped it badly; three near-identical navy slabs early; a mixed-ratio pair in a three-column row. |
| 9 | Error recovery | 1 | No error state, and no channel to raise a problem: no comment, no reject, no per-tile verdict. The reviewer's only output was to leave. |
| 10 | Help and documentation | 4 | The best thing on the page. The triptych, the honest motion caption, codes and dimensions on every card, provenance one click away. |
| Total | | 27/40 (67.5%) | Acceptable, one point off Good |

Baseline for comparison: 17/36 (47%, Poor) on 2026-09-18, with 2 P0 and 3 P1.

## Design Specificity Verdict

Split. The copy and the illustration commission are unmistakably authored for this game; the tile system carrying them is a generic dark-slab social template.

Authored: "She took her coffee to go." / "The sun moves only when you do." / "Three witnesses at every stop. One of them is sending you the wrong way." That is the game's own logic turned into ad copy, holding the voice under prize-mechanic pressure without a single tourism adjective. And the character holds across every plate from one image reference: same straw hat, terracotta linen, cream tote, rope lead, same always-leaving posture, four towns, three aspect ratios, recognisable at thumbnail size.

Category-interchangeable: thirteen of fourteen tiles are the same object (brand pill, badge, kicker, 88px headline, deck, rule, CTA, footnote, hard cut into landscape). Nothing in the system knows it is advertising a detective game. The game's own interface furniture, specified in the brief, is the ready-made design language and none of it appears: no case file, no kraft notebook, no rubber stamp, no copper-amber clue glow, no sun-arc clock, no hand-drawn map.

Against the approved STYLE FORMULA the plates miss: the prompts are byte-identical to it, the outputs are warm-realist digital painting in deep perspective with an amber palette, where the formula asks for impressionist gouache, broken brushwork, cel-shaded characters with ink contours, flat frontal perspective, and cream sand, sea-glass teal, eucalypt sage and dusk violet. Brand OS 7.4 names the result: over-saturated tourism-board gloss. The guard checks that the prompt string matched, never the output.

Against the spring reference the two packs share their review chrome and nothing else: spring is parchment, indigo, cyanotype collage, small restrained type; this is navy-dominant, 88px display, saturated landscape realism. The review chrome travelled and the design language did not.

Deterministic scan: page 29 findings to 7; renderer 4 to 0. The seven are all inherited spring-template conventions (kicker above heading, hero eyebrow chip, tracked small caps x3, cream page ground). Guard clean across palette, copy-to-provenance, solution leak, dimensions and em-dashes.

## Overall Impression

The rebuild fixed what the first critique found, and the second critique found something worse underneath: the campaign was publishing the solution to the game it advertises. Everything mechanical is now in good order. What remains is one strategic question the mechanics cannot answer, which is whether these paintings are the right paintings.

## What's Working

1. Character consistency across seventeen generation-2 plates from a single image reference. Hard, and done well.
2. Copy that holds the voice under prize-mechanic pressure: eight tiles carry a prize, a URL and a deadline without one exclamation mark or tourism adjective.
3. The honesty architecture: Confirmed / Still held / Not authorised, the dashed pending treatment, a motion caption that volunteers its own inadequacy, a watermark burned into every export and a release mode that refuses to ship one either way round. Someone deliberately made it hard to mistake this for finished work.

## Priority Issues

[P0, FIXED] The campaign published the answer to the game. The plate schedule was the correct route in order across three weeks; feed-02's deck reused the witness tell that resolves the final venue; the page named two route stops in plain text. Fixed by moving Weeks 2 and 3 and both mechanic tiles to Sorrento, Flinders and Arthurs Seat, the three towns the brief already authors as wrong turns, and by rewriting the guard to fail on any solution name, the venue, five tells, or a route-stop plate rendered by any tile. Recorded as spoiler_policy in the receipt.

[P0, OPEN, James's call] The hook slide may not read as PI. carousel-01 is the supplied pi-concierge disc: a multi-tone floppy sun hat with flowing hair, filling the lower right. The reviewer read it as an orange crab or a mango. BRAND-PI and BOS 7.5 specify a single-tone silhouette, akubra not fedora, popped collar, notebook in the pocket, no face, already moving on, and that mark exists unused in the same folder as pi-avatar.svg. This is the swipe-decision frame and PI is the protected brand asset, so it is not mine to overrule: James supplied this artwork deliberately. Options are keep, scale down so the disc sits whole, or switch to pi-avatar.svg.

[P1, FIXED] Internal codes and illegible disclosure on published creative. Every tile carried FEED-01-style codes, and on generation-2 plates the caption sat on sunlit awnings at roughly 1.5:1. Codes removed from the tiles; the illustration disclosure moved onto the flat ground beside the badge.

[P1, FIXED] Story tiles violated Instagram safe areas. Brand mark at 6.25% sat under the story header; counter and meta at 8.8% sat in the reply-bar band. Rebuilt to 250px clear top and bottom.

[P1, OPEN, James's call] The plates match neither the game's approved style nor the publication's reference campaign. Either re-prompt toward the formula so the ad matches the product, or formally retire the formula as this campaign's basis and record why. Related: every prompt reserved a calm upper third for a headline and the renderer covers 34 to 48 percent with an opaque navy slab, so the reserved sky is paid for and discarded.

[P2, FIXED] The page documented everything and asked for nothing, and four claims contradicted the receipt. Added a decision block stating the question, the default and the two holds that actually gate release; reconciled the counts, the every-frame overclaim and the prize placement.

## Persona Red Flags

Jordan (first-timer): the word game appears nowhere in the hero; "Case 01", "plate", "generation-2" have no glossary; the hook slide does not introduce PI at the moment the design intends to.

Riley (stress tester): in the lightbox, dragging to pan toggles zoom off instead; filtering to a week leaves the calendar and evidence on screen; reshares link nowhere; and before this pass, reading route_in_public_copy false six inches under a calendar naming Main Ridge was enough to stop trusting the guard.

Casey (distracted mobile): three 9:16 frames at about 105px on a phone made a third of the pack unreviewable (now two-up); the lightbox hands a 1080px image to a 390px viewport with no pinch affordance.

James (the approver): was being asked for a global yes on a surface where every individual problem was invisible, on a pack that published the game's answer, with a receipt that disagreed with the artwork on three counts.

## Minor Observations

- hero-wide's deck has two question marks in one sentence and a title's interrogative colliding with the sentence verb.
- carousel-04's deck breaks "One of / them"; its opening curly quote is not hung, so line one sits about 20px right of the two below.
- hero-wide and hero-wide-02, and the three feed tiles, are near-identical compositions: as a three-week feed presence it is close to one picture shown six times.
- The prize puts a dollar figure on eight tiles against BRAND-PI's no-pricing house rule. The rule's stated reasoning (prices go stale) plainly does not apply to a fixed prize, but the CI lint and the campaign are in silent contradiction and BRAND-PI should carry a one-line exemption.
- brand_lock records pi-concierge.svg superseding a BOS Layer 7.5 mark, campaign-locally, with no BOS update and no record of the EIC gate that BOS 3.3 makes non-delegable for character-led campaigns.
- Storing the prior critique score inside the artefact's own provenance invites the next reviewer to anchor on it.
- Three commissioned plates are held unused under spoiler_policy while Mornington is reused across several tiles.

## Questions to Consider

1. If the campaign had shown the route, was the game still a deduction game, or was the trailer the walkthrough? Teasing the decoys makes the campaign part of the puzzle instead of the spoiler.
2. Seventeen bespoke plates each reserved a calm sky for the headline, and every tile covers that sky with a flat navy rectangle. What is the slab protecting, and is it worth what it costs?
3. The spring pack and this one share a watermark and nothing else. Which one is Peninsula Insider? If spring, this needs re-grounding, not re-cropping. If this, Brand OS Layer 7 needs rewriting, because it currently describes spring.
4. The guard printed clean on a pack that published the answer. What is a guard for, if it only catches what you would have caught by eye?
5. PI's language is single-tone silhouette, no face, akubra not fedora, functional not glamorous, already moving on. Is the hook slide that, or a stock illustration of a woman in a hat?
