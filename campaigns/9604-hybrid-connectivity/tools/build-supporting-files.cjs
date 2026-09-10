const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(
  `${fs.readFileSync(path.join(root, "campaign-data.js"), "utf8")}\nthis.DATA = CAMPAIGN;`,
  sandbox,
);
const campaign = sandbox.DATA;

const sha256 = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const write = (relativePath, body) => {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
  console.log(`Wrote ${relativePath}`);
};
const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const addDays = (isoDate, days) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const secondary = {
  1: ["Email", "Email 01 + landing hero", "Launch the coverage problem and guide route"],
  2: ["Email", "Email 02 + retargeting", "Rank missed-transmission consequences"],
  3: ["LinkedIn document", "Architecture truth", "Developer-defined routing and fallback"],
  4: ["Email + web", "Asset tracking proof", "Segment email and vertical landing block"],
  5: ["Email + web", "Agtech proof", "Segment email and vertical landing block"],
  6: ["Engineering explainer", "Environmental proof", "Carousel and landing block"],
  7: ["Email + retargeting", "Remote equipment proof", "Segment email and exception-path retargeting"],
  8: ["Email + web", "Field-safety proof", "Segment email and qualified caveat"],
  9: ["Technical document", "One module. Both layers.", "Engineering proof and SI enablement"],
  10: ["Guide + email", "Readiness checklist", "Release conversion object and follow-up"],
  11: ["Email + web", "Design clinic EOI", "Proposed-event interest only"],
  12: ["Retargeting", "Design conversation", "High-intent conversion close"],
};
const sales = {
  1: "Map one representative route",
  2: "Prioritise one message set",
  3: "Offer architecture review",
  4: "Asset-tracking talk track",
  5: "Agtech talk track",
  6: "Environmental-monitoring talk track",
  7: "Remote-equipment talk track",
  8: "Field-safety governed talk track",
  9: "SI technical follow-up",
  10: "Guide download follow-up",
  11: "Clinic EOI qualification",
  12: "Design-session qualification",
};

const calendar = campaign.weeks.flatMap((week) => [
  {
    week: week.week,
    date: week.date,
    phase: week.phase,
    channel: "LinkedIn",
    asset: week.headline,
    purpose: week.label,
    state: "Copy + creative ready",
  },
  {
    week: week.week,
    date: addDays(week.date, 2),
    phase: week.phase,
    channel: secondary[week.week][0],
    asset: secondary[week.week][1],
    purpose: secondary[week.week][2],
    state: "Review ready",
  },
  {
    week: week.week,
    date: addDays(week.date, 3),
    phase: week.phase,
    channel: "Sales / SI",
    asset: sales[week.week],
    purpose: "Human follow-up after qualified intent",
    state: "Script ready",
  },
]);
const calendarColumns = ["week", "date", "phase", "channel", "asset", "purpose", "state"];
write(
  "downloads/campaign-calendar.csv",
  [
    calendarColumns.map(csv).join(","),
    ...calendar.map((row) => calendarColumns.map((key) => csv(row[key])).join(",")),
  ].join("\n") + "\n",
);

const mdList = (items) => items.map((item) => `- ${item}`).join("\n");
const manuscript = [];
manuscript.push(`---
type: deliverable
project: m2m-connectivity
agent: codex
status: current
created: 2026-09-10
description: Complete production manuscript for the proposed 90-day Iridium Certus 9604 Hybrid IoT campaign.
tags: [m2m, campaign, hybrid-iot, iridium-9604, production-pack]
---

# ${campaign.meta.title}

**Product:** ${campaign.meta.product}<br>
**Campaign line:** ${campaign.meta.line}<br>
**Status:** ${campaign.meta.status}<br>
**Proposed run:** ${campaign.meta.proposedRun}<br>
**Version:** ${campaign.meta.version}

> This manuscript is complete for private review. It does not authorise publication to M2M channels, email sends, paid spend, CRM mutation, pricing commitments or external activation.

## Strategy

**Commercial objective:** ${campaign.strategy.objective}

**Audience**

${mdList(campaign.strategy.audience)}

**Conversion route:** ${campaign.strategy.route}<br>
**Primary channel:** ${campaign.strategy.primaryChannel}<br>
**Supporting channels:** ${campaign.strategy.supportingChannels.join("; ")}<br>
**Primary measure:** ${campaign.strategy.primaryMeasure}<br>
**Diagnostic measures:** ${campaign.strategy.diagnosticMeasures.join("; ")}<br>
**Non-goal:** ${campaign.strategy.nonGoal}

## Narrative phases
`);
for (const phase of campaign.phases) {
  manuscript.push(`### ${phase.number} · ${phase.title} (${phase.weeks})\n\n${phase.copy}\n`);
}

