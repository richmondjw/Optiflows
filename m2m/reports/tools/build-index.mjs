#!/usr/bin/env node
/**
 * Build /m2m/reports/index.html from tools/reports.json.
 *
 * The library index was previously hand-edited HTML, which is why the Lead
 * Performance Diagnostic sat published but unlisted for weeks. Adding a report
 * is now a JSON entry plus `node tools/build-index.mjs`.
 *
 * IDEMPOTENT BY CONSTRUCTION. The generated region is fenced by explicit
 * comment markers and every replacement is anchored to a marker that must be
 * found. An earlier version anchored the end of the table on the literal
 * `</table></div>`, which its own output did not contain — so a second run
 * silently duplicated the whole document (16 rows, two tables). Anything that
 * cannot be located now aborts instead of guessing.
 *
 * The header/logo block, prototype panel, note and footer are left untouched.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const here = resolve(process.argv[1], '..');
const INDEX = resolve(here, '../index.html');
const data = JSON.parse(readFileSync(resolve(here, 'reports.json'), 'utf8'));

const CSS_A = '<!-- BEGIN generated:styles -->';
const CSS_B = '<!-- END generated:styles -->';
const TBL_A = '<!-- BEGIN generated:table -->';
const TBL_B = '<!-- END generated:table -->';
const JS_A = '<!-- BEGIN generated:script -->';
const JS_B = '<!-- END generated:script -->';
const ROBOTS = '<meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex">';

const die = (m) => {
  console.error(`build-index: ${m}`);
  process.exit(1);
};

/** Replace a fenced region, or insert it at `fallbackAt` on first run. */
function fence(src, open, close, body, fallbackAt) {
  const i = src.indexOf(open);
  if (i !== -1) {
    const j = src.indexOf(close, i);
    if (j === -1) die(`found ${open} with no matching ${close}`);
    return src.slice(0, i) + open + body + close + src.slice(j + close.length);
  }
  const k = fallbackAt(src);
  if (k === -1 || k === undefined) die(`could not locate an insertion point for ${open}`);
  return src.slice(0, k) + open + body + close + src.slice(k);
}

const reports = [...data.reports].sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0));
const uniq = (k) => [...new Set(reports.map((r) => r[k]))];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const tagClass = (s) => (s === 'Current' ? 'cur' : s === 'Archive' ? 'arc' : 'int');

const rows = reports
  .map(
    (r) => `<tr data-section="${slug(r.section)}" data-bu="${slug(r.bu)}" data-status="${slug(r.status)}"
 data-search="${slug(`${r.title} ${r.purpose} ${r.audience} ${r.bu} ${r.section}`)}">
<td class="sc"><span class="sec sec-${slug(r.section)}">${r.section}</span></td>
<td class="dt"><span class="dlab">${r.date}</span></td>
<td class="tt"><a class="rt" href="${r.href}">${r.title}</a><div class="bu">${r.bu}</div></td>
<td class="pp">${r.purpose}</td>
<td class="au">${r.audience}</td>
<td class="st"><span class="tag ${tagClass(r.status)}">${r.status}</span></td></tr>`
  )
  .join('\n');

const chips = (label, key, values) => `
<div class="fgroup"><span class="flabel">${label}</span>
<button class="chip on" data-filter="${key}" data-value="">All</button>
${values.map((v) => `<button class="chip" data-filter="${key}" data-value="${slug(v)}">${v}</button>`).join('')}
</div>`;

// Filter chrome is only worth its space once the library is big enough to need
// it. Below this many reports the whole controls block is omitted — four rows
// of data under four rows of filters read as scaffolding, not as a library.
const CONTROLS_MIN_REPORTS = 8;
const showControls = reports.length >= CONTROLS_MIN_REPORTS;

// Denser than the original build: row padding 20px -> 11px, body copy
// 13.5px -> 12px, title 16px -> 14px. Roughly doubles what fits above the fold.
const css = `
.controls{display:flex;flex-wrap:wrap;gap:14px 24px;align-items:center;margin-top:20px;padding:0 0 16px}
.fgroup{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.flabel{font-size:9.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:var(--g3);margin-right:2px}
.chip{font:inherit;font-size:11px;font-weight:600;color:var(--g4);background:#fff;border:1px solid var(--g2);
border-radius:11px;padding:3px 11px;cursor:pointer;transition:all .12s;white-space:nowrap}
.chip:hover{border-color:var(--teal);color:var(--teald)}
.chip.on{background:var(--tint);border-color:var(--tint);color:var(--teald)}
.search{margin-left:auto}
.search input{font:inherit;font-size:12px;padding:5px 11px;border:1px solid var(--g2);border-radius:3px;width:190px;color:var(--ink)}
.search input:focus{outline:2px solid var(--teal);outline-offset:1px;border-color:transparent}
thead th{padding:12px 12px 9px;font-size:9.5px}
td{padding:11px 12px;font-size:12px;line-height:1.5}
td.sc{width:104px}
.sec{font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--g3)}
td.dt{width:104px}
.dlab{font-size:11.5px;font-weight:600}
td.tt{width:238px}
.rt{font-size:14px}
.bu{font-size:9.5px;margin-top:4px;font-weight:600;color:var(--g3)}
td.pp{min-width:300px;font-size:12px}
td.au{width:172px;font-size:11.5px}
td.st{width:96px}
.tag{font-size:9px;padding:3px 7px}
tbody tr.hide{display:none}
.empty{padding:34px 12px;text-align:center;color:var(--g3);font-size:12.5px}
@media(max-width:720px){.search{margin-left:0;width:100%}.search input{width:100%}}
`;

