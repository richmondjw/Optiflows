import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const campaigns = [
  {
    slug: "peninsula-insider-spring-2026",
    variable: "PI_SPRING_PRODUCTION",
    expectedAssets: 22
  },
  {
    slug: "peninsula-insider-october-2026",
    variable: "PI_OCTOBER_PRODUCTION",
    expectedAssets: 20
  }
];

function fail(message) {
  throw new Error(message);
}

function loadData(campaign) {
  const filename = path.join(root, campaign.slug, "production-copy.js");
  const source = fs.readFileSync(filename, "utf8");
  if (source.includes("—")) fail(`${campaign.slug}: new production copy contains an em dash`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}\nthis.__campaignData = ${campaign.variable};`, context, { filename });
  return context.__campaignData;
}

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`Missing ${label}`);
}

for (const campaign of campaigns) {
  const data = loadData(campaign);
  if (!data || !Array.isArray(data.issues) || data.issues.length !== 4) {
    fail(`${campaign.slug}: expected four issues`);
  }

  const assetIds = new Set();
  let assetCount = 0;
  for (const issue of data.issues) {
    for (const key of ["id", "shortTitle", "label", "title", "date", "hero", "heroAlt"]) {
      requireText(issue[key], `${campaign.slug} ${issue.id || "issue"}.${key}`);
    }
    if (!fs.existsSync(path.join(root, campaign.slug, issue.hero))) {
      fail(`${campaign.slug}: missing email hero ${issue.hero}`);
    }

    const email = issue.email;
    for (const key of ["subject", "preheader", "kicker", "heading", "intro", "button", "destination", "footer", "audience", "sender", "gate"]) {
      requireText(email[key], `${campaign.slug} ${issue.id}.email.${key}`);
    }
    if ((!email.paragraphs || !email.paragraphs.length) && (!email.bullets || !email.bullets.length)) {
      fail(`${campaign.slug}: ${issue.id} has no complete email body`);
    }
    if (!Array.isArray(issue.assets) || issue.assets.length < 5) {
      fail(`${campaign.slug}: ${issue.id} expected at least five channel jobs`);
    }

    for (const asset of issue.assets) {
      assetCount += 1;
      if (assetIds.has(asset.id)) fail(`${campaign.slug}: duplicate asset id ${asset.id}`);
      assetIds.add(asset.id);
      for (const key of ["id", "channel", "format", "state", "gate"]) {
        requireText(asset[key], `${campaign.slug} asset.${key}`);
      }
      if (!Array.isArray(asset.fields) || asset.fields.length < 3) {
        fail(`${campaign.slug}: ${asset.id} needs at least three complete copy fields`);
      }
      for (const field of asset.fields) {
        requireText(field.label, `${campaign.slug} ${asset.id}.field.label`);
        requireText(field.text, `${campaign.slug} ${asset.id}.${field.label}`);
      }
    }
  }

  if (assetCount !== campaign.expectedAssets) {
    fail(`${campaign.slug}: expected ${campaign.expectedAssets} copy-complete jobs, found ${assetCount}`);
  }

  const html = fs.readFileSync(path.join(root, campaign.slug, "index.html"), "utf8");
  for (const marker of ["pi-copy-studio.css", "pi-copy-studio.js", "production-copy.js", "PICopyStudio.mount"]) {
    if (!html.includes(marker)) fail(`${campaign.slug}: page missing ${marker}`);
  }
  console.log(`${campaign.slug}: 4 emails and ${assetCount} complete asset copy sets`);
}

console.log("pi_campaign_copy_verification=pass");
