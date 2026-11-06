const { test, expect } = require('@playwright/test');

const preview = '/preview-3/';

async function dismissConsent(page) {
  const refuse = page.locator('[data-consent="refuse"]');
  if (await refuse.isVisible()) await refuse.click();
}

async function fillProject(page) {
  await page.locator('input[name=contactName]').fill('Validation locale');
  await page.locator('input[name=company]').fill('Validation');
  await page.locator('input[name=email]').fill('validation@example.invalid');
  await page.locator('select[name=projectType]').selectOption({ index: 1 });
  await page.locator('select[name=budget]').selectOption({ index: 5 });
  await page.locator('select[name=desiredDate]').selectOption({ index: 4 });
  await page.locator('textarea[name=needs]').fill('Test technique sans prospect réel.');
  await page.locator('.aurelis-consent input').check({ force: true });
}

test('legacy routes, SEO and preview safety are preserved', async ({ request }) => {
  for (const route of ['/', '/offres/', '/en/', '/en/offers/', '/mentions-legales/', '/politique-confidentialite/', '/creation-site-internet/', '/creation-site-web-entreprise/', '/creation-site-premium/', '/refonte-site-web/', '/realisations/mr-gaston/', '/en/work/mr-gaston/', '/site-classique/', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(route)).status(), route).toBe(200);
  }
  const home = await (await request.get('/')).text();
  expect(home).toContain('canonical" href="https://aurelis.ink/');
  expect(home).toContain('offerAssistant');
  const page = await (await request.get(preview)).text();
  expect(page).toContain('noindex, nofollow');
  expect(page).toContain('Mr Gaston');
  expect(page).toContain('Bryan Burger');
  expect(page).toContain('Trans Delivery');
  expect((await request.get('/api/leads')).status()).toBe(405);
  const blocked = await request.post('/api/leads', { data: { email: 'validation@example.invalid' } });
  expect(blocked.status()).toBe(503);
  expect((await blocked.json()).integration).toBe('preview-disabled');
});

test('desktop keeps cinematic scenes, magnetic interaction, portfolio and offer selection', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(preview);
  await dismissConsent(page);
  await expect(page.locator('.aurelis-filament')).toHaveCount(4);
  await expect(page.locator('.pin-spacer')).toHaveCount(7);
  await expect(page.locator('.aurelis-territory-card')).toHaveCount(3);
  await expect(page.locator('.aurelis-real-work-card')).toHaveCount(3);
  await expect(page.locator('.aurelis-offer-price strong')).toHaveText(['990 €', '2 490 €', '4 490 €', '7 490 €']);
  const filament = page.locator('.aurelis-filament--intro');
  const initial = await filament.evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect.poll(() => filament.evaluate((el) => getComputedStyle(el).transform)).not.toBe(initial);
  const button = page.locator('.aurelis-hero-actions .aurelis-magnetic');
  await button.scrollIntoViewIfNeeded();
  await button.hover({ position: { x: 10, y: 10 } });
  await expect.poll(() => button.evaluate((el) => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).e))).toBeGreaterThan(.2);
  await page.locator('.aurelis-offer-card').nth(2).getByRole('link', { name: 'Parler de cette formule' }).click();
  await expect(page.locator('input[name="offer-choice"][value="Aurelis Prestige"]')).toBeChecked();
  expect(errors).toEqual([]);
});

test('mobile navigation, reduced motion and responsive widths', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(preview);
  await dismissConsent(page);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.locator('.aurelis-menu-toggle').tap();
  await expect(page.locator('.aurelis-menu-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.aurelis-nav')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('link', { name: 'Réalisations', exact: true })).toBeVisible();
  const menuCoversIntro = await page.evaluate(() => {
    const prelude = document.querySelector('.aurelis-cinema-prelude');
    const rect = prelude.getBoundingClientRect();
    const point = document.elementFromPoint(rect.left + 12, Math.min(rect.bottom - 4, rect.top + rect.height / 2));
    return Boolean(point && point.closest('.aurelis-nav'));
  });
  expect(menuCoversIntro).toBe(true);
  await page.locator('.aurelis-menu-toggle').tap();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.aurelis-cinematic-target')).toHaveCount(0);
  await expect(page.locator('.aurelis-progress')).toBeHidden();
  for (const width of [320, 360, 390, 720, 721, 768, 900, 980, 981, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), `width ${width}`).toBe(true);
  }
  expect(errors).toEqual([]);
  await context.close();
});

