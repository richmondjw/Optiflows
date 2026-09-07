# October 2026 production pack verification

**Status:** Pass for private OptiFlows review, with four external-release gates open

**Checked:** 7 September 2026, Australia/Sydney

**Scope:** Campaign review artefacts only

## Verified inventory

| Group | Count | Verification |
|---|---:|---|
| Licensed reference photographs | 4 | Reopened, rendered and recorded in the provenance ledger |
| AI-assisted text-free masters | 4 | Reopened and rendered at 1856 by 2304 pixels |
| Instagram and Facebook feed exports | 4 | 1080 by 1350 pixels |
| Story and Reel cover exports | 4 | 1080 by 1920 pixels |
| Website and email hero exports | 4 | 1600 by 900 pixels |
| Motion exports | 4 | Silent H.264 MP4; three at 1080p and one review file at 720p |
| Production media files | 24 | Unique SHA-256 hashes in `asset-manifest.json` |
| Calendar drops | 9 | Filterable by week and channel |
| Copy-deck rows | 12 | Social, email and website copy with alt text and attribution |
| Website activation studies | 4 | Homepage, What's On, Insider Picks and route/article module |

## Browser and interaction checks

- A fresh browser session shows the OptiFlows password gate.
- The page carries `noindex`, `nofollow`, `noarchive`, `nosnippet` and `noimageindex` metadata.
- All 29 page images loaded.
- All 34 internal page and download targets returned HTTP 200.
- All five video instances, including the repeated hero clip, loaded metadata.
- The asset filters, calendar filters, copy buttons and desktop/mobile activation control worked.
- Desktop width 1440 had zero horizontal overflow.
- Mobile width 390 had zero horizontal overflow.
- The browser console contained no errors.

Headless Chrome cancelled four open MP4 range requests when the QA page closed. This is expected stream teardown, not a missing-file failure: each video reached metadata-ready state and every direct HTTP check returned 200.

## Quality decisions

- The first generated Chapter 01 motion contained visible cyan banding and was rejected. The review pack uses a clean, deterministic 1080 by 1920 slow camera treatment instead.
- Chapters 02 and 03 passed visual review at 1080 by 1920.
- Chapter 04 passed visual review at 720 by 1280. It remains a review asset and needs a 1080 by 1920 rerender before external use.

## External-release gates

1. Run the 72-hour source readback before using dated event language.
2. Confirm Coolart access or publish the documented Western Port fallback.
3. Confirm Chapter 03 booking details and Chapter 04 route and hospitality inventory.
4. Rerender Chapter 04 motion at 1080 by 1920 before external use.

The OptiFlows review pack is ready to publish. No Peninsula Insider site, newsletter, social channel or campaign schedule has been changed or authorised by this verification.
