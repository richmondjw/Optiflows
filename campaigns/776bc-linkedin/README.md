# 776BC LinkedIn case study campaign

Published path: `/campaigns/776bc-linkedin/`
Pack ID: `776bc-linkedin-case-study-2026-09-30`
Owner: Optiflows
Status: private review pack; social release held

## Contents

- `pack.json`: source of truth for three exact captions, alt text, intended sequence and release gates.
- `render-assets.mjs`: creates three 1200 × 1500 PNG exports from real Pursuit page frames. It uses the locally installed `@resvg/resvg-js` renderer. No generation service is required.
- `assets/`: final PNG exports for LinkedIn.
- `build-pack.mjs`: renders the static review page and Buffer import CSV from `pack.json`.
- `downloads/buffer-drafts.csv`: UTF-8, Buffer bulk-upload format with one image URL per post and no posting time. Import to the Optiflows LinkedIn channel and choose **Save as Drafts**. No draft or schedule exists just because this CSV exists.

## Source and claims

The editorial and image source is the existing [776BC Pursuit page](/776bc/pursuit/), specifically its premise, pull quote, long read and frames `001`, `002` and `035`. The exact pull quote and long-read excerpt on post 2 are from that page. Frames were visually checked to exclude prominent USA/USRowing kit marks.

The canonical 776BC engagement brief in JWR-TheOne describes a draft-only, human-reviewed media system. It does not independently validate asset-volume, efficiency or performance claims. Those claims are absent here. The operating-model diagram is a proposed editorial process, not a reported commercial result.

## Release

The pack is published for private review behind the site's existing gate and `noindex` metadata. The social posts remain held until 776BC/Lux clears external use, the Optiflows homepage case-study section is live, and a human reviews the imported Buffer drafts. This repo has no Buffer credentials or write-capable endpoint. The available Codex runtime did not expose the configured Buffer connector, so no draft IDs are claimed.

To update: edit `pack.json` and/or `render-assets.mjs`, run `npm ci`, then `node render-assets.mjs` and `node build-pack.mjs`. Inspect exports, commit and deploy. To retire the URL, remove the campaign card and this folder in a reviewed site change.