test('transition, gallery and intelligence animate and resize cleanly', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(preview);
  await expect(page.locator('.pin-spacer')).toHaveCount(7);
  for (const scene of [
    { trigger: '.aurelis-transition-scene', target: '.aurelis-transition-shape', distance: 450 },
    { trigger: '.aurelis-portfolio-stage', target: '.aurelis-territory-card:first-child .aurelis-territory-artwork', distance: 650 },
    { trigger: '.aurelis-intelligence', target: '.aurelis-intelligence-lines', distance: 700 },
  ]) {
    const target = page.locator(scene.target);
    const before = await target.evaluate((el) => getComputedStyle(el).transform);
    const top = await page.locator(scene.trigger).evaluate((el) => el.getBoundingClientRect().top + scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), top + scene.distance);
    await expect.poll(() => target.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.aurelis-cinematic-target')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.pin-spacer')).toHaveCount(7);
});

test('project form blocks preview delivery; retries use the same key and only a stored lead succeeds', async ({ page }) => {
  await page.goto(preview);
  await dismissConsent(page);
  await fillProject(page);
  await page.locator('.aurelis-submit').click();
  await expect(page.locator('.aurelis-form-message')).toContainText('Prévisualisation');
  const sent = [];
  await page.route('**/api/leads', async (route) => {
    sent.push({ body: route.request().postDataJSON(), key: route.request().headers()['x-idempotency-key'] });
    if (sent.length === 1) return route.fulfill({ status: 200, json: { ok: true, accepted: false, id: 'unconfirmed-id' } });
    if (sent.length === 2) return route.fulfill({ status: 200, json: { ok: true, accepted: true, id: '00000000-0000-4000-8000-000000000000' } });
    return route.fulfill({ status: 200, json: { ok: true, accepted: true, id: 'mock-id', duplicate: false, message: 'Demande test enregistrée' } });
  });
  await page.locator('.aurelis-submit').click();
  await expect(page.locator('.aurelis-form-message')).toContainText('n’a pas pu être enregistrée');
  await page.locator('.aurelis-submit').click();
  await expect(page.locator('.aurelis-form-message')).toContainText('n’a pas pu être enregistrée');
  await page.locator('.aurelis-submit').click();
  await expect(page.locator('.aurelis-form-message')).toHaveText('Demande test enregistrée');
  expect(sent).toHaveLength(3);
  expect(sent[0].key).toBe(sent[1].key);
  expect(sent[1].key).toBe(sent[2].key);
  expect(sent[0].body.idempotencyKey).toBe(sent[0].key);
  expect(sent[0].body.consent).toBe(true);
  expect(sent[0].body.offer).toBe('Aurelis Signature');
});

test('a duplicate confirms the request without counting another conversion', async ({ page }) => {
  await page.goto(preview);
  await dismissConsent(page);
  await page.evaluate(() => {
    window.__conversionCount = 0;
    window.AurelisAnalytics.formSuccess = () => { window.__conversionCount += 1; };
  });
  await page.route('**/api/leads', (route) => route.fulfill({ status: 200, json: { ok: true, accepted: true, id: 'mock-id', duplicate: true, message: 'Demande déjà enregistrée' } }));
  await fillProject(page);
  await page.locator('.aurelis-submit').click();
  await expect(page.locator('.aurelis-form-message')).toHaveText('Demande déjà enregistrée');
  expect(await page.evaluate(() => window.__conversionCount)).toBe(0);
});

test('existing free-audit modal uses the protected preview API', async ({ page }) => {
  await page.goto(preview);
  await dismissConsent(page);
  await page.locator('[data-audit-open]').click();
  await expect(page.locator('#leadModal')).toHaveClass(/is-open/);
  await page.locator('#leadName').fill('Test audit');
  await page.locator('#leadEmail').fill('audit@example.invalid');
  await page.locator('#leadNeeds').fill('https://example.invalid — test sans prospect réel');
  await page.locator('#leadConsent').check();
  await page.locator('#leadSubmit').click();
  await expect(page.locator('#leadFormError')).toContainText('Prévisualisation');
  await expect(page.locator('#leadSuccess')).toBeHidden();
});

test('prerendered content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(preview);
  await expect(page.locator('#realisations')).toContainText('Mr Gaston');
  await expect(page.locator('.aurelis-offer-card')).toHaveCount(4);
  await expect(page.locator('.aurelis-submit')).toBeDisabled();
  await context.close();
});