manuscript.push("## Weekly production copy\n");
for (const week of campaign.weeks) {
  manuscript.push(`### Week ${week.week} · ${week.label} · ${week.date}

**Channels:** ${week.channels.join("; ")}<br>
**Creative eyebrow:** ${week.eyebrow}<br>
**Headline:** ${week.headline}<br>
**Support:** ${week.support}<br>
**CTA:** ${week.cta}<br>
**Destination:** ${week.url}<br>
**Claim/evidence note:** ${week.evidence}

**LinkedIn copy**

${week.caption}
`);
}

manuscript.push("## LinkedIn document and carousel scripts\n");
for (const carousel of campaign.carousels) {
  manuscript.push(`### ${carousel.title}\n\n**Audience:** ${carousel.audience} · **Week:** ${carousel.week}\n`);
  carousel.slides.forEach((slide, index) => {
    manuscript.push(`#### Slide ${index + 1} · ${slide.headline}\n\n${slide.body}${slide.cta ? `\n\n**CTA:** ${slide.cta}` : ""}\n`);
  });
  if (carousel.technicalNotes) manuscript.push(`**Retained engineering detail**\n\n${carousel.technicalNotes.map(s => `- **${s.headline}** ${s.body}`).join('\n')}\n`);
}

manuscript.push("## Email sequence\n");
for (const email of campaign.emails) {
  manuscript.push(`### ${email.id.toUpperCase()} · Week ${email.week} · ${email.segment}

**Subject:** ${email.subject}<br>
**Preheader:** ${email.preheader}<br>
**Headline:** ${email.headline}

${email.paragraphs.join("\n\n")}

${mdList(email.bullets)}

**CTA:** ${email.cta} → ${campaign.meta.primaryUrl}
`);
}

manuscript.push("## Website activation designs\n");
for (const item of campaign.website) {
  manuscript.push(`### ${item.title}\n\n**Eyebrow:** ${item.eyebrow}\n\n**Headline:** ${item.headline}\n\n${item.body}\n\n**Primary CTA:** ${item.cta}${item.secondary ? `<br>\n**Secondary CTA:** ${item.secondary}` : ""}\n`);
}

manuscript.push("## Paid search copy\n");
for (const group of campaign.paidSearch) {
  manuscript.push(`### ${group.group}\n\n**Keywords:** ${group.keywords.join("; ")}\n\n**Headlines:** ${group.headlines.join("; ")}\n\n**Descriptions**\n\n${mdList(group.descriptions)}\n`);
}

manuscript.push("## Retargeting copy\n");
for (const item of campaign.retargeting) {
  manuscript.push(`### ${item.audience}\n\n**Line:** ${item.line}\n\n${item.body}\n\n**CTA:** ${item.cta}\n`);
}

manuscript.push("## Sales and system-integrator talk tracks\n");
for (const track of campaign.talkTracks) {
  manuscript.push(`### ${track.vertical}\n\n**Opener:** ${track.opener}\n\n${mdList(track.questions)}\n\n**Claim guard:** ${track.guard}<br>\n**Next step:** ${track.next}\n`);
}

manuscript.push("## Evidence register\n");
for (const source of campaign.sources) {
  manuscript.push(`### ${source.title}\n\n- Source owner: ${source.owner}\n- URL: ${source.url}\n- Freshness: ${source.asOf}\n- Supports: ${source.supports}\n- Confidence: ${source.confidence}\n`);
}

manuscript.push("## Activation gates\n");
for (const gate of campaign.gates) {
  manuscript.push(`### ${gate.gate}\n\n- Owner: ${gate.owner}\n- Requirement: ${gate.requirement}\n- Status: ${gate.status}\n`);
}

manuscript.push(`## Technical claim boundary

The Iridium Certus 9604 makes LTE-M, Iridium Short Burst Data and GNSS available in one module. Network routing, retry, escalation and fallback behaviour remain implementation choices for the product team. The campaign must not promise automatic switching, universal coverage, uninterrupted tracking, guaranteed message delivery or a guaranteed safety outcome.

## Release boundary

The OptiFlows page is a private, no-index review surface. Approval to publish that review surface is not approval to activate the campaign. Each live channel remains gated by its named owner, technical review, conversion-path verification, budget approval where applicable and James's explicit release authority.
`);
write("downloads/2026-09-10-hybrid-iot-90-day-campaign-manuscript.md", manuscript.join("\n"));

