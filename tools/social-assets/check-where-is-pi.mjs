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
// Case 01's answer is the route mornington -> cape-schanck -> main-ridge -> red-hill, venue Montalto.
// Mornington is the premise (the game's own title card gives it away), so it is allowed. Every other
// stop, the final venue, and the witness tells that resolve it must not appear anywhere the public sees:
// not in tile copy, not in page copy, and not as the subject of a plate a tile renders.
// An earlier version of this check tested three hand-written phrases and passed a pack that published
// the whole route as pictures. Check the names and the plate filenames, not the sentences.
const SOLUTION = ["cape schanck", "cape-schanck", "main ridge", "main-ridge", "red hill", "red-hill", "montalto"];
const TELLS = ["somewhere with a view", "walk before lunch", "sculpture", "ten minutes by tractor", "paringa"];
const visibleText = page.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ");
const rendererStrings = [...renderer.matchAll(/(?:kicker|headline|deck|cta|note|meta):\s*(?:"([^"]*)"|\[([^\]]*)\])/g)]
  .map((m) => m[1] ?? m[2]).join(" ");
const publicText = (visibleText + " " + rendererStrings).toLowerCase();
const leaked = SOLUTION.filter((t) => publicText.includes(t));
const tells = TELLS.filter((t) => publicText.includes(t));
// Which plates do the tiles actually render? A painting of a route stop leaks it without naming it.
const plateMap = Object.fromEntries([...renderer.matchAll(/(\w+):\s*"(assets\/masters\/[^"]+)"/g)].map((m) => [m[1], m[2]]));
const platesUsed = [...new Set([...renderer.matchAll(/plate:\s*"(\w+)"/g)].map((m) => m[1]).filter(Boolean))];
const platesLeaking = platesUsed.filter((k) => SOLUTION.some((t) => (plateMap[k] ?? "").toLowerCase().includes(t.replace(/ /g, "-"))));
if (leaked.length) fail.push(`Case 01 solution named in public copy: ${leaked.join(", ")}`);
if (tells.length) fail.push(`Case 01 witness tell reused as public copy: ${tells.join(", ")}`);
if (platesLeaking.length) fail.push(`tiles render plates of Case 01 route stops: ${platesLeaking.join(", ")}`);
if (!leaked.length && !tells.length && !platesLeaking.length) ok(`no Case 01 solution leak (checked ${SOLUTION.length} names, ${TELLS.length} tells, ${platesUsed.length} plates in use)`);

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
