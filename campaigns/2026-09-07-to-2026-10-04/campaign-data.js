const campaignSlug = 'coordination-drag-2026-09';

function blogLink(slug, source, id) {
  return `https://www.optiflows.com.au/blog/posts/${slug}.html?utm_source=${source}&utm_medium=organic&utm_campaign=${campaignSlug}&utm_content=${id}`;
}

function diagnosticLink(source, id) {
  return `https://www.optiflows.com.au/?utm_source=${source}&utm_medium=organic&utm_campaign=${campaignSlug}&utm_content=${id}#drag-check`;
}

function paragraphs(lines) {
  return lines.join('\n\n');
}

export const campaign = {
  id: campaignSlug,
  title: 'Make the system visible',
  subtitle: 'Four weeks of practical thinking on coordination drag, structured knowledge, governed agents and compounding growth systems.',
  period: '7 September – 4 October 2026',
  objective: 'Build category clarity and qualified demand for the OptiFlows coordination-drag diagnostic.',
  owner: 'James Richmond',
  status: 'Draft campaign pack - human approval required before publication',
  channels: [
    { id: 'linkedin-personal', label: 'James · LinkedIn' },
    { id: 'linkedin-company', label: 'OptiFlows · LinkedIn' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube Shorts' }
  ],
  weeks: [
    { number: 1, dates: '7–13 Sep', theme: 'See the drag', colour: '#ff8c73', intent: 'Make coordination drag recognisable and personally relevant.' },
    { number: 2, dates: '14–20 Sep', theme: 'Structure the knowledge', colour: '#66c7ff', intent: 'Establish a sharp, practical point of view on AI-ready knowledge.' },
    { number: 3, dates: '21–27 Sep', theme: 'Remove dependency. Retain authority.', colour: '#ffc857', intent: 'Show that governed agents reduce bottlenecks without removing human control.' },
    { number: 4, dates: '28 Sep–4 Oct', theme: 'Build the engine', colour: '#8b7cff', intent: 'Move from isolated activity to compounding operating capability.' }
  ],
  emails: [
    {
      id: 'e01', sequence: 'Day 0', format: 'edm', accent: 'coral',
      title: 'Your team may not be the bottleneck',
      intent: 'Turn a familiar execution problem into a concrete diagnosis, then offer one low-friction action.',
      audience: 'Permissioned or lawfully inferred business contacts whose roles are directly relevant to operating-model and workflow improvement.',
      subjects: [
        'Your team may not be the bottleneck',
        'Where work gets stuck between teams',
        'A 90-second check for coordination drag'
      ],
      preheader: 'The hidden constraint is often the routing between people, tools and decisions.',
      hero: 'emails/assets/email-01-coordination-drag-hero.jpg',
      html: 'emails/email-01-coordination-drag.html',
      cta: {
        label: 'Estimate the drag',
        url: 'https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e01-drag-check#drag-check'
      },
      plainText: paragraphs([
        'Hi {{first_name}},',
        'When a growing company slows down, the usual response is to add capacity: another hire, another tool or another meeting.',
        'But the hidden constraint is often the way work moves between people, systems and decisions.',
        'Three signs tend to show up first:\n\n1. Routine decisions queue behind the same person.\n2. Every handoff rebuilds context.\n3. Follow-up depends on memory.',
        'We call this coordination drag. It looks small in the moment, but repeated across a team and a year, it becomes a material operating cost.',
        'We built a 90-second check to put an indicative number on one workflow:',
        'Estimate the drag: https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e01-drag-check#drag-check',
        'If you would rather talk it through, reply with the workflow that creates the most chasing. I will send back the first three places I would inspect.',
        'James Richmond\nOptiFlows\nhello@optiflows.com',
        '{{consent_context}}\nUnsubscribe: {{unsubscribe_url}}\nYou can also reply with "unsubscribe".'
      ])
    },
    {
      id: 'e02', sequence: 'Day +4 business days', format: 'edm', accent: 'human',
      title: 'The three-question workflow test',
      intent: 'Convert recognition into self-diagnosis and a reply while preserving a single primary CTA.',
      audience: 'Recipients from Email 1 who have not replied or unsubscribed. Suppress all opt-outs before sending.',
      subjects: [
        'The three-question workflow test',
        'Still routing work through the same few people?',
        'A simple test for your next workflow review'
      ],
      preheader: 'Three questions reveal whether the workflow or the team is creating the drag.',
      hero: 'emails/assets/email-02-workflow-test-hero.jpg',
      html: 'emails/email-02-workflow-test.html',
      cta: {
        label: 'Run the 90-second check',
        url: 'https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e02-workflow-test#drag-check'
      },
      plainText: paragraphs([
        'Hi {{first_name}},',
        'A quick follow-up with a simple operating-model test.',
        'Pick one recurring workflow that matters: lead follow-up, client onboarding, approvals, reporting or campaign production.',
        'Then ask:\n\n1. Where does it wait?\n2. Who has to rebuild the context?\n3. Which routine exception reaches a senior person?',
        'If the answers keep pointing to the same handoffs and the same people, the constraint is probably not effort. It is the routing architecture.',
        'The goal is not to automate everything. It is to make the movement visible, encode the routine work and keep judgment with the right human.',
        'Run the 90-second check: https://www.optiflows.com.au/?utm_source=outbound_email&utm_medium=email&utm_campaign=coordination-drag-2026-09&utm_content=e02-workflow-test#drag-check',
        'Or reply with the workflow you chose. I am happy to tell you what I would measure first.',
        'James Richmond\nOptiFlows\nhello@optiflows.com',
        '{{consent_context}}\nUnsubscribe: {{unsubscribe_url}}\nYou can also reply with "unsubscribe".'
      ])
    }
  ],
  posts: [
    {
      id: 'p01', week: 1, date: '2026-09-07', day: 'Mon 7 Sep', format: 'tile',
      theme: 'The operating-model reframe',
      title: 'Your operating model is the bottleneck. Not your team.',
      deck: 'A broad executive hook that shifts the diagnosis from people and tools to coordination architecture.',
      accent: 'coral', visual: 'network',
      blogSlug: 'why-your-operating-model-is-the-bottleneck',
      asset: { image: 'assets/p01-operating-model-bottleneck.png', width: 1080, height: 1350 },
      channels: {
        'linkedin-personal': paragraphs([
          'Most scaling companies diagnose execution problems in the wrong place.',
          'They hire more people. Buy another tool. Add another meeting. Then wonder why work still slows down between teams.',
          'The team is often doing exactly what the system allows. The real constraint is the routing architecture: who decides, where context lives, how exceptions move and what still depends on somebody remembering to follow up.',
          'Before asking people to work harder, I would ask a different question: how is work actually moving through the business?',
          blogLink('why-your-operating-model-is-the-bottleneck', 'linkedin', 'p01-personal')
        ]),
        'linkedin-company': paragraphs([
          'More headcount does not repair broken coordination.',
          'When the routing model stays the same, adding people creates more handoffs, more waiting and more invisible work. The constraint is not necessarily the team. It may be the system the team is working inside.',
          'A practical operating-model diagnosis starts by mapping how work and decisions really move.',
          blogLink('why-your-operating-model-is-the-bottleneck', 'linkedin', 'p01-company')
        ]),
        instagram: paragraphs([
          'Your team may not be the bottleneck.',
          'If decisions, approvals and context still route through the same few people, the operating model is the constraint.',
          'Fix the movement before adding more work. Full article via the link in bio.',
          '#OperatingModel #AIWorkflow #BusinessSystems #OptiFlows'
        ])
      }
    },
    {
      id: 'p02', week: 1, date: '2026-09-09', day: 'Wed 9 Sep', format: 'carousel',
      theme: 'Coordination-tax diagnostic',
      title: 'Seven signs you are paying a coordination tax',
      deck: 'A saveable diagnostic carousel that helps leaders recognise the problem inside their own organisation.',
      accent: 'coral', visual: 'meter',
      blogSlug: 'why-your-operating-model-is-the-bottleneck',
      asset: { pdf: 'assets/p02-coordination-tax-carousel.pdf', slideBase: 'assets/p02-coordination-tax-slide-', slideCount: 8, width: 1080, height: 1350 },
      slides: [
        { headline: 'Seven signs you are paying a coordination tax', body: 'The cost rarely appears as one line in the P&L. It appears between people, tools and decisions.', variant: 'cover' },
        { headline: '01 / Decisions queue behind the same person', body: 'Work pauses while teams wait for context, approval or judgment that exists in only one head.' },
        { headline: '02 / Follow-up depends on memory', body: 'The workflow has no reliable trigger, owner or escalation path. Progress depends on somebody remembering.' },
        { headline: '03 / Every handoff rebuilds context', body: 'Teams translate the same brief, customer history or decision repeatedly because the system does not carry it forward.' },
        { headline: '04 / Another tool creates another inbox', body: 'The software may be useful, but nobody redesigned how work should move through it.' },
        { headline: '05 / Meetings are the integration layer', body: 'People meet to reconcile systems, clarify ownership and manually route work that should already know where to go.' },
        { headline: '06–07 / Exceptions become normal work', body: 'Escalations consume senior attention, and growth creates more coordination instead of more capacity.' },
        { headline: 'Measure the drag before automating it', body: 'Start with one workflow. Find the waiting, rework, chasing and decision latency. Then redesign the movement.', variant: 'cta', cta: 'Run the 90-second drag check' }
      ],
      channels: {
        'linkedin-personal': paragraphs([
          'Coordination drag is expensive precisely because it rarely looks dramatic.',
          'It looks like a Slack message asking for an update. A meeting to reconstruct context. A campaign waiting for approval. A client request sitting between two systems. A founder stepping back into a routine decision.',
          'One incident is small. Repeated across a week, a team and a year, it becomes an operating tax.',
          'I have put seven of the most common signals into this diagnostic. Which one is most familiar inside your business?',
          blogLink('why-your-operating-model-is-the-bottleneck', 'linkedin', 'p02-personal')
        ]),
        'linkedin-company': paragraphs([
          'Coordination tax hides in waiting, chasing, translation and rework.',
          'Use this seven-signal diagnostic to identify whether a workflow problem is being misdiagnosed as a people problem.',
          'Save it for your next operating review, then choose one workflow to measure.',
          blogLink('why-your-operating-model-is-the-bottleneck', 'linkedin', 'p02-company')
        ]),
        instagram: paragraphs([
          'Seven quiet signs that coordination is costing more than it should.',
          'Save this for your next workflow review. Then look for the handoff creating the most waiting, chasing or rework.',
          '#Operations #WorkflowDesign #FounderLed #OptiFlows'
        ])
      }
    },
    {
      id: 'p03', week: 1, date: '2026-09-11', day: 'Fri 11 Sep', format: 'motion',
      theme: 'Scaling the nodes, not the routing',
      title: 'Ten people to forty. Same routing architecture.',
      deck: 'A short kinetic system diagram showing fragmentation, measurement, redesign and resolved flow.',
      accent: 'coral', visual: 'network', duration: '6 seconds',
      blogSlug: 'why-your-operating-model-is-the-bottleneck',
      asset: { video: 'assets/p03-routing-architecture.mp4', poster: 'assets/p03-routing-architecture-poster.png', width: 1080, height: 1920 },
      motion: { opening: 'Ten people → forty people.', closing: 'The routing logic stayed the same.', resolution: 'Scale the system, not just the nodes.' },
      channels: {
        'linkedin-personal': paragraphs([
          'A company can scale headcount without scaling its operating model.',
          'More people join the network. The same approvals, routing decisions and context dependencies remain. What worked at ten people becomes invisible drag at forty.',
          'Scaling is not just adding nodes. The routing logic has to change too.',
          blogLink('why-your-operating-model-is-the-bottleneck', 'linkedin', 'p03-personal')
        ]),
        'linkedin-company': paragraphs([
          'More nodes. Same routing logic. More drag.',
          'A scalable operating model changes how decisions, context and exceptions move, not only how many people are available to move them.',
          blogLink('why-your-operating-model-is-the-bottleneck', 'linkedin', 'p03-company')
        ]),
        instagram: paragraphs([
          'Ten people became forty. The routing architecture never changed.',
          'Scale the system, not just the nodes.',
          '#SystemsThinking #BusinessGrowth #AIWorkflow #OptiFlows'
        ]),
        youtube: paragraphs([
          'Ten people to forty. Same routing architecture.',
          'Why scaling headcount without redesigning coordination creates more waiting, more escalation and more founder dependency.',
          blogLink('why-your-operating-model-is-the-bottleneck', 'youtube', 'p03-short'),
          '#Shorts #OperatingModel #BusinessSystems'
        ])
      }
    },
    {
      id: 'p04', week: 2, date: '2026-09-14', day: 'Mon 14 Sep', format: 'tile',
      theme: 'The knowledge-system reframe',
      title: 'Your AI needs a filing system. Not another database.',
      deck: 'A contrarian technical hook that makes structured knowledge feel practical rather than infrastructurally heavy.',
      accent: 'signal', visual: 'files',
      blogSlug: 'your-ai-needs-a-filing-system-not-a-database',
      asset: { image: 'assets/p04-filing-system.png', width: 1080, height: 1350 },
      channels: {
        'linkedin-personal': paragraphs([
          'When a business wants AI to use its knowledge, the reflex is often to reach for a vector database.',
          'For a few hundred working documents, that can be a lot of infrastructure before the underlying information has even been organised.',
          'A well-structured folder of complete markdown files gives an agent something simpler and often more useful: clear names, explicit relationships, readable context and a path it can navigate.',
          'The vault is the database. The structure is the retrieval system.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'linkedin', 'p04-personal')
        ]),
        'linkedin-company': paragraphs([
          'AI cannot compensate for knowledge that is scattered, ambiguous or structurally invisible.',
          'Before adding a retrieval stack, organise the source: complete documents, explicit links, consistent metadata and clear operating rules.',
          'For many mid-market teams, better structure beats more infrastructure.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'linkedin', 'p04-company')
        ]),
        instagram: paragraphs([
          'Before building a retrieval pipeline, fix the filing system.',
          'Clear files. Explicit links. Useful metadata. Complete context.',
          'Better structure often beats more infrastructure.',
          '#KnowledgeManagement #AgenticAI #PKM #OptiFlows'
        ])
      }
    },
    {
      id: 'p05', week: 2, date: '2026-09-16', day: 'Wed 16 Sep', format: 'carousel',
      theme: 'Choosing structured files or RAG',
      title: 'When structured files beat RAG (and when they do not)',
      deck: 'A balanced decision framework that demonstrates judgment rather than promoting a universal technical answer.',
      accent: 'signal', visual: 'files',
      blogSlug: 'your-ai-needs-a-filing-system-not-a-database',
      asset: { pdf: 'assets/p05-files-versus-rag-carousel.pdf', slideBase: 'assets/p05-files-versus-rag-slide-', slideCount: 8, width: 1080, height: 1350 },
      slides: [
        { headline: 'Structured files or RAG?', body: 'Choose the lightest architecture that reliably solves the knowledge problem you actually have.', variant: 'cover' },
        { headline: 'Start with the source, not the retrieval layer', body: 'If the knowledge is duplicated, stale or unnamed, a more sophisticated search layer will retrieve the same disorder faster.' },
        { headline: 'Structured files win when the corpus is bounded', body: 'A few dozen to a few hundred curated documents can stay legible to both people and agents.' },
        { headline: 'They win when relationships matter', body: 'Rules can link to definitions, playbooks and proof. An agent can follow the same reasoning path as a careful operator.' },
        { headline: 'They win when change must be immediate', body: 'Edit the source file and the agent sees the current version. No chunking or embedding refresh is required.' },
        { headline: 'RAG wins when scale and search complexity dominate', body: 'Large, heterogeneous corpora and high-volume semantic discovery can justify dedicated retrieval infrastructure.' },
        { headline: 'The useful answer may be both', body: 'Keep an authoritative structured source, then add retrieval where the corpus and use case genuinely demand it.' },
        { headline: 'Architecture should follow the problem', body: 'Do not buy complexity as a substitute for information design.', variant: 'cta', cta: 'Read the full OptiFlows guide' }
      ],
      channels: {
        'linkedin-personal': paragraphs([
          'Structured files versus RAG is not an ideological choice.',
          'The right answer depends on corpus size, document quality, update frequency, retrieval patterns and how much infrastructure the team can realistically operate.',
          'The mistake is starting with the retrieval technology before establishing an authoritative source.',
          'This carousel is the decision framework I use. It also includes the point where structured files stop being the simplest answer.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'linkedin', 'p05-personal')
        ]),
        'linkedin-company': paragraphs([
          'The best knowledge architecture is not necessarily the most sophisticated one.',
          'Use this framework to decide when a structured file system is sufficient, when dedicated retrieval becomes justified and why the authoritative source still matters in both cases.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'linkedin', 'p05-company')
        ]),
        instagram: paragraphs([
          'Structured files or RAG?',
          'The answer should follow the corpus and the operating need, not the current technology fashion.',
          'Save this decision framework.',
          '#RAG #KnowledgeSystems #AIArchitecture #OptiFlows'
        ])
      }
    },
    {
      id: 'p06', week: 2, date: '2026-09-18', day: 'Fri 18 Sep', format: 'motion',
      theme: 'Knowledge becomes navigable',
      title: 'From scattered documents to navigable knowledge',
      deck: 'A kinetic transformation from disconnected files into a linked, agent-readable knowledge map.',
      accent: 'signal', visual: 'files', duration: '6 seconds',
      blogSlug: 'your-ai-needs-a-filing-system-not-a-database',
      asset: { video: 'assets/p06-navigable-knowledge.mp4', poster: 'assets/p06-navigable-knowledge-poster.png', width: 1080, height: 1920 },
      motion: { opening: 'Documents everywhere.', closing: 'No shared path through them.', resolution: 'Structure turns storage into navigable knowledge.' },
      channels: {
        'linkedin-personal': paragraphs([
          'Most company knowledge is not missing. It is simply difficult to navigate.',
          'Strategy is in a deck. Decisions are in chat. Proof is in a proposal. Brand rules are in somebody’s memory.',
          'An agent-ready knowledge system does not begin with a larger model. It begins with an authoritative structure that both people and agents can follow.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'linkedin', 'p06-personal')
        ]),
        'linkedin-company': paragraphs([
          'Storage becomes knowledge only when people and agents can find the current source, understand its role and follow its relationships.',
          'Structure is the operating layer between information and useful action.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'linkedin', 'p06-company')
        ]),
        instagram: paragraphs([
          'The documents already exist. The path through them does not.',
          'Structure turns storage into navigable knowledge.',
          '#KnowledgeDesign #AgentSystems #FutureOfWork #OptiFlows'
        ]),
        youtube: paragraphs([
          'From scattered documents to navigable knowledge.',
          'An agent-ready knowledge system starts with an authoritative structure that humans and AI can follow.',
          blogLink('your-ai-needs-a-filing-system-not-a-database', 'youtube', 'p06-short'),
          '#Shorts #KnowledgeManagement #AgenticAI'
        ])
      }
    },
    {
      id: 'p07', week: 3, date: '2026-09-21', day: 'Mon 21 Sep', format: 'tile',
      theme: 'Founder as router',
      title: 'If every decision returns to the founder, the system is not installed.',
      deck: 'A founder-led observation that separates authority from routine coordination.',
      accent: 'human', visual: 'gate',
      blogSlug: 'removing-the-founder-from-the-loop',
      asset: { image: 'assets/p07-founder-router.png', width: 1080, height: 1350 },
      channels: {
        'linkedin-personal': paragraphs([
          'There is a difference between founder authority and founder dependency.',
          'Authority sets direction, defines boundaries and makes genuinely consequential decisions. Dependency means routine approvals, context and exceptions still queue behind one calendar.',
          'Removing the founder from the loop should not remove their judgment. It should encode that judgment clearly enough that normal work can move, while unusual work escalates with the right context.',
          'The goal is not less control. It is control without becoming the routing layer.',
          blogLink('removing-the-founder-from-the-loop', 'linkedin', 'p07-personal')
        ]),
        'linkedin-company': paragraphs([
          'The founder’s job is to set direction, not route routine traffic.',
          'A durable operating model preserves human authority while removing unnecessary dependence on one person for context, follow-up and standard decisions.',
          blogLink('removing-the-founder-from-the-loop', 'linkedin', 'p07-company')
        ]),
        instagram: paragraphs([
          'Keep the authority. Remove the dependency.',
          'If routine work still queues behind one person, the operating system is not installed yet.',
          '#FounderLed #LeadershipSystems #AIWorkflows #OptiFlows'
        ])
      }
    },
    {
      id: 'p08', week: 3, date: '2026-09-23', day: 'Wed 23 Sep', format: 'carousel',
      theme: 'Governed decision boundaries',
      title: 'What agents decide, recommend, escalate and never do',
      deck: 'A governance framework designed to reassure direct and hidden buyers that autonomy has explicit boundaries.',
      accent: 'human', visual: 'gate',
      blogSlug: 'removing-the-founder-from-the-loop',
      asset: { pdf: 'assets/p08-agent-boundaries-carousel.pdf', slideBase: 'assets/p08-agent-boundaries-slide-', slideCount: 8, width: 1080, height: 1350 },
      slides: [
        { headline: 'What should an agent be allowed to do?', body: 'Autonomy is useful only when the authority boundary is explicit.', variant: 'cover' },
        { headline: 'Decide', body: 'Routine, reversible actions inside an agreed policy: classification, routing, reminders and low-risk preparation.' },
        { headline: 'Recommend', body: 'Judgment calls where the agent can assemble evidence and propose a next step, but a human owns the decision.' },
        { headline: 'Escalate', body: 'Exceptions, ambiguity, missing evidence or thresholds that require accountable human attention.' },
        { headline: 'Never do', body: 'Spend, publish, alter credentials, mutate protected records or make consequential external commitments without explicit authority.' },
        { headline: 'Carry the decision context', body: 'An escalation should arrive with the source, options, risk and reason, not as another vague notification.' },
        { headline: 'Log what happened', body: 'A governed system makes actions, approvals and exceptions reviewable after the fact.' },
        { headline: 'Good governance reduces friction', body: 'The goal is not a human approval on everything. It is the right human decision at the right boundary.', variant: 'cta', cta: 'Map one authority boundary' }
      ],
      channels: {
        'linkedin-personal': paragraphs([
          '“Human in the loop” is too vague to be an operating model.',
          'Which human? At what point? For what threshold? With what evidence? What can proceed without them?',
          'I prefer four explicit lanes: decide, recommend, escalate and never do. The boundary should be visible before an agent enters production, not invented after something goes wrong.',
          'The useful result is not an approval on every task. It is routine work moving safely while the right exceptions reach the right person with enough context to decide.',
          blogLink('removing-the-founder-from-the-loop', 'linkedin', 'p08-personal')
        ]),
        'linkedin-company': paragraphs([
          'Governed autonomy needs explicit decision lanes.',
          'This framework separates what an agent may decide, what it may recommend, what it must escalate and what remains outside its authority.',
          'Save it for the design review before your next agent enters production.',
          blogLink('removing-the-founder-from-the-loop', 'linkedin', 'p08-company')
        ]),
        instagram: paragraphs([
          'Decide. Recommend. Escalate. Never do.',
          'Four lanes make “human in the loop” an operating rule instead of a slogan.',
          '#AIGovernance #HumanInTheLoop #AgenticAI #OptiFlows'
        ])
      }
    },
    {
      id: 'p09', week: 3, date: '2026-09-25', day: 'Fri 25 Sep', format: 'motion',
      theme: 'Authority gate in motion',
      title: 'Remove dependency. Retain authority.',
      deck: 'A cinematic visual of routine flow proceeding while consequential work pauses at a visible human gate.',
      accent: 'human', visual: 'gate', duration: '6 seconds',
      blogSlug: 'removing-the-founder-from-the-loop',
      asset: { video: 'assets/p09-retain-authority.mp4', poster: 'assets/p09-retain-authority-poster.png', width: 1080, height: 1920 },
      motion: { opening: 'Everything queued behind one person.', closing: 'Routine work can move.', resolution: 'Human authority stays exactly where it matters.' },
      channels: {
        'linkedin-personal': paragraphs([
          'The best agent systems do not remove the human. They remove unnecessary waiting around the human.',
          'Routine work moves inside explicit policy. Consequential work pauses at a visible authority gate. The decision arrives with its context intact.',
          'That is the difference between automation and a governed operating system.',
          blogLink('removing-the-founder-from-the-loop', 'linkedin', 'p09-personal')
        ]),
        'linkedin-company': paragraphs([
          'Remove dependency. Retain authority.',
          'Governed flow allows routine work to proceed while preserving an explicit human decision boundary for what actually matters.',
          blogLink('removing-the-founder-from-the-loop', 'linkedin', 'p09-company')
        ]),
        instagram: paragraphs([
          'The human stays in authority, not in every routine handoff.',
          'Design the boundary. Carry the context. Let normal work move.',
          '#AIGovernance #WorkflowAutomation #Leadership #OptiFlows'
        ]),
        youtube: paragraphs([
          'Remove dependency. Retain authority.',
          'A governed agent system lets routine work move while consequential decisions remain human-owned.',
          blogLink('removing-the-founder-from-the-loop', 'youtube', 'p09-short'),
          '#Shorts #AIGovernance #HumanInTheLoop'
        ])
      }
    },
    {
      id: 'p10', week: 4, date: '2026-09-28', day: 'Mon 28 Sep', format: 'tile',
      theme: 'From activity to infrastructure',
      title: 'Campaigns are tactics. Engines are infrastructure.',
      deck: 'A growth-system reframe that contrasts repeated launches with compounding capability.',
      accent: 'intelligence', visual: 'engine',
      blogSlug: 'campaigns-are-tactics-engines-are-infrastructure',
      asset: { image: 'assets/p10-campaigns-versus-engines.png', width: 1080, height: 1350 },
      channels: {
        'linkedin-personal': paragraphs([
          'A campaign is a one-time event. A campaign engine is a system that can produce the next campaign without rebuilding everything from zero.',
          'The distinction is easy to miss because both can generate activity. Only one compounds the audience learning, proof, workflows, reusable assets and decision logic created along the way.',
          'If the tenth campaign takes the same effort as the first, the business has been funding tactics, not building infrastructure.',
          blogLink('campaigns-are-tactics-engines-are-infrastructure', 'linkedin', 'p10-personal')
        ]),
        'linkedin-company': paragraphs([
          'Campaign activity can grow while campaign capability remains flat.',
          'An engine preserves the learning, assets, routing and decision logic required to make the next cycle better than the last.',
          'One depletes. The other compounds.',
          blogLink('campaigns-are-tactics-engines-are-infrastructure', 'linkedin', 'p10-company')
        ]),
        instagram: paragraphs([
          'If every campaign starts with a blank document, you do not have an engine yet.',
          'Build the infrastructure that makes the next cycle better than the last.',
          '#GrowthSystems #MarketingOperations #CampaignStrategy #OptiFlows'
        ])
      }
    },
    {
      id: 'p11', week: 4, date: '2026-09-30', day: 'Wed 30 Sep', format: 'carousel',
      theme: 'Reset versus compound',
      title: 'Campaign versus engine: reset or compound?',
      deck: 'A side-by-side operating comparison that turns the growth-engine argument into a practical checklist.',
      accent: 'intelligence', visual: 'engine',
      blogSlug: 'campaigns-are-tactics-engines-are-infrastructure',
      asset: { pdf: 'assets/p11-campaign-engine-carousel.pdf', slideBase: 'assets/p11-campaign-engine-slide-', slideCount: 8, width: 1080, height: 1350 },
      slides: [
        { headline: 'Campaign or campaign engine?', body: 'Both create activity. Only one leaves the organisation stronger after the launch.', variant: 'cover' },
        { headline: 'Campaign / Starts from a brief', body: 'A new document, new assumptions and a new scramble for context every cycle.' },
        { headline: 'Engine / Starts from accumulated learning', body: 'Audience evidence, approved positioning, previous performance and reusable components are already available.' },
        { headline: 'Campaign / Relies on coordination', body: 'People chase assets, translate decisions and manually route each handoff.' },
        { headline: 'Engine / Encodes the workflow', body: 'Clear triggers, ownership, authority boundaries and reusable production paths keep work moving.' },
        { headline: 'Campaign / Output disappears', body: 'The launch ends and the operating knowledge disperses back into folders, inboxes and memory.' },
        { headline: 'Engine / Capability compounds', body: 'Each cycle improves the playbook, evidence base, asset library and decision quality.' },
        { headline: 'The test is simple', body: 'Did this campaign merely perform, or did it make the next campaign easier and better?', variant: 'cta', cta: 'Build the engine' }
      ],
      channels: {
        'linkedin-personal': paragraphs([
          'The real test of a campaign is not only whether it performed.',
          'Did it make the next campaign easier to produce, easier to govern and more likely to work?',
          'A useful engine preserves the audience evidence, positioning decisions, reusable assets, workflow and performance learning created during the cycle. That is what turns marketing activity into organisational capability.',
          'This carousel shows the operating difference between a campaign that resets and an engine that compounds.',
          blogLink('campaigns-are-tactics-engines-are-infrastructure', 'linkedin', 'p11-personal')
        ]),
        'linkedin-company': paragraphs([
          'Did the campaign perform? And did it leave the next campaign easier to produce?',
          'Use this comparison to distinguish one-time activity from a campaign engine that preserves learning and compounds capability.',
          blogLink('campaigns-are-tactics-engines-are-infrastructure', 'linkedin', 'p11-company')
        ]),
        instagram: paragraphs([
          'A campaign creates an output. An engine creates the next output, and gets better each time.',
          'Swipe for the reset-versus-compound test.',
          '#GrowthEngine #MarketingSystems #ContentOperations #OptiFlows'
        ])
      }
    },
    {
      id: 'p12', week: 4, date: '2026-10-02', day: 'Fri 2 Oct', format: 'motion',
      theme: 'Diagnostic conversion',
      title: 'What is coordination drag costing?',
      deck: 'The direct-response close: visualise the hidden cost, then invite one low-friction diagnostic action.',
      accent: 'mint', visual: 'meter', duration: '6 seconds',
      asset: { video: 'assets/p12-drag-check.mp4', poster: 'assets/p12-drag-check-poster.png', width: 1080, height: 1920 },
      motion: { opening: 'Waiting. Chasing. Rework. Escalation.', closing: 'Small moments. Repeated every week.', resolution: 'Put a number on the drag.' },
      channels: {
        'linkedin-personal': paragraphs([
          'Coordination drag rarely arrives as one dramatic failure.',
          'It accumulates through waiting, chasing, rework, repeated context and senior attention pulled into routine decisions.',
          'The first useful step is not a transformation program. It is putting a rough number on one workflow that keeps pulling people back into the loop.',
          'We built a 90-second check to make that cost visible. It is indicative, not a business case, but it gives you a better first question.',
          diagnosticLink('linkedin', 'p12-personal')
        ]),
        'linkedin-company': paragraphs([
          'What is routine coordination costing your business?',
          'Use the 90-second OptiFlows drag check to estimate the annual cost of waiting, chasing, rework and unnecessary escalation inside one recurring workflow.',
          diagnosticLink('linkedin', 'p12-company')
        ]),
        instagram: paragraphs([
          'Waiting. Chasing. Rework. Escalation.',
          'Small moments become a material operating cost when they repeat every week.',
          'Put a number on the drag. Link in bio.',
          '#OperationalExcellence #WorkflowDesign #BusinessEfficiency #OptiFlows'
        ]),
        youtube: paragraphs([
          'What is coordination drag costing your business?',
          'Estimate the annual cost of waiting, chasing, rework and unnecessary escalation inside one recurring workflow.',
          diagnosticLink('youtube', 'p12-short'),
          '#Shorts #BusinessOperations #WorkflowDesign'
        ])
      }
    }
  ]
};
