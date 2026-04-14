import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const args = parseArgs(process.argv.slice(2));
const input = args.input || 'tools/social-assets/output/optiflows-carousel/manifest.json';
const target = args.target;

await runNodeScript('tools/social-assets/publish-to-pages.js', buildArgs('--input', input, '--target', target));
await runNodeScript('tools/social-assets/ayrshare-post.js', buildArgs('--input', input, args.dryRun ? '--dry-run' : undefined));

async function runNodeScript(script, scriptArgs) {
  const filteredArgs = scriptArgs.filter(Boolean);
  const { stdout, stderr } = await execFile(process.execPath, [script, ...filteredArgs], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      OPTIFLOWS_PUBLIC_MEDIA_BASE_URL:
        process.env.OPTIFLOWS_PUBLIC_MEDIA_BASE_URL || inferPublicUrl(target),
    },
  });
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
}

function inferPublicUrl(targetPath) {
  const base = process.env.OPTIFLOWS_SITE_BASE_URL || 'https://www.optiflows.com.au';
  const targetDir = (targetPath || 'social-assets/optiflows-operating-system-carousel').replace(/^\/+|\/+$/g, '');
  return `${base.replace(/\/$/, '')}/${targetDir}`;
}

function buildArgs(...items) {
  return items.filter(Boolean);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--input') out.input = argv[++i];
    if (token === '--target') out.target = argv[++i];
    if (token === '--dry-run') out.dryRun = true;
  }
  return out;
}
