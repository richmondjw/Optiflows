# Service Delivery Specification — SDS-01
## Operating Audit
**Version:** 1.0 | **Status:** Draft for review | **Owner:** James Richmond

---

## 1. Offer Summary

| Field | Detail |
|---|---|
| **Name** | Operating Audit |
| **Tagline** | Find the drag before you pay to fix it |
| **Duration** | 2 weeks |
| **Pricing model** | Fixed fee |
| **Price point** | $4,500–$6,500 AUD + GST |
| **Floor** | $4,500 (solo operator, simple ops) |
| **Ceiling** | $6,500 (50+ person business, multi-function) |
| **Payment** | 100% upfront on booking |
| **Primary outcome** | Client exits with a prioritised business case for one specific AI-native system build |

---

## 2. Purpose & Positioning

The Audit exists for two reasons:

1. **For the client:** Reduces risk. They don't commit $25k+ to a System Install without knowing what they're actually fixing.
2. **For OptiFlows:** Qualifies the client. We learn whether they're buildable (tools, team maturity, decision-making speed) before committing to a 6-week engagement. The Audit is a paid discovery — it filters bad fits and generates IP we use in delivery.

The Audit is **not** a generic strategy review. It is a workflow diagnostic with a specific output: a prioritised list of friction points and a recommendation for what to build first.

---

## 3. Client Profile (Who This Is For)

