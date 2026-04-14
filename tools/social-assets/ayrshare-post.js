import fs from 'node:fs/promises';
import path from 'node:path';
import { createAyrshareClient } from './lib/ayrshare-client.js';

const args = parseArgs(process.argv.slice(2));

if (!args.input) {
  console.error('Usage: node tools/social-assets/ayrshare-post.js --input <manifest-or-payload.json> [--dry-run]');
  process.exit(1);
}

const rootDir = process.cwd();
const absInput = path.resolve(rootDir, args.input);
const raw = JSON.parse(await fs.readFile(absInput, 'utf8'));
const payload = await buildAyrsharePayload(raw, path.dirname(absInput));

if (args.dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const client = createAyrshareClient();
const response = await client.post('/post', payload);
console.log(JSON.stringify(response, null, 2));

async function buildAyrsharePayload(input, inputDir) {
  if (input.platforms && input.post) return input;

  const slideFiles = Array.isArray(input.outputs)
    ? input.outputs
        .map((entry) => entry.file)
        .filter(Boolean)
        .map((file) => path.resolve(inputDir, file))
    : [];

  const existingSlideFiles = [];
  for (const file of slideFiles) {
    try {
      await fs.access(file);
      existingSlideFiles.push(file);
    } catch {
      // skip missing
    }
  }

  if (!existingSlideFiles.length) {
    throw new Error('No render outputs found. Pass an Ayrshare payload JSON or a manifest.json with rendered slide files.');
  }

  const baseMediaUrl = process.env.OPTIFLOWS_PUBLIC_MEDIA_BASE_URL;
  if (!baseMediaUrl) {
    throw new Error('Missing OPTIFLOWS_PUBLIC_MEDIA_BASE_URL. Ayrshare needs public URLs for images/videos.');
  }

  const postText = process.env.AYRSHARE_DEFAULT_POST_TEXT || input.title || 'New Optiflows post';
  const platforms = splitCsv(process.env.AYRSHARE_DEFAULT_PLATFORMS || 'linkedin');

  return {
    post: postText,
    platforms,
    mediaUrls: existingSlideFiles.map((file) => `${baseMediaUrl.replace(/\/$/, '')}/${path.basename(file)}`),
  };
}

function splitCsv(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--input') out.input = argv[++i];
    if (token === '--dry-run') out.dryRun = true;
  }
  return out;
}
