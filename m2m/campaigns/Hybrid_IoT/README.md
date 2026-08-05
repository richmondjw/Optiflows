# Iridium 9604 Hybrid IoT Campaign — Review Pack

**Published path:** https://optiflows.com.au/m2m/campaigns/Hybrid_IoT/
**Pack date:** 30 Jun 2026
**Pack ID:** `iridium-9604-campaign-pack`
**Source:** `~/.openclaw/workspace/campaigns/iridium-9604-2026-06-30/iridium_9604_campaign_pack.html`

## What this is

A single self-contained HTML campaign pack for the Iridium 9604 hybrid IoT campaign. Same pattern as `m2m/M2M-One-NZ/`. Reviewers open the URL, walk the pack, and leave pinned notes.

## Files

- `index.html` — the campaign pack (720 KB, fully self-contained, no companion folders needed)

## Comments module — local-only by default

The review-comments module ships in local-only mode (each reviewer's notes stay in their own browser, exported via the **Download notes (JSON)** button).

To switch to shared-live mode and reuse the existing M2M One NZ comments backend, edit `index.html` and find the config block near the end of `<script>`:

```js
var REVIEW_BACKEND = { url: "", pollMs: 5000 };
var REVIEW_DOC = "iridium-9604-campaign-pack";   // already set, do not change
```

Set `REVIEW_BACKEND.url` to the deployed endpoint (the same `comments.php` or Cloudflare Worker URL used by the M2M One NZ pack). `REVIEW_DOC` is already unique to this pack so notes will not collide with the NZ pack on a shared backend.

## To republish after edits

1. Rebuild the source pack: `cd ~/.openclaw/workspace/campaigns/iridium-9604-2026-06-30 && python build_pack.py`
2. Copy across: `cp iridium_9604_campaign_pack.html <this-folder>/index.html`
3. Commit + push from the Optiflows repo.

## Removing this campaign

Delete this folder, commit, push. The URL returns 404.
