# Visible Flow - permissioned email sequence

**Campaign:** 7 September – 4 October 2026
**Status:** Draft - consent validation and send approval required

## Mandatory send gate

- Send only where OptiFlows can evidence express consent or a valid basis for inferred consent.
- Do not use purchased, scraped or harvested addresses.
- Resolve `{{first_name}}`, `{{consent_context}}` and `{{unsubscribe_url}}` before sending.
- Identify OptiFlows accurately and keep the unsubscribe function active for at least 30 days.
- Suppress opt-outs and action unsubscribe requests within five working days.
- Test every merge tag, link and rendering variant inside the selected email platform.

## E01 - Your team may not be the bottleneck

- Timing: Day 0
- Audience: Permissioned or lawfully inferred business contacts whose roles are directly relevant to operating-model and workflow improvement.
- Intent: Turn a familiar execution problem into a concrete diagnosis, then offer one low-friction action.
- Preheader: The hidden constraint is often the routing between people, tools and decisions.
- HTML: [emails/email-01-coordination-drag.html](../emails/email-01-coordination-drag.html)
- CTA: Estimate the drag - https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e01-drag-check#drag-check

### Subject line options

1. Your team may not be the bottleneck
2. Where work gets stuck between teams
3. A 90-second check for coordination drag

### Plain-text version

Hi {{first_name}},

When a growing company slows down, the usual response is to add capacity: another hire, another tool or another meeting.

But the hidden constraint is often the way work moves between people, systems and decisions.

Three signs tend to show up first:

1. Routine decisions queue behind the same person.
2. Every handoff rebuilds context.
3. Follow-up depends on memory.

We call this coordination drag. It looks small in the moment, but repeated across a team and a year, it becomes a material operating cost.

We built a 90-second check to put an indicative number on one workflow:

Estimate the drag: https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e01-drag-check#drag-check

If you would rather talk it through, reply with the workflow that creates the most chasing. I will send back the first three places I would inspect.

James Richmond
OptiFlows
hello@optiflows.com

{{consent_context}}
Unsubscribe: {{unsubscribe_url}}
You can also reply with "unsubscribe".

## E02 - The three-question workflow test

- Timing: Day +4 business days
- Audience: Recipients from Email 1 who have not replied or unsubscribed. Suppress all opt-outs before sending.
- Intent: Convert recognition into self-diagnosis and a reply while preserving a single primary CTA.
- Preheader: Three questions reveal whether the workflow or the team is creating the drag.
- HTML: [emails/email-02-workflow-test.html](../emails/email-02-workflow-test.html)
- CTA: Run the 90-second check - https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e02-workflow-test#drag-check

### Subject line options

1. The three-question workflow test
2. Still routing work through the same few people?
3. A simple test for your next workflow review

### Plain-text version

Hi {{first_name}},

A quick follow-up with a simple operating-model test.

Pick one recurring workflow that matters: lead follow-up, client onboarding, approvals, reporting or campaign production.

Then ask:

1. Where does it wait?
2. Who has to rebuild the context?
3. Which routine exception reaches a senior person?

If the answers keep pointing to the same handoffs and the same people, the constraint is probably not effort. It is the routing architecture.

The goal is not to automate everything. It is to make the movement visible, encode the routine work and keep judgment with the right human.

Run the 90-second check: https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e02-workflow-test#drag-check

Or reply with the workflow you chose. I am happy to tell you what I would measure first.

James Richmond
OptiFlows
hello@optiflows.com

{{consent_context}}
Unsubscribe: {{unsubscribe_url}}
You can also reply with "unsubscribe".
