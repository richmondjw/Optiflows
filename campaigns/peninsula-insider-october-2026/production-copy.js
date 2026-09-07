const PI_OCTOBER_PRODUCTION = {
  brand: {
    icon: "assets/pi-site-icon.svg",
    firstWord: "Peninsula",
    accentWord: "Insider"
  },
  issues: [
    {
      id: "W1-EML",
      shortTitle: "01 More hour",
      label: "Chapter 01 · 1 to 4 October",
      title: "One more hour",
      date: "Proposed 1 October 2026",
      hero: "assets/exports/wide/pi-october-w1-one-more-hour-web-email-hero-1600x900.jpg",
      heroAlt: "Illustrative view of Cape Schanck lighthouse in a long coral evening, adapted from a real reference photograph.",
      email: {
        publication: "The Insider Note",
        subject: "One more hour. Three ways to use it.",
        preheader: "Practical after-five plans for the first long October evening.",
        kicker: "October field note · After five",
        heading: "One more hour. Use it well.",
        intro: "The clocks move forward on Sunday 4 October. School returns on Monday. Routine comes back, but the evening shifts later.",
        paragraphs: [
          "This is not another list of sunset lookouts. The October field guide starts with the decision that matters after five: what does the time, weather and energy actually support?",
          "Choose a little movement, a water-edge pause or a table-led finish. Each plan keeps the current access check and a weather alternative close, so the extra light becomes usable rather than theoretical."
        ],
        blocks: [
          { label: "Decision 01", title: "Start with the time you have", body: "Pick the plan that fits the evening. Do not turn one spare hour into a rushed itinerary." },
          { label: "Decision 02", title: "Keep a weather alternative", body: "Wind, rain and access can change the right answer. Check the released guide again before leaving." }
        ],
        button: "Open the October field guide",
        destination: "Released October after-five guide",
        textLinks: ["Check the current access and weather notes"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Released guide and link read-back; current route, access and weather checks; email compliance; human send approval."
      },
      assets: [
        {
          id: "W1-WEB", channel: "Peninsula Insider website", format: "Homepage and guide entry", state: "Copy complete · held",
          fields: [
            { label: "Eyebrow", text: "OCTOBER · THIS WEEK'S DECISION" },
            { label: "Headline", text: "One more hour. Use it well." },
            { label: "Complete body", text: "The clocks move forward on Sunday 4 October and school returns on Monday. Routine comes back, but the evening shifts later.\n\nChoose an after-five plan by the time, weather and energy you actually have: a little movement, a water-edge pause or a table-led finish. Each released plan carries its current access check and a weather alternative.\n\nThis is not another sunset list. It is a cleaner decision for the first longer October evening." },
            { label: "CTA", text: "Open the October field guide" },
            { label: "Alt and attribution", text: "Alt: Illustrative campaign image of Cape Schanck lighthouse in a long coral evening, adapted from a real reference photograph.\nAttribution: Cape Schanck sunset by Ali Khiran, CC BY-SA 4.0. AI-assisted adaptation." }
          ], gate: "Refresh and read back the released guide; verify route, access and weather details; confirm image credit."
        },
        {
          id: "W1-FEED", channel: "Instagram and Facebook", format: "Feed post", state: "Copy complete · held",
          fields: [
            { label: "On-asset copy", text: "ONE MORE HOUR.\nUSE IT WELL.\nOctober · after five" },
            { label: "Complete caption", text: "October gives us one more hour. Use it well.\n\nWe have shaped three after-five Peninsula plans around the things that make an evening work: the time you really have, current access and a weather alternative.\n\nChoose a little movement, a water-edge pause or a table-led finish. No rushed itinerary. No generic sunset list.\n\nSave the field guide for the first long evening and check the live details before leaving.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #PeninsulaInsider #October" },
            { label: "CTA", text: "Open the October field guide" },
            { label: "Alt and disclosure", text: "Illustrative campaign image of Cape Schanck lighthouse in a long coral evening, adapted from a real reference photograph. AI-assisted adaptation from Cape Schanck sunset by Ali Khiran, CC BY-SA 4.0." }
          ], gate: "Released guide, current access and weather notes, social executor and visible attribution."
        },
        {
          id: "W1-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · held",
          fields: [
            { label: "Frame copy", text: "1. ONE MORE HOUR. | The clocks move forward on 4 October.\n2. WHAT DOES AFTER FIVE SUPPORT? | A little movement · a water-edge pause · a table-led finish.\n3. USE IT WELL. | Keep one weather alternative. | Sticker: Open the field guide" },
            { label: "Accessible sequence", text: "Three illustrated Story frames explain the October clock change, offer three shapes for an after-five plan and link to a guide with current checks." },
            { label: "Story caption", text: "First long evening? Choose the shape before the place. Check the released guide and current conditions before leaving." },
            { label: "Alt and disclosure", text: "Cape Schanck lighthouse in an illustrative long coral evening. AI-assisted adaptation from Ali Khiran's CC BY-SA 4.0 reference photograph." }
          ], gate: "Same-day clock detail, current guide, working sticker, attribution and Story executor."
        },
        {
          id: "W1-MOTION", channel: "Instagram Stories", format: "Seven-second motion alternative", state: "Copy complete · media ready",
          fields: [
            { label: "Overlay script", text: "0.0 to 2.0 sec: ONE MORE HOUR.\n2.0 to 4.8 sec: USE IT WELL.\n4.8 to 7.0 sec: OPEN THE OCTOBER FIELD GUIDE →" },
            { label: "Post copy", text: "The first long October evening does not need a long itinerary. Choose the shape, keep a weather alternative, then go." },
            { label: "Accessibility", text: "Silent seven-second motion treatment of an illustrative Cape Schanck evening. All meaning is repeated in the deterministic text overlay and Story caption." },
            { label: "Disclosure", text: "AI-assisted still adaptation with deterministic motion and text treatment. Reference: Cape Schanck sunset by Ali Khiran, CC BY-SA 4.0." }
          ], gate: "Overlay render and timeline QA; current guide; attribution; choose either still or motion for the Story slot."
        },
        {
          id: "W1-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · held",
          fields: [
            { label: "Subject and preheader", text: "Subject: One more hour. Three ways to use it.\nPreheader: Practical after-five plans for the first long October evening." },
            { label: "Complete email", text: "One more hour. Use it well.\n\nThe clocks move forward on Sunday 4 October. School returns on Monday. Routine comes back, but the evening shifts later.\n\nThis is not another list of sunset lookouts. The October field guide starts with the decision that matters after five: what does the time, weather and energy actually support?\n\nChoose a little movement, a water-edge pause or a table-led finish. Each plan keeps the current access check and a weather alternative close, so the extra light becomes usable rather than theoretical." },
            { label: "CTA and footer", text: "Button: Open the October field guide\nText link: Check current access and weather notes\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt and disclosure", text: "Illustrative view of Cape Schanck lighthouse in a long coral evening. AI-assisted adaptation from a CC BY-SA 4.0 reference photograph by Ali Khiran." }
          ], gate: "Email compliance, released guide, route and weather checks, visible credit and human send approval."
        }
      ]
    },
    {
      id: "W2-EML",
      shortTitle: "02 Other coast",
      label: "Chapter 02 · 5 to 11 October",
      title: "Read the other coast",
      date: "Proposed 7 October 2026",
      hero: "assets/exports/wide/pi-october-w2-read-other-coast-web-email-hero-1600x900.jpg",
      heroAlt: "Illustrative view along Flinders Pier in pale spring light, adapted from a real reference photograph.",
      email: {
        publication: "The Insider Note",
        subject: "Read the other coast.",
        preheader: "Your Western Port plan, with current access notes and a picnic fallback.",
        kicker: "October field note · Western Port",
        heading: "Read the other coast",
        intro: "Western Port rewards a slower plan: pages, water and enough room to notice the quieter horizon.",
        paragraphs: [
          "Start with the session or reading stop that has been verified for your date. Add the water-edge pause only after current access is clear, and make the food decision before you leave rather than assuming the venue can solve it.",
          "Our published guide will carry the organiser's latest session information and the land manager's latest access notice side by side. If Coolart access is not confirmed, we will use the Somers and Balnarring fallback and make no Coolart venue claim."
        ],
        blocks: [
          { label: "Pack before leaving", title: "Pages, water, picnic", body: "Choose the session, check the exact venue and access, then decide whether to bring food. The practical detail is part of the day." }
        ],
        button: "Plan a Western Port day",
        destination: "Released Western Port decision guide",
        textLinks: ["Read the current access note"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Current organiser or Parks Victoria confirmation; activate the fallback if unresolved; email compliance; human send approval.",
        note: "This is the fallback-safe master. A venue-specific festival variant may replace one paragraph only after the Coolart contradiction is closed."
      },
      assets: [
        {
          id: "W2-WEB", channel: "Peninsula Insider website", format: "Decision guide entry", state: "Copy complete · access held",
          fields: [
            { label: "Eyebrow", text: "WESTERN PORT · CURRENT ACCESS NOTE" },
            { label: "Headline", text: "Read the other coast." },
            { label: "Complete body", text: "Western Port rewards a slower plan: pages, water and enough room to notice the quieter horizon.\n\nStart with the session or reading stop verified for your date. Add the water-edge pause only after current access is clear, and make the food decision before leaving.\n\nThe released guide will place the organiser's latest session information beside the land manager's latest access notice. If Coolart access is not confirmed, the guide will use the Somers and Balnarring fallback and make no Coolart venue claim." },
            { label: "CTA", text: "Plan a Western Port day" },
            { label: "Alt and attribution", text: "Alt: Illustrative view along Flinders Pier in pale spring light, adapted from a real reference photograph.\nAttribution: Flinders Pier by Daniel Kabel, CC BY-SA 4.0. AI-assisted adaptation." }
          ], gate: "Resolve organiser and Parks Victoria access contradiction or activate the fallback; read back all venue details."
        },
        {
          id: "W2-FEED", channel: "Instagram and Facebook", format: "Feed post", state: "Copy complete · access held",
          fields: [
            { label: "On-asset copy", text: "READ THE OTHER COAST.\nPages · water · picnic\nWestern Port" },
            { label: "Complete caption", text: "Western Port rewards a slower read.\n\nWe are building one useful day around pages, water and a quieter horizon. The plan starts with the session or reading stop you can verify, adds the water-edge pause only when access is clear, and brings the picnic decision forward.\n\nThe released guide will show current organiser and land-manager information together. If Coolart access is not confirmed, we will use the Somers and Balnarring fallback and make no Coolart venue claim.\n\nSave this for 9 to 11 October, then check the live guide before leaving.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #WesternPort #PeninsulaInsider" },
            { label: "CTA", text: "Plan a Western Port day" },
            { label: "Alt and disclosure", text: "Illustrative view along Flinders Pier in pale spring light. AI-assisted adaptation from Daniel Kabel's CC BY-SA 4.0 reference photograph." }
          ], gate: "Access contradiction resolved or fallback activated; released guide; social executor; visible attribution."
        },
        {
          id: "W2-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · access held",
          fields: [
            { label: "Frame copy", text: "1. READ THE OTHER COAST. | Western Port · 9 to 11 October.\n2. PAGES · WATER · PICNIC | Choose the verified session. Check access. Pack before leaving.\n3. CURRENT DETAILS FIRST. | If the venue changes, the plan changes. | Sticker: Open the Western Port guide" },
            { label: "Accessible sequence", text: "Three illustrative Story frames introduce a Western Port reading day, prompt readers to verify the session and access, and link to the current guide." },
            { label: "Story caption", text: "Western Port, read slowly. Use the released guide for the current venue, access and picnic plan." },
            { label: "Alt and disclosure", text: "Illustrative Flinders Pier in pale spring light. AI-assisted adaptation from a CC BY-SA 4.0 reference photograph by Daniel Kabel." }
          ], gate: "Current venue and access notice, working sticker, fallback decision, attribution and Story executor."
        },
        {
          id: "W2-MOTION", channel: "Instagram Stories", format: "Seven-second motion alternative", state: "Copy complete · media ready",
          fields: [
            { label: "Overlay script", text: "0.0 to 2.0 sec: READ THE OTHER COAST.\n2.0 to 4.8 sec: PAGES · WATER · PICNIC\n4.8 to 7.0 sec: CHECK THE CURRENT GUIDE →" },
            { label: "Post copy", text: "A quieter Western Port day begins with current access, the session you can verify and the food decision made before leaving." },
            { label: "Accessibility", text: "Silent seven-second forward glide along an illustrative pier. All meaning is repeated in the deterministic overlay and Story caption." },
            { label: "Disclosure", text: "AI-assisted still and motion treatment. Reference: Flinders Pier by Daniel Kabel, CC BY-SA 4.0." }
          ], gate: "Overlay render and timeline QA; access gate or fallback; attribution; choose still or motion for the Story slot."
        },
        {
          id: "W2-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · access held",
          fields: [
            { label: "Subject and preheader", text: "Subject: Read the other coast.\nPreheader: Your Western Port plan, with current access notes and a picnic fallback." },
            { label: "Complete email", text: "Read the other coast\n\nWestern Port rewards a slower plan: pages, water and enough room to notice the quieter horizon.\n\nStart with the session or reading stop that has been verified for your date. Add the water-edge pause only after current access is clear, and make the food decision before you leave rather than assuming the venue can solve it.\n\nOur published guide will carry the organiser's latest session information and the land manager's latest access notice side by side. If Coolart access is not confirmed, we will use the Somers and Balnarring fallback and make no Coolart venue claim." },
            { label: "CTA and footer", text: "Button: Plan a Western Port day\nText link: Read the current access note\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt and disclosure", text: "Illustrative view along Flinders Pier in pale spring light. AI-assisted adaptation from a CC BY-SA 4.0 reference photograph by Daniel Kabel." }
          ], gate: "Access contradiction closed or fallback used, email compliance, released guide and human send approval."
        }
      ]
    },
    {
      id: "W3-EML",
      shortTitle: "03 Weekend",
      label: "Chapter 03 · 12 to 18 October",
      title: "Keep the weekend",
      date: "Proposed 14 October 2026",
      hero: "assets/exports/wide/pi-october-w3-keep-the-weekend-web-email-hero-1600x900.jpg",
      heroAlt: "Illustrative footprints and scattered petals on a Peninsula beach, adapted from a real St Andrews Beach photograph.",
      email: {
        publication: "The Insider Note",
        subject: "Keep the Mornington weekend.",
        preheader: "A community walk on Saturday, a garden plan on Sunday.",
        kicker: "October field note · Mornington",
        heading: "Walk Saturday. Garden Sunday.",
        intro: "The Main Street Mornington Festival is not running in 2026. That does not leave the weekend empty.",
        paragraphs: [
          "On Saturday 17 October, Breast Foot Forward lists 5 km and 10 km starts, finishing at Rosebud Village Green. On Sunday 18 October, Mornington Botanical Rose Gardens lists its monthly High Tea.",
          "These are separate events with separate bookings, access and reasons to go. Neither is presented as a replacement for the cancelled festival. Choose one, combine them only if the timing works, and check both organisers before committing."
        ],
        blocks: [
          { label: "Saturday", title: "Walk with purpose", body: "Choose the 5 km or 10 km event only after registration, start and access details are current." },
          { label: "Sunday", title: "Take the garden slowly", body: "Confirm the High Tea booking, session information and current garden access before leaving." }
        ],
        button: "Build your weekend",
        destination: "Released Mornington weekend guide",
        textLinks: ["Check Saturday's registration", "Check Sunday's booking"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Final event, booking and access checks; released guide; email compliance; human send approval."
      },
      assets: [
        {
          id: "W3-WEB", channel: "Peninsula Insider website", format: "Weekend guide entry", state: "Copy complete · booking held",
          fields: [
            { label: "Eyebrow", text: "MORNINGTON · 17 AND 18 OCTOBER" },
            { label: "Headline", text: "Walk Saturday. Garden Sunday." },
            { label: "Complete body", text: "The Main Street Mornington Festival is not running in 2026. That does not leave the weekend empty.\n\nOn Saturday 17 October, Breast Foot Forward lists 5 km and 10 km starts, finishing at Rosebud Village Green. On Sunday 18 October, Mornington Botanical Rose Gardens lists its monthly High Tea.\n\nThese are separate events with separate bookings, access and reasons to go. Neither is a replacement for the cancelled festival. Choose one, combine them only if the timing works, and check both organisers before committing." },
            { label: "CTA", text: "Build your weekend" },
            { label: "Alt and attribution", text: "Alt: Illustrative footprints and scattered petals on a Peninsula beach, adapted from a real St Andrews Beach photograph.\nAttribution: St Andrews Beach footprints by Alex Wigan, CC0. AI-assisted adaptation." }
          ], gate: "Confirm both events, booking pathways, access and exact timings; keep cancellation context explicit."
        },
        {
          id: "W3-FEED", channel: "Instagram and Facebook", format: "Feed post", state: "Copy complete · booking held",
          fields: [
            { label: "On-asset copy", text: "KEEP THE WEEKEND.\nWalk Saturday.\nGarden Sunday." },
            { label: "Complete caption", text: "The Main Street Mornington Festival is not running in 2026. That does not leave the weekend empty.\n\nSaturday 17 October: Breast Foot Forward lists 5 km and 10 km starts, finishing at Rosebud Village Green.\n\nSunday 18 October: Mornington Botanical Rose Gardens lists its monthly High Tea.\n\nThese are separate events with separate bookings and access arrangements. Neither is a replacement for the cancelled festival. Choose one, or combine them only if the verified timing works.\n\nSave the guide and check both organisers before committing.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #Mornington #PeninsulaInsider" },
            { label: "CTA", text: "Build your weekend" },
            { label: "Alt and disclosure", text: "Illustrative footprints and scattered petals on a Peninsula beach. AI-assisted adaptation from Alex Wigan's CC0 St Andrews Beach photograph." }
          ], gate: "Final booking and access checks, released guide, social executor and clear cancellation context."
        },
        {
          id: "W3-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · booking held",
          fields: [
            { label: "Frame copy", text: "1. KEEP THE WEEKEND. | Mornington · 17 and 18 October.\n2. SATURDAY: WALK. | SUNDAY: GARDEN. | Separate events. Separate bookings.\n3. CHOOSE ONE, OR CHECK THE TIMING. | Sticker: Build your weekend" },
            { label: "Accessible sequence", text: "Three illustrative Story frames acknowledge the cancelled festival, present a Saturday community walk and Sunday garden plan as separate events, and link to current booking information." },
            { label: "Story caption", text: "Festival cancelled. Weekend still useful. Check the two separate events and their live booking details." },
            { label: "Alt and disclosure", text: "Illustrative footprints and petals on a Peninsula beach. AI-assisted adaptation from a CC0 St Andrews Beach photograph by Alex Wigan." }
          ], gate: "Current booking and access states, working sticker, released guide and Story executor."
        },
        {
          id: "W3-MOTION", channel: "Instagram Stories", format: "Seven-second motion alternative", state: "Copy complete · media ready",
          fields: [
            { label: "Overlay script", text: "0.0 to 2.0 sec: KEEP THE WEEKEND.\n2.0 to 4.8 sec: WALK SATURDAY · GARDEN SUNDAY\n4.8 to 7.0 sec: CHECK BOTH EVENTS →" },
            { label: "Post copy", text: "Two separate Mornington plans. Choose one, or combine them only after the booking and timing checks pass." },
            { label: "Accessibility", text: "Silent seven-second treatment of an illustrative shoreline path and petals. All meaning is repeated in deterministic overlay text and the caption." },
            { label: "Disclosure", text: "AI-assisted still and motion treatment. Reference: St Andrews Beach footprints by Alex Wigan, CC0." }
          ], gate: "Overlay and timeline QA; current event checks; choose still or motion for the Story slot."
        },
        {
          id: "W3-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · booking held",
          fields: [
            { label: "Subject and preheader", text: "Subject: Keep the Mornington weekend.\nPreheader: A community walk on Saturday, a garden plan on Sunday." },
            { label: "Complete email", text: "Walk Saturday. Garden Sunday.\n\nThe Main Street Mornington Festival is not running in 2026. That does not leave the weekend empty.\n\nOn Saturday 17 October, Breast Foot Forward lists 5 km and 10 km starts, finishing at Rosebud Village Green. On Sunday 18 October, Mornington Botanical Rose Gardens lists its monthly High Tea.\n\nThese are separate events with separate bookings, access and reasons to go. Neither is presented as a replacement for the cancelled festival. Choose one, combine them only if the timing works, and check both organisers before committing." },
            { label: "CTA and footer", text: "Button: Build your weekend\nText links: Check Saturday's registration | Check Sunday's booking\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt and disclosure", text: "Illustrative footprints and scattered petals on a Peninsula beach. AI-assisted adaptation from Alex Wigan's CC0 St Andrews Beach photograph." }
          ], gate: "Email compliance, final booking and access checks, released guide and human send approval."
        }
      ]
    },
    {
      id: "W4-EML",
      shortTitle: "04 Long finish",
      label: "Chapter 04 · 19 to 25 October",
      title: "The long finish",
      date: "Proposed 20 October 2026",
      hero: "assets/exports/wide/pi-october-w4-long-finish-web-email-hero-1600x900.jpg",
      heroAlt: "Illustrative Point Nepean coast in long late light, adapted from a real reference photograph.",
      email: {
        publication: "The Insider Note",
        subject: "Thirty-five kilometres of coast.",
        preheader: "The route, the support plan and what to know before 25 October.",
        kicker: "October field note · 25 October",
        heading: "The long finish",
        intro: "The Bloody Long Walk is scheduled for Sunday 25 October: 35 supported kilometres from Quarantine Station to Martha Cove Marina.",
        paragraphs: [
          "If you are walking, start with the organiser's current registration, transport, start and gear instructions. If you are supporting, use the released guide to choose a legal, practical meeting point rather than improvising along the route.",
          "If you are simply following the day, read the coast as a sequence: Sorrento, Rye, Rosebud, Dromana and Safety Beach. Choose one part of the coast rather than trying to chase the entire route. The distance is the story."
        ],
        blocks: [
          { label: "Walker", title: "Begin with the organiser", body: "Registration, transport, start information and safety instructions remain authoritative." },
          { label: "Supporter", title: "Choose one verified meeting point", body: "Do not turn support into an unplanned chase along the coast. Use the released route guide." }
        ],
        button: "Read the route guide",
        destination: "Released 25 October route and support guide",
        textLinks: ["Check the official event status"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Current registration and operations; released route guide; H&H inventory decision; email compliance; human send approval."
      },
      assets: [
        {
          id: "W4-WEB", channel: "Peninsula Insider website", format: "Route guide entry", state: "Copy complete · operations held",
          fields: [
            { label: "Eyebrow", text: "ROUTE GUIDE · 25 OCTOBER" },
            { label: "Headline", text: "Thirty-five kilometres of coast." },
            { label: "Complete body", text: "The Bloody Long Walk is scheduled for Sunday 25 October: a 35 km supported route from Quarantine Station through Sorrento, Rye, Rosebud, Dromana and Safety Beach to Martha Cove Marina.\n\nWalkers should begin with the organiser's current registration, transport, start and safety instructions. Supporters should choose one legal, practical meeting point from the released guide. Readers following the day can use the route to understand the coast as a sequence.\n\nThe walk and its operating information carry this guide. Any additional ticketed programme remains a separate current listing." },
            { label: "CTA", text: "Read the route guide" },
            { label: "Alt and attribution", text: "Alt: Illustrative Point Nepean coast in long late light, adapted from a real reference photograph.\nAttribution: Point Nepean coast by Philip Mallis, CC BY-SA 4.0. AI-assisted adaptation." }
          ], gate: "Confirm event operations, registration, transport and support information; decide H&H treatment; read back route."
        },
        {
          id: "W4-FEED", channel: "Instagram and Facebook", format: "Feed post", state: "Copy complete · operations held",
          fields: [
            { label: "On-asset copy", text: "THIRTY-FIVE KILOMETRES.\nONE LONG COAST.\n25 October" },
            { label: "Complete caption", text: "Thirty-five kilometres of coast.\n\nThe Bloody Long Walk is scheduled for Sunday 25 October, following a supported route from Quarantine Station through Sorrento, Rye, Rosebud, Dromana and Safety Beach to Martha Cove Marina.\n\nWalking? Start with the organiser's current registration, transport and safety information. Supporting? Choose one verified meeting point from the released guide. Following? Read the coast as a sequence and choose one section rather than chasing the entire route.\n\nSave the route guide and check the official event status before the day.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #BloodyLongWalk #PeninsulaInsider" },
            { label: "CTA", text: "Read the route guide" },
            { label: "Alt and disclosure", text: "Illustrative Point Nepean coast in long late light. AI-assisted adaptation from Philip Mallis's CC BY-SA 4.0 reference photograph." }
          ], gate: "Current event and route operations, released guide, H&H decision, social executor and attribution."
        },
        {
          id: "W4-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · operations held",
          fields: [
            { label: "Frame copy", text: "1. 35 KM OF COAST. | Sunday 25 October.\n2. WALKING · SUPPORTING · FOLLOWING? | Start with the right plan.\n3. ONE VERIFIED ROUTE GUIDE. | Check official operations before the day. | Sticker: Read the guide" },
            { label: "Accessible sequence", text: "Three illustrative Story frames introduce the 35 kilometre event, separate walker, supporter and follower needs, and link to current operational information." },
            { label: "Story caption", text: "A long day needs the right plan. Use the released guide, then check the organiser's current instructions." },
            { label: "Alt and disclosure", text: "Illustrative Point Nepean coast in late light. AI-assisted adaptation from Philip Mallis's CC BY-SA 4.0 reference photograph." }
          ], gate: "Current event operations, working sticker, released route guide, attribution and Story executor."
        },
        {
          id: "W4-MOTION", channel: "Instagram Stories", format: "Six-second motion alternative", state: "Copy complete · 1080p blocked",
          fields: [
            { label: "Overlay script", text: "0.0 to 1.8 sec: 35 KM OF COAST.\n1.8 to 4.0 sec: WALKING · SUPPORTING · FOLLOWING?\n4.0 to 6.0 sec: READ THE ROUTE GUIDE →" },
            { label: "Post copy", text: "One long coast. Three different planning needs. Check the released guide and official operations before 25 October." },
            { label: "Accessibility", text: "Silent six-second coastal push. All meaning is repeated in the deterministic overlay and caption." },
            { label: "Disclosure", text: "AI-assisted still and motion treatment. Reference: Point Nepean coast by Philip Mallis, CC BY-SA 4.0." }
          ], gate: "Hard block until 1080p rerender, overlay and timeline QA, current event operations and Story slot decision."
        },
        {
          id: "W4-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · operations held",
          fields: [
            { label: "Subject and preheader", text: "Subject: Thirty-five kilometres of coast.\nPreheader: The route, the support plan and what to know before 25 October." },
            { label: "Complete email", text: "The long finish\n\nThe Bloody Long Walk is scheduled for Sunday 25 October: 35 supported kilometres from Quarantine Station to Martha Cove Marina.\n\nIf you are walking, start with the organiser's current registration, transport, start and gear instructions. If you are supporting, use the released guide to choose a legal, practical meeting point rather than improvising along the route.\n\nIf you are simply following the day, read the coast as a sequence: Sorrento, Rye, Rosebud, Dromana and Safety Beach. Choose one part of the coast rather than trying to chase the entire route. The distance is the story." },
            { label: "CTA and footer", text: "Button: Read the route guide\nText link: Check the official event status\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt and disclosure", text: "Illustrative Point Nepean coast in long late light. AI-assisted adaptation from Philip Mallis's CC BY-SA 4.0 reference photograph." }
          ], gate: "Email compliance, current registration and operations, released guide, H&H decision and human send approval."
        }
      ]
    }
  ]
};
