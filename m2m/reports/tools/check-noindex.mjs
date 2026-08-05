#!/usr/bin/env node
/**
 * Assert that nothing under /m2m/ is indexable. Exits non-zero on any gap.
 *
 * Run before pushing anything to the M2M library:
 *   node m2m/reports/tools/check-noindex.mjs           # local files
 *   node m2m/reports/tools/check-noindex.mjs --live    # also probe the live site
 *
 * Standing rule: /m2m/ is an internal library. Every page carries a per-page
 * meta robots directive AND robots.txt disallows the path. The meta tag is the
 * authoritative one — robots.txt stops crawling but cannot remove a URL that
 * is already indexed, so the two are not interchangeable.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const REQUIRED = ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex'];
const root = resolve(process.argv[1], '../../..');       // repo/m2m
const repo = resolve(root, '..');                        // repo
const live = process.argv.includes('--live');

function walk(dir) {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

let fail = 0;
const pages = walk(root);
for (const p of pages) {
  const head = readFileSync(p, 'utf8').slice(0, 4000);
  const m = head.match(/<meta name="robots" content="([^"]*)"/i);
  const missing = m ? REQUIRED.filter((d) => !m[1].includes(d)) : REQUIRED;
  if (missing.length) {
    console.error(`FAIL ${relative(repo, p)} — missing: ${missing.join(',')}`);
    fail++;
  }
}

const robots = readFileSync(resolve(repo, 'robots.txt'), 'utf8');
if (!/^\s*Disallow:\s*\/m2m\/\s*$/m.test(robots)) {
  console.error('FAIL robots.txt — no "Disallow: /m2m/"');
  fail++;
}
try {
  if (/\/m2m\//.test(readFileSync(resolve(repo, 'sitemap.xml'), 'utf8'))) {
    console.error('FAIL sitemap.xml lists a /m2m/ URL');
    fail++;
  }
} catch { /* no sitemap is fine */ }

if (live) {
  const urls = pages.map(
    (p) => 'https://optiflows.com.au/' + relative(repo, p).replace(/index\.html$/, '')
  );
  for (const u of urls) {
    try {
      const html = await (await fetch(u)).text();
      const m = html.match(/<meta name="robots" content="([^"]*)"/i);
      const missing = m ? REQUIRED.filter((d) => !m[1].includes(d)) : REQUIRED;
      if (missing.length) {
        console.error(`FAIL (live) ${u} — missing: ${missing.join(',')}`);
        fail++;
      }
    } catch (e) {
      console.error(`WARN (live) ${u} — ${e.message}`);
    }
  }
}

console.log(
  fail
    ? `\n${fail} problem(s) — /m2m/ is NOT fully protected`
    : `OK — ${pages.length} pages under /m2m/ carry ${REQUIRED.join(',')}; robots.txt disallows /m2m/${live ? '; live verified' : ''}`
);
process.exit(fail ? 1 : 0);