- 15–150 person business
- Revenue: $3M–$50M AUD
- Has existing SaaS stack (CRM, project management, comms tools)
- Founder/MD is the decision-maker or is present in the room
- Is experiencing at least two of: handoff failures, founder bottleneck, tool sprawl, failed AI pilots, staff churn from operational frustration
- **Not a fit:** Businesses with no documented processes, no clear decision-maker, or who want us to also run their ops (that's a different engagement)

---

## 4. Consultative Process

### Week 1 — Discovery

#### Day 1–2: Intake & Context Setting

**Kick-off call (90 min, James + client MD/ops lead)**

Pre-work sent to client 48h before:
- Org chart or team structure diagram (any format)
- List of all active SaaS tools (spreadsheet ok)
- Last 3 months of their biggest operational headaches (email, voice note, anything)

Kick-off agenda:
1. Business context: revenue model, growth stage, team structure (20 min)
2. "Where does work break?" — open diagnostic (30 min)
3. Walk through their tool stack together (20 min)
4. Identify 3–5 workflows to trace in depth (15 min)
5. Schedule stakeholder interviews (5 min)

**Discovery questions (core set):**
- Where do you spend the most time doing work that should be automatic?
- What's the last thing that fell through a gap — and what did it cost?
- If you were on holiday for 2 weeks, what would break?
- Which tool do people hate most, and why do they still use it?
- Where do decisions stall?
- What gets rebuilt from scratch every time it should already exist?
- If you could fix one thing in the next 90 days, what would it be?

#### Day 3–4: Stakeholder Interviews

2–4 interviews, 45 min each, with the people *doing* the work (not just the people managing it).

Interview focus:
- Trace one workflow from trigger to completion (start → end, every step)
- Find the handoffs: where does work leave one person/system and enter another?
- Find the rebuilds: what gets re-entered, re-explained, or re-created?
- Find the escalations: what gets kicked upstairs that shouldn't need to?
- Find the gaps: what never gets done, even though everyone knows it should?

Tools used:
- Fireflies.ai (auto-transcription, all calls recorded with consent)
- Loom (client can submit async walkthroughs instead of live calls if preferred)
- Miro or FigJam (live workflow tracing during interview)

#### Day 5: Synthesis (Internal — James Only)

- Review all transcripts (Fireflies summaries + spot-check full transcripts)
- Build raw friction map (all identified failure points)
- Score each friction point: frequency × cost × fixability
- Identify top 3 candidates for AI-native intervention
- Draft business case assumptions

### Week 2 — Analysis & Delivery

#### Day 6–8: Deep Analysis

For each of the top 3 friction points:
- Quantify cost: time lost per week × loaded hourly rate × team members affected
- Identify root cause: process gap, tool gap, or coordination gap
- Map the current state: trigger → steps → output → failure points
- Sketch the future state: what does the AI-native version look like?
- Estimate build complexity: simple / medium / complex
- Estimate ROI: conservative case (time saved × cost), optimistic case

#### Day 9: Deliverable Production

Produce the Operating Audit Report (see Section 6).

#### Day 10: Readout Call (60 min, James + client MD + relevant ops/tech lead)

Agenda:
1. What we found — friction map summary (15 min)
2. The three priority interventions — ranked and explained (20 min)
3. Business case walkthrough — cost to fix vs. cost of not fixing (10 min)
4. Recommended first build — what it is, what it does, what success looks like (10 min)
5. Path forward — System Install scope and next steps (5 min)

---

## 5. Tools & Infrastructure

| Tool | Purpose | Cost |
|---|---|---|
| Fireflies.ai | Auto-transcription of all calls | ~$10/mo (existing) |
| Miro / FigJam | Live workflow mapping during interviews | ~$16/mo (existing) |
| Notion | Internal synthesis workspace | ~$16/mo (existing) |
| Claude / GPT-4 | Transcript analysis, pattern extraction, report drafting | ~$20/mo (existing) |
| Loom | Async video walkthroughs from client | Free tier |
| Google Docs | Deliverable production (client-readable format) | Free |

**Total marginal tooling cost per engagement:** ~$0 (all absorbed into existing subscriptions)

---

## 6. Deliverables

### 6.1 Workflow Friction Map
A visual map of the client's core workflows — not the org chart version, the real version. Shows:
- Each workflow traced from trigger to output
- Every handoff point marked
- Failure modes annotated at each handoff
- Time cost estimated at each step

Format: Miro board (shared link) + exported PDF

### 6.2 Friction Scorecard
Tabular ranking of all identified friction points:

| Workflow | Friction Point | Frequency | Weekly Cost Estimate | Fixability | Priority Score |
|---|---|---|---|---|---|
| [e.g. Client onboarding] | [e.g. Contract sent late] | Daily | $1,200/wk | High | 1 |

### 6.3 AI-Native Intervention Brief (×3)
One-page brief per priority intervention:
- What the workflow currently looks like
- What breaks and why
- What the AI-native version does
- What tools it connects to
- What humans still own
- Estimated build complexity and timeframe
- Conservative and optimistic ROI

### 6.4 Business Case
Two-page executive summary:
- Total estimated cost of current friction (annualised)
- Cost of fixing priority 1 (System Install investment)
- Payback period
- What success looks like at 90 days
- What success looks like at 12 months

### 6.5 Recommended First Build
Clear recommendation: which system to build first, and why. Not three options. One recommendation with rationale.

---

## 7. Time Budget

| Activity | James Hours | Notes |
|---|---|---|
| Pre-work review | 1h | Client-submitted materials |
| Kick-off call | 1.5h | + 30min prep |
| Stakeholder interviews (×3) | 3.5h | + 45min scheduling/admin |
| Internal synthesis | 4h | Transcript review + friction map |
| Deep analysis | 5h | Quantification + future state mapping |
| Deliverable production | 4h | Report + Miro board |
| Readout call | 1h | + 30min prep |
| **Total** | **~21h** | |

**Capacity:** 2 simultaneous Audits per month comfortable. 3 is a stretch.

---

## 8. Pricing & Margin

| Item | Amount |
|---|---|
| **Price (floor)** | $4,500 AUD + GST |
| **Price (ceiling)** | $6,500 AUD + GST |
| **Target price** | $5,500 AUD + GST |
| **James time cost** | 21h × $200/h implicit rate = $4,200 |
| **Tooling cost** | ~$0 marginal |
| **Gross margin (floor)** | ~7% |
| **Gross margin (target)** | ~24% |
| **Gross margin (ceiling)** | ~35% |

**Pricing rationale:** The Audit is a loss-leader at the floor. The goal is conversion to a System Install ($25k+). Even at floor pricing, the Audit is worth running if conversion rate is >50%. Target price should be $5,500 for most engagements. Price up to $6,500 for larger, more complex businesses.

**Conversion expectation:** 60%+ of Audit clients should proceed to a System Install. If conversion drops below 40%, revisit qualification criteria.

---

## 9. IP Generated

Every Audit creates reusable IP:

- **Friction Map template** (Miro) — reusable across all future Audits
- **Intervention Brief template** (Google Docs) — reusable across all future Audits
- **Discovery question bank** — updated after each engagement with new questions that surfaced insights
- **Industry-specific friction patterns** — anonymised notes on what breaks in each vertical (professional services, agencies, B2B SaaS, etc.)
- **Benchmarks** — what "good" looks like for each workflow type, built up over time

---

## 10. Quality Gates

Before the Readout call, James must be able to answer yes to all of these:

- [ ] Can I explain in one sentence what the client's biggest operational problem is?
- [ ] Can I quantify the cost of that problem to within ±30%?
- [ ] Do I have a clear recommendation — one specific thing to build first?
- [ ] Is the client ready to have a commercial conversation about a System Install?
- [ ] Have I identified any red flags that would make a System Install risky or inadvisable?

---

## 11. Upsell Path

The Audit readout should naturally transition to a System Install conversation. The script:

> "Based on what we've found, our recommendation is to start with [X]. Here's what that looks like as a System Install — fixed scope, 6 weeks, here's what you'll have at the end."

Do not present options. Present one recommendation. Let them ask about alternatives.

---

## 12. Failure Modes & Mitigations

| Risk | Mitigation |
|---|---|
| Client can't get stakeholders to interview | Require this as a condition of booking. No access = no Audit. |
| Client expects strategy, not diagnosis | Set framing in sales call: "This is a diagnostic, not a strategy review." |
| Readout doesn't convert | Diagnose: was it the wrong client, wrong recommendation, or wrong framing? |
| Client uses Audit to brief another vendor | Expected. Our report is better than what they'll get elsewhere. Win on execution. |
| James over-runs hours | Set a hard 22h cap. If more time needed, flag and discuss with client. |
