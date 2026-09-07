import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(path.resolve(process.env.PLAYWRIGHT_MODULE)).href
  : "playwright";
const { chromium } = await import(playwrightModule);

const baseUrl = process.env.PI_CAMPAIGN_BASE_URL || "http://127.0.0.1:8766";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true
});

const campaigns = [
  { slug: "peninsula-insider-spring-2026", emailRoot: "#email-studio", firstSubject: "One show before lunch", assets: 22 },
  { slug: "peninsula-insider-october-2026", emailRoot: "#emails", firstSubject: "One more hour. Three ways to use it.", assets: 20 }
];

for (const campaign of campaigns) {
  for (const viewport of [{ name: "desktop", width: 1365, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => sessionStorage.setItem("optiflows_authed", "1"));
    await page.route("https://hooks.optiflows.com.au/buffer/v1/**", async (route) => {
      if (route.request().method() !== "GET") {
        await route.abort("blockedbyclient");
        return;
      }
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: { ...response.headers(), "access-control-allow-origin": "*" }
      });
    });
    await page.goto(`${baseUrl}/campaigns/${campaign.slug}/`, { waitUntil: "domcontentloaded" });
    await page.locator(`${campaign.emailRoot} .pcs-email-studio`).waitFor();

    const tabs = await page.locator(`${campaign.emailRoot} [data-pcs-email-tab]`).count();
    const emails = await page.locator(`${campaign.emailRoot} [data-pcs-email]`).count();
    const assets = await page.locator("#production-copy .pcs-asset-copy").count();
    const activeEmails = await page.locator(`${campaign.emailRoot} [data-pcs-email].is-active`).count();
    if (tabs !== 4 || emails !== 4 || assets !== campaign.assets || activeEmails !== 1) {
      throw new Error(`${campaign.slug}/${viewport.name}: unexpected counts ${tabs}/${emails}/${assets}/${activeEmails}`);
    }
    const subject = await page.locator(`${campaign.emailRoot} .pcs-email-issue.is-active .pcs-email-spec h3`).textContent();
    if (subject.trim() !== campaign.firstSubject) throw new Error(`${campaign.slug}: first subject mismatch`);
    const heroLoaded = await page.locator(`${campaign.emailRoot} .pcs-email-issue.is-active .pcs-email-hero`).evaluate((image) => image.complete && image.naturalWidth > 0);
    if (!heroLoaded) throw new Error(`${campaign.slug}: email hero did not load`);

    await page.locator(`${campaign.emailRoot} [data-pcs-email-tab]`).nth(1).click();
    await page.locator(`${campaign.emailRoot} [data-pcs-email="${campaign.slug.includes("spring") ? "S2-EML" : "W2-EML"}"].is-active`).waitFor();
    if (viewport.name === "desktop") {
      await page.locator(`${campaign.emailRoot} [data-pcs-device="mobile"]`).click();
      await page.waitForTimeout(300);
      const mobileFrameWidth = await page.locator(`${campaign.emailRoot} .pcs-email-issue.is-active .pcs-email-frame`).evaluate((frame) => frame.getBoundingClientRect().width);
      if (mobileFrameWidth > 394) throw new Error(`${campaign.slug}: mobile email preview is too wide (${mobileFrameWidth}px)`);
      await page.locator(`${campaign.emailRoot} [data-pcs-device="desktop"]`).click();
    }
    await page.locator("#production-copy .pcs-asset-copy").first().click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) throw new Error(`${campaign.slug}/${viewport.name}: horizontal overflow`);
    if (errors.length) throw new Error(`${campaign.slug}/${viewport.name}: ${errors.join(" | ")}`);

    await page.locator(campaign.emailRoot).screenshot({ path: `C:/Users/James/AppData/Local/Temp/${campaign.slug}-email-studio-${viewport.name}.png` });
    await page.close();
  }
  console.log(`${campaign.slug}: desktop and mobile email/copy UI passed`);
}

for (const viewport of [{ name: "desktop", width: 1365, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem("optiflows_authed", "1"));
  await page.goto(`${baseUrl}/campaigns/`, { waitUntil: "domcontentloaded" });
  const campaignCards = await page.locator(".campaign-card").count();
  const emailTotal = await page.locator(".hero__status").getByText("10", { exact: true }).count();
  const emailDesignLinks = await page.locator('a[href*="peninsula-insider-"]').count();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (campaignCards !== 3 || emailTotal !== 1 || emailDesignLinks < 4 || overflow || errors.length) {
    throw new Error(`campaign index/${viewport.name}: cards=${campaignCards}, emailTotal=${emailTotal}, links=${emailDesignLinks}, overflow=${overflow}, errors=${errors.join(" | ")}`);
  }
  await page.close();
}
console.log("campaign-index: desktop and mobile passed");

console.log("pi_campaign_ui_verification=pass buffer_mutation=blocked");
await browser.close();
