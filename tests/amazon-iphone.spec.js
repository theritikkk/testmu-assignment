const { test } = require('@playwright/test');

test('Search iPhone and add to cart', async ({ page }) => {

  await page.goto('https://www.amazon.in');

  await page.fill('#twotabsearchtextbox', 'iPhone');
  await page.press('#twotabsearchtextbox', 'Enter');

  const products = page.locator('[data-component-type="s-search-result"]');
  await products.first().waitFor();

  const product = products.first();

  // ✅ Price (safe selector)
  const price = await product.locator('.a-price .a-offscreen').first().textContent();
  console.log('iPhone Price:', price);

  // ✅ Try add-to-cart directly
  const addBtn = product.locator(
    'button[name="submit.addToCart"], button:has-text("Add to cart")'
  );

  if (await addBtn.count() > 0) {
    console.log('Direct add to cart');
    await addBtn.first().click();
  } else {
    console.log('Opening product page');

    const link = product.locator('h2 a').first();

    const [newPage] = await Promise.all([
      page.context().waitForEvent('page').catch(() => null),
      link.click({ force: true })
    ]);

    const target = newPage || page;

    await target.waitForLoadState('domcontentloaded');

    await target.locator('#attachSiNoCoverage').click().catch(() => {});

    await target.waitForSelector('#add-to-cart-button');
    await target.click('#add-to-cart-button');
  }

});