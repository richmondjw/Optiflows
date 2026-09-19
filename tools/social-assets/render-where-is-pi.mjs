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
  await page.goto(`${rendererUrl}?asset=${id}&capture=1`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Every declared face must actually be loaded; a fallback face is a silent brand failure.
  const fonts = await page.evaluate(() => [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`));
  const notLoaded = fonts.filter((f) => !f.endsWith("loaded"));
  if (notLoaded.length) problems.push("fonts not loaded: " + notLoaded.join(", "));
  const out = path.join(outDir, `${file}.png`);
  await page.screenshot({ path: out, type: "png" });
  const meta = await page.evaluate(() => window.__PI_ASSET__);
  manifest.push({ id, file: `${file}.png`, width, height, url: meta.url, note: meta.note, problems });
  console.log(`${problems.length ? "WARN" : "ok  "} ${id.padEnd(12)} ${width}x${height} -> exports/png/${file}.png${problems.length ? "  " + problems.join(" | ") : ""}`);
  await page.close();
}
await browser.close();
await fs.writeFile(path.join(outDir, "capture-manifest.json"), JSON.stringify({ generatedAt: new Date().toISOString(), renderer: "asset-renderer.html", captures: manifest }, null, 2));
const failed = manifest.filter((m) => m.problems.length);
if (failed.length) { console.error(`${failed.length} capture(s) reported problems`); process.exit(2); }
