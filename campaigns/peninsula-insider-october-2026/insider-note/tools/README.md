# Peninsula Insider draft transfer

This desk creates an **unscheduled beehiiv draft**, after approval of the exact import body, subject and preheader. It has no subscriber send or scheduling action.

1. Start **Open PI Email Desk.cmd** local launcher on James’s computer.
2. Open the October Insider Note review page and choose **Connect beehiiv**. Allow the local connection window and, if the browser requests it, access to this computer’s local email desk.
3. Review the **beehiiv import layout** and select the subject/preheader pair.
4. Select **Approve this version for a beehiiv draft**.
5. Choose **Push approved draft to beehiiv** once. Open the returned beehiiv draft link.

The API key is loaded by the local process from the existing private credential configuration. It is never included in this website, downloads, browser storage or a Git commit. The local connection capability lasts only while the desk process is running and stays in browser memory.

## Approval and duplicates

Approval binds to a SHA-256 hash of the exact request, including subject, preheader and email body. Changing an email requires a new approval. Clearing approval revokes the current server approval when connected.

Transfers are saved locally before creation begins. A repeated push reads the same saved post rather than making another. If creation has an uncertain outcome, the desk blocks another creation until an operator reconciles the result in beehiiv. An asynchronous processing response is checked against the same post ID. The saved receipt records who approved, when, the version and the draft ID.

## Layout

The established email preview retains the canonical Insider Note styling. beehiiv’s documented HTML pipeline removes style and link tags, so a separate, editable, single-column **import variant** uses inline styling. That exact variant is reviewed and transferred. The subject and preheader are set through documented `email_settings` fields.

Read-back compares all approved text in order and all destination links, after decoding HTML entities and collapsing whitespace. Provider wrapper text may appear before/after the intact body; legal/web merge URLs may be resolved. Missing or changed copy and links remain **body verification pending**, with the saved draft link available for reconciliation. The same saved post is reused. This conservative check does not claim pixel-identical HTML.

The provider’s own template and legal footer still wrap the HTML. A successful draft read-back is not an inbox rendering test or send approval. Verify the actual draft in beehiiv, its sender, reply-to, issue number, registered street address, dark mode, Outlook and mobile email previews before scheduling.

## Start manually

```sh
python3 tools/beehiiv_desk.py --root /path/to/insider-note --state /private/path/pi-email-desk --credentials /private/path/beehiiv/env
```

Bind address is only `127.0.0.1:8792`. Mutation requires the ephemeral local token and an allowlisted browser origin. The shared OptiFlows review password is not treated as API authentication.

## Verification boundary

The connected Peninsula Insider publication and current posts have been read successfully. Automated tests exercise approval, stale hashes, duplicate prevention, asynchronous creation and uncertain outcomes with a simulated provider. No October email is approved, transferred, scheduled or sent by installing this tool. The first approved transfer will confirm current account write entitlement and actual beehiiv rendering; an API rejection is surfaced rather than represented as a successful push.

Official API reference: [Create post](https://developers.beehiiv.com/api-reference/posts/create), [Get post](https://developers.beehiiv.com/api-reference/posts/show).

If the hosted page cannot connect because local network access is blocked, allow local access for OptiFlows in the browser’s site permissions and reconnect, or use the launcher’s local review page directly. The local page uses the same version/hash checks and draft-only boundary. [Chrome local network permission reference](https://developer.chrome.com/blog/local-network-access).

## October website approvals

Open `website.html` from the review pack or the local desk. Choose the week and one of the three treatments, connect the existing local desk, confirm the exact proposal, and click Approve and schedule website update. The desk verifies the proposal and component SHA, writes intent before the scheduler call, creates one native OpenClaw one-shot job for Remy, and reads back its owner, exact time and brief. It returns a private downloadable receipt. No public credential or new recurring service is created.

The proposed windows start Wednesdays 7, 14, 21 and 28 October at 08:00 Australia/Melbourne and last seven days. One treatment is permitted per week; conflicting approvals are refused. Duplicate approvals reuse the stored job. An uncertain scheduler result blocks automatic retries until its job is reconciled. This queues work for Remy’s native runtime, not an automatic message into an open Codex chat. Execution is pending until the job completes its source, implementation, review, CI and live checks. No website treatment is approved merely by viewing it.

The human can inspect or cancel the returned job in the existing OpenClaw scheduler. Reconcile cancellation with the stored receipt before replacing a selected treatment; the interface does not silently overwrite or delete a job. The launcher must be running on this Windows/WSL machine when approving. Remote review alone cannot schedule.

## Weekly social tiles

`social-manifest.json` maps three 1080 × 1350 PNG tiles per week to editable HTML layouts and draft captions. `social/tile.css` controls the shared PI typography. Photography stays in separate layers with exact credit beside it; no Visit Victoria photo is transferred to an AI provider. Draft assets remain subject to the listed source and release checks. Social publication and newsletter sending are separate actions.
