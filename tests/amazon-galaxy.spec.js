const { test } = require('@playwright/test');

test('Search Samsung Galaxy and add to cart', async ({ page }) => {

  await page.goto('https://www.amazon.in');

  await page.fill('#twotabsearchtextbox', 'Samsung Galaxy');
  await page.press('#twotabsearchtextbox', 'Enter');

  const products = page.locator('[data-component-type="s-search-result"]');
  await products.first().waitFor();

  const product = products.first();

  const price = await product.locator('.a-price .a-offscreen').first().textContent();
  console.log('Galaxy Price:', price);

  const addBtn = product.locator(
    'button[name="submit.addToCart"], button:has-text("Add to cart")'
  );

  if (await addBtn.count() > 0) {
    await addBtn.first().click();
  } else {
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