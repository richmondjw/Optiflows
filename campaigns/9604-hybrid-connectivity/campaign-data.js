const CAMPAIGN = {
  meta: {
    id: "9604-hybrid-iot-90-day-2026",
    title: "Coverage Beyond the Grid",
    product: "Iridium Certus 9604 Hybrid IoT",
    line: "Cellular where you can. Satellite where you must.",
    status: "PRIVATE REVIEW · PRODUCTION PACK · NOT ACTIVATED",
    version: "1.0",
    created: "2026-09-09",
    proposedRun: "21 September–13 December 2026",
    owner: "M2M Group",
    primaryUrl: "https://m2mone.com.au/hybrid-iot-readiness/",
    reviewUrl: "https://optiflows.com.au/campaigns/9604-hybrid-connectivity/"
  },

  strategy: {
    objective: "Generate qualified technical conversations with product teams, solution integrators and operators whose connected devices move beyond dependable cellular coverage.",
    audience: [
      "Asset tracking and logistics product teams",
      "Agtech and environmental monitoring teams",
      "Remote equipment monitoring operators",
      "Field-safety and lone-worker solution teams",
      "System integrators building connected products"
    ],
    route: "Coverage problem → readiness guide → qualified design conversation",
    primaryChannel: "LinkedIn organic and document posts",
    supportingChannels: ["Segmented email nurture", "Hybrid IoT landing page", "Paid search", "Retargeting", "Sales and SI follow-up"],
    primaryMeasure: "Qualified design-session requests and sales-accepted leads",
    diagnosticMeasures: ["Readiness-guide conversion", "Repeat visits", "LinkedIn document completion", "Lead response time", "Performance by source and vertical"],
    nonGoal: "This is not a reach campaign and it is not authorised to optimise primarily for impressions or opens."
  },

  phases: [
    { id: "recognise", number: "01", weeks: "Weeks 1–3", title: "Recognise the coverage gap", copy: "Make the operational boundary visible, quantify the decision it creates and explain that hybrid behaviour must be designed." },
    { id: "prove", number: "02", weeks: "Weeks 4–8", title: "Prove it in the field", copy: "Translate the same design question into five credible operating contexts without promising universal coverage or automatic failover." },
    { id: "convert", number: "03", weeks: "Weeks 9–12", title: "Move into engineering", copy: "Give engaged teams a practical readiness tool, a design clinic and a clear route to a scoped technical conversation." }
  ],

  weeks: [
    {
      id: "w01", week: 1, phase: "recognise", date: "2026-09-22", label: "Coverage boundary", master: "w01-coverage-boundary.png",
      eyebrow: "HYBRID IOT · THE COVERAGE GAP", headline: "Where does your device lose coverage?",
      support: "Find the boundary before it becomes an operating issue.", cta: "Explore the readiness guide",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn organic", "Website hero", "Email 01", "Paid search"],
      caption: "A connected product can work perfectly in the lab and still fail at the edge of its operating map. The useful question is not whether cellular coverage is good in general. It is where your device, asset or worker moves beyond the coverage your workflow depends on—and which messages still matter there.\n\nHybrid IoT gives product teams another connectivity layer to design around. The readiness work starts with routes, environments, message priorities, power, antenna placement and the consequence of a missed transmission.\n\nMap the coverage dependency before choosing the architecture.\n\nExplore the Hybrid IoT readiness guide: https://m2mone.com.au/hybrid-iot-readiness/\n\n#HybridIoT #IoTDesign #SatelliteIoT #Connectivity",
      evidence: "Problem framing; no performance guarantee."
    },
    {
      id: "w02", week: 2, phase: "recognise", date: "2026-09-29", label: "Cost of silence", master: "w02-transmission-cost.png",
      eyebrow: "HYBRID IOT · OPERATING CONSEQUENCE", headline: "What does one missed transmission cost?",
      support: "Not every message is equal. Design around the ones that change a decision.", cta: "Prioritise your messages",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn organic", "Email 02", "Retargeting"],
      caption: "A missed location update, threshold alert or safety escalation does not carry the same consequence as routine telemetry. That distinction should shape the connectivity design.\n\nBefore adding a satellite path, rank the messages your operation produces:\n• Which ones are time-sensitive?\n• Which ones can wait and retry?\n• Which ones trigger a human decision?\n• What is the operational cost when one never arrives?\n\nThe answer creates a clearer brief for reporting frequency, retry logic, power use and the role of each network layer.\n\nUse the readiness guide to start the conversation: https://m2mone.com.au/hybrid-iot-readiness/\n\n#RemoteOperations #IoT #AssetTracking #Engineering",
      evidence: "Operational diagnostic; consequence varies by application."
    },
    {
      id: "w03", week: 3, phase: "recognise", date: "2026-10-06", label: "Architecture truth", master: "w09-engineering-design.png",
      eyebrow: "HYBRID IOT · DESIGN TRUTH", headline: "Hybrid is a design decision—not a magic switch.",
      support: "The 9604 makes both network layers available. Your system defines when and how to use them.", cta: "Review the design questions",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn document", "Landing-page proof", "Engineering follow-up"],
      caption: "The Iridium Certus 9604 brings LTE-M cellular, Iridium Short Burst Data and GNSS into one compact module. That simplifies the hardware footprint. It does not remove the system-design work.\n\nThe module provides independent control of its cellular and satellite subsystems. Product teams still define the routing, retry, fallback and message-priority logic that fits their application.\n\nThat is good engineering news: the behaviour can be designed around the device, environment and commercial model instead of assumed from a generic ‘always connected’ claim.\n\nStart with the readiness questions: https://m2mone.com.au/hybrid-iot-readiness/\n\n#EmbeddedSystems #IoTEngineering #Iridium #LTEM",
      evidence: "Official Iridium 9604 architecture; implementation behaviour remains developer-defined."
    },
    {
      id: "w04", week: 4, phase: "prove", date: "2026-10-13", label: "Asset tracking", master: "w04-asset-tracking.png",
      eyebrow: "VERTICAL PROOF · ASSET TRACKING", headline: "Visibility beyond the predictable route.",
      support: "Plan for the point where a moving asset exceeds dependable cellular reach.", cta: "Assess the route",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn carousel", "Segment email", "Vertical landing section", "Sales talk track"],
      caption: "Asset routes are rarely as tidy as a coverage map. Detours, yards, regional corridors and remote handover points can take a tracker outside the cellular conditions assumed at design time.\n\nA hybrid architecture can add a satellite message path for defined exceptions—but the design still needs discipline. Which event justifies satellite transmission? How long should the device retry cellular? What payload is essential? How will operations distinguish delayed telemetry from a genuine incident?\n\nDesign the exception path before the exception happens.\n\nAssess your coverage gap: https://m2mone.com.au/hybrid-iot-readiness/\n\n#AssetTracking #LogisticsTechnology #HybridIoT #SatelliteIoT",
      evidence: "Use-case framing; no route or coverage guarantee."
    },
    {
      id: "w05", week: 5, phase: "prove", date: "2026-10-20", label: "Agtech", master: "w05-agtech.png",
      eyebrow: "VERTICAL PROOF · AGTECH", headline: "Monitoring does not stop at the fence line.",
      support: "Design the reporting path around the property—not the nearest tower.", cta: "Map the field conditions",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn carousel", "Segment email", "Vertical landing section", "SI outreach"],
      caption: "Distributed agriculture creates a practical connectivity question: which readings need to leave the field when terrestrial coverage is intermittent or absent?\n\nThe right answer is usually selective. Routine readings may be stored, batched or retried. A threshold event—water level, equipment state or environmental condition—may deserve a different path and priority.\n\nHybrid IoT is strongest when message value, power budget, antenna conditions and operating geography are designed together. It is not a substitute for that work.\n\nMap the field conditions with the readiness guide: https://m2mone.com.au/hybrid-iot-readiness/\n\n#Agtech #RemoteMonitoring #IoTConnectivity #SatelliteIoT",
      evidence: "Scenario-led copy; final application architecture requires engineering review."
    },
    {
      id: "w06", week: 6, phase: "prove", date: "2026-10-27", label: "Environmental monitoring", master: "w06-environmental.png",
      eyebrow: "VERTICAL PROOF · ENVIRONMENT", headline: "When the site is remote, the data still matters.",
      support: "Prioritise the readings that should travel now from the ones that can wait.", cta: "Define the reporting logic",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn carousel", "Engineering explainer", "Vertical landing section"],
      caption: "Environmental monitoring often places sensors exactly where network infrastructure is least convenient: catchments, coastlines, reserves and distributed field sites.\n\nThe design challenge is not to transmit everything over every available path. It is to define what the operation needs to know, how soon it needs to know it and what the device should do when its preferred network is unavailable.\n\nA hybrid module can reduce hardware complexity. A resilient monitoring product still depends on thoughtful payloads, power management, antenna design and exception logic.\n\nDefine the reporting logic: https://m2mone.com.au/hybrid-iot-readiness/\n\n#EnvironmentalMonitoring #IoTDesign #RemoteSensors #Iridium",
      evidence: "Scenario-led copy; no promise of universal or continuous connectivity."
    },
    {
      id: "w07", week: 7, phase: "prove", date: "2026-11-03", label: "Remote equipment", master: "w07-remote-equipment.png",
      eyebrow: "VERTICAL PROOF · REMOTE EQUIPMENT", headline: "Design for the hour no one can drive out.",
      support: "Make the critical state visible before it becomes an expensive site visit.", cta: "Review the exception path",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn carousel", "Segment email", "Retargeting", "Sales talk track"],
      caption: "Remote equipment monitoring earns its value when it changes a maintenance or operating decision. That makes message priority more important than message volume.\n\nWhat condition requires attention now? What can wait for the cellular path to recover? What should be compressed into a small exception payload? And what local behaviour must continue even if neither network is available?\n\nThose questions turn ‘hybrid connectivity’ from a feature into an operating design.\n\nReview the exception path: https://m2mone.com.au/hybrid-iot-readiness/\n\n#RemoteEquipment #PredictiveMaintenance #IndustrialIoT #HybridConnectivity",
      evidence: "Operational design framing; local autonomy remains application-specific."
    },
    {
      id: "w08", week: 8, phase: "prove", date: "2026-11-10", label: "Field safety", master: "w08-field-safety.png",
      eyebrow: "VERTICAL PROOF · FIELD SAFETY", headline: "Connectivity is part of the safety plan.",
      support: "Treat communications as one layer of a governed escalation process.", cta: "Assess the dependency",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn carousel", "Segment email", "Vertical landing section", "Sales talk track"],
      caption: "For a lone-worker or field-safety product, connectivity is important—but it is only one part of the safety system.\n\nA responsible design defines message priority, retry behaviour, acknowledgement, escalation, device-state visibility and what the worker should do when communications are unavailable. A satellite path may extend the operating design beyond dependable cellular coverage; it should never be presented as a guarantee of delivery or safety.\n\nBuild the communications dependency into the risk assessment from the start.\n\nAssess the design questions: https://m2mone.com.au/hybrid-iot-readiness/\n\n#FieldSafety #LoneWorker #SafetyTechnology #SatelliteIoT",
      evidence: "Safety-sensitive copy with explicit no-guarantee qualification."
    },
    {
      id: "w09", week: 9, phase: "convert", date: "2026-11-17", label: "Engineering proof", master: "w09-engineering-design.png",
      eyebrow: "ENGINEERING PROOF · 9604", headline: "One module. Both layers. Your logic.",
      support: "LTE-M, Iridium SBD and GNSS in a compact form factor—with subsystem control left to the product design.", cta: "Talk through the architecture",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn document", "Technical email", "Landing-page proof", "SI enablement"],
      caption: "The Iridium Certus 9604 combines LTE-M cellular, Iridium Short Burst Data and GNSS in a 16 × 26 × 2.4 mm module. Iridium describes independent control of the cellular and satellite subsystems and a unified AT-command interface.\n\nFor an engineering team, the practical value is design flexibility and a smaller integration footprint—not a black-box promise. Antennas, power, firmware, payloads, service plans, certification and operating conditions still belong in the design review.\n\nBring the real route, message profile and constraints to a Hybrid IoT design conversation.\n\nStart here: https://m2mone.com.au/hybrid-iot-readiness/\n\n#HardwareDesign #EmbeddedIoT #Iridium9604 #SystemsEngineering",
      evidence: "Dimensions and architecture from official Iridium product information, observed 9 September 2026."
    },
    {
      id: "w10", week: 10, phase: "convert", date: "2026-11-24", label: "Readiness checklist", master: "w01-coverage-boundary.png",
      eyebrow: "DESIGN TOOL · READINESS CHECKLIST", headline: "Map the gap before you map the hardware.",
      support: "Seven questions to turn a coverage concern into an engineering brief.", cta: "Download the checklist",
      url: "downloads/hybrid-iot-readiness-guide.pdf", channels: ["LinkedIn organic", "Email 07", "Lead-magnet page", "Retargeting"],
      caption: "A useful Hybrid IoT conversation starts before the module selection.\n\nBring seven inputs:\n1. Operating regions and movement patterns\n2. Known or suspected coverage boundaries\n3. Message types and payload sizes\n4. Reporting frequency and urgency\n5. Power, enclosure and antenna constraints\n6. Retry, acknowledgement and fallback behaviour\n7. Commercial and service assumptions\n\nWe have packaged the questions into a practical readiness guide for product and solution teams.\n\nDownload the guide: https://optiflows.com.au/campaigns/9604-hybrid-connectivity/downloads/hybrid-iot-readiness-guide.pdf\n\n#IoTArchitecture #ProductDesign #HybridIoT #EngineeringChecklist",
      evidence: "Campaign-owned diagnostic framework; not a product certification or coverage assessment."
    },
    {
      id: "w11", week: 11, phase: "convert", date: "2026-12-01", label: "Design clinic", master: "w09-engineering-design.png",
      eyebrow: "LIVE TECHNICAL SESSION · PROPOSED", headline: "Bring the coverage problem. Leave with a design path.",
      support: "A focused clinic for product teams and integrators—subject to speaker and date confirmation.", cta: "Register interest",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn organic", "Email 08", "Website clinic panel", "Partner outreach"],
      caption: "Some Hybrid IoT questions are best worked through with the route, payload and device constraints on the table.\n\nWe are proposing a focused design clinic for product teams and system integrators assessing cellular-plus-satellite architectures. The session would cover message priority, switching logic, power and antenna considerations, service assumptions and the evidence needed before a prototype.\n\nThis is an expression-of-interest, not a confirmed event. Date, speaker and capacity will be published only after internal confirmation.\n\nRegister interest: https://m2mone.com.au/hybrid-iot-readiness/\n\n#IoTEngineering #SystemIntegrators #SatelliteIoT #DesignClinic",
      evidence: "Proposed event; activation requires named speaker, date, capacity and owner."
    },
    {
      id: "w12", week: 12, phase: "convert", date: "2026-12-08", label: "Design conversation", master: "w01-coverage-boundary.png",
      eyebrow: "HYBRID IOT · NEXT DECISION", headline: "Ready to design beyond dependable coverage?",
      support: "Bring the operating map, critical messages and device constraints. We will help shape the next technical step.", cta: "Start a design conversation",
      url: "https://m2mone.com.au/hybrid-iot-readiness/", channels: ["LinkedIn organic", "Conversion email", "Retargeting", "Sales follow-up"],
      caption: "If your device, asset or worker moves beyond dependable cellular coverage, the next step is not another generic connectivity claim. It is a scoped design conversation.\n\nBring the operating map, message priorities, reporting cadence, power and antenna constraints, and the behaviour you need when the preferred network is unavailable. We can help you test whether a cellular-plus-satellite architecture is appropriate and identify the work needed before prototype or deployment.\n\nStart a Hybrid IoT design conversation: https://m2mone.com.au/hybrid-iot-readiness/\n\n#HybridIoT #IoTProduct #SatelliteConnectivity #Engineering",
      evidence: "Conversion offer; qualification and technical review required."
    }
  ],

  carousels: [
    {
      "id": "asset-tracking",
      "week": 4,
      "title": "The route changes. Someone still needs an answer.",
      "audience": "Asset tracking and logistics teams",
      "master": "carousel-asset-tracking-human.jpg",
      "slides": [
        {
          "headline": "The route just changed.",
          "body": "For the person waiting at the next handover, the next update matters."
        },
        {
          "headline": "So did the coverage.",
          "body": "A detour can take a tracker beyond the cellular conditions it was designed around."
        },
        {
          "headline": "Which update cannot wait?",
          "body": "Rank the location, delay and exception messages that change a human decision."
        },
        {
          "headline": "Give the exception a plan.",
          "body": "Design cellular retries, a satellite message path and what happens when neither is available."
        },
        {
          "headline": "Bring us the real route.",
          "body": "Start with one journey, its critical messages and your device constraints.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "technicalNotes": [
        {
          "headline": "Where does the route exceed your network assumption?",
          "body": "Detours, depots and remote handover points can expose a coverage dependency."
        },
        {
          "headline": "Rank the events",
          "body": "Routine location updates, exceptions, tamper events and safety alerts do not carry equal urgency."
        },
        {
          "headline": "Define the behaviour",
          "body": "Set cellular retry, satellite escalation, payload size, acknowledgement and store-and-forward rules."
        },
        {
          "headline": "Design the whole device",
          "body": "Power, antennas, enclosure, firmware, service costs and operations must be reviewed together."
        },
        {
          "headline": "Assess the coverage gap",
          "body": "Bring a real route and message profile to a scoped Hybrid IoT design conversation.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "storyAccent": "#F7781E",
      "illustrative": "Generated illustrative person and setting; not a customer case study or testimonial."
    },
    {
      "id": "agtech",
      "week": 5,
      "title": "The water level cannot read your coverage map.",
      "audience": "Agtech product and farm-system teams",
      "master": "carousel-agtech-human.jpg",
      "slides": [
        {
          "headline": "One farm. A lot to watch.",
          "body": "A water reading from the far paddock can shape the next job of the day."
        },
        {
          "headline": "The tower is somewhere else.",
          "body": "Design around the paddock, terrain and sky view where the sensor actually works."
        },
        {
          "headline": "This reading changes the day.",
          "body": "Separate urgent thresholds from routine readings that can store, batch or retry."
        },
        {
          "headline": "Make the whole design work.",
          "body": "Match message paths to power, antennas and the behaviour required when offline."
        },
        {
          "headline": "Start with your far paddock.",
          "body": "Bring one site's conditions into a Hybrid IoT readiness conversation.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "technicalNotes": [
        {
          "headline": "What must leave the field now?",
          "body": "Separate urgent thresholds from routine telemetry that can wait, batch or retry."
        },
        {
          "headline": "Where does the device really operate?",
          "body": "Use property conditions, terrain and movement—not the nearest town—as the design input."
        },
        {
          "headline": "What is the power budget?",
          "body": "Reporting frequency and network behaviour must fit the device's energy model."
        },
        {
          "headline": "What happens offline?",
          "body": "Define local control, storage, retry and operator visibility before choosing the communications path."
        },
        {
          "headline": "Map the field conditions",
          "body": "Turn operating reality into a Hybrid IoT readiness brief.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "storyAccent": "#FEC221",
      "illustrative": "Generated illustrative person and setting; not a customer case study or testimonial."
    },
    {
      "id": "environmental",
      "week": 6,
      "title": "A remote reading. A very human decision.",
      "audience": "Environmental monitoring teams",
      "master": "carousel-environmental-human.jpg",
      "slides": [
        {
          "headline": "Out here, change is quiet.",
          "body": "A remote reading can help someone decide what needs a closer look."
        },
        {
          "headline": "Which change needs attention?",
          "body": "Define which thresholds matter and how quickly the team needs to know."
        },
        {
          "headline": "Send the part that matters.",
          "body": "Design a small, useful exception message and retain detail locally where appropriate."
        },
        {
          "headline": "Remote still has limits.",
          "body": "Plan for power and sky view; a satellite path cannot guarantee delivery."
        },
        {
          "headline": "Bring the site into the design.",
          "body": "Use the readiness guide to map the site, payload and reporting priorities.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "technicalNotes": [
        {
          "headline": "Remote data still needs a priority",
          "body": "Not every reading needs immediate transmission. Define what changes a decision."
        },
        {
          "headline": "Design for constrained payloads",
          "body": "Send the smallest useful exception message; retain detail locally where appropriate."
        },
        {
          "headline": "Account for the site",
          "body": "Sky view, mounting, antenna placement, power and maintenance access affect the design."
        },
        {
          "headline": "Keep the caveat visible",
          "body": "A satellite layer extends the design; it does not guarantee continuous availability or delivery."
        },
        {
          "headline": "Define the reporting logic",
          "body": "Bring the site, payload and urgency model to a design review.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "storyAccent": "#0057AD",
      "illustrative": "Generated illustrative person and setting; not a customer case study or testimonial."
    },
    {
      "id": "remote-equipment",
      "week": 7,
      "title": "Before someone makes the long drive.",
      "audience": "Industrial and remote-operations teams",
      "master": "carousel-remote-equipment-human.jpg",
      "slides": [
        {
          "headline": "It's a long way out.",
          "body": "Before a technician heads to a remote site, the equipment state matters."
        },
        {
          "headline": "What needs their attention now?",
          "body": "Choose the fault or threshold messages that change the next maintenance decision."
        },
        {
          "headline": "Give critical messages a plan.",
          "body": "Define retries and a satellite exception path around urgency, power and payload."
        },
        {
          "headline": "The machine still needs a plan.",
          "body": "Keep safe local control independent of connectivity, and make missing data visible."
        },
        {
          "headline": "Start with one real exception.",
          "body": "Bring its trigger, response and device constraints to a design review.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "technicalNotes": [
        {
          "headline": "What condition deserves attention now?",
          "body": "Start with decisions—not dashboards or data volume."
        },
        {
          "headline": "What can wait?",
          "body": "Routine telemetry may retry or batch. Exceptions may need another path."
        },
        {
          "headline": "What should the device do locally?",
          "body": "Connectivity cannot replace safe local control and fault handling."
        },
        {
          "headline": "How will operations read the state?",
          "body": "Make delayed data, loss of link and genuine incidents distinguishable."
        },
        {
          "headline": "Review the exception path",
          "body": "Scope the architecture before the next remote failure or truck roll.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "storyAccent": "#F7781E",
      "illustrative": "Generated illustrative person and setting; not a customer case study or testimonial."
    },
    {
      "id": "field-safety",
      "week": 8,
      "title": "There is a person behind every check-in.",
      "audience": "Lone-worker and safety-solution teams",
      "master": "carousel-field-safety-human.jpg",
      "slides": [
        {
          "headline": "Someone is expecting your check-in.",
          "body": "A field worker and their response team need a clear communications plan."
        },
        {
          "headline": "Sent. Received. Acknowledged?",
          "body": "Define what the worker and response team see at every message state."
        },
        {
          "headline": "Who takes the next step?",
          "body": "Set retry, alternate-path and human escalation rules for each event."
        },
        {
          "headline": "And when no message gets through?",
          "body": "Make communication limits visible and define the worker's procedure for that state."
        },
        {
          "headline": "Build the whole safety plan.",
          "body": "Review the workflow with technical and safety owners; connectivity is not a safety guarantee.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "technicalNotes": [
        {
          "headline": "Connectivity is one safety layer",
          "body": "Treat it as part of a governed process—not a guarantee."
        },
        {
          "headline": "Define acknowledgement",
          "body": "Know how the device, worker and response team see message state."
        },
        {
          "headline": "Define escalation",
          "body": "Set retry, alternate path and human escalation behaviour for each event class."
        },
        {
          "headline": "Define the unavailable state",
          "body": "The product and procedure must make communication limits visible."
        },
        {
          "headline": "Assess the dependency",
          "body": "Review the complete safety workflow with technical and risk owners.",
          "cta": "m2mone.com.au/hybrid-iot-readiness"
        }
      ],
      "storyAccent": "#FEC221",
      "illustrative": "Generated illustrative person and setting; not a customer case study or testimonial."
    }
  ],

  emails: [
    {
      id: "e01", week: 1, segment: "Product, engineering and SI prospects", subject: "Where does your device lose coverage?", preheader: "Map the operating boundary before it becomes a product issue.",
      headline: "Find the boundary before it finds you.", master: "w01-coverage-boundary.png", cta: "Explore the readiness guide",
      paragraphs: [
        "A connected product can be reliable in its expected cellular footprint and still encounter a very different operating reality once an asset, device or worker moves beyond it.",
        "The first Hybrid IoT decision is not a module selection. It is a map of operating regions, critical messages, reporting urgency and the consequence of a transmission that does not arrive.",
        "Our readiness guide gives product teams a practical way to assemble those inputs before an engineering conversation."
      ],
      bullets: ["Operating regions and movement", "Critical versus delay-tolerant messages", "Power, antenna and enclosure constraints", "Retry, acknowledgement and fallback behaviour"]
    },
    {
      id: "e02", week: 2, segment: "Guide visitors and engaged prospects", subject: "What does one missed transmission cost?", preheader: "Prioritise the messages that change an operating decision.",
      headline: "Not every message is equal.", master: "w02-transmission-cost.png", cta: "Prioritise the message path",
      paragraphs: [
        "Routine telemetry, threshold alerts, location exceptions and safety escalations do not carry the same operational consequence.",
        "A stronger Hybrid IoT brief ranks those messages first. That ranking then informs payload size, reporting cadence, cellular retries, satellite escalation and the service assumptions that need testing.",
        "Use the readiness guide to turn the cost of silence into a design input."
      ],
      bullets: ["Which messages trigger action?", "How long can each message wait?", "What needs acknowledgement?", "What happens if neither path is available?"]
    },
    {
      id: "e03", week: 4, segment: "Asset tracking and logistics", subject: "Your route is the real coverage map", preheader: "Design the exception path before an asset leaves the predictable corridor.",
      headline: "Visibility beyond the predictable route.", master: "w04-asset-tracking.png", cta: "Assess the route",
      paragraphs: [
        "Detours, regional corridors, depots and remote handover points can expose the gap between a product's assumed coverage and the route it actually travels.",
        "The Iridium Certus 9604 makes cellular and satellite subsystems available in one compact module. Your application still decides which events justify another path, how long to retry and what the operations team sees.",
        "Bring a real route and message profile to a scoped design conversation."
      ],
      bullets: ["Route and dwell-point review", "Event and payload priority", "Retry and escalation logic", "Antenna, power and enclosure constraints"]
    },
    {
      id: "e04", week: 5, segment: "Agtech and environmental monitoring", subject: "Remote monitoring starts with message priority", preheader: "Separate the readings that must travel now from those that can wait.",
      headline: "The site is remote. The decision is not.", master: "w05-agtech.png", cta: "Map the field conditions",
      paragraphs: [
        "Distributed monitoring creates a simple but important question: which readings need to reach the operation when terrestrial coverage is intermittent or absent?",
        "Routine telemetry may store, batch or retry. A threshold event may deserve a different path. The right design joins that message logic with the device's power model, antenna conditions and maintenance reality.",
        "Use the guide to frame the field conditions before hardware selection."
      ],
      bullets: ["Site and sky-view conditions", "Threshold versus routine data", "Power and reporting budget", "Local storage and fallback behaviour"]
    },
    {
      id: "e05", week: 7, segment: "Remote equipment operators and OEMs", subject: "Design for the hour no one can drive out", preheader: "Make the critical equipment state visible without transmitting everything.",
      headline: "Design the exception path.", master: "w07-remote-equipment.png", cta: "Review the exception path",
      paragraphs: [
        "Remote monitoring is valuable when it changes a maintenance or operating decision before another site visit is required.",
        "That means identifying the small set of states that deserve immediate attention, deciding what can wait for cellular recovery and keeping safe local control independent of the link.",
        "A Hybrid IoT design review can test whether a satellite exception path fits the device and operating model."
      ],
      bullets: ["Decision-triggering conditions", "Small exception payloads", "Local control and storage", "Operations visibility and response"]
    },
    {
      id: "e06", week: 8, segment: "Field-safety and lone-worker solution teams", subject: "Connectivity is part of the safety plan", preheader: "Review acknowledgement, escalation and the unavailable state.",
      headline: "A communications path is not a safety guarantee.", master: "w08-field-safety.png", cta: "Assess the dependency",
      paragraphs: [
        "A field-safety product needs more than a second network. It needs a governed definition of message priority, acknowledgement, retry, escalation and the visible state when communications are unavailable.",
        "A satellite path may extend the operating design beyond dependable cellular coverage. It should sit inside the complete risk assessment, worker procedure and response workflow.",
        "Bring technical, product and safety owners into the same design conversation."
      ],
      bullets: ["Event classes and urgency", "Acknowledgement and escalation", "User-visible link state", "Procedure when communications are unavailable"]
    },
    {
      id: "e07", week: 10, segment: "All engaged prospects", subject: "The Hybrid IoT readiness checklist", preheader: "Seven inputs to bring into a cellular-plus-satellite design review.",
      headline: "Map the gap before you map the hardware.", master: "w01-coverage-boundary.png", cta: "Download the checklist",
      paragraphs: [
        "A productive Hybrid IoT review begins with operating evidence: where the device travels, which messages matter, how quickly they need to arrive and what the product should do when a preferred path is unavailable.",
        "We have assembled the seven inputs into a concise, printable readiness guide for product teams and integrators.",
        "Use it internally, then bring the completed questions to a scoped architecture conversation."
      ],
      bullets: ["Operating map", "Coverage assumptions", "Message and payload profile", "Power and antenna constraints", "Retry and fallback logic", "Service model", "Evidence and test plan"]
    },
    {
      id: "e08", week: 11, segment: "High-intent product teams and system integrators", subject: "Bring your coverage problem to the Hybrid IoT design clinic", preheader: "Register interest in a focused technical working session.",
      headline: "Bring the problem. Leave with a design path.", master: "w09-engineering-design.png", cta: "Register interest",
      paragraphs: [
        "We are proposing a focused Hybrid IoT design clinic for teams assessing cellular-plus-satellite products.",
        "The session would work through a real operating map, message profile, switching logic, power and antenna constraints, service assumptions and the evidence needed before a prototype.",
        "Register your interest now. We will confirm the date, speaker and capacity separately before any event invitation is issued."
      ],
      bullets: ["For product and engineering teams", "Useful for solution integrators", "Bring a real operating scenario", "Proposed event; date and speaker to be confirmed"]
    }
  ],

  website: [
    { id: "hero", title: "Landing hero", eyebrow: "IRIDIUM CERTUS 9604 · HYBRID IOT", headline: "Cellular where you can. Satellite where you must.", body: "Design connected products around the real operating map—not the ideal one.", cta: "Download the readiness guide", secondary: "Start a design conversation", master: "w01-coverage-boundary.png" },
    { id: "verticals", title: "Vertical proof rail", eyebrow: "WHERE THE COVERAGE GAP BECOMES REAL", headline: "One architecture question. Five operating contexts.", body: "Asset tracking · Agtech · Environmental monitoring · Remote equipment · Field safety", cta: "Choose your operating context", secondary: "", master: "w04-asset-tracking.png" },
    { id: "architecture", title: "Architecture truth panel", eyebrow: "ONE MODULE · BOTH LAYERS · YOUR LOGIC", headline: "The hardware footprint gets smaller. The design responsibility does not.", body: "LTE-M, Iridium SBD and GNSS in one module. Routing, retry and fallback behaviour remain part of the product design.", cta: "Review the design questions", secondary: "View official product evidence", master: "w09-engineering-design.png" },
    { id: "clinic", title: "Design clinic conversion", eyebrow: "PROPOSED TECHNICAL SESSION", headline: "Bring the coverage problem. Leave with a design path.", body: "A focused working session for product teams and integrators. Date, speaker and capacity require confirmation before launch.", cta: "Register interest", secondary: "Download the guide", master: "w09-engineering-design.png" }
  ],

  paidSearch: [
    { group: "Hybrid IoT connectivity", keywords: ["hybrid iot connectivity", "cellular satellite iot", "hybrid satellite cellular module"], headlines: ["Hybrid IoT Design", "Cellular + Satellite IoT", "Assess Your Coverage Gap"], descriptions: ["Map coverage dependencies, message priorities and device constraints before you prototype.", "Explore a cellular-plus-satellite design path with the M2M Connectivity team."] },
    { group: "Iridium 9604", keywords: ["iridium 9604", "iridium certus 9604", "9604 hybrid iot module"], headlines: ["Explore Iridium 9604", "9604 Hybrid IoT Module", "Talk Through Your Design"], descriptions: ["Review LTE-M, Iridium SBD and GNSS integration questions for your connected product.", "Bring your route, payload and device constraints to a scoped technical conversation."] },
    { group: "Remote asset tracking", keywords: ["satellite asset tracking module", "remote asset tracking connectivity", "hybrid iot tracking"], headlines: ["Track Beyond Cellular", "Design The Exception Path", "Hybrid IoT For Assets"], descriptions: ["Plan for routes and exceptions beyond dependable cellular coverage.", "Assess message priority, retry logic, power and antenna constraints with an IoT specialist."] },
    { group: "Remote monitoring", keywords: ["satellite remote monitoring", "remote equipment iot", "satellite environmental monitoring"], headlines: ["Remote IoT Design", "Connect Remote Equipment", "Prioritise Critical Data"], descriptions: ["Separate critical exceptions from routine telemetry and review the right network path.", "Explore Hybrid IoT for remote equipment, agriculture and environmental monitoring."] },
    { group: "Field safety", keywords: ["satellite lone worker device", "hybrid connectivity field safety", "remote worker iot"], headlines: ["Field Safety Connectivity", "Assess The Dependency", "Hybrid IoT Design Review"], descriptions: ["Review communications as one part of your complete field-safety system.", "Define acknowledgement, escalation and the unavailable state with technical owners."] }
  ],

  retargeting: [
    { audience: "Landing-page visitor", line: "Still mapping the coverage gap?", body: "Use the seven-question readiness guide to turn it into a design brief.", cta: "Download the guide" },
    { audience: "Guide downloader", line: "Bring the real operating map.", body: "Talk through message priorities, power, antennas and fallback logic with an IoT specialist.", cta: "Start a design conversation" },
    { audience: "Vertical content engager", line: "Your operating context changes the design.", body: "Review the exception path for assets, agriculture, monitoring or field safety.", cta: "Assess the coverage gap" },
    { audience: "High-intent repeat visitor", line: "Ready to test the architecture?", body: "Bring the route, payload and constraints. We will help shape the next technical step.", cta: "Book a design session" }
  ],

  talkTracks: [
    { vertical: "Asset tracking & logistics", opener: "Where do your routes or assets move beyond the cellular conditions assumed by the product?", questions: ["Which events trigger an operational response?", "How long can routine telemetry wait?", "What payload would justify satellite escalation?"], guard: "Do not promise uninterrupted tracking or coverage.", next: "Review one representative route and message profile." },
    { vertical: "Agtech", opener: "Which field readings need action when terrestrial coverage is unavailable?", questions: ["What can store, batch or retry?", "What is the device power budget?", "What are the antenna and mounting conditions?"], guard: "Do not assume the same design across properties or terrain.", next: "Complete the readiness worksheet for one deployment." },
    { vertical: "Environmental monitoring", opener: "Which remote measurements change a decision, and how quickly?", questions: ["What is the minimum useful exception payload?", "How often can the site be serviced?", "What local storage is required?"], guard: "Do not imply continuous or guaranteed delivery.", next: "Scope the site, payload and reporting logic." },
    { vertical: "Remote equipment", opener: "Which equipment state is worth knowing before the next site visit?", questions: ["What should the equipment do locally?", "What can wait for cellular recovery?", "How will operators distinguish delayed data from an incident?"], guard: "Connectivity must not replace safe local control.", next: "Map one exception workflow end to end." },
    { vertical: "Field safety", opener: "How does your current safety process behave when cellular coverage is unavailable?", questions: ["How are messages acknowledged?", "What is the escalation path?", "How is unavailable communications shown to the worker?"], guard: "Never position a network path as a safety guarantee.", next: "Convene product, engineering and safety owners for a governed review." }
  ],

  sources: [
    { title: "Iridium Certus 9604 product page", url: "https://www.iridium.com/9604", owner: "Iridium", asOf: "Observed 9 September 2026", supports: "LTE-M, Iridium SBD, GNSS, dimensions, subsystem control, payload limits and module architecture", confidence: "High" },
    { title: "Iridium commercial availability announcement", url: "https://investor.iridium.com/2026-06-23-Iridiums-Next-Generation-Hybrid-IoT-Module-and-Development-Kit-are-Now-Commercially-Available", owner: "Iridium", asOf: "23 June 2026", supports: "Commercial availability and Iridium's board-space claim", confidence: "High" },
    { title: "M2M One Hybrid IoT readiness page", url: "https://m2mone.com.au/hybrid-iot-readiness/", owner: "M2M One", asOf: "Observed 9 September 2026", supports: "Current destination, use cases and enquiry route", confidence: "High for current page state" },
    { title: "M2M Hybrid IoT internal campaign hub", url: "https://optiflows.com.au/m2m/campaigns/Hybrid_IoT/", owner: "M2M Group", asOf: "Observed 9 September 2026", supports: "Prior campaign message and operational lineage", confidence: "Medium; lifecycle state conflicts with current work records" },
    { title: "Supplied reference art 01 and 02", url: "assets/reference-art/", owner: "M2M campaign source pack", asOf: "Supplied 9 September 2026", supports: "Mood, terrain, composition and visual direction only", confidence: "High for direction; not final creative" }
  ],

  gates: [
    { owner: "Campaign owner", gate: "Reconcile the operational record", requirement: "Confirm whether this is an extension, relaunch or new 90-day flight; align the campaign hub, Asana state and dates.", status: "Required before activation" },
    { owner: "Marketing + Finance", gate: "Approve budget and channel mix", requirement: "Set the paid-media budget, bidding boundary and stop conditions. Current working record shows no approved budget.", status: "Required before paid activation" },
    { owner: "Marketing Ops", gate: "Prove attribution", requirement: "Verify UTM naming, landing conversion, consent, Zoho source capture and test-lead read-back.", status: "Required before traffic" },
    { owner: "Engineering / Product", gate: "Approve technical claims", requirement: "Check every 9604 claim and preserve the developer-defined routing/fallback caveat.", status: "Required before external release" },
    { owner: "Sales", gate: "Name offer owner and SLA", requirement: "Assign lead owner, qualification rule and response time for guide downloads and design-session requests.", status: "Required before lead capture" },
    { owner: "James", gate: "Approve release set", requirement: "Approve the exact copy, creative, dates, destinations and any proposed design-clinic details.", status: "Human-gated" }
  ]
};

if (typeof window !== "undefined") window.CAMPAIGN = CAMPAIGN;
if (typeof module !== "undefined") module.exports = CAMPAIGN;
