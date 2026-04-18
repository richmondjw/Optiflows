# Service Delivery Specification — SDS-02
## System Install
**Version:** 1.0 | **Status:** Draft for review | **Owner:** James Richmond

---

## 1. Offer Summary

| Field | Detail |
|---|---|
| **Name** | System Install |
| **Tagline** | A working operating system in six weeks |
| **Duration** | 6 weeks |
| **Pricing model** | Fixed scope, fixed cost |
| **Price point** | $18,000–$32,000 AUD + GST |
| **Floor** | $18,000 (single workflow, low integration complexity) |
| **Ceiling** | $32,000 (multi-workflow, complex stack, custom agent build) |
| **Target price** | $24,000–$28,000 |
| **Payment** | 50% on project start, 50% on delivery |
| **Primary outcome** | Client has one AI-native workflow running in production, owned by their team, with governance layer built in |

---

## 2. Purpose & Positioning

The System Install is OptiFlows' core product. It is the difference between a client who has an AI pilot and a client who has a working system.

It is scoped to **one priority workflow** identified in the Operating Audit (or in an equivalent discovery process if the client comes in without an Audit). Narrow scope is a feature, not a limitation — it's what allows fixed pricing and guaranteed delivery.

The System Install is **not** an ongoing retainer and **not** open-ended consulting. It has a defined start, a defined end, and a defined output. If the client wants more after delivery, that's the Operating Partner conversation.

---

## 3. Client Profile (Who This Is For)

**Ideal entry path:** Completed SDS-01 Operating Audit (preferred)
**Alternative entry:** Client has a clear, specific workflow problem and the commercial maturity to engage without diagnostic phase (rare but acceptable — requires James to run a compressed discovery in Week 1)

Client readiness requirements:
- Has identified workflow to fix (or willing to spend Week 1 on it)
- Has access to their tech stack and can grant integration credentials
- Has a named internal owner (not James — someone at the client who owns the outcome)
- Leadership is bought in — this can't be a skunkworks project
- Can commit 3–5 hours/week of internal stakeholder time for 6 weeks
- Decision-maker is available for weekly check-ins (30 min)

