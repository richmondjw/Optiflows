#!/usr/bin/env node
/**
 * Wrap a report HTML file in the M2M reports library's AES-GCM password shell.
 *
 * The library's original reports (Inbound Lead Performance, the Technical
 * Diagnostic, MMC Marketing Performance, Growth Engine) do NOT use the
 * `gate.js` overlay — that only hides a div and leaves the content in the
 * page source. They encrypt the entire report body with AES-256-GCM and
 * decrypt it in the browser only once the correct password is entered. The
 * ciphertext is all that ships. That is real protection, and it is the
 * pattern every new report in this library must use.
 *
 * Scheme (must stay byte-compatible with the decrypt block in the shell):
 *   PBKDF2(password, salt=16B random, 250000 iters, SHA-256) -> AES-256-GCM key
 *   AES-256-GCM(iv = 12B random) over the UTF-8 report HTML
 *   payload JSON {s: salt_b64, i: iv_b64, c: (ciphertext||tag)_b64, n: iters}
 *   embedded in <script id="d" type="application/json">
 *
 * Usage:
 *   node encrypt-report.mjs --src in.html --out dir/index.html \
 *     --title "M2M One — Nurture Programme" \
 *     --sub "This report contains M2M Group commercial data..." \
 *     --foot "M2M One · Mailchimp + Zoho CRM · Jun 2026" \
 *     --password m2m2026
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';

const ITERATIONS = 250000;
// Any already-encrypted report works as the shell donor; this one is the
// library's original and defines the house look for the unlock screen.
const TEMPLATE = resolve(process.argv[1], '../../../report/index.html');

function arg(name, required = true) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1 || !process.argv[i + 1]) {
    if (required) {
      console.error(`missing --${name}`);
      process.exit(1);
    }
    return null;
  }
  return process.argv[i + 1];
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function shellFrom(templatePath) {
  const t = readFileSync(templatePath, 'utf8');
  const open = '<script id="d" type="application/json">';
  const a = t.indexOf(open);
  if (a === -1) throw new Error('template has no encrypted payload block');
  const b = t.indexOf('</script>', a);
  return { head: t.slice(0, a + open.length), tail: t.slice(b) };
}

const src = arg('src');
const out = arg('out');
const title = arg('title');
const sub = arg('sub', false) ??
  'This report contains M2M Group commercial data and sales performance data. Enter the access password to continue.';
const foot = arg('foot', false);
const password = arg('password');

const plaintext = readFileSync(src, 'utf8');

// Refuse to encrypt something that is obviously leaking contact data. The
// encryption protects the page, but a linked binary sitting next to it is
// fetched over plain HTTP regardless — so a report that still points at its
// raw data bundle must be fixed before it is published, not wrapped.
const localData = [...plaintext.matchAll(/(?:href|src)="([^"]+\.(?:zip|xlsx|csv|json))"/gi)]
  .map((m) => m[1])
  .filter((h) => !/^https?:/i.test(h));
if (localData.length) {
  console.error('refusing to publish: report links to local data files that the');
  console.error('password shell does NOT protect — strip or host them separately first:');
  localData.forEach((h) => console.error('  ' + h));
  process.exit(2);
}

const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(Buffer.from(password, 'utf8'), salt, ITERATIONS, 32, 'sha256');
const cipher = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final(), cipher.getAuthTag()]);

const payload = JSON.stringify({
  s: salt.toString('base64'),
  i: iv.toString('base64'),
  c: ct.toString('base64'),
  n: ITERATIONS,
});

let { head, tail } = shellFrom(TEMPLATE);
head = head
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(title)}</h1>`)
  .replace(/<p class="sub">[\s\S]*?<\/p>/, `<p class="sub">${esc(sub)}</p>`);
if (foot) {
  head = head.replace(/<div class="foot">[\s\S]*?<\/div>/, `<div class="foot">${esc(foot)}</div>`);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, head + payload + tail, 'utf8');

const kb = (n) => Math.round(n / 1024);
console.log(`encrypted ${kb(plaintext.length)}KB -> ${out} (${kb(ct.length)}KB ciphertext, ${ITERATIONS} iters)`);
