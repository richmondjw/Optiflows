# Hybrid IoT campaign production verification

## Publishing kit update — 10 September 2026

- One complete publishing ZIP, 12 weekly post ZIPs and eight email copy/design ZIPs.
- 48 PNG social exports preserve the decoded source pixels and dimensions; 12 caption files preserve the exact source strings.
- Five LinkedIn document PDFs contain five ordered pages each. All 25 rendered pages match their source artwork; visual inspection completed.
- Supporting paid-search, retargeting, sales and website copy is included as text, alongside the existing guide and labelled website/motion studies.
- Publishing manifests record actual file hashes, dimensions, source IDs, archive paths and remaining holds.
- Download controls checked at desktop, 390 and 320 CSS-pixel widths; no page overflow at those widths.
- Email packages are not send-ready HTML templates. The week 10 URL field and caption contain different destination forms; the intended public destination requires confirmation. Clinic details and existing release requirements remain unresolved.
- Rebuild with `python tools/build-publishing-kit.py`, then `python tools/refresh-asset-manifest.py`. Text files use LF line endings so delivered hashes survive Git checkout.

**Campaign:** Coverage Beyond the Grid / Iridium Certus 9604 Hybrid IoT<br>
**Checked:** 10 September 2026 (AEST)<br>
**Release layer:** Private OptiFlows review surface only<br>
**Result:** PASS for production-pack build and private-review readiness; external campaign activation remains gated.

## Verified inventory

| Surface | Expected | Observed | Result |
|---|---:|---:|---|
| Weekly campaign concepts | 12 | 12 | PASS |
| Native social exports | 48 | 48 | PASS |
| LinkedIn carousel/document pages | 25 | 25 | PASS |
| Complete email copy and designs | 8 | 8 | PASS |
| In-situ website activation studies | 4 | 4 | PASS |
| Motion studies | 2 | 2 | PASS |
| Calendar touches | 36 | 36 | PASS |
| Readiness guide | 1 | 1 eight-page PDF | PASS |
| Evidence records | 5 | 5 | PASS |
| Activation gates | 6 | 6 | PASS |

## Browser verification

The campaign review page was exercised in Google Chrome through Playwright at:

- 1440 × 1000 desktop;
- 390 × 844 mobile;
- 320 × 720 mobile;
- a 720 CSS-pixel viewport as the 200% desktop-zoom equivalent.

At every viewport:

- the document returned HTTP 200;
- all expected dynamic sections rendered with the counts above;
- no horizontal page overflow was detected;
- no broken image or video element was detected;
- no unexpected failed request, HTTP error, page error or console error was detected;
- the full social-copy dialog and full email-copy dialog opened with substantive content;
- the review-only and not-activated state was present in rendered text.

The separate `/campaigns/` library was checked at 1440 px and 390 px. It
contained four campaign cards, exactly one Hybrid IoT production card, a working
link to this review workspace and no horizontal overflow or broken image.

## PDF verification

`downloads/hybrid-iot-readiness-guide.pdf` was rendered from the controlled HTML
source and inspected page by page. The initial visual pass found clipping on the
operating-map worksheet and evidence-plan pages. Those layouts were corrected,
the PDF was regenerated and all eight pages were reinspected.

The final PDF contains eight pages and extractable text for the four critical
guide statements tested. No missing key statement or visible clipping remained.

## Brand and source integrity

- The placed M2M Connectivity SVG has SHA-256
  `8a5c083ad86dab2d1238cd5a12a6351b985a0ed6e667b113e279dd0e00ed2802`.
- That hash exactly matches the supplied M2M source logo used for this build.
- Titillium Web 400, 600 and 700 are packaged locally; the review surface does
  not depend on an external font service.
- Higgsfield masters remain text-free. Official logo, typography and final copy
  were applied by the deterministic browser renderer.
- The creative provenance record retains source/reference rights states,
  generation model/date/prompt briefs and SHA-256 output receipts.

## Source and package checks

- Campaign-data and production-tool JavaScript syntax checks: PASS.
- Campaign calendar and downloadable manuscript generated from the same
  structured campaign source: PASS.
- Official technical caveat retained: network selection, routing, retry and
  fallback behaviour are implementation choices; the campaign does not claim
  automatic switching or guaranteed coverage/delivery.
- Reusable `m2m-campaign-production` skill schema validation: PASS.
- OpenClaw skill discovery: PASS and model-visible for `m2m-otto`,
  `m2m-marcus`, `m2m-sable`, `m2m-rex`, `m2m-cora`, `m2m-mason`,
  `m2m-herald` and `m2m-guardian`.
- Static package validator, file/link checks and manifest-hash validation: PASS
  after the final manifest build.

## Known limitations and activation boundary

- This report proves the production pack and private review layer, not campaign performance.
- The proposed flight dates have not been activated.
- The two supplied legacy composites have unknown publication rights and are
  retained outside the public release as reference-only inputs; they do not
  appear in final campaign exports.
- Higgsfield job identifiers were not retained in the working folder. Final
  generated outputs are anchored by hashes and retained production briefs.
- Publishing this review page does not modify the live M2M landing page, send
  email, schedule social posts, start paid media, create CRM records, commit a
  price or confirm the proposed design clinic.
- Conversion attribution, lead ownership/SLA, technical claim approval,
  audience approval, paid budget and final release authority remain activation gates.
