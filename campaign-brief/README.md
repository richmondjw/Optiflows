# Campaign Brief Compiler

The Campaign Brief Compiler is a static, browser-based master input for M2M Group campaign packs. It keeps campaign strategy in a generic core and applies brand-specific plugins at the final handoff.

## What is functional now

- Eight-stage brief wizard covering foundation, audience, commercial and communication objectives, proposition, strategy, production, evidence/gates and brand branches.
- Local draft persistence with reset and browser-only storage.
- 9604 Hybrid Connectivity fixture that reverse-engineers the current “Coverage Beyond the Grid” pack.
- Live readiness score, missing-field prompts and evidence/gate warnings.
- Curated Vault-backed audience, role, vertical and objective libraries with checkbox selection, visible source attribution and an **Other** field for campaign-specific values.
- Multi-KPI entry with a primary KPI selector and synchronized legacy `primaryKpi` / `secondaryKpis` fields.
- Assisted proposition and strategy panels that generate reviewable working hypotheses from the current brief and let the planner apply one direction.
- Campaign Consultant front door with six short inputs, valid “I don't know” answers, three brand-neutral directions and five bounded preference rounds.
- Controlled research modes (**No research**, **Quick scan**, **Evidence pack**) that prepare decision-linked research questions and label evidence as Confirmed, Strongly supported, Inferred, Unknown or Requires approval.
- One-click handoff from the selected or ranked concept into the existing eight-stage compiler. The export retains a `consultantRun` object with inputs, research, concepts, preference events, selected concept, brief, independent brand branches and pack summary.
- Independent M2M Connectivity, M2M One Australia, M2M One New Zealand and Semtech plugin branches.
- Export of a portable JSON campaign pack, print-friendly review HTML, Markdown brief, branch CSV and Higgsfield job JSON.
- Landing page, social, email, sales-enablement and Higgsfield job specifications in the JSON pack.
- Higgsfield-safe prompts that generate text-free masters; approved copy and one branch logo are applied in deterministic post-processing.

## Use

Open `/campaign-brief/` on the OptiFlows site, or serve the repository root with any static server. Choose **Load 9604 campaign** to see the reverse-engineered fixture, then edit any field. The right-hand panel is the live output contract. **Download campaign pack** produces five files named from the campaign slug.

## Plugin contract

Plugins live in `plugins.js`. Each plugin supplies an id, entity, market, voice, logo asset (or an explicit missing-asset state), CTA, destination policy, palette and version. The generic core never selects a logo or changes the campaign proposition. Each selected plugin becomes a separate `brandBranches[]` entry with `independentArtwork: true` and a one-logo rule.

## Assisted brief layer

`libraries.js` contains a dated, attributable snapshot of the canonical M2M vocabulary from the JWR-TheOne vault. It is a replaceable library, not a live Vault connection; the source and review date are shown in the form and should be refreshed before external use. Message directions and strategy recommendations are deterministic starting points from the current inputs. They are exported under `assistance` and remain hypotheses until proof, owners and release gates are reviewed.

The Consultant uses the same principle. Its first release is deterministic and evidence-aware: it creates research questions before presenting the approved internal references and existing 9604 campaign snapshot. It does not silently browse the open web or call a generative provider. A future server-side research adapter can add dated source retrieval while preserving the evidence statuses, preference history and human approval gates.

## Higgsfield boundary

The browser never holds provider credentials and never activates a campaign. It exports provider-neutral job specifications with prompts, negative prompts, model intent, post-processing and a human gate. A future server connector can consume `higgsfieldJobs[]` and write provider ids and receipts back into the pack without changing the brief schema.

For an explicit local handoff, run `node tools/campaign-brief-higgsfield.cjs <campaign-pack.json>` from the repository root. It prints the exact `higgsfield generate create ... --wait --json` commands and submits nothing. After reviewing the prompts, provider model, branches and rights, `--execute --confirm` submits them through the installed CLI. This is intentionally outside the browser and remains a human-gated action.

## Acceptance fixture

The 9604 fixture is based on the production pack at `https://optiflows.com.au/campaigns/9604-hybrid-connectivity/`. It preserves the pack’s central route (coverage problem → readiness guide → qualified design conversation), its three phases, its channel mix, its evidence language and the requirement for independent M2M Connectivity and M2M One artwork.
