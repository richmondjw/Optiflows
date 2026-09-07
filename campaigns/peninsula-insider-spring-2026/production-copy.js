const PI_SPRING_PRODUCTION = {
  brand: {
    icon: "assets/pi-site-icon.svg",
    firstWord: "Peninsula",
    accentWord: "Insider"
  },
  issues: [
    {
      id: "S1-EML",
      shortTitle: "01 Paper",
      label: "Week 01 · Culture / Mornington",
      title: "Paper before lunch",
      date: "Proposed 13 September 2026",
      hero: "assets/exports/s1-email.webp",
      heroAlt: "Original paper-collage specimen cabinet in harbour blue and warm white for the works-on-paper planning guide.",
      email: {
        publication: "The Insider Note",
        subject: "One show before lunch",
        preheader: "Make National Works on Paper the fixed point, then leave the rest of Mornington loose.",
        kicker: "The Sunday Note · Mornington",
        heading: "Paper before lunch",
        intro: "National Works on Paper 2026 is now at Mornington Peninsula Regional Gallery. Give it the clean part of the day.",
        paragraphs: [
          "MPRG lists the exhibition from 5 September to 22 November and regular gallery hours of 11 am to 4 pm, Tuesday to Sunday.",
          "I would make it the first fixed point of a Mornington half-day. Start with the exhibition; decide lunch and any second stop when you step outside. That protects the reason for going without turning the day into a checklist.",
          "We have not reviewed individual works, so the guide stays practical. It explains what is confirmed, what to check with MPRG and why one good show can be enough."
        ],
        button: "Plan the half-day",
        destination: "S1-WEB proposed route",
        textLinks: ["Check current MPRG details on the official exhibition page"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Sender, consent, suppression, footer and preference links; released anchor; fresh MPRG check; human send approval."
      },
      assets: [
        {
          id: "S1-WEB",
          channel: "Peninsula Insider website",
          format: "Anchor article",
          state: "Copy complete · held",
          fields: [
            { label: "Search package", text: "Proposed path: /journal/national-works-on-paper-mornington/\nSearch title: National Works on Paper 2026: plan a Mornington half-day | Peninsula Insider\nMeta description: Make National Works on Paper 2026 the fixed point of a Mornington half-day, with current MPRG dates, regular hours and the details to check before leaving." },
            { label: "Headline and standfirst", text: "Paper before lunch\nNational Works on Paper 2026 is now at MPRG. Give the exhibition the first fixed place in your Mornington plan, then decide what comes next when you step outside." },
            { label: "Complete body", text: "National Works on Paper returns to Mornington Peninsula Regional Gallery from 5 September to 22 November 2026. MPRG says 68 works were selected from more than 900 entries for this year's exhibition. That scale is the reason to make the gallery the decision, not one item in a crowded wet-weather list.\n\nPI has not independently reviewed the exhibition, so this guide does not nominate a favourite work. If a serious gallery visit belongs in your Peninsula day, put it first and leave the rest responsive. MPRG currently lists regular hours as 11 am to 4 pm, Tuesday to Sunday. Starting near opening keeps lunch as a decision made after the exhibition.\n\nChoose only one second commitment. If the weather is holding, make it a walk. If it turns, keep the day indoors. If the exhibition gives you enough, stop there and have lunch. Before leaving, confirm the exhibition, hours, admission and access directly with MPRG." },
            { label: "CTA", text: "Primary: Check current MPRG details\nSecondary: See gallery visit information" },
            { label: "Accessibility", text: "Hero alt: An original paper-collage specimen cabinet in harbour blue and warm white, created for Peninsula Insider's works-on-paper planning guide." }
          ],
          gate: "Independent editorial review; live MPRG admission and access check; canonical route; links; byline; rights and accessibility receipt."
        },
        {
          id: "S1-DSP",
          channel: "Peninsula Insider website",
          format: "Dispatch module",
          state: "Copy complete · held",
          fields: [
            { label: "Headline", text: "This weekend, make one show the plan" },
            { label: "Standfirst", text: "National Works on Paper is open at MPRG. Start there, then leave lunch and the weather to decide the rest." },
            { label: "Complete body", text: "National Works on Paper 2026 has opened at Mornington Peninsula Regional Gallery, where MPRG lists the exhibition through 22 November.\n\nOur plan is intentionally short: make the exhibition the first commitment. The gallery currently lists regular hours of 11 am to 4 pm, Tuesday to Sunday. Check the current visit details before leaving, then choose lunch or one second stop after the show.\n\nWe have not reviewed the exhibition and are not presenting this as a list of must-see works. It is a cleaner weekend decision: one substantial cultural anchor, with room to respond to the day." },
            { label: "CTA and source", text: "Plan the half-day\nSource link: Check MPRG directly" },
            { label: "Alt text", text: "Paper, ink and botanical fragments arranged as a quiet editorial cabinet." }
          ],
          gate: "Current MPRG check and released, read-back S1-WEB route."
        },
        {
          id: "S1-EML",
          channel: "The Insider Note",
          format: "Email",
          state: "Copy and design complete · held",
          fields: [
            { label: "Subject and preheader", text: "Subject: One show before lunch\nPreheader: Make National Works on Paper the fixed point, then leave the rest of Mornington loose." },
            { label: "Complete email", text: "Paper before lunch\n\nNational Works on Paper 2026 is now at Mornington Peninsula Regional Gallery. MPRG lists the exhibition from 5 September to 22 November and regular gallery hours of 11 am to 4 pm, Tuesday to Sunday.\n\nI would make it the first fixed point of a Mornington half-day. Start with the exhibition; decide lunch and any second stop when you step outside. That protects the reason for going without turning the day into a checklist.\n\nWe have not reviewed individual works, so the guide stays practical. It explains what is confirmed, what to check with MPRG and why one good show can be enough." },
            { label: "CTA and footer", text: "Button: Plan the half-day\nText link: Check current MPRG details\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt", text: "Original paper-collage specimen cabinet in harbour blue and warm white for the works-on-paper planning guide." }
          ],
          gate: "Email compliance controls, released anchor, current source read-back and human send approval."
        },
        {
          id: "S1-FEED",
          channel: "Instagram Feed",
          format: "Five-slide carousel",
          state: "Copy complete · held",
          fields: [
            { label: "On-asset copy", text: "1. Paper before lunch | National Works on Paper 2026 · Mornington | Make one serious show the plan.\n2. The fixed point | MPRG · 5 Sep to 22 Nov 2026 | 68 selected works, according to the gallery.\n3. Give it the first slot | Regular hours listed: 11 am to 4 pm · Tue to Sun | Check current details before leaving.\n4. Leave one decision open | Lunch? A walk? Home? | Decide after the exhibition, not before it.\n5. Keep the plan clean | Read the guide. Check MPRG. | Original illustration, not an exhibited work." },
            { label: "Complete caption", text: "One serious show can carry a Mornington half-day.\n\nNational Works on Paper 2026 is at MPRG from 5 September to 22 November. The gallery says this year's exhibition contains 68 works selected from more than 900 entries.\n\nOur plan: give the exhibition the first fixed slot, then let lunch, weather and energy decide whether the day needs anything else. MPRG currently lists regular hours as 11 am to 4 pm, Tuesday to Sunday.\n\nWe have not independently reviewed the exhibition. Check current opening, admission and access details with MPRG before leaving.\n\nSave the decision. Read the guide through the profile link.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #Mornington #NationalWorksOnPaper" },
            { label: "Per-slide alt", text: "1. Title card for Paper before lunch, a Peninsula Insider Mornington gallery plan.\n2. National Works on Paper dates and the gallery's selected-work count.\n3. MPRG's listed regular hours with a prompt to recheck.\n4. A planning card suggesting lunch or one second stop remain open.\n5. Closing card asking readers to check MPRG and identifying the artwork as an original illustration." }
          ],
          gate: "Caption, alt text, live source check, released guide and social executor."
        },
        {
          id: "S1-STORY",
          channel: "Instagram Stories",
          format: "Three-frame sequence",
          state: "Copy complete · held",
          fields: [
            { label: "Frame copy", text: "1. MORNINGTON HALF-DAY? | Make one show the fixed point.\n2. NATIONAL WORKS ON PAPER 2026 | MPRG · 5 Sep to 22 Nov | Regular hours listed: Tue to Sun · 11 am to 4 pm.\n3. START WITH THE EXHIBITION | Leave the second decision open. | Sticker: Plan the half-day" },
            { label: "Accessible sequence", text: "Three illustrated Story cards propose National Works on Paper at MPRG as the fixed point of a Mornington half-day, give the official exhibition dates and listed regular hours, and direct readers to the planning guide and MPRG checks." },
            { label: "Destination", text: "S1-WEB released route" }
          ],
          gate: "Current MPRG details, released route, working sticker and social executor."
        }
      ]
    },
    {
      id: "S2-EML",
      shortTitle: "02 Walk",
      label: "Week 02 · Walk / Greens Bush",
      title: "One walk, two lengths",
      date: "Proposed 20 September 2026",
      hero: "assets/exports/s2-email.webp",
      heroAlt: "Two botanical paper specimens illustrating a choice between shorter and longer walks without depicting a real route.",
      email: {
        publication: "The Insider Note",
        subject: "Short walk or long walk?",
        preheader: "Two Baldrys circuits, one starting point and a clearer September plan.",
        kicker: "The Sunday Note · Greens Bush",
        heading: "Choose the length first",
        intro: "Parks Victoria lists two Baldrys circuits from Baldry Crossing: a 1.6 km short circuit and a 3.6 km long circuit.",
        paragraphs: [
          "I would choose the short circuit when walking shares the day with another commitment. Give the long circuit the main part of the outing if its extra distance, creek crossings and fern gullies are what you want to walk for. That recommendation needs independent local adoption; it is not a report of a recent visit.",
          "The guide puts the routes side by side and keeps Parks Victoria's current conditions within reach. Before setting out, check the official page. It currently carries a fox-control notice through October 2026 and warns that short secondary-track sections may close."
        ],
        button: "Compare the two circuits",
        destination: "S2-WEB proposed route",
        textLinks: ["Check current Parks Victoria conditions"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Email controls; released anchor; route identity; current conditions; local editorial adoption; human send approval."
      },
      assets: [
        {
          id: "S2-WEB", channel: "Peninsula Insider website", format: "Anchor article", state: "Copy complete · held",
          fields: [
            { label: "Search package", text: "Proposed path: /journal/baldrys-circuits-greens-bush/\nSearch title: Baldrys circuits: choose a Greens Bush walk | Peninsula Insider\nMeta description: Compare the 1.6 km and 3.6 km Baldrys circuits from Baldry Crossing, then check Parks Victoria's current conditions before setting out." },
            { label: "Headline and standfirst", text: "One walk, two lengths\nParks Victoria lists two Baldrys circuits from the same starting point. Let the distance decide what the walk needs to be in your day." },
            { label: "Complete body", text: "Choose the Baldrys Short Circuit when walking has to share the plan. Parks Victoria lists it at 1.6 km from Baldry Crossing and describes eucalypt forest. The useful promise is the shorter published distance, not a promise about speed, easy access or how a group will find the ground.\n\nChoose the 3.6 km Long Circuit when the walk is the main outing. Parks Victoria says it goes further into the forest and includes several creek crossings and fern gullies. That makes it a different decision, not automatically the better walk.\n\nParks Victoria directs both circuits to Baldry Crossing. Its page flags slippery and uneven ground, changed conditions, no dogs and a current fox-control notice. Check the official page when planning and again before leaving. Follow signs on site." },
            { label: "CTA", text: "Primary: Check Parks Victoria conditions\nSecondary: Compare the two circuits" },
            { label: "Accessibility", text: "Hero alt: Two original botanical paper specimens, one compact and one deeper and denser, illustrating a choice between two walk lengths without depicting a route." }
          ], gate: "Route and entity reconciliation; independent local judgement; current conditions; canonical route; byline; rights and accessibility."
        },
        {
          id: "S2-DSP", channel: "Peninsula Insider website", format: "Dispatch module", state: "Copy complete · held",
          fields: [
            { label: "Headline", text: "Next weekend: choose your Greens Bush circuit" },
            { label: "Complete body", text: "Choose the length before filling the rest of 26 to 27 September. Parks Victoria lists the Baldrys Short Circuit at 1.6 km and the Long Circuit at 3.6 km, both from Baldry Crossing.\n\nOur proposed split is simple: short when walking shares the day, long when the walk is the main outing. The official description gives the longer route creek crossings and fern gullies, but current conditions still need a fresh check.\n\nParks Victoria's page currently carries a fox-control notice through October 2026 and says short secondary-track sections may close. That is a reason to check the source close to your visit, not a claim that the circuits are closed." },
            { label: "CTA and source", text: "Compare the circuits\nSource: Check Parks Victoria conditions" },
            { label: "Alt text", text: "Two paper botanical specimens compare a compact walk with a longer, denser route choice." }
          ], gate: "Current Parks Victoria conditions and released, read-back S2-WEB route."
        },
        {
          id: "S2-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · held",
          fields: [
            { label: "Subject and preheader", text: "Subject: Short walk or long walk?\nPreheader: Two Baldrys circuits, one starting point and a clearer September plan." },
            { label: "Complete email", text: "Choose the length first\n\nParks Victoria lists two Baldrys circuits from Baldry Crossing: a 1.6 km short circuit and a 3.6 km long circuit.\n\nI would choose the short circuit when walking shares the day with another commitment. Give the long circuit the main part of the outing if its extra distance, creek crossings and fern gullies are what you want to walk for. That recommendation needs independent local adoption; it is not a report of a recent visit.\n\nThe guide puts the routes side by side and keeps Parks Victoria's current conditions within reach. Check the official page before setting out." },
            { label: "CTA and footer", text: "Button: Compare the two circuits\nText link: Check current Parks Victoria conditions\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt", text: "Two botanical paper specimens illustrating a choice between shorter and longer walks without depicting a real route." }
          ], gate: "Email controls, released anchor, current conditions, editorial adoption and human send approval."
        },
        {
          id: "S2-FEED", channel: "Instagram Feed", format: "Five-slide carousel", state: "Copy complete · held",
          fields: [
            { label: "On-asset copy", text: "1. One walk, two lengths | Baldrys circuits · Greens Bush.\n2. Keep room in the day | Short · 1.6 km | Eucalypt forest, according to Parks Victoria.\n3. Make walking the plan | Long · 3.6 km | Creek crossings and fern gullies, according to Parks Victoria.\n4. One official start | Baldry Crossing | Check changed conditions. Follow signs on site.\n5. Choose the length first | Save the comparison | Read the guide, then check Parks Victoria." },
            { label: "Complete caption", text: "One starting point. Two ways to shape the day.\n\nParks Victoria lists the Baldrys Short Circuit at 1.6 km and the Long Circuit at 3.6 km, both from Baldry Crossing. The longer route is described with creek crossings and fern gullies.\n\nOur proposed choice: short when the walk shares the day; long when walking is the plan. Independent local review remains pending.\n\nCheck Parks Victoria's latest conditions before setting out. Dogs are not allowed, and the current page carries a fox-control notice through October 2026 with possible short closures on secondary tracks.\n\nSave the comparison. Read the full guide through the profile link.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #GreensBush" },
            { label: "Per-slide alt", text: "1. Title card comparing two Baldrys circuit lengths.\n2. The 1.6 km short circuit is described as the option that leaves room in the day.\n3. The 3.6 km long circuit is described with creek crossings and fern gullies.\n4. Both official routes start at Baldry Crossing, with a prompt to check conditions.\n5. Closing card asks readers to save the comparison and check Parks Victoria." }
          ], gate: "Caption, per-slide alt, current conditions, released guide and social executor."
        },
        {
          id: "S2-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · held",
          fields: [
            { label: "Frame copy", text: "1. A GREENS BUSH WALK? | Choose the length before you set out.\n2. SHORT · 1.6 KM | LONG · 3.6 KM | Both start at Baldry Crossing.\n3. READ THE COMPARISON | Then check current Parks Victoria conditions. | Sticker: Compare the circuits" },
            { label: "Accessible sequence", text: "Three illustrated Story cards ask readers to choose between the 1.6 kilometre and 3.6 kilometre Baldrys circuits, identify Baldry Crossing as the official start and direct readers to current Parks Victoria conditions." },
            { label: "Destination", text: "S2-WEB released route" }
          ], gate: "Route identity, live conditions, working sticker and social executor."
        },
        {
          id: "S2-MOTION", channel: "Instagram Stories", format: "Eight-second motion alternative", state: "Copy complete · review media",
          fields: [
            { label: "Overlay script", text: "0.0 to 2.2 sec: ONE WALK. TWO LENGTHS.\n2.2 to 5.4 sec: SHORT · 1.6 KM | LONG · 3.6 KM\n5.4 to 8.0 sec: COMPARE CURRENT CONDITIONS →" },
            { label: "Post copy", text: "One starting point. Two published distances. Choose the length first, then check current Parks Victoria conditions." },
            { label: "Accessibility", text: "Silent eight-second movement across the accepted botanical Story master. All information is repeated in the deterministic overlay and Story caption." },
            { label: "Fallback", text: "Use the static S2-STORY sequence whenever motion delivery, readability or current-condition checks do not pass." }
          ], gate: "Add deterministic overlay; inspect the full timeline; current conditions; choose either motion or static Story sequence."
        }
      ]
    },
    {
      id: "S3-EML",
      shortTitle: "03 Holidays",
      label: "Week 03 · Family / School holidays",
      title: "Without the scramble",
      date: "Proposed 24 September 2026",
      hero: "assets/exports/s3-email.webp",
      heroAlt: "Three paper specimen groups representing active-first, rain-safe and low-friction family day shapes.",
      email: {
        publication: "The Insider Note",
        subject: "Pick the shape before the venue",
        preheader: "Active-first, rain-safe or low-friction: one cleaner school-holiday decision.",
        kicker: "The Holiday Note · Peninsula-wide",
        heading: "School holidays without the scramble",
        intro: "Before opening a dozen tabs, choose what the day needs to be.",
        paragraphs: [
          "The published Victorian government-school holidays run from 21 September to 2 October. Friday 25 September is also a public holiday.",
          "The Shire's current programme is useful for finding candidates, but availability and details can change. Check the operator directly, then stop once one anchor and one fallback are clear."
        ],
        bullets: [
          "Active-first: movement is the anchor; everything after it is optional.",
          "Rain-safe: one contained, age-matched session and a short travel radius.",
          "Low-friction: the nearest suitable activity with a clear start and finish."
        ],
        button: "Choose the day shape",
        destination: "S3-WEB refreshed route",
        textLinks: ["Browse current Shire holiday listings"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Email controls; released guide; programme and operator checks; public-holiday hours; editorial approval."
      },
      assets: [
        {
          id: "S3-WEB", channel: "Peninsula Insider website", format: "Anchor refresh", state: "Copy complete · held",
          fields: [
            { label: "Search package", text: "Canonical relationship: controlled refresh of /explore/plans/the-school-holidays-survival-guide/\nSearch title: Mornington Peninsula school holidays: choose the day shape | Peninsula Insider\nMeta description: Plan one school-holiday day around its energy: active-first, rain-safe or low-friction, with live programme and booking checks before leaving." },
            { label: "Headline and standfirst", text: "School holidays without the scramble\nChoose the shape of the day before the venue. One anchor, one flexible second move and a clean way out beats a list nobody can finish." },
            { label: "Complete body", text: "Victoria's published government-school holiday period runs from Monday 21 September to Friday 2 October 2026. Before opening tabs, choose one of three shapes: active-first, rain-safe or low-friction.\n\nUse active-first when movement is the point. Use rain-safe when the forecast is uncertain or the group needs a contained plan. Use low-friction when the cost of organising is already too high. Low-friction is not a lesser day.\n\nFriday 25 September is a Victorian public holiday, so usual Friday arrangements may differ. Before leaving, confirm the activity is running, age and supervision requirements fit, booking and capacity are understood, access and cost are current, and the fallback is easier than the original plan. Then stop researching." },
            { label: "CTA", text: "Primary: Browse the live Shire school-holiday programme\nSecondary: Reopen the PI holiday guide" },
            { label: "Accessibility", text: "Hero alt: Three original paper specimen groups representing an active day, a rain-safe day and a low-friction day." }
          ], gate: "Live programme and operator checks; route strategy; local family review; public-holiday hours; byline; rights and accessibility."
        },
        {
          id: "S3-DSP", channel: "Peninsula Insider website", format: "Public-holiday dispatch", state: "Copy complete · held",
          fields: [
            { label: "Headline", text: "For the long weekend, choose the day shape first" },
            { label: "Complete body", text: "Friday 25 September is a Victorian public holiday, inside the government-school holiday period. That adds one more reason to decide what the day needs before building a list.\n\nChoose active-first if movement is the point. Choose rain-safe if weather or energy needs containment. Choose low-friction if one nearby, age-matched commitment is enough.\n\nThe Shire's live holiday programme is the inventory. Check the exact operator for date, age, booking, cost and access; public-holiday arrangements may differ. Then give the day one anchor and one easy exit." },
            { label: "CTA and source", text: "Choose your day shape\nSource: Browse current Shire listings" },
            { label: "Alt text", text: "Three simple paper groups stand for active-first, rain-safe and low-friction family plans." }
          ], gate: "Current programme, operator details, public-holiday hours and released S3-WEB route."
        },
        {
          id: "S3-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · held",
          fields: [
            { label: "Subject and preheader", text: "Subject: Pick the shape before the venue\nPreheader: Active-first, rain-safe or low-friction: one cleaner school-holiday decision." },
            { label: "Complete email", text: "School holidays without the scramble\n\nThe published Victorian government-school holidays run from 21 September to 2 October. Friday 25 September is also a public holiday.\n\nBefore opening a dozen tabs, choose what the day needs to be: active-first, rain-safe or low-friction.\n\nThe Shire's current programme is useful for finding candidates, but availability and details can change. Check the operator directly, then stop once one anchor and one fallback are clear." },
            { label: "CTA and footer", text: "Button: Choose the day shape\nText link: Browse current Shire holiday listings\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt", text: "Three paper specimen groups representing active-first, rain-safe and low-friction family day shapes." }
          ], gate: "Email controls, released guide, operator checks, public-holiday checks and human send approval."
        },
        {
          id: "S3-FEED", channel: "Instagram Feed", format: "Five-slide carousel", state: "Copy complete · held",
          fields: [
            { label: "On-asset copy", text: "1. School holidays, fewer tabs | Choose the shape before the venue.\n2. Active-first | Put movement first | Make the rest optional.\n3. Rain-safe | One contained activity | Check age, booking and access.\n4. Low-friction | Keep it close | One clear start. One clear finish.\n5. Lock it in five minutes | Date · age · booking · access · fallback | Then stop researching." },
            { label: "Complete caption", text: "The school-holiday shortcut is not a longer list. It is a better first decision.\n\nChoose the day shape:\n\nACTIVE-FIRST when movement is the point.\nRAIN-SAFE when weather or energy needs containment.\nLOW-FRICTION when one nearby commitment is enough.\n\nVictoria's published government-school holidays run from 21 September to 2 October. Friday 25 September is a public holiday.\n\nUse the Shire's live holiday programme to find candidates, then check the operator for date, age, booking, cost and access. Save this framework; keep only one anchor and one easy fallback.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #SchoolHolidays" },
            { label: "Per-slide alt", text: "1. Title card asking families to choose the day shape before the venue.\n2. Active-first means putting movement first and making the rest optional.\n3. Rain-safe means one contained activity with age, booking and access checks.\n4. Low-friction means one nearby activity with a clear start and finish.\n5. Closing checklist covers date, age, booking, access and fallback." }
          ], gate: "Caption, per-slide alt, live programme and operator checks, released guide and social executor."
        },
        {
          id: "S3-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · held",
          fields: [
            { label: "Frame copy", text: "1. WHAT DOES TODAY NEED? | Not which venue. Which shape?\n2. ACTIVE-FIRST · RAIN-SAFE · LOW-FRICTION | Pick one before opening more tabs.\n3. ONE ANCHOR. ONE FALLBACK. DONE. | Sticker: Choose the day shape" },
            { label: "Accessible sequence", text: "Three Story cards ask families to choose an active-first, rain-safe or low-friction day, then limit planning to one anchor and one fallback." },
            { label: "Destination", text: "S3-WEB released route" }
          ], gate: "Current programme context, working sticker, released route and social executor."
        }
      ]
    },
    {
      id: "S4-EML",
      shortTitle: "04 Reset",
      label: "Week 04 · Weekend / Red Hill",
      title: "The Spring reset weekend",
      date: "Proposed 2 October 2026",
      hero: "assets/exports/s4-email.webp",
      heroAlt: "Paper still life with a compact market morning, an open centre and long amber-and-blue evening shapes.",
      email: {
        publication: "The Insider Note",
        subject: "Leave the middle of the weekend loose",
        preheader: "Red Hill on Saturday morning; the daylight-saving clock change on Sunday.",
        kicker: "The Weekend Note · 3 to 4 October",
        heading: "Two fixed points for 3 to 4 October",
        intro: "Start with Saturday morning. Then leave the middle of the weekend unclaimed.",
        paragraphs: [
          "The Shire lists Hill & Ridge Community Market at Red Hill Recreation Reserve from 9 am to 2 pm on 3 October.",
          "Victoria's clocks move forward one hour at 2 am on Sunday 4 October. It does not add daylight, but it moves the available evening light later on the clock. Keep that evening clear until weather and energy tell you what it should be.",
          "One market. One protected evening. Everything else optional."
        ],
        button: "Use the two-point plan",
        destination: "S4-WEB proposed route",
        textLinks: ["Check the market directly", "Read the official daylight-saving rule"],
        signoff: ["James Richmond", "Peninsula Insider"],
        footer: "You received this email because you subscribed to Peninsula Insider. Manage preferences | Unsubscribe",
        audience: "The Insider Note subscribers",
        sender: "Approved Peninsula Insider sender - confirm before send",
        gate: "Email controls; released anchor; 24-hour market check; exact links; editorial approval; human send approval."
      },
      assets: [
        {
          id: "S4-WEB", channel: "Peninsula Insider website", format: "Anchor article", state: "Copy complete · held",
          fields: [
            { label: "Search package", text: "Proposed path: /journal/spring-reset-weekend-3-4-october-2026/\nSearch title: Mornington Peninsula weekend plan: 3 to 4 October 2026 | Peninsula Insider\nMeta description: Build the last school-holiday weekend around Red Hill market on Saturday morning and the daylight-saving clock change on Sunday." },
            { label: "Headline and standfirst", text: "Fix two points. Leave the weekend room.\nPut one official market in Saturday morning. Keep Sunday evening clear when the clocks move forward. Let the middle stay loose." },
            { label: "Complete body", text: "Mornington Peninsula Shire lists Hill & Ridge Community Market at Red Hill Recreation Reserve on Saturday 3 October from 9 am to 2 pm. Make the market the morning anchor, not a promise about the whole day. Check the official event page again before travelling.\n\nDo not pre-book Saturday afternoon simply because the morning is planned. Decide after the market whether the day needs lunch, a short stop or home. Keep Sunday's middle available for weather, energy and whatever came home from Red Hill.\n\nAt 2 am on Sunday 4 October, Victoria's clocks move forward one hour. The change shifts the existing light later on the clock; it does not create more daylight. Protect the evening, then decide close to the day whether it belongs outdoors, at the table or at home.\n\nTwo points: Saturday morning at the market, subject to a fresh check; Sunday evening left unclaimed. Everything between them is optional." },
            { label: "CTA", text: "Primary: Check Hill & Ridge Community Market\nSecondary: Read Victoria's daylight-saving rule" },
            { label: "Accessibility", text: "Hero alt: An original paper still life with a compact market-inspired morning specimen, an open centre and long amber-and-blue evening shapes." }
          ], gate: "24-hour market recheck; any venue-specific Sunday plan; canonical route; local review; byline; rights and accessibility."
        },
        {
          id: "S4-DSP", channel: "Peninsula Insider website", format: "Exact-date dispatch", state: "Copy complete · held",
          fields: [
            { label: "Headline", text: "3 to 4 October: one morning anchor, one open evening" },
            { label: "Complete body", text: "For the last school-holiday weekend, fix two points and leave the middle alone.\n\nMornington Peninsula Shire lists Hill & Ridge Community Market at Red Hill Recreation Reserve on Saturday 3 October, 9 am to 2 pm. Check the event page before travelling; weather, stalls, parking and live operation are not confirmed here.\n\nAt 2 am on Sunday 4 October, Victoria's clocks move forward one hour for daylight saving. That shifts the evening light later by the clock. Protect the evening, then decide close to the day what the weather and energy support." },
            { label: "CTA and sources", text: "Use the two-point plan\nSources: official market page and Business Victoria daylight-saving page" },
            { label: "Alt text", text: "Paper forms mark one Saturday morning point and one open Sunday evening around a deliberately empty centre." }
          ], gate: "24-hour market check, official clock rule and released S4-WEB route."
        },
        {
          id: "S4-EML", channel: "The Insider Note", format: "Email", state: "Copy and design complete · held",
          fields: [
            { label: "Subject and preheader", text: "Subject: Leave the middle of the weekend loose\nPreheader: Red Hill on Saturday morning; the daylight-saving clock change on Sunday." },
            { label: "Complete email", text: "Two fixed points for 3 to 4 October\n\nStart with Saturday morning. The Shire lists Hill & Ridge Community Market at Red Hill Recreation Reserve from 9 am to 2 pm on 3 October.\n\nThen leave the middle of the weekend unclaimed.\n\nVictoria's clocks move forward one hour at 2 am on Sunday 4 October. It does not add daylight, but it moves the available evening light later on the clock. Keep that evening clear until weather and energy tell you what it should be.\n\nOne market. One protected evening. Everything else optional." },
            { label: "CTA and footer", text: "Button: Use the two-point plan\nText links: Check the market directly | Read the daylight-saving rule\nJames Richmond · Peninsula Insider\nSubscriber reason | Manage preferences | Unsubscribe" },
            { label: "Hero alt", text: "Paper still life with a compact market morning, an open centre and long amber-and-blue evening shapes." }
          ], gate: "Email controls, released anchor, 24-hour market check, exact links and human send approval."
        },
        {
          id: "S4-FEED", channel: "Instagram Feed", format: "Five-slide carousel", state: "Copy complete · held",
          fields: [
            { label: "On-asset copy", text: "1. The Spring reset weekend | Fix two points. Leave the middle loose.\n2. Saturday morning | Hill & Ridge Community Market | 3 Oct · 9 am to 2 pm · Red Hill.\n3. Saturday afternoon | Do not fill it yet | Decide after the market.\n4. Sunday evening | Clocks move forward at 2 am | Protect the later clock; check weather.\n5. One morning. One evening. | Everything between them is optional | Check official details before leaving." },
            { label: "Complete caption", text: "The last school-holiday weekend does not need a full itinerary.\n\nFix Saturday morning: Hill & Ridge Community Market is listed at Red Hill Recreation Reserve on 3 October, 9 am to 2 pm.\n\nLeave the middle loose.\n\nOn Sunday 4 October, Victoria's clocks move forward one hour at 2 am for daylight saving. That shifts available evening light later by the clock; it does not add daylight. Keep the evening unclaimed until weather and energy are clear.\n\nCheck the official market page before travelling. Save the two-point plan.\n\nJames Richmond · Peninsula Insider\n#MorningtonPeninsula #RedHill #SpringWeekend" },
            { label: "Per-slide alt", text: "1. Title card introducing a two-point weekend plan.\n2. Saturday morning card with the listed Red Hill market date and time.\n3. Saturday afternoon card asks readers to decide after the market.\n4. Sunday evening card explains the 2 am clock change and weather check.\n5. Closing card leaves everything between the two points optional." }
          ], gate: "Caption, per-slide alt, 24-hour market check, released guide and social executor."
        },
        {
          id: "S4-STORY", channel: "Instagram Stories", format: "Three-frame sequence", state: "Copy complete · held",
          fields: [
            { label: "Frame copy", text: "1. SATURDAY MORNING | Red Hill market · 3 Oct · 9 am to 2 pm.\n2. LEAVE THE MIDDLE LOOSE | Decide after the market, not before it.\n3. PROTECT SUNDAY EVENING | Clocks forward · 2 am | Sticker: Use the two-point plan" },
            { label: "Accessible sequence", text: "Three Story cards set Red Hill market as the Saturday morning anchor, leave the weekend middle open and explain that Victoria's clocks move forward at 2 am on Sunday." },
            { label: "Destination", text: "S4-WEB released route" }
          ], gate: "24-hour market check, clock detail, working sticker, released route and social executor."
        },
        {
          id: "S4-MOTION", channel: "Peninsula Insider website", format: "Eight-second wide motion plate", state: "Copy complete · review media",
          fields: [
            { label: "Overlay script", text: "0.0 to 2.2 sec: 3 TO 4 OCTOBER\n2.2 to 5.4 sec: ONE MORNING. ONE EVENING.\n5.4 to 8.0 sec: LEAVE THE MIDDLE LOOSE →" },
            { label: "Supporting copy", text: "Fix Saturday morning. Protect Sunday evening. Let weather and energy decide everything between them." },
            { label: "Accessibility", text: "Silent eight-second movement across the accepted Spring reset specimen. The complete decision is repeated in live overlay text and nearby page copy." },
            { label: "Fallback", text: "Use the static S4-WEB composition when reduced motion is requested or motion verification does not pass." }
          ], gate: "Add deterministic overlay; timeline and reduced-motion QA; 24-hour market check; released S4-WEB route."
        }
      ]
    }
  ]
};
