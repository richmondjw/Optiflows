const fs = require("fs");
const path = require("path");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright",
);

const [url, outputDirectory] = process.argv.slice(2);
if (!url || !outputDirectory) process.exit(2);
fs.mkdirSync(outputDirectory, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const report = { url, checkedAt: new Date().toISOString(), viewports: {}, failures: [] };
  try {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile-390", width: 390, height: 844 },
    ]) {
      const page = await browser.newPage({ viewport });
      const pageErrors = [];
      const badResponses = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (response) => {
        if (response.status() >= 400 && !response.url().endsWith("/gate.js") && !response.url().endsWith("/favicon.ico")) {
          badResponses.push(`${response.status()} ${response.url()}`);
        }
      });
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(1000);
      const state = await page.evaluate(() => ({
        cardCount: document.querySelectorAll(".campaign-card").length,
        hybridCardCount: [...document.querySelectorAll(".campaign-card")].filter((card) => card.textContent.includes("Coverage beyond")).length,
        hybridLink: document.querySelector('a[href="./9604-hybrid-connectivity/"]')?.href,
        brokenImages: [...document.images].filter((item) => item.complete && !item.naturalWidth).map((item) => item.src),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      }));
      await page.screenshot({ path: path.join(outputDirectory, `${viewport.name}-campaign-index.png`), fullPage: true });
      report.viewports[viewport.name] = { httpStatus: response?.status(), ...state, pageErrors, badResponses };
      if (response?.status() !== 200) report.failures.push(`${viewport.name}: HTTP ${response?.status()}`);
      if (state.cardCount !== 4) report.failures.push(`${viewport.name}: expected 4 cards, observed ${state.cardCount}`);
      if (state.hybridCardCount !== 1 || !state.hybridLink) report.failures.push(`${viewport.name}: Hybrid IoT card/link missing`);
      if (state.horizontalOverflow) report.failures.push(`${viewport.name}: horizontal overflow`);
      if (state.brokenImages.length) report.failures.push(`${viewport.name}: broken images`);
      report.failures.push(...pageErrors.map((item) => `${viewport.name}: ${item}`));
      report.failures.push(...badResponses.map((item) => `${viewport.name}: ${item}`));
      await page.close();
    }
  } finally {
    await browser.close();
  }
  report.result = report.failures.length ? "FAIL" : "PASS";
  fs.writeFileSync(path.join(outputDirectory, "campaign-index-qa.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.result}: ${report.failures.length} issue(s)`);
  if (report.failures.length) {
    console.log(report.failures.join("\n"));
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
