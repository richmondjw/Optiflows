#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith('--'));
const execute = args.includes('--execute');
const confirmed = args.includes('--confirm');
if (!input) {
  console.error('Usage: node tools/campaign-brief-higgsfield.cjs <campaign-pack.json> [--dry-run] [--execute --confirm]');
  process.exit(1);
}
if (execute && !confirmed) {
  console.error('Execution is gated. Add --confirm only after reviewing the pack and accepting provider usage.');
  process.exit(2);
}
const pack = JSON.parse(fs.readFileSync(input, 'utf8'));
const jobs = (pack.higgsfieldJobs || []).filter((job) => job.provider === 'Higgsfield');
if (!jobs.length) { console.log('No Higgsfield jobs in this pack.'); process.exit(0); }

for (const job of jobs) {
  const command = ['generate', 'create', job.jobType || 'gpt_image_2', '--prompt', job.prompt, '--aspect_ratio', '16:9', '--resolution', '2k', '--wait', '--json'];
  console.log(`${execute ? 'RUN' : 'DRY-RUN'} ${job.id} (${job.branch})`);
  console.log(`higgsfield ${command.map((part) => /\s/.test(part) ? JSON.stringify(part) : part).join(' ')}`);
  if (execute) {
    const result = spawnSync('higgsfield', command, { stdio: 'inherit', shell: process.platform === 'win32' });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
if (!execute) console.log('\nNo jobs were submitted. Review the commands, then rerun with --execute --confirm.');
