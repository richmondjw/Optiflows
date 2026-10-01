# SIZZLE Go-to-Market Launch Strategy

## Goal

SIZZLE is being prepared for launch, not live. The immediate goal is a safe, reviewable public-launch path for Culinary Mastery: establish the commercial offer, validate commerce and access controls, run a small consented pilot, then launch to owned channels only when release gates pass.

Reuse the existing Asana public-launch milestone: https://app.asana.com/1/233540066981051/project/1216946794205955/task/1217068037225619

## Audience and offer

**Approved offer**
- Free: modules 1-2, no account required.
- Home Cook: modules 1-12, A$59 launch price, A$79 standard.
- Full Kitchen: modules 1-19 plus business tools, A$119 launch price, A$149 standard.
- One-time purchase, usable on three devices.
- Launch pricing ends after the first 100 buyers or 14 days, whichever occurs first.
- Upgrade is A$70. This fixed approved amount must be disclosed before checkout and rechecked for customer fairness before activation.

Primary audience: serious Australian home cooks seeking structured foundations, confidence and practical progression. Secondary audience: aspiring small food operators, with food costing and business tools as the Full Kitchen differentiator.

Positioning: **Cook with confidence. Start with the foundations.** Free-module and food-cost-calculator CTAs should lead acquisition. Do not promise cloud sync, safety outcomes, technique guarantees, or testimonials without evidence.

## Domain and registration

Recommend **cookwithsizzle.com**, subject to registrar availability, price, trademark/rights clearance, and confirmation of registrant, ownership and access. RDAP non-registration is not purchase or clearance confirmation.

Fallback: **cook.optiflows.com.au**, only after clean-browser public access and ownership/access are verified. Current probes are inconclusive: cook.optiflows.com.au and optiflows.com.au/campaigns returned 403, while optiflow.com.au/campaigns returned 404.

Assume the Optiflows campaign library at `optiflows.com.au/campaigns` pending James’s spelling reply. Confirm whether the campaign hub is a published site or review document before publication.

## Release gates

No selling until all gates pass:
1. Deploy server-side paid-content gating. Paid content is currently exposed in public JavaScript; the browser paywall is off by default and the Worker is an undeployable 503 stub.
2. Verify a live Lemon Squeezy commerce runtime, including pricing, tax, receipts, licence activation, revocation, refund handling and provider redirects. Gumroad is fallback only.
3. Confirm the chosen registration model. Proposed baseline: anonymous free access; purchase email and licence registration; device-local learning with export. No account profiles unless approved.
4. Test clean-browser access, checkout, activation, three-device use, failed payment, refund/revocation, rate limiting, cached requests and restoration of valid customer access.
5. Obtain independent technical security/payment review and an independent culinary review of safety-critical content.
6. Confirm domain, commercial identity, campaign destination and consented launch channels.

Client purchase-adapter preparation and six passing unit tests are useful readiness work, not a working backend or paid launch.

## Campaign sequence

**T-7:** Internal QA against every release gate; prepare support and rollback procedures.

**T-3:** Invite 10-20 target testers with consent. Use reviewed technique material only. Gather activation, lesson-completion and usability feedback.

**T0:** Launch only after gates pass through consented email, owned social, free modules and calculator pages. Create: hero creative, portrait and square variants, short motion asset, three-message launch email sequence, free-lesson CTA and calculator CTA. The existing original food illustration may support early creative; no Higgsfield production is claimed.

**T+3:** Review learner feedback and only genuine, consented proof.

**T+7:** Improve message clarity and onboarding.

**T+14:** Evaluate launch-price deadline and readiness outcomes. If launch has not occurred, conduct readiness evaluation on 2026-10-15.

## Measurement and ownership

Proposed pilot targets, not forecasts: 20 genuine target testers, zero critical access/payment defects, 19 of 20 controlled activation attempts successful, and at least 10 first-lesson completions.

For SIZZLE-LAUNCH-01, measure qualified free starts, landing-to-free-start conversion, first-lesson completion, verified server-side purchases, activation success, refunds, support burden, mobile LCP and CLS. After baseline, test one headline or CTA variable at a time.

Remy owns execution. James owns registrant/commercial identity and unavailable service setup. Stop checkout and new campaign acquisition on a critical defect, while retaining valid paid customer access and backups.