**Disqualifying factors:**
- No internal owner named (project will fail at handoff)
- Stack is completely undocumented or chaotic (require Audit first)
- Leadership is not bought in (someone below MD/founder is trying to run this — won't work)
- Expecting us to also run the system post-delivery (that's Operating Partner)

---

## 4. Consultative Process

### Pre-Engagement (Before Week 1)

**Scoping call (45 min, James + client MD + internal owner)**

If client came through Audit, this is a commercial/confirmation call:
- Confirm workflow to build
- Confirm internal owner and their availability
- Confirm tech stack access
- Set week-by-week expectations
- Sign contract, collect 50% deposit

If client did not come through Audit:
- Run compressed discovery: 90 min diagnostic call
- James must be able to scope the build before signing

**Pre-start client checklist (sent week before Week 1):**
- [ ] API credentials / admin access for all tools in scope
- [ ] Internal owner confirmed and diary blocked
- [ ] Existing process documentation (any format — even a voice note)
- [ ] 3 real examples of the workflow running (good and bad)
- [ ] Named person who will approve system design before build begins

---

### Week 1 — Diagnose (if not post-Audit) / Map Current State

**Kick-off workshop (2h, James + internal owner + 1–2 people who do the work)**

Agenda:
1. Trace the workflow: trigger → every step → output (60 min)
2. Find every failure mode and handoff gap (30 min)
3. Agree on success criteria: what does "working" look like? (20 min)
4. Identify all tools the system must connect to (10 min)

**Questions for current-state mapping:**
- Walk me through the last time this workflow ran. Every step.
- Where did it nearly go wrong?
- What does "done" look like — and how do you know?
- Who touches this and when?
- What tools are involved at each step?
- What would need to be true for you to trust this to run without you checking it?

**Week 1 output (internal):**
- Current-state workflow map (Miro)
- Tool integration list
- Failure mode log
- Draft success criteria

---

### Week 2 — Design

**System design (James, internal — 2 days of focused work)**

Design decisions to make:
- What does the agent layer do? (trigger → routing → action → output)
- What do humans still own? (approval points, exception handling, escalation paths)
- What guardrails are non-negotiable? (audit trail, data scope, rollback)
- How does it connect to existing tools? (API, webhook, no-code connector, or custom)
- What does "broken" look like, and how does it surface?

**Design review call (60 min, James + client MD + internal owner)**

Present:
- System architecture diagram (Miro): what the agent does, what humans do, how tools connect
- Governance layer: where humans approve, what gets logged, what the agent cannot do
- Success criteria (agreed in Week 1, refined)
- Risks and mitigations
- What's in scope and explicitly what is not in scope

**Client must sign off on design before build begins.** No exceptions.

---

### Week 3–5 — Install

**Build sequence:**

Week 3: Core agent layer
- Build the trigger and routing logic
- Connect primary integrations
- Internal testing against real examples from Week 1
- Daily async update to internal owner (Slack/email — 3 sentences: what's done, what's next, any blockers)

Week 4: Integration & testing
- Wire all tool connections
- Build governance layer: logging, audit trail, human approval checkpoints
- Test against edge cases from failure mode log
- First live run with internal owner present

Week 5: Refinement & rehearsal
- Address issues from live run
- Train internal owner: how to use it, how to modify it, what to do when it breaks
- Documentation sprint (see Deliverables)
- Second live run — internal owner runs it, James observes

**Weekly check-in (30 min, James + internal owner)**
- What ran this week
- What was adjusted
- What's next
- Any risks

**Tools used:**
- Make.com / n8n (workflow automation layer)
- Claude / OpenAI API (agent intelligence layer)
- Airtable / Notion / Google Sheets (data layer — depends on client stack)
- Zapier (if client has existing Zaps — integrate, don't rip out)
- Custom code (Python/Node) where no-code is insufficient — James builds, client owns
- GitHub (version control for all custom code — client gets repo access)
- Loom (async walkthrough recordings — training artefacts)

---

### Week 6 — Handoff

**Handoff week structure:**

Day 1–2: Internal owner runs the system solo (James available async)
Day 3: Final documentation review and sign-off
Day 4: Handoff call (90 min)
Day 5: Buffer / any final fixes

**Handoff call agenda (90 min, James + MD + internal owner + any team members who will use it):**
1. System demo — internal owner presents it, not James (30 min)
2. Runbook walkthrough — how to use it, how to modify it, what to do when it breaks (30 min)
3. Governance review — what's logged, how to review, escalation path (15 min)
4. 90-day plan — what success looks like and how to track it (10 min)
5. Operating Partner conversation — if applicable (5 min)

---

## 5. Deliverables

### 5.1 The Working System
The primary deliverable. One AI-native workflow running in production:
- Triggered automatically or with minimal human initiation
- Connected to the client's existing tools
- Outputs the right thing to the right place
- Handles edge cases without breaking
- Surfaces failures clearly when they happen

### 5.2 System Architecture Document
Living document (Google Doc + Miro):
- What the system does (plain English, one page)
- Architecture diagram: triggers, agent layer, integrations, outputs
- Data flow: what information moves where
- Governance layer: what's logged, what requires human approval, what the agent cannot do
- Integration map: every tool connected, how, and what credentials are required

### 5.3 Runbook
Step-by-step operational guide for the internal owner:
- How to start/stop/restart the system
- How to handle common exceptions
- How to make minor modifications (prompts, routing rules, thresholds)
- How to escalate if something goes wrong
- Who to call if it breaks catastrophically (i.e., James — 30-day post-delivery support window)

### 5.4 Training Recordings (Loom)
3–5 Loom recordings covering:
- System overview (5 min): what it does and why
- Operator walkthrough (10 min): how to use it day-to-day
- Admin walkthrough (10 min): how to modify it, what to watch for
- Governance review (5 min): what's logged and how to read it

### 5.5 GitHub Repository (if custom code)
- All custom code, version controlled
- README with setup instructions
- Client is added as owner
- James removed as collaborator post-delivery (client owns it fully)

### 5.6 30-Day Post-Delivery Support
- Async support via email/Slack for 30 days post-handoff
- Covers: questions, minor bugs, configuration tweaks
- Does not cover: new features, scope expansion, training new staff (those are Operating Partner)

---

## 6. Time Budget

| Activity | James Hours | Notes |
|---|---|---|
| Pre-engagement scoping | 2h | |
| Week 1: Kick-off + mapping | 6h | Workshop + synthesis |
| Week 2: System design | 8h | Architecture + design review |
| Week 3: Core build | 16h | |
| Week 4: Integration + testing | 16h | |
| Week 5: Refinement + docs | 12h | |
| Week 6: Handoff + training | 6h | |
| Async client comms | 4h | Spread across 6 weeks |
| Buffer | 4h | Scope creep, unexpected complexity |
| **Total** | **~74h** | |

**Capacity:** 1 System Install active at a time is comfortable. 2 simultaneous is a stretch (requires contractor support in Weeks 3–5).

---

## 7. Pricing & Margin

| Item | Amount |
|---|---|
| **Price (floor)** | $18,000 AUD + GST |
| **Price (target)** | $25,000 AUD + GST |
| **Price (ceiling)** | $32,000 AUD + GST |
| **James time cost (74h @ $200/h)** | $14,800 |
| **Contractor support (if needed)** | $0–$4,000 (10–20h @ $150–200/h) |
| **Tooling cost (marginal)** | ~$100–300 (APIs, Make.com runs, etc.) |
| **Gross margin (floor, no contractor)** | ~18% |
| **Gross margin (target, no contractor)** | ~41% |
| **Gross margin (ceiling, no contractor)** | ~53% |

**Pricing variables:**
- **Complexity:** Single workflow + simple integrations = floor. Multi-agent, complex API work, custom code throughout = ceiling.
- **Stack complexity:** If client is on modern SaaS with good APIs (HubSpot, Notion, Slack) = lower. Legacy systems, custom databases, no API access = higher or decline.
- **Internal owner quality:** If internal owner is technically capable = lower James hours. If James has to hold their hand throughout = price up.

**Discounting rules:**
- No discounts without scope reduction
- If price is the objection, offer to narrow scope — not reduce price
- Audit clients get priority scheduling, not pricing discounts

---

## 8. IP Generated

- **System Architecture template** — reusable across all future Installs (adapted per client)
- **Runbook template** — reusable, adapted per system
- **Agent prompt library** — every prompt written for a client is reviewed, generalised, and added to OptiFlows' internal library
- **Integration patterns** — documented approaches for each tool combination (HubSpot+Slack, Notion+Make, etc.)
- **Governance layer template** — audit trail, approval checkpoint, boundary-setting pattern that is reused in every Install
- **Industry playbooks** — anonymised notes on what works in each vertical; becomes basis for future Audit acceleration
- **Training recording templates** — Loom structure reused across all Installs

---

## 9. Quality Gates

**Before build begins (end of Week 2):**
- [ ] Client has signed off on system design in writing
- [ ] All integration credentials received and tested
- [ ] Internal owner has confirmed availability for Weeks 3–6
- [ ] Success criteria are specific and measurable

**Before handoff (end of Week 5):**
- [ ] System has run successfully on at least 3 real examples
- [ ] Internal owner has operated the system without James present
- [ ] All deliverables are 90% complete
- [ ] No open blockers that would prevent delivery

**Before closing the engagement:**
- [ ] Client MD has seen the live system (not just the internal owner)
- [ ] Runbook is reviewed and approved by internal owner
- [ ] 30-day support window clearly communicated
- [ ] Operating Partner conversation has been had (even if not now)

---

## 10. Scope Management

The fixed price only holds if scope is fixed. Scope management is James's responsibility.

**In scope by default:**
- One named workflow (agreed in Week 2 design sign-off)
- Integrations to named tools (agreed in Week 2)
- Governance layer (non-negotiable, always included)
- Documentation and training (always included)

**Out of scope by default:**
- Additional workflows (quote separately or Operating Partner)
- Staff training beyond the internal owner and 2–3 core users
- System modifications after handoff (30-day support covers bugs, not features)
- Maintaining or running the system (Operating Partner)

**Scope creep protocol:**
> "That's a great idea and it's not in scope for this Install. I can either add it as a paid extension (quote you separately) or we note it as Phase 2 for your Operating Partner engagement. Which do you prefer?"

---

## 11. Failure Modes & Mitigations

| Risk | Mitigation |
|---|---|
| No internal owner (system dies at handoff) | Disqualify or pause engagement until one is named |
| Integration is blocked (API access denied, IT won't cooperate) | Flag in Week 1. Escalate to MD. If unresolved by Week 2, scope change or pause. |
| Client expands scope mid-project | Scope change protocol. Document in writing. Price or schedule impact. |
| System works but team doesn't adopt it | Root cause: internal owner wasn't bought in. Prevention: qualify this in pre-engagement. |
| James over-runs hours significantly | Review at Week 3 check-in. If >15h over, have a commercial conversation. |
| Client dissatisfied with output | Use success criteria from Week 1 as the objective standard. If met = delivered. If not = fix it. |
