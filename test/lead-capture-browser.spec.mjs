import { test, expect } from 'playwright/test';

const surfaces = [
  { path: '/', form: '#leadForm', open: '[data-cta-location="hero"]', success: '#formSuccess' },
  { path: '/blog/', form: '#leadForm', open: '#leadStep1 .IntentCard', success: '#leadStep3.active' },
  { path: '/growth.html', form: '#leadForm', open: '#leadStep1 .IntentCard', success: '#leadStep3.active', gated: true },
  { path: '/v4/', form: '#leadForm', open: '#leadStep1 .IntentCard', success: '#leadStep3.active', gated: true }
];

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  for (const surface of surfaces) {
    test(`${viewport.name} ${surface.path} stores before showing success`, async ({ page }) => {
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.setViewportSize(viewport);
      await page.route('**/api/leads', route => route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ accepted: true, id: 'synthetic-record-id', stored: true, duplicate: false }) }));
      await page.goto(`http://127.0.0.1:8765${surface.path}`);
      if (surface.gated) {
        await page.evaluate(() => sessionStorage.setItem('optiflows_authed', '1'));
        await page.reload();
      }
      await page.locator(surface.open).first().click();
      const form = page.locator(surface.form);
      await expect(form).toBeVisible();
      await form.locator('[name="full_name"]').fill('Synthetic lead');
      await form.locator('[name="email"]').fill('synthetic@example.test');
      await form.locator('[name="company_name"]').fill('Synthetic organisation');
      await form.locator('button[type="submit"]').click();
      await page.waitForTimeout(100);
      expect(pageErrors).toEqual([]);
      await expect(page.locator(surface.success)).toBeVisible();
    });
  }
}
