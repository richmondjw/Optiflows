---
target: the Where is PI? Case 01 campaign review package
total_score: 17
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 3
target_identity: "file:/mnt/c/Users/James/Projects/optiflows-where-is-pi-review-20260919/campaigns/peninsula-insider-where-is-pi/index.html"
target_fingerprint: "sha256:6843ea2ddd9c19d08def2f55e495d169480488f8c3856a98b2c30056dceef712"
target_path: /mnt/c/Users/James/Projects/optiflows-where-is-pi-review-20260919/campaigns/peninsula-insider-where-is-pi/index.html
timestamp: 2026-09-18T23-40-38Z
slug: campaigns-peninsula-insider-where-is-pi-index-html
---
Method: dual-agent (A: general-purpose design review · B: general-purpose detector/evidence). Browser inspection unavailable this session (Chrome extension not connected); evidence is source, detector JSON and full-resolution renders of every export.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Page states PRIVATE REVIEW, 00 scheduled, Still held / Not authorised. Tiles carry no slide counter or review stamp (spring tiles do). |
| 2 | Match system / real world | 2 | "Deterministic PI type", "GPT Image 2", "Higgsfield" pills are production jargon. Motion labelled 9:16; file is 834x1112 (3:4). Week 3 cards captioned "with urgency copy" are the unchanged Week 1 images. |
| 3 | User control and freedom | 2 | Week filters work. No lightbox or full-resolution view; the approver cannot inspect a tile at the scale defects live at. |
| 4 | Consistency and standards | 1 | CTA URL is play.peninsulainsider.com.au on feed tile, hero, copy panel and provenance, but peninsulainsider.com.au on carousel-05 and story-03. Two ambers on one tile. Green ground vs Harbour lock. Wordmark treatment differs from every prior PI asset. |
| 5 | Error prevention | 1 | Missing-glyph box shipped after the URL on feed tile, hero and story-03. Provenance local_path points at exports/ while plates live in masters/; review_file names a file that does not exist. No pre-flight caught any of it. |
| 6 | Recognition rather than recall | 3 | Calendar deep-links to sections; copy panel sits under the assets. Approver must remember Week 3 images are Week 1 images. |
| 7 | Flexibility and efficiency | 2 | Four filter buttons only; no download-all, no side-by-side with the spring reference. |
| 8 | Aesthetic and minimalist design | 2 | Page is fine (inherited). Tiles: hard black offset drop shadow on every text line of every painted tile; hero stacks four lines over the busiest region; story-02 leaves 60% empty; carousel-03 leading collapses between the venue and "Jackalope". |
| 9 | Error recovery | 1 | No error states; a failed image is a grey block. The page presents defective exports as finished. |
| 10 | Help and documentation | n/a | Single-purpose approval page; the evidence block is the documentation. |
| Total | | 17/36 (47%) | Poor |

## Design Specificity Verdict

Category-interchangeable, with one authored moment. A campaign titled "Where in the Peninsula is PI?" contains no PI. On none of the eleven assets does the brand's one irreplaceable asset appear: no akubra silhouette leaving the frame, no dog on a rope lead, no terracotta figure, no pi-avatar.svg, no pi-mark.svg, no witness, no copper-amber clue glow. The three plates are handsome plein-air landscapes with nobody in them. "Can you find her?" is printed over paintings in which there is nothing to find. Remove the wordmark and these are tourism-board tiles for any coastal town in Australia. The one authored moment is the Mornington plate's light under "She took her coffee to go." That line is genuinely PI; everything built on top of it is generic.

Layer by layer:
- Page vs assets: the page is a near byte-for-byte clone of the spring template, on the Harbour palette, with the correct pi-site-icon.svg masthead. It is on brand. The assets under it are not: five of ten static tiles (carousel-01/03/05, story-02/03) sit on #072620, a near-black green, with a #FFAE2A accent. Neither exists in the v6 tokens. creative-provenance.json declares dark_ground #0B2E4A and warm_signal #F5C177; the exports contradict their own receipt.
- Assets vs assets: two ambers on story-03. Feed tile and hero are the same plate with the same headline, so the Week 1 post and the Week 2 hero are visually one post. Carousel-02 is the feed tile again with a translucent "01". Four towns promised, two illustrated.
- Assets vs spring: spring tiles carry a consistent frame: white masthead pill top-left (icon + Peninsula Insider), REVIEW ONLY · UNPUBLISHED top-right, sand slide-counter disc bottom-left, asset ID and date bottom-right, Harbour-deep ground, flat clean type. This campaign has none of that furniture; its wordmark is plain amber capitals with a hard black shadow.
- Assets vs the approved STYLE FORMULA: gouache over cel-shaded characters, terracotta figures, one copper-amber glow, and explicitly "no gradients, no dark scrims, no film grain." Carousel-04 and story-02 are a green scrim over a plate; carousel-01 is a blurred plate under a scrim; the plates contain zero characters.