const masterBriefs = {
  "w01-coverage-boundary.png": "Cinematic editorial photograph of a remote Australian operating corridor crossing from connected infrastructure into open terrain; credible field conditions, strong left-side negative space, restrained teal and navy grade, no copy or logos.",
  "w02-transmission-cost.png": "Cinematic industrial operations scene focused on an isolated asset and a time-sensitive telemetry moment; a sense of consequence without alarmism, realistic Australian landscape, negative space for campaign typography, no copy or logos.",
  "w04-asset-tracking.png": "Premium editorial logistics photograph of freight moving beyond the predictable road network; layered distance, operational realism and a subtle boundary motif, no fictitious interface overlays, copy or logos.",
  "w05-agtech.png": "Premium Australian agtech landscape with distributed sensing and irrigation context; real soil, crop and machinery detail, expansive composition, soft atmospheric light, no text or logos.",
  "w06-environmental.png": "Remote environmental-monitoring field site in an Australian coastal or catchment landscape; scientific equipment treated credibly, cinematic natural light, no text or logos.",
  "w07-remote-equipment.png": "Isolated industrial equipment in a remote Australian operating environment at a consequential maintenance moment; realistic materials, premium editorial lighting, no text or logos.",
  "w08-field-safety.png": "Single field worker viewed respectfully in a vast remote work environment, communications as one element of a broader safety system; realistic PPE and terrain, no peril spectacle, text or logos.",
  "w09-engineering-design.png": "Macro editorial photograph of a compact communications module integrated into a real engineering prototype; visible design work, restrained signal-layer motif, technical credibility, no legible component branding, text or logos.",
};
const referenceFiles = [
  "assets/reference-art/9604-reference-01.jpg",
  "assets/reference-art/9604-reference-02.jpg",
];
const provenance = {
  schemaVersion: "1.0",
  campaignId: campaign.meta.id,
  generatedAt: "2026-09-10T00:00:00+10:00",
  policy: {
    rawMasters: "Higgsfield generated the text-free photographic masters; official branding and copy were not delegated to the image model.",
    finishing: "Official M2M artwork, Titillium fonts, approved copy and native dimensions were applied deterministically in HTML/CSS and exported through a browser renderer.",
    references: "The two supplied legacy composites were used for mood, audience and compositional direction only. Their external rights status is unknown; neither appears in the final rendered campaign assets.",
    limitation: "Higgsfield job identifiers were not retained in the campaign folder. File hashes anchor the observed outputs; promptBrief is the retained production brief rather than a verbatim provider log.",
  },
  references: referenceFiles.map((file, index) => ({
    sourceId: `supplied-reference-${String(index + 1).padStart(2, "0")}`,
    internalWorkingPath: file,
    source: "User-supplied campaign reference",
    rightsStatus: "Unknown; reference use only; not approved for publication",
    retainedOutsidePublicRelease: true,
    sha256: fs.existsSync(path.join(root, file)) ? sha256(path.join(root, file)) : JSON.parse(fs.readFileSync(path.join(root, 'creative-provenance.json'), 'utf8')).references.find(r => r.internalWorkingPath === file)?.sha256 || null,
  })),
  imageMasters: Object.entries(masterBriefs).map(([name, promptBrief]) => ({
    file: `assets/higgsfield-masters/${name}`,
    provider: "Higgsfield",
    model: "GPT Image 2 / gpt_image_2",
    generatedOn: "2026-09-09",
    promptBrief,
    referenceUse: ["supplied-reference-01", "supplied-reference-02"],
    outputRole: "Text-free photographic master",
    sha256: sha256(path.join(root, "assets/higgsfield-masters", name)),
  })),
  motionStudies: [
    {
      file: "assets/motion/coverage-boundary-loop.mp4",
      sourceMaster: "assets/higgsfield-masters/w01-coverage-boundary.png",
      provider: "Higgsfield",
      model: "Seedance 2.0",
      generatedOn: "2026-09-09",
      durationSeconds: 8,
      delivery: "Muted seamless review loop",
      promptBrief: "Slow, controlled cinematic push through the coverage-boundary landscape with natural atmospheric movement; preserve geography and realism; no added text, logos, vehicles or impossible motion.",
      sha256: sha256(path.join(root, "assets/motion/coverage-boundary-loop.mp4")),
    },
    {
      file: "assets/motion/engineering-design-loop.mp4",
      sourceMaster: "assets/higgsfield-masters/w09-engineering-design.png",
      provider: "Higgsfield",
      model: "Seedance 2.0",
      generatedOn: "2026-09-09",
      durationSeconds: 8,
      delivery: "Muted seamless review loop",
      promptBrief: "Measured macro camera slide across the engineering prototype with restrained light and depth movement; preserve component geometry; no added text, logos, hands or fictitious UI.",
      sha256: sha256(path.join(root, "assets/motion/engineering-design-loop.mp4")),
    },
  ],
  deterministicOutputs: {
    tool: "tools/render-assets.cjs with Chromium/Playwright",
    source: "render.html + campaign-data.js + official logo/font assets + Higgsfield masters",
    sets: [
      { path: "assets/exports", count: 48, formats: ["1600x900", "1080x1350", "1080x1080", "1080x1920"] },
      { path: "assets/carousels", count: 25, formats: ["1080x1350"], brand: "M2M Connectivity" },
      { path: "assets/carousels/m2m-one", count: 25, formats: ["1080x1350"], brand: "M2M One" },
      { path: "assets/email", count: 8, formats: ["1200x900"] },
      { path: "assets/website", count: 4, formats: ["1600x900"] },
    ],
  },
};
const carouselReceipts = path.join(root, 'carousel-generation-receipts.json');
if (fs.existsSync(carouselReceipts)) {
  provenance.imageMasters.push(...JSON.parse(fs.readFileSync(carouselReceipts, 'utf8')));
  provenance.policy.limitation = 'Original weekly masters lack retained provider job IDs. The human-story carousel revision retains provider job IDs, verbatim prompt files and generation receipts. All people and settings are illustrative, not actual customer evidence.';
  provenance.brandVariants = { default: 'M2M Connectivity', m2mOne: 'M2M One', placement: 'Exactly one official logo at top left per slide; each version uses only its own brand logo and signature, with unchanged artwork and proportions', m2mOneSource: 'https://m2mone.com.au/wp-content/uploads/2024/09/M2M-One-Logo_RBG.png', m2mOneAuthority: 'Existing approved asset from Pixel M2M One brand manifest; endorsed positive 326x80 source, placed no larger than native size', m2mOneSha256: sha256(path.join(root, 'assets/brand/m2m-one-logo.png')) };
}
write("creative-provenance.json", JSON.stringify(provenance, null, 2) + "\n");

