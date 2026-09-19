// Deterministic tile capture for campaigns/peninsula-insider-where-is-pi.
// Usage: node tools/social-assets/render-where-is-pi.mjs [--only feed-01,story-02]
// Env:   PLAYWRIGHT_MODULE=<path to a playwright install>   (defaults to the resolvable "playwright")
//        PI_CHROME=<chrome executable>                       (defaults to the local Chrome used by verify-pi-campaign-ui.mjs)
// Writes PNG captures to assets/exports/png/ and WebP (via the sibling Python step) to assets/exports/.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

// PLAYWRIGHT_MODULE may point at the package folder or its entry file; ESM cannot import a directory.
const resolvePlaywright = async (p) => {
  const abs = path.resolve(p);
  const stat = await fs.stat(abs).catch(() => null);
  return pathToFileURL(stat?.isDirectory() ? path.join(abs, "index.mjs") : abs).href;
};
const playwrightModule = process.env.PLAYWRIGHT_MODULE
  ? await resolvePlaywright(process.env.PLAYWRIGHT_MODULE)
  : "playwright";
const { chromium } = await import(playwrightModule);

const root = process.cwd();
const campaign = path.resolve(root, "campaigns/peninsula-insider-where-is-pi");
const rendererUrl = pathToFileURL(path.join(campaign, "asset-renderer.html")).href;
const outDir = path.join(campaign, "assets/exports/png");
await fs.mkdir(outDir, { recursive: true });

const SIZES = { feed: [1080, 1350], story: [1080, 1920], wide: [1920, 1080] };
const JOBS = [
  ["feed-01", "feed", "feed-tile"],
  ["carousel-01", "feed", "carousel-01-hook"],
  ["carousel-02", "feed", "carousel-02-case"],
  ["carousel-03", "feed", "carousel-03-mechanic"],
  ["carousel-04", "feed", "carousel-04-witness"],
  ["carousel-05", "feed", "carousel-05-cta"],
  ["story-01", "story", "story-01-hook"],
  ["story-02", "story", "story-02-challenge"],
  ["story-03", "story", "story-03-cta"],
  ["hero-wide", "wide", "hero-wide"],
  ["feed-02", "feed", "feed-02-sustain"],
  ["feed-03", "feed", "feed-03-urgency"],
  ["story-04", "story", "story-04-countdown"],
  ["hero-wide-02", "wide", "hero-wide-02-urgency"],
];

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg > -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;
// --release drops the REVIEW ONLY badge and writes to exports/release/ so review and releasable
// tiles can never be confused for one another.
const release = process.argv.includes("--release");
const releaseDir = path.join(campaign, "assets/exports/release");
if (release) await fs.mkdir(releaseDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PI_CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const manifest = [];
for (const [id, format, file] of JOBS) {
  if (only && !only.has(id)) continue;
  const [width, height] = SIZES[format];
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const problems = [];
  page.on("console", (m) => { if (m.type() === "error") problems.push(m.text()); });
  page.on("requestfailed", (r) => problems.push("request failed: " + r.url()));
  await page.goto(`${rendererUrl}?asset=${id}&capture=1${release ? "&release=1" : ""}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Every declared face must actually be loaded; a fallback face is a silent brand failure.
  const fonts = await page.evaluate(() => [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`));
  const notLoaded = fonts.filter((f) => !f.endsWith("loaded"));
  if (notLoaded.length) problems.push("fonts not loaded: " + notLoaded.join(", "));
  // A release capture must not carry the review badge; fail loudly rather than ship a watermark.
  const badgeVisible = await page.locator(".badge").isVisible().catch(() => false);
  if (release && badgeVisible) problems.push("release capture still shows the REVIEW ONLY badge");
  if (!release && !badgeVisible) problems.push("review capture is missing the REVIEW ONLY badge");
  const out = path.join(release ? releaseDir : outDir, `${file}.png`);
  await page.screenshot({ path: out, type: "png" });
  // JPEG alongside the PNG: it is what the channels and the download links actually want.
  const jpgDir = path.join(campaign, release ? "assets/exports/release/jpg" : "assets/exports/jpg");
  await fs.mkdir(jpgDir, { recursive: true });
  await page.screenshot({ path: path.join(jpgDir, `${file}.jpg`), type: "jpeg", quality: 92 });
  const meta = await page.evaluate(() => window.__PI_ASSET__);
  manifest.push({ id, file: `${file}.png`, width, height, url: meta.url, note: meta.note, problems });
  console.log(`${problems.length ? "WARN" : "ok  "} ${id.padEnd(12)} ${width}x${height} -> exports/${release ? "release" : "png"}/${file}.png${problems.length ? "  " + problems.join(" | ") : ""}`);
  await page.close();
}
await browser.close();
// A --only run must not drop the other captures from the manifest: merge onto what is already recorded.
const manifestPath = path.join(release ? releaseDir : outDir, "capture-manifest.json");
const previous = await fs.readFile(manifestPath, "utf8").then((t) => JSON.parse(t).captures ?? []).catch(() => []);
const merged = [...previous.filter((p) => !manifest.some((m) => m.id === p.id)), ...manifest]
  .sort((a, b) => JOBS.findIndex((j) => j[0] === a.id) - JOBS.findIndex((j) => j[0] === b.id));
await fs.writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), renderer: "asset-renderer.html", captures: merged }, null, 2));
const failed = manifest.filter((m) => m.problems.length);
if (failed.length) { console.error(`${failed.length} capture(s) reported problems`); process.exit(2); }
