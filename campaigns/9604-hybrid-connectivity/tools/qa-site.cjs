const fs = require("fs");
const path = require("path");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright",
);

const [url, outputDirectory] = process.argv.slice(2);
if (!url || !outputDirectory) {
  console.error("Usage: node qa-site.cjs <url> <output-directory>");
  process.exit(2);
}
fs.mkdirSync(outputDirectory, { recursive: true });

const expected = {
  calendarRows: 37,
  creativeCards: 12,
  carouselSets: 5,
  carouselSlides: 25,
  websiteCards: 4,
  emailCards: 8,
  evidenceCards: 5,
  gateCards: 6,
  motionVideos: 2,
};

(async () => {
  const browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const results = { url, checkedAt: new Date().toISOString(), expected, viewports: {} };
  try {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "mobile-320", width: 320, height: 720 },
    ]) {
      const page = await browser.newPage({ viewport });
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      const badResponses = [];
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          !message.text().includes("gate.js") &&
          !message.text().startsWith("Failed to load resource: the server responded with a status of 404")
        ) {
          consoleErrors.push(message.text());
        }
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (item) => {
        if (
          item.status() >= 400 &&
          !item.url().endsWith("/gate.js") &&
          !item.url().endsWith("/favicon.ico")
        ) {
          badResponses.push(`${item.status()} ${item.url()}`);
        }
      });
      page.on("requestfailed", (request) => {
        const benignMediaAbort =
          request.resourceType() === "media" && request.failure()?.errorText === "net::ERR_ABORTED";
        if (!request.url().endsWith("/gate.js") && !benignMediaAbort) {
          failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText}`);
        }
      });
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.evaluate(() => {
        document.querySelectorAll('img[loading="lazy"]').forEach((item) => {
          item.loading = "eager";
        });
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.race([
          Promise.all(
            [...document.images].map((item) =>
              item.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                    item.onload = resolve;
                    item.onerror = resolve;
                  }),
            ),
          ),
          new Promise((resolve) => setTimeout(resolve, 15_000)),
        ]);
      });
      await page.waitForTimeout(500);

      const state = await page.evaluate(() => ({
        title: document.title,
        status: document.querySelector(".hero-card .status")?.textContent?.trim(),
        bodyText: document.body.innerText,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        brokenImages: [...document.images]
          .filter((item) => !item.complete || item.naturalWidth === 0)
          .map((item) => item.getAttribute("src")),
        brokenVideos: [...document.querySelectorAll("video")]
          .filter((item) => item.error || item.readyState === 0)
          .map((item) => item.getAttribute("src")),
        counts: {
          calendarRows: document.querySelectorAll("#calendar-grid .cal-row").length,
          creativeCards: document.querySelectorAll("#creative-grid .creative-card").length,
          carouselSets: document.querySelectorAll("#carousel-gallery .carousel-set").length,
          carouselSlides: document.querySelectorAll("#carousel-gallery img").length,
          websiteCards: document.querySelectorAll("#website-grid .website-card").length,
          emailCards: document.querySelectorAll("#email-grid .email-card").length,
          evidenceCards: document.querySelectorAll("#evidence-grid .evidence-card").length,
          gateCards: document.querySelectorAll("#gate-grid .gate-card").length,
          motionVideos: document.querySelectorAll(".motion-grid video").length,
        },
      }));
      const mismatches = Object.entries(expected)
        .filter(([key, count]) => state.counts[key] !== count)
        .map(([key, count]) => `${key}: expected ${count}, observed ${state.counts[key]}`);
      const requiredText = [
        "Production complete",
        "The campaign is not activated",
        "Cellular where you can. Satellite where you must.",
      ];
      const missingText = requiredText.filter((text) => !state.bodyText.includes(text));

      await page.screenshot({ path: path.join(outputDirectory, `${viewport.name}-hero.png`) });
      await page.locator("#calendar").screenshot({ path: path.join(outputDirectory, `${viewport.name}-calendar.png`) });
      await page.locator("#creative .creative-card").first().screenshot({ path: path.join(outputDirectory, `${viewport.name}-creative.png`) });
      await page.locator("#emails .email-card").first().screenshot({ path: path.join(outputDirectory, `${viewport.name}-email.png`) });

      await page.locator(".show-copy").first().click();
      const socialDialogText = await page.locator("#copy-dialog").innerText();
      await page.locator(".dialog-close").click();
      await page.locator(".show-email").first().click();
      const emailDialogText = await page.locator("#copy-dialog").innerText();
      await page.locator(".dialog-close").click();

      let zoomOverflow = null;
      if (viewport.name === "desktop") {
        await page.setViewportSize({ width: 720, height: 500 });
        zoomOverflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
      }
      results.viewports[viewport.name] = {
        httpStatus: response?.status(),
        title: state.title,
        statusLabel: state.status,
        counts: state.counts,
        countMismatches: mismatches,
        missingText,
        horizontalOverflow: state.scrollWidth > state.clientWidth + 1,
        zoom200HorizontalOverflow:
          zoomOverflow && zoomOverflow.scrollWidth > zoomOverflow.clientWidth + 1,
        brokenImages: state.brokenImages,
        brokenVideos: state.brokenVideos,
        socialDialogHasFullCopy:
          socialDialogText.includes("LinkedIn caption") && socialDialogText.length > 500,
        emailDialogHasFullCopy:
          emailDialogText.includes("Preheader:") && emailDialogText.length > 400,
        consoleErrors,
        pageErrors,
        failedRequests,
        badResponses,
      };
      await page.close();
    }
  } finally {
    await browser.close();
  }

  const failures = [];
  for (const [name, result] of Object.entries(results.viewports)) {
    if (result.httpStatus !== 200) failures.push(`${name}: HTTP ${result.httpStatus}`);
    failures.push(...result.countMismatches.map((value) => `${name}: ${value}`));
    failures.push(...result.missingText.map((value) => `${name}: missing text ${value}`));
    if (result.horizontalOverflow) failures.push(`${name}: horizontal overflow`);
    if (result.zoom200HorizontalOverflow) failures.push(`${name}: horizontal overflow at 200% zoom`);
    if (result.brokenImages.length) failures.push(`${name}: broken images ${result.brokenImages.join(", ")}`);
    if (result.brokenVideos.length) failures.push(`${name}: broken videos ${result.brokenVideos.join(", ")}`);
    if (!result.socialDialogHasFullCopy) failures.push(`${name}: social copy dialog incomplete`);
    if (!result.emailDialogHasFullCopy) failures.push(`${name}: email copy dialog incomplete`);
    failures.push(...result.consoleErrors.map((value) => `${name}: console ${value}`));
    failures.push(...result.pageErrors.map((value) => `${name}: page ${value}`));
    failures.push(...result.failedRequests.map((value) => `${name}: request ${value}`));
    failures.push(...result.badResponses.map((value) => `${name}: response ${value}`));
  }
  results.failures = failures;
  results.result = failures.length ? "FAIL" : "PASS";
  const output = path.join(outputDirectory, "site-qa.json");
  fs.writeFileSync(output, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`${results.result}: ${failures.length} issue(s)`);
  console.log(output);
  if (failures.length) {
    console.log(failures.join("\n"));
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
