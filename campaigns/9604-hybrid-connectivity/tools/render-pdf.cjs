const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "\\\\wsl.localhost\\Ubuntu\\home\\james\\openclaw\\workspace\\Optiflows-homepage-deploy\\node_modules\\playwright",
);

const [url, outputPath] = process.argv.slice(2);
if (!url || !outputPath) {
  console.error("Usage: node render-pdf.cjs <url> <output.pdf>");
  process.exit(2);
}

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ executablePath: chromePath, headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((item) =>
          item.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                item.onload = resolve;
                item.onerror = resolve;
              }),
        ),
      );
    });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`Rendered ${outputPath}`);
  } finally {
    if (browser) await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