const controls = showControls
  ? `<div class="controls">
${chips('Section', 'section', uniq('section'))}
${chips('Status', 'status', uniq('status'))}
${chips('Business unit', 'bu', uniq('bu'))}
<div class="search"><input type="search" id="q" placeholder="Search reports&hellip;" aria-label="Search reports"></div>
</div>`
  : '';

const table = `
<div class="tblhd"><span class="l">All reports</span><span class="r" id="rcount"></span></div>
${controls}
<div class="tw"><table>
<thead><tr><th>Section</th><th>Date</th><th>Title</th><th>Purpose</th><th>Audience</th><th>Status</th></tr></thead>
<tbody>
${rows}
</tbody></table>
<div class="empty" id="empty" style="display:none">No reports match those filters.</div></div>
`;

const script = `
<script>
(function(){
 var f={section:'',status:'',bu:''},q='';
 var rows=[].slice.call(document.querySelectorAll('tbody tr'));
 var count=document.getElementById('rcount'), empty=document.getElementById('empty');
 function apply(){
  var shown=0;
  rows.forEach(function(r){
   var ok=(!f.section||r.dataset.section===f.section)
        &&(!f.status||r.dataset.status===f.status)
        &&(!f.bu||r.dataset.bu===f.bu)
        &&(!q||r.dataset.search.indexOf(q)>-1);
   r.classList.toggle('hide',!ok); if(ok)shown++;
  });
  count.textContent=shown+(shown===1?' report':' reports')+(shown===rows.length?' \\u00b7 newest first':' of '+rows.length);
  empty.style.display=shown?'none':'';
 }
 document.querySelectorAll('.chip').forEach(function(b){
  b.addEventListener('click',function(){
   var k=b.dataset.filter;
   document.querySelectorAll('.chip[data-filter="'+k+'"]').forEach(function(o){o.classList.remove('on')});
   b.classList.add('on'); f[k]=b.dataset.value; apply();
  });
 });
 var qi=document.getElementById('q');
 if(qi)qi.addEventListener('input',function(e){
  q=e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); apply();
 });
 apply();
})();
</script>
`;

let out = readFileSync(INDEX, 'utf8');

// 1. styles — first run inserts immediately before the closing </style>
out = fence(out, CSS_A, CSS_B, css, (s) => s.indexOf('</style>'));

// 2. table — first run replaces the legacy hand-written block wholesale
if (out.indexOf(TBL_A) === -1) {
  const a = out.indexOf('<div class="tblhd">');
  const b = out.indexOf('</table></div>');
  if (a === -1 || b === -1) die('legacy table block not found for first-run replacement');
  out = out.slice(0, a) + TBL_A + table + TBL_B + out.slice(b + '</table></div>'.length);
} else {
  out = fence(out, TBL_A, TBL_B, table, () => -1);
}

// 3. behaviour script — first run inserts just before </body>
out = fence(out, JS_A, JS_B, script, (s) => s.indexOf('</body>'));

// 4. invariants that must hold whatever else changed
out = out.replace(/<meta name="robots"[^>]*>/i, ROBOTS);
out = out.replace(/Last updated [^&]*&middot;/, `Last updated ${data.updated} &middot;`);

const tables = (out.match(/<table/g) || []).length;
const bodies = (out.match(/<tbody>/g) || []).length;
const trs = (out.match(/<tr data-section/g) || []).length;
if (tables !== 1 || bodies !== 1 || trs !== reports.length) {
  die(`refusing to write duplicated output — tables=${tables} tbody=${bodies} rows=${trs}, expected 1/1/${reports.length}`);
}
if (!out.includes(ROBOTS)) die('noindex directive missing');

writeFileSync(INDEX, out, 'utf8');
console.log(`built index: ${reports.length} reports, ${uniq('section').length} sections, 1 table`);
