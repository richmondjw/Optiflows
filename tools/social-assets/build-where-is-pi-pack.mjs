// Builds the downloadable pack for campaigns/peninsula-insider-where-is-pi and wires the copy
// into the review page. One source per fact:
//   - the words ON each creative are parsed out of asset-renderer.html, so the page cannot
//     disagree with what the renderer draws;
//   - the words that travel WITH each post (caption, alt) come from campaign-copy.json;
//   - the prize sentence and the URL come from creative-provenance.json.
// Outputs: an inlined copy block in index.html, a PDF pack, captions.txt, and a zip of everything.
//
// Usage: node tools/social-assets/build-where-is-pi-pack.mjs
// Env:   PLAYWRIGHT_MODULE, PI_CHROME (as for render-where-is-pi.mjs)
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const resolvePlaywright = async (p) => {
  const abs = path.resolve(p);
  const stat = await fs.stat(abs).catch(() => null);
  return pathToFileURL(stat?.isDirectory() ? path.join(abs, "index.mjs") : abs).href;
};
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? await resolvePlaywright(process.env.PLAYWRIGHT_MODULE) : "playwright");

const root = process.cwd();
const dir = path.resolve(root, "campaigns/peninsula-insider-where-is-pi");
const downloads = path.join(dir, "assets/downloads");
await fs.mkdir(downloads, { recursive: true });

const renderer = await fs.readFile(path.join(dir, "asset-renderer.html"), "utf8");
const copyFile = JSON.parse(await fs.readFile(path.join(dir, "campaign-copy.json"), "utf8"));
const provenance = JSON.parse(await fs.readFile(path.join(dir, "creative-provenance.json"), "utf8"));

