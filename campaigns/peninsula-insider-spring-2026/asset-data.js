const PI_CAMPAIGN = {
  revision: "1.1",
  title: "Spring is for decisions",
  status: "REVIEW ONLY · UNPUBLISHED",
  calendar: {
    status: "PROPOSED · NOTHING SCHEDULED",
    timezone: "Australia/Melbourne",
    channels: {
      web: "Peninsula Insider website · anchor",
      feed: "Instagram Feed · carousel",
      story: "Instagram Stories · sequence",
      dispatch: "Peninsula Insider website · dispatch",
      email: "The Insider Note · email"
    },
    timing_note: "Dates are editorial hypotheses. Exact send and post times require channel baselines and a separately authorised release.",
    entries: [
      {date:"2026-09-08", day:"TUE 08 SEP", week:"s1", channel:"web", channel_label:"Anchor", asset:"S1-WEB", title:"Paper before lunch", purpose:"Open the weekly decision", gate:"Editorial acceptance + released/read-back route"},
      {date:"2026-09-10", day:"THU 10 SEP", week:"s1", channel:"feed", channel_label:"Feed", asset:"S1-FEED", title:"Five-slide decision", purpose:"Make the half-day saveable", gate:"Caption, alt text + social executor"},
      {date:"2026-09-12", day:"SAT 12 SEP", week:"s1", channel:"story", channel_label:"Stories", asset:"S1-STORY", title:"Three-frame prompt", purpose:"Prompt the weekend choice", gate:"Sticker route + social executor"},
      {date:"2026-09-13", day:"SUN 13 SEP", week:"s1", channel:"dispatch", channel_label:"Dispatch", asset:"S1-DSP", title:"Make one show the plan", purpose:"Forward the useful decision", gate:"Current MPRG check + released route"},
      {date:"2026-09-13", day:"SUN 13 SEP", week:"s1", channel:"email", channel_label:"Email", asset:"S1-EML", title:"One show before lunch", purpose:"Deliver the Sunday note", gate:"Sender, consent, footer + suppression controls"},

      {date:"2026-09-15", day:"TUE 15 SEP", week:"s2", channel:"web", channel_label:"Anchor", asset:"S2-WEB", title:"One walk, two lengths", purpose:"Open the route decision", gate:"Route identity, local judgement + released route"},
      {date:"2026-09-17", day:"THU 17 SEP", week:"s2", channel:"feed", channel_label:"Feed", asset:"S2-FEED", title:"Short or long?", purpose:"Make the comparison saveable", gate:"Caption, alt text + social executor"},
      {date:"2026-09-19", day:"SAT 19 SEP", week:"s2", channel:"story", channel_label:"Stories", asset:"S2-STORY", title:"Choose the length first", purpose:"Prompt a route choice", gate:"Live conditions + sticker route"},
      {date:"2026-09-20", day:"SUN 20 SEP", week:"s2", channel:"dispatch", channel_label:"Dispatch", asset:"S2-DSP", title:"Plan 26–27 September", purpose:"Put the walk into consideration", gate:"Parks Victoria check + released route"},
      {date:"2026-09-20", day:"SUN 20 SEP", week:"s2", channel:"email", channel_label:"Email", asset:"S2-EML", title:"Short walk or long walk?", purpose:"Deliver the Sunday comparison", gate:"Sender, consent, footer + suppression controls"},

      {date:"2026-09-21", day:"MON 21 SEP", week:"s3", channel:"web", channel_label:"Anchor", asset:"S3-WEB", title:"Choose the day shape first", purpose:"Open the holiday framework", gate:"Programme checks, family review + released route"},
      {date:"2026-09-22", day:"TUE 22 SEP", week:"s3", channel:"feed", channel_label:"Feed", asset:"S3-FEED", title:"School holidays, fewer tabs", purpose:"Make the framework saveable", gate:"Caption, alt text + social executor"},
      {date:"2026-09-24", day:"THU 24 SEP", week:"s3", channel:"story", channel_label:"Stories", asset:"S3-STORY", title:"What does today need?", purpose:"Prompt one day shape", gate:"Operator checks + sticker route"},
      {date:"2026-09-24", day:"THU 24 SEP", week:"s3", channel:"dispatch", channel_label:"Dispatch", asset:"S3-DSP", title:"The public-holiday weekend", purpose:"Reach readers before Friday", gate:"Public-holiday hours + released route"},
      {date:"2026-09-24", day:"THU 24 SEP", week:"s3", channel:"email", channel_label:"Email", asset:"S3-EML", title:"Pick the shape before the venue", purpose:"Deliver before the long weekend", gate:"Sender, consent, footer + suppression controls"},

      {date:"2026-09-30", day:"WED 30 SEP", week:"s4", channel:"web", channel_label:"Anchor", asset:"S4-WEB", title:"Leave the middle loose", purpose:"Open the two-point plan", gate:"Market recheck + released/read-back route"},
      {date:"2026-10-01", day:"THU 01 OCT", week:"s4", channel:"feed", channel_label:"Feed", asset:"S4-FEED", title:"The Spring reset weekend", purpose:"Make the plan saveable", gate:"Caption, alt text + social executor"},
      {date:"2026-10-02", day:"FRI 02 OCT", week:"s4", channel:"story", channel_label:"Stories", asset:"S4-STORY", title:"Saturday morning. Sunday evening.", purpose:"Prompt the exact-date plan", gate:"Live market details + sticker route"},
      {date:"2026-10-02", day:"FRI 02 OCT", week:"s4", channel:"dispatch", channel_label:"Dispatch", asset:"S4-DSP", title:"Fix two points", purpose:"Reach readers before 3–4 October", gate:"24-hour market check + released route"},
      {date:"2026-10-02", day:"FRI 02 OCT", week:"s4", channel:"email", channel_label:"Email", asset:"S4-EML", title:"Leave the middle open", purpose:"Deliver before the weekend", gate:"Sender, consent, footer + suppression controls"}
    ]
  },
  weeks: {
    s1: {
      number: "01",
      dates: "7—13 SEP",
      label: "CULTURE / MORNINGTON",
      title: "Paper before lunch",
      accent: "paper",
      masters: { wide: "masters/s1-paper-wide.png", feed: "masters/s1-paper-feed.png", story: "masters/s1-paper-story.png" },
      web: {
        id: "S1-WEB",
        eyebrow: "ONE SERIOUS SHOW · ONE OPEN DECISION",
        title: "Paper before lunch",
        deck: "Make National Works on Paper the fixed point of a Mornington half-day. Decide what comes next when you step outside.",
        fact: "MPRG · 5 SEP—22 NOV 2026",
        cta: "CHECK CURRENT MPRG DETAILS"
      },
      dispatch: {
        id: "S1-DSP",
        eyebrow: "THE WEEKEND DECISION",
        title: "Make one show the plan",
        deck: "Start with the exhibition. Leave lunch, weather and the second stop open.",
        fact: "REGULAR HOURS LISTED · TUE—SUN · 11 AM—4 PM",
        cta: "PLAN THE HALF-DAY"
      },
      email: {
        id: "S1-EML",
        eyebrow: "THE SUNDAY NOTE",
        title: "One show before lunch",
        deck: "National Works on Paper is now at MPRG. Give it the clean part of the day; let the rest stay responsive.",
        fact: "68 SELECTED WORKS · ACCORDING TO MPRG",
        cta: "PLAN THE HALF-DAY"
      },
      feed: [
        {kicker:"SPRING DECISION 01", title:"Paper before lunch", body:"National Works on Paper 2026 · Mornington", note:"Make one serious show the plan."},
        {kicker:"THE FIXED POINT", title:"5 Sep—22 Nov", body:"MPRG says 68 works were selected for the 2026 exhibition.", note:"Source: MPRG"},
        {kicker:"GIVE IT THE FIRST SLOT", title:"11 am—4 pm", body:"Regular hours listed · Tuesday—Sunday", note:"Check current details before leaving."},
        {kicker:"LEAVE ONE DECISION OPEN", title:"Lunch? Walk? Home?", body:"Decide after the exhibition, not before it.", note:"One anchor can be enough."},
        {kicker:"KEEP THE PLAN CLEAN", title:"Read. Check. Go.", body:"Use the guide, then check MPRG directly.", note:"Original PI illustration · not an exhibited work."}
      ],
      stories: [
        {kicker:"MORNINGTON HALF-DAY?", title:"Make one show the fixed point.", body:"Leave the second decision open."},
        {kicker:"NATIONAL WORKS ON PAPER 2026", title:"5 Sep—22 Nov", body:"Regular hours listed · Tue—Sun · 11 am—4 pm"},
        {kicker:"START WITH THE EXHIBITION", title:"Then let the day answer.", body:"PLAN THE HALF-DAY →"}
      ],
      source: "MPRG · observed 6 Sep 2026",
      hold: "Editorial review + live admission/access check"
    },
    s2: {
      number: "02",
      dates: "14—20 SEP",
      label: "WALK / GREENS BUSH",
      title: "One walk, two lengths",
      accent: "walk",
      masters: { wide: "masters/s2-walk-wide.png", feed: "masters/s2-walk-feed.png", story: "masters/s2-walk-story.png" },
      web: {
        id: "S2-WEB",
        eyebrow: "BALDRYS CIRCUITS · GREENS BUSH",
        title: "One walk, two lengths",
        deck: "Choose 1.6 km when walking shares the day. Choose 3.6 km when walking is the day.",
        fact: "ONE START · BALDRY CROSSING",
        cta: "CHECK PARKS VICTORIA CONDITIONS"
      },
      dispatch: {
        id: "S2-DSP",
        eyebrow: "PLAN 26—27 SEPTEMBER",
        title: "Choose the length first",
        deck: "Two circuits begin at Baldry Crossing. Let the distance shape the rest of the weekend.",
        fact: "SHORT 1.6 KM · LONG 3.6 KM",
        cta: "COMPARE THE CIRCUITS"
      },
      email: {
        id: "S2-EML",
        eyebrow: "THE SUNDAY NOTE",
        title: "Short walk or long walk?",
        deck: "One starting point, two useful choices and the official conditions within reach.",
        fact: "LOCAL JUDGEMENT PENDING",
        cta: "COMPARE THE CIRCUITS"
      },
      feed: [
        {kicker:"SPRING DECISION 02", title:"One walk, two lengths", body:"Baldrys circuits · Greens Bush", note:"Choose the length before you leave."},
        {kicker:"KEEP ROOM IN THE DAY", title:"Short · 1.6 km", body:"Eucalypt forest, according to Parks Victoria.", note:"The walk shares the plan."},
        {kicker:"MAKE WALKING THE PLAN", title:"Long · 3.6 km", body:"Creek crossings and fern gullies, according to Parks Victoria.", note:"Give the walk the day."},
        {kicker:"ONE OFFICIAL START", title:"Baldry Crossing", body:"Check changed conditions. Follow signs on site.", note:"Distance does not establish access."},
        {kicker:"CHOOSE THE LENGTH FIRST", title:"Save the comparison", body:"Read the guide, then check Parks Victoria.", note:"Original illustrative artwork."}
      ],
      stories: [
        {kicker:"A GREENS BUSH WALK?", title:"Choose the length first.", body:"One starting point. Two day shapes."},
        {kicker:"BALDRYS CIRCUITS", title:"Short · 1.6 km\nLong · 3.6 km", body:"Both start at Baldry Crossing."},
        {kicker:"BEFORE YOU SET OUT", title:"Read the comparison.", body:"Then check current Parks Victoria conditions →"}
      ],
      source: "Parks Victoria · observed 6 Sep 2026",
      hold: "Route identity + local judgement + live conditions"
    },
    s3: {
      number: "03",
      dates: "21—27 SEP",
      label: "FAMILY / SCHOOL HOLIDAYS",
      title: "Without the scramble",
      accent: "family",
      masters: { wide: "masters/s3-holidays-wide.png", feed: "masters/s3-holidays-feed.png", story: "masters/s3-holidays-story.png" },
      web: {
        id: "S3-WEB",
        eyebrow: "SCHOOL HOLIDAYS · FEWER TABS",
        title: "Choose the day shape first",
        deck: "Active-first, rain-safe or low-friction. One anchor and one easy fallback beat a list nobody can finish.",
        fact: "21 SEP—2 OCT · GOVERNMENT SCHOOLS",
        cta: "BROWSE THE LIVE PROGRAMME"
      },
      dispatch: {
        id: "S3-DSP",
        eyebrow: "THE PUBLIC-HOLIDAY WEEKEND",
        title: "What does the day need?",
        deck: "Choose the energy before the venue. Then check the operator and stop researching.",
        fact: "FRIDAY 25 SEP · VICTORIAN PUBLIC HOLIDAY",
        cta: "CHOOSE THE DAY SHAPE"
      },
      email: {
        id: "S3-EML",
        eyebrow: "THE HOLIDAY NOTE",
        title: "Pick the shape before the venue",
        deck: "Movement, shelter or ease: make the first decision before opening another tab.",
        fact: "ONE ANCHOR · ONE FALLBACK · DONE",
        cta: "CHOOSE THE DAY SHAPE"
      },
      feed: [
        {kicker:"SPRING DECISION 03", title:"School holidays, fewer tabs", body:"Choose the shape before the venue.", note:"One anchor. One fallback."},
        {kicker:"ACTIVE-FIRST", title:"Put movement first", body:"Make everything after it optional.", note:"Check weather, access and age."},
        {kicker:"RAIN-SAFE", title:"Contain the plan", body:"One age-matched activity. A short travel radius.", note:"Check booking and availability."},
        {kicker:"LOW-FRICTION", title:"Keep it close", body:"One clear start. One clear finish.", note:"A smaller plan is still a good day."},
        {kicker:"LOCK IT IN FIVE MINUTES", title:"Date · age · booking", body:"Access · cost · fallback", note:"Then stop researching."}
      ],
      stories: [
        {kicker:"WHAT DOES TODAY NEED?", title:"Not which venue. Which shape?", body:"Choose before opening more tabs."},
        {kicker:"THREE USEFUL SHAPES", title:"ACTIVE-FIRST\nRAIN-SAFE\nLOW-FRICTION", body:"Pick one."},
        {kicker:"ONE ANCHOR. ONE FALLBACK.", title:"Done.", body:"CHOOSE THE DAY SHAPE →"}
      ],
      source: "Vic Gov + Mornington Peninsula Shire · observed 6 Sep 2026",
      hold: "Operator checks + public-holiday hours + family review"
    },
    s4: {
      number: "04",
      dates: "28 SEP—4 OCT",
      label: "WEEKEND / RED HILL",
      title: "The Spring reset weekend",
      accent: "reset",
      masters: { wide: "masters/s4-reset-wide.png", feed: "masters/s4-reset-feed.png", story: "masters/s4-reset-story.png" },
      web: {
        id: "S4-WEB",
        eyebrow: "3—4 OCTOBER · TWO FIXED POINTS",
        title: "Leave the middle loose",
        deck: "Put one official market in Saturday morning. Protect Sunday evening when the clocks move forward.",
        fact: "ONE MORNING · ONE EVENING · EVERYTHING ELSE OPTIONAL",
        cta: "USE THE TWO-POINT PLAN"
      },
      dispatch: {
        id: "S4-DSP",
        eyebrow: "THE EXACT-DATE WEEKEND",
        title: "Fix two points",
        deck: "Red Hill on Saturday morning. The later clock on Sunday evening. No full itinerary required.",
        fact: "MARKET · 3 OCT · 9 AM—2 PM",
        cta: "CHECK THE MARKET"
      },
      email: {
        id: "S4-EML",
        eyebrow: "THE WEEKEND NOTE",
        title: "Leave the middle open",
        deck: "One market. One protected evening. Let weather and energy decide everything between them.",
        fact: "CLOCKS FORWARD · 2 AM · SUNDAY 4 OCT",
        cta: "USE THE TWO-POINT PLAN"
      },
      feed: [
        {kicker:"SPRING DECISION 04", title:"The Spring reset weekend", body:"Fix two points. Leave the middle loose.", note:"3—4 October"},
        {kicker:"SATURDAY MORNING", title:"Red Hill market", body:"3 Oct · 9 am—2 pm", note:"Check the official event page."},
        {kicker:"SATURDAY AFTERNOON", title:"Do not fill it yet", body:"Decide after the market, not before it.", note:"The loose middle is the plan."},
        {kicker:"SUNDAY EVENING", title:"Protect the later clock", body:"Clocks move forward at 2 am.", note:"It shifts the light; it does not add daylight."},
        {kicker:"ONE MORNING. ONE EVENING.", title:"Everything else optional", body:"Check official details before leaving.", note:"Save the two-point plan."}
      ],
      stories: [
        {kicker:"SATURDAY MORNING", title:"Red Hill market", body:"3 Oct · 9 am—2 pm"},
        {kicker:"LEAVE THE MIDDLE LOOSE", title:"Decide after the market.", body:"Not before it."},
        {kicker:"PROTECT SUNDAY EVENING", title:"Clocks forward · 2 am", body:"USE THE TWO-POINT PLAN →"}
      ],
      source: "Mornington Peninsula Shire + Business Victoria · observed 6 Sep 2026",
      hold: "24-hour market recheck + any place-specific evening claim"
    }
  }
};
