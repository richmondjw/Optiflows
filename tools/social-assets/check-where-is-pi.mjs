// Guard for campaigns/peninsula-insider-where-is-pi. Exit 0 = clean, 2 = failures.
//  1. Every hex colour in asset-renderer.html is a Harbour token (the tiles cannot drift off palette).
//  2. The CTA URL and prize line in the renderer are byte-identical to creative-provenance.json.
//  3. Every export referenced by index.html exists, has the stated dimensions, and nothing on disk is unreferenced.
//  4. No em-dash anywhere in the renderer's strings or the page's visible copy (house rule).
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dir = path.resolve(root, "campaigns/peninsula-insider-where-is-pi");
const read = (f) => fs.readFile(path.join(dir, f), "utf8");
const fail = [];
const ok = (msg) => console.log("ok   " + msg);

const ALLOWED = new Set(["#0B2E4A", "#10527E", "#F5C177", "#E2562F", "#F2EFEA", "#FDFCFA", "#14202A", "#8A5620"]);

const renderer = await read("asset-renderer.html");
const provenance = JSON.parse(await read("creative-provenance.json"));
const page = await read("index.html");

// 1. palette
const hexes = [...new Set((renderer.match(/#[0-9a-fA-F]{6}\b/g) || []).map((h) => h.toUpperCase()))];
const off = hexes.filter((h) => !ALLOWED.has(h));
off.length ? fail.push(`renderer uses off-token colours: ${off.join(", ")}`) : ok(`renderer palette: ${hexes.length} tokens, all Harbour`);

// 2. copy source of truth
const urlMatch = renderer.match(/const URL_CTA = "([^"]+)"/);
const prizeMatch = renderer.match(/const PRIZE = "([^"]+)"/);
const expectedPrize = `${provenance.copy.prize_line} Draw closes ${provenance.copy.draw_closes}.`;
urlMatch?.[1] === provenance.copy.cta ? ok(`CTA URL matches provenance: ${urlMatch[1]}`) : fail.push(`CTA URL drift: renderer "${urlMatch?.[1]}" vs provenance "${provenance.copy.cta}"`);
prizeMatch?.[1] === expectedPrize ? ok("prize line matches provenance") : fail.push(`prize line drift:\n  renderer:   ${prizeMatch?.[1]}\n  provenance: ${expectedPrize}`);
if (/Mornington to Cape Schanck|Cape Schanck to Main Ridge|Main Ridge to Red Hill/.test(renderer + page)) fail.push("Case 01 route appears in public copy (spoils the game)");
else ok("route not present in public copy");

// 3. exports referenced vs on disk
const stated = { feed: [1080, 1350], story: [1080, 1920], wide: [1920, 1080] };
const refs = [...new Set([...page.matchAll(/assets\/exports\/([a-z0-9-]+\.webp)/g)].map((m) => m[1]))];
const onDisk = (await fs.readdir(path.join(dir, "assets/exports"))).filter((f) => f.endsWith(".webp"));
for (const f of refs) if (!onDisk.includes(f)) fail.push(`page references missing export ${f}`);
for (const f of onDisk) if (!refs.includes(f)) fail.push(`unreferenced export on disk: ${f}`);
const { default: sharpless } = { default: null };
// dimensions via WebP header (VP8/VP8L/VP8X) without a native dependency
const webpSize = (buf) => {
  const tag = buf.toString("ascii", 12, 16);
  if (tag === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (tag === "VP8L") { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]; }
  return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
};
for (const f of refs.filter((f) => onDisk.includes(f))) {
  const buf = await fs.readFile(path.join(dir, "assets/exports", f));
  const [w, h] = webpSize(buf);
  const kind = f.startsWith("story") ? "story" : f.startsWith("hero") ? "wide" : "feed";
  const [ew, eh] = stated[kind];
  w === ew && h === eh ? ok(`${f} ${w}x${h}`) : fail.push(`${f} is ${w}x${h}, expected ${ew}x${eh}`);
}

// 4. house rule
const visible = page.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, "");
if (/—/.test(renderer)) fail.push("em-dash in renderer strings");
if (/—/.test(visible)) fail.push("em-dash in page copy");
if (!/—/.test(renderer + visible)) ok("no em-dashes");

if (fail.length) { console.error("\nFAIL\n- " + fail.join("\n- ")); process.exit(2); }
console.log("\nclean");