// --- 1. the words the renderer actually draws, per asset -------------------------------------
const FILES = {
  "feed-01": "feed-tile", "carousel-01": "carousel-01-hook", "carousel-02": "carousel-02-case",
  "carousel-03": "carousel-03-mechanic", "carousel-04": "carousel-04-witness", "carousel-05": "carousel-05-cta",
  "story-01": "story-01-hook", "story-02": "story-02-challenge", "story-03": "story-03-cta",
  "story-04": "story-04-countdown", "feed-02": "feed-02-sustain", "feed-03": "feed-03-urgency",
  "hero-wide": "hero-wide", "hero-wide-02": "hero-wide-02-urgency",
};
const SIZES = { feed: "1080 x 1350", story: "1080 x 1920", wide: "1920 x 1080" };
const field = (body, name) => (body.match(new RegExp(`${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)) ?? [])[1] ?? "";
const assets = {};
for (const m of renderer.matchAll(/"([a-z0-9-]+)":\s*\{(format:[\s\S]*?)\},?\r?\n/g)) {
  const [, id, body] = m;
  if (!FILES[id]) continue;
  const format = field(body, "format");
  assets[id] = {
    id, format, size: SIZES[format], file: FILES[id],
    onTile: ["kicker", "headline", "deck", "cta", "url", "note"]
      .map((k) => [k, field(body, k)]).filter(([, v]) => v)
      .map(([k, v]) => [k, v.replace(/\\"/g, '"')]),
    alt: copyFile.alt[id] ?? "",
  };
}
const missing = Object.keys(FILES).filter((k) => !assets[k]);
if (missing.length) { console.error("renderer is missing assets: " + missing.join(", ")); process.exit(2); }
const noAlt = Object.values(assets).filter((a) => !a.alt).map((a) => a.id);
if (noAlt.length) { console.error("campaign-copy.json has no alt for: " + noAlt.join(", ")); process.exit(2); }

const pack = {
  campaign: provenance.campaign,
  generatedAt: new Date().toISOString(),
  cta: provenance.copy.cta,
  prize: `${provenance.copy.prize_line} Draw closes ${provenance.copy.draw_closes}.`,
  assets,
  posts: copyFile.posts,
};

// --- 2. inline the copy into the review page --------------------------------------------------
const START = "<!-- COPY-DATA:START -->", END = "<!-- COPY-DATA:END -->";
let page = await fs.readFile(path.join(dir, "index.html"), "utf8");
const block = `${START}\n  <script type="application/json" id="campaign-copy">${JSON.stringify(pack)}</script>\n  ${END}`;
// The data must precede the script that reads it: the page's inline script runs at parse time.
page = page.replace(new RegExp(`\\s*${START}[\\s\\S]*?${END}`), "");
page = page.replace(/(<body[^>]*>)/, `$1\n  ${block}`);
await fs.writeFile(path.join(dir, "index.html"), page);

// --- 3. captions.txt --------------------------------------------------------------------------
const rule = "-".repeat(78);
const lines = [pack.campaign, `Generated ${pack.generatedAt}`, "", "REVIEW ONLY. Nothing in this pack is authorised for publication.", ""];
for (const post of pack.posts) {
  lines.push(rule, `WEEK ${post.week} / ${post.day} / ${post.channel}`, rule, "");
  lines.push("FILES:");
  for (const id of post.assets) {
    const a = assets[id];
    lines.push(a ? `  ${a.file}.jpg   ${a.size}` : `  ${id === "motion-01" ? "motion-01-mornington-pier-9x16.mp4   834 x 1112" : id}`);
  }
  lines.push("", "CAPTION:", ...post.caption.split("\n").map((l) => (l ? "  " + l : "")), "");
  for (const id of post.assets) {
    const a = assets[id];
    if (!a) continue;
    lines.push(`ALT TEXT (${a.file}):`, "  " + a.alt, "");
    if (a.onTile.length) {
      lines.push(`WORDS ON THE CREATIVE (${a.file}):`, ...a.onTile.map(([k, v]) => `  ${k.padEnd(9)} ${v}`), "");
    }
  }
}
await fs.writeFile(path.join(downloads, "captions.txt"), lines.join("\n"), "utf8");

// --- 4. the PDF pack --------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sheet = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${esc(pack.campaign)}</title><style>
@font-face{font-family:Sora;src:url("assets/fonts/sora-700.woff2") format("woff2");font-weight:700;font-display:block}
@font-face{font-family:Sora;src:url("assets/fonts/sora-800.woff2") format("woff2");font-weight:800;font-display:block}
@font-face{font-family:Figtree;src:url("assets/fonts/figtree-400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:Figtree;src:url("assets/fonts/figtree-600.woff2") format("woff2");font-weight:600;font-display:block}
@page{size:A4;margin:14mm}
*{box-sizing:border-box}
body{margin:0;font:400 10pt/1.5 Figtree,Arial,sans-serif;color:#14202A;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3{font-family:Sora,Arial,sans-serif;margin:0;letter-spacing:-.03em;line-height:1.05}
.cover{height:262mm;display:flex;flex-direction:column;justify-content:space-between;background:#0B2E4A;color:#FDFCFA;padding:18mm;border-radius:6mm;page-break-after:always;overflow:hidden}
.cover-art{margin:8mm -18mm;height:96mm;overflow:hidden}
.cover-art img{width:100%;height:100%;object-fit:cover;object-position:center 42%;display:block}
.cover h1{font-size:34pt;font-weight:800;max-width:150mm;margin-top:6mm}
.cover .kicker{color:#F5C177;font:600 9pt/1 Sora,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase}
.cover p{max-width:135mm;font-size:12pt;color:rgba(253,252,250,.85)}
.cover .facts{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;border-top:1px solid rgba(253,252,250,.3);padding-top:6mm}
.cover .facts b{display:block;font:800 17pt/1 Sora,Arial,sans-serif}
.cover .facts span{font-size:8pt;letter-spacing:.1em;text-transform:uppercase;color:rgba(253,252,250,.7)}
.post{page-break-before:always}
.post-head{border-bottom:1.5pt solid #0B2E4A;padding-bottom:3mm;margin-bottom:5mm}
.post-head .kicker{color:#8A5620;font:600 8pt/1 Sora,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase}
.post-head h2{font-size:19pt;font-weight:700;color:#0B2E4A;margin-top:2mm}
.shots{display:flex;flex-wrap:wrap;gap:4mm;margin-bottom:5mm}
.shot{width:52mm}
.shots.one .shot{width:88mm}
.shots.one.wide .shot{width:150mm}
.shot img{width:100%;height:auto;display:block;border:.5pt solid rgba(11,46,74,.25);border-radius:2mm}
.shot .cap{margin-top:1.5mm;font-size:7pt;letter-spacing:.08em;text-transform:uppercase;color:#4c5d67}
.wide .shot{width:110mm}
.blk{margin-bottom:4mm;padding:4mm 5mm;background:#F2EFEA;border-radius:3mm;page-break-inside:avoid}
.blk h3{font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:#10527E;margin-bottom:2mm;font-weight:700}
.blk p{margin:0;white-space:pre-wrap}
.tile-copy{margin-bottom:4mm;page-break-inside:avoid}
.tile-copy h3{font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:#10527E;margin-bottom:2mm;font-weight:700}
.tile-copy table{width:100%;border-collapse:collapse}
.tile-copy td{padding:1.4mm 0;vertical-align:top;border-bottom:.4pt solid rgba(11,46,74,.14);font-size:9pt}
.tile-copy td:first-child{width:22mm;color:#4c5d67;font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;padding-right:3mm}
.alt{font-size:8.5pt;color:#40515d}
.foot{margin-top:6mm;padding-top:3mm;border-top:.5pt solid rgba(11,46,74,.2);font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#4c5d67}
</style></head><body>
<section class="cover">
  <div><div class="kicker">Where in the Peninsula is PI? Case 01</div><h1>She took her coffee to go.</h1>
  <p>Every asset in the campaign with the copy that travels with it. Review only: nothing here is authorised for publication, and every image carries the review watermark.</p></div>
  <div class="cover-art"><img src="assets/exports/jpg/cover-plate.jpg"></div>
  <div class="facts">
    <div><b>${pack.posts.length}</b><span>posts</span></div>
    <div><b>${Object.keys(assets).length}</b><span>static tiles</span></div>
    <div><b>00</b><span>scheduled</span></div>
  </div>
</section>
${pack.posts.map((post) => {
  const shots = post.assets.map((id) => assets[id]).filter(Boolean);
  const isWide = shots.some((a) => a.format === "wide");
  const one = shots.length + (post.assets.includes("motion-01") ? 1 : 0) === 1;
  return `<section class="post">
    <div class="post-head"><div class="kicker">Week ${post.week} · ${esc(post.day)} · ${esc(post.channel)}</div><h2>${esc(post.caption.split("\n")[0])}</h2></div>
    <div class="shots${one ? " one" : ""}${isWide ? " wide" : ""}">${shots.map((a) => `<figure class="shot"><img src="assets/exports/jpg/${a.file}.jpg"><figcaption class="cap">${esc(a.file)} · ${esc(a.size)}</figcaption></figure>`).join("")}
    ${post.assets.includes("motion-01") ? '<figure class="shot"><img src="assets/exports/jpg/feed-tile.jpg" style="opacity:.45"><figcaption class="cap">motion-01 · 834 x 1112 mp4 · still shown for reference</figcaption></figure>' : ""}</div>
    <div class="blk"><h3>Caption</h3><p>${esc(post.caption)}</p></div>
    ${shots.map((a) => `<div class="tile-copy"><h3>Words on ${esc(a.file)}</h3><table>${a.onTile.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table><p class="alt" style="margin-top:2mm"><strong>Alt.</strong> ${esc(a.alt)}</p></div>`).join("")}
    <div class="foot">Review only · unpublished · ${esc(pack.cta)}</div>
  </section>`;
}).join("\n")}
</body></html>`;
const sheetPath = path.join(dir, ".print-sheet.tmp.html");
await fs.writeFile(sheetPath, sheet, "utf8");

const browser = await chromium.launch({ headless: true, executablePath: process.env.PI_CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe" });

// Cover plate: the 7 MB master PNG is far more resolution than a 96mm cover band needs.
const coverSrc = path.join(dir, "assets/masters/v2/plate-mornington-wide-16x9-v2.png");
const coverOut = path.join(dir, "assets/exports/jpg/cover-plate.jpg");
const cp = await browser.newPage({ viewport: { width: 1600, height: 905 }, deviceScaleFactor: 1 });
await cp.setContent(`<body style="margin:0"><img src="${pathToFileURL(coverSrc).href}" style="width:1600px;height:905px;object-fit:cover;object-position:center 42%;display:block"></body>`, { waitUntil: "networkidle" });
await cp.screenshot({ path: coverOut, type: "jpeg", quality: 88 });
await cp.close();

const p = await browser.newPage();
const problems = [];
p.on("requestfailed", (r) => problems.push("missing: " + path.basename(new URL(r.url()).pathname)));
await p.goto(pathToFileURL(sheetPath).href, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const pdfPath = path.join(downloads, "where-is-pi-case-01-campaign-pack.pdf");
await p.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
await fs.rm(sheetPath, { force: true });
if (problems.length) { console.error("PDF build could not load: " + [...new Set(problems)].join(", ")); process.exit(2); }

// --- 5. the zip -------------------------------------------------------------------------------
// Uses the platform zip utility; PowerShell's Compress-Archive is always present on Windows.
const zipPath = path.join(downloads, "where-is-pi-case-01-assets.zip");
await fs.rm(zipPath, { force: true });
const staging = path.join(dir, ".zip-staging");
await fs.rm(staging, { recursive: true, force: true });
await fs.mkdir(path.join(staging, "images"), { recursive: true });
await fs.mkdir(path.join(staging, "motion"), { recursive: true });
for (const a of Object.values(assets)) {
  await fs.copyFile(path.join(dir, "assets/exports/jpg", `${a.file}.jpg`), path.join(staging, "images", `${a.file}.jpg`));
}
await fs.copyFile(path.join(dir, "assets/motion/motion-01-mornington-pier-9x16.mp4"), path.join(staging, "motion/motion-01-mornington-pier-9x16.mp4"));
await fs.copyFile(path.join(downloads, "captions.txt"), path.join(staging, "captions.txt"));
await fs.copyFile(pdfPath, path.join(staging, "where-is-pi-case-01-campaign-pack.pdf"));
const execFileAsync = promisify(execFile);
await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
  `Compress-Archive -Path '${staging}\\*' -DestinationPath '${zipPath}' -Force`]);
await fs.rm(staging, { recursive: true, force: true });

const kb = async (f) => Math.round((await fs.stat(f)).size / 1024);
console.log(`ok  copy data inlined into index.html (${pack.posts.length} posts, ${Object.keys(assets).length} assets)`);
console.log(`ok  captions.txt              ${await kb(path.join(downloads, "captions.txt"))} KB`);
console.log(`ok  campaign pack PDF         ${await kb(pdfPath)} KB`);
console.log(`ok  assets zip                ${await kb(zipPath)} KB`);