function dimensions(file) {
  const data = fs.readFileSync(file);
  if (data.subarray(1, 4).toString() === "PNG") {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }
  if (data.subarray(0, 4).toString() === "RIFF" && data.subarray(8, 12).toString() === "WEBP") {
    const type = data.subarray(12, 16).toString();
    if (type === "VP8 ") {
      return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
    }
  }
  return null;
}
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}
function category(relative) {
  if (relative.startsWith("assets/exports/")) return "social-export";
  if (relative.startsWith("assets/carousels/")) return "carousel-slide";
  if (relative.startsWith("assets/email/")) return "email-design";
  if (relative.startsWith("assets/website/")) return "website-study";
  if (relative.startsWith("assets/higgsfield-masters/")) return "generative-master";
  if (relative.startsWith("assets/motion/")) return "motion-study";
  if (relative.startsWith("assets/reference-art/")) return "reference-only";
  if (relative.startsWith("downloads/")) return "download";
  if (relative.startsWith("assets/brand/") || relative.startsWith("assets/fonts/")) return "brand-source";
  if (relative.startsWith("tools/") || relative === "render.html") return "production-tool";
  return "campaign-source";
}
const excluded = (relative) =>
  relative.startsWith("tmp/") ||
  relative === "asset-manifest.json" ||
  relative.startsWith("assets/reference-art/") ||
  relative.endsWith("test-w01-feed.png") ||
  relative.endsWith("-seedance2.mp4");
const files = walk(root)
  .map((absolute) => ({ absolute, relative: path.relative(root, absolute).split(path.sep).join("/") }))
  .filter(({ relative }) => !excluded(relative))
  .sort((a, b) => a.relative.localeCompare(b.relative));
const items = files.map(({ absolute, relative }) => ({
  file: relative,
  category: category(relative),
  bytes: fs.statSync(absolute).size,
  dimensions: dimensions(absolute),
  sha256: sha256(absolute),
}));
const counts = items.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});
write(
  "asset-manifest.json",
  JSON.stringify(
    {
      schemaVersion: "1.0",
      campaignId: campaign.meta.id,
      generatedAt: "2026-09-10T00:00:00+10:00",
      exclusions: ["tmp/**", "reference-only inputs retained outside the public release", "test render", "unused source video with audio", "asset-manifest.json self-hash"],
      counts,
      totalFiles: items.length,
      totalBytes: items.reduce((sum, item) => sum + item.bytes, 0),
      files: items,
    },
    null,
    2,
  ) + "\n",
);