Deterministic scan (impeccable detect, target page): 29 findings, 18 unique. low-contrast x13 (nine are #63727c on #f2efea at 4.3:1; four are Sand #F5C177 as text on cream at 1.4 to 1.6:1, which the v6 tokens forbid: Sand is for dark grounds only), undersized-ui-text x7 (9 to 10px status, summary and week labels), all-caps-body x3, tiny-text, wide-tracking, hero-eyebrow-chip, kicker-above-heading, cream-palette, marketing-buzzword (truncation artefact, false positive). Baseline on the spring page: 258 raw findings, so by the detector's measure this page is the cleaner of the two; the detector cannot see inside the tiles, which is where this campaign's problems are.

Visual overlays: not available; browser extension not connected.

## Overall Impression

The wrapper is right and the contents are wrong. The review page is a competent clone of spring with correct governance and a correct masthead. The eleven things it asks James to approve are off-palette, off-formula, missing the character the campaign is named for, carry shipped text defects, and represent one week of assets presented as three. The single biggest opportunity is to put PI in it: re-plate with the approved formula so she is leaving every frame, rebuild the flat slides as the game's own notebook on Harbour-deep, and run every tile through the spring/October renderer so the chrome is on brand by construction.

## What's Working

1. The headline and the Mornington plate. Eight words, dry, specific, unmistakably PI's world; the plate's light is place-grounded rather than tropical. This pairing is the campaign.
2. Governance scaffolding. noindex/nofollow/noarchive plus a robots.txt disallow that correctly notes the meta tag is authoritative; PRIVATE REVIEW; 00 scheduled; the Confirmed / Still held / Not authorised triad; a provenance receipt.
3. Copy discipline. No em-dashes, no exclamation marks, no tourism adjectives on any tile. The voice rules were followed even where the design was not.

## Priority Issues

[P0] Five of ten static tiles are on the wrong brand palette. Why it matters: this is the "not quite on brand" feeling made measurable; half the carousel and two-thirds of the story set will sit in the grid beside spring tiles on Harbour-deep and read as a foreign brand; the STYLE FORMULA also bans dark scrims. Fix: rebuild every non-illustrated tile on #0B2E4A with Sand #F5C177 as the only accent; replace scrims with the spring approach (illustration bleeding in at the base of a flat ground); un-scrim carousel-04; add a palette assertion to the export step so an off-token hex fails the build. Suggested command: $impeccable colorize, then $impeccable harden.

[P0] Shipped text defects on the exports. (a) A missing-glyph box after the URL on feed tile, hero and story-03; root cause verified: none of the shipped Sora/Figtree subsets contain U+2192, and the tiles were rendered somewhere with no fallback font; the same character renders correctly through the October renderer on this machine. (b) CTA URL is peninsulainsider.com.au on the two CTA slides (carousel-05, story-03) and play.peninsulainsider.com.au everywhere else, including the copy James approved. (c) Carousel-03 fragments the approved prize line across five lines with collapsed leading. (d) Story-03 drops "Jackalope". Why it matters: a tofu box in a public post is a credibility hole; a wrong URL on the click-driving slides sends players to the magazine, not the game; the prize line no longer says what was approved. Fix: SVG arrow or none; one URL string sourced from creative-provenance.json copy.cta on every tile; set the prize line as the approved sentence with $250 as the only emphasised token. Suggested command: $impeccable typeset for (a)(c)(d); $impeccable harden for (b).

[P1] PI is absent from a campaign about finding PI. Why it matters: Brand OS 3.3 makes the persona the protected, irreplaceable asset, and the game brief specifies her exactly (sun hat, terracotta linen, tote, small scruffy dog, always leaving the frame). Without her the "find her" promise has no object. Fix: re-prompt the plates with the byte-identical STYLE FORMULA plus the PI figure exiting right at small scale, and make that the hook; replace the stock "?" on carousel-01 with pi-avatar.svg; set pi-mark.svg where the text wordmark is. Suggested command: $impeccable delight, then $impeccable shape.

[P1] Three weeks promised, one week of assets shown; the copy panel spoils the game. Week 2 has one card; Week 3 re-shows feed tile and carousel-01 pixel-unchanged under "urgency" captions; the calendar lists an urgency tile and countdown stories that do not exist. The copy panel's mechanic line prints the correct route (Mornington to Cape Schanck to Main Ridge to Red Hill), the answer to Case 01. Fix: build the Week 2/3 variants or relabel honestly; cut the route from all public copy. Suggested command: $impeccable clarify.

[P1] The motion piece does not match its description or its slot. File is 834x1112, 5.04s, no type, no wordmark, no CTA; the page calls it 9:16 for Stories and Reels and posters it with a 9:16 frame. Fix: re-render at 1080x1920 with the sun-arc as the animated element, ending on the CTA card; correct the label; same-ratio poster; ffprobe aspect check in the page build. Suggested command: $impeccable animate, then $impeccable harden.

[P2] Single-card .wide-grid blows the feed tile to full shell width. repeat(auto-fit,minmax(280px,1fr)) with one child renders FEED-01 at up to ~1620px wide; spring uses repeat(3,...). Fix: repeat(3,minmax(0,1fr)) for portrait groups; auto-fit only for the 16:9 hero. Suggested command: $impeccable layout.

[P2] Hard drop shadows and busy-region type placement on the painted tiles. Every text line on feed tile, hero, carousel-02 and story-01 carries a black offset shadow; the hero stacks four lines over the bathing boxes and tents; "CASE 01" is illegible against the sand path. Fix: drop the shadow; place type on the calm sky or water region, or use the spring pattern of a flat Harbour band with the plate bleeding in. Suggested command: $impeccable typeset, then $impeccable polish.

## Persona Red Flags

Jordan (first-timer): never learns who PI is; "Case 01", "deterministic PI type", "GPT Image 2", "Higgsfield" are opaque; reads "Can you find her?", looks for a person in the painting, finds none.

Riley (stress tester): counts towns (4 promised, 2 shown); clicks Week 3 and sees Week 1 again; diffs the URLs across slides; watches the motion poster snap from 9:16 to 3:4; finds provenance local_path pointing at files that live elsewhere and review_file naming a file that does not exist; zooms the feed tile and finds the tofu box.

Casey (distracted mobile): at 680px and below the status pill and calendar-summary labels are 9px, under the 12px floor; the carousel row becomes a 2-column grid with an orphan fifth slide; story-02 on a phone is a headline in the top third and 60% blank green.

James (the approver): cannot approve from the page and cannot inspect from it; the provenance receipt he is asked to trust states a Harbour lock the tiles violate; the copy block says "approved by James (Option A)" while three tiles deviate from that copy; he is asked to release a three-week calendar with one week of assets and a caption that gives away the solution; the prize partner is still unconfirmed while the prize is baked into finished artwork on three tiles.

## Minor Observations

- Page title and several alt strings use em-dashes against the house rule; the tiles are clean.
- "Sound on." on a static carousel slide (carousel-04) belongs on the motion piece only.
- Two "$250" treatments (Sand on story-03 and carousel-02, orange elsewhere).
- Brand OS 7.2 says avoid promo-heavy or sale-led; a slide that is 60% "$250" (carousel-03) is that.
- Feed caption on the page reads "$250 to dine at..." while the tile reads "$250 at..."; hero adds a full stop the feed tile lacks.
- Hero-art caption "Original Higgsfield illustration · deterministic PI type" is production vocabulary, not review vocabulary.
- pi-site-icon.svg (Cormorant serif P) and pi-mark.svg (akubra silhouette) are two visual systems; the page uses the first, the tiles use neither.
- creative-provenance.json: brand_lock is correct but unenforced; local_path and review_file are stale.
- The compositor that produced these tiles was never committed (the three "typography" commits touched only exported images), so the exports cannot be regenerated from source today. The October campaign's asset-renderer.html is the reusable, on-brand pattern.
- carousel-02 at 437KB and story-01 at 592KB should be re-encoded before any upload.

## Questions to Consider

1. Where is PI? What if every plate hid her silhouette (akubra, tote, dog, exiting right) at a different scale, and the feed tile itself were the first puzzle a follower solves before tapping through?
2. Why is the carousel a text deck when the game is a painted world? Slides 2 to 4 could be the notebook: kraft paper, a witness line in quotes, a rubber stamp for Mornington.
3. Should the prize lead at all? The brand is wine-country restraint; the game's experience formula is "the player feels like a local who is in on the secret." What if the hook is the mystery and the prize is the footnote?
4. Why a five-second loop of water when the game's signature is a sun that only moves when you do? One plate, sun arcing from 8:10am to last light as the headline resolves, ending on "Play."
5. If there are four stops, why three plates? A four-plate set makes the carousel the route (without naming it), gives Weeks 2 and 3 real assets, and lets the closing tile be Montalto at golden hour, where she is finally found.
