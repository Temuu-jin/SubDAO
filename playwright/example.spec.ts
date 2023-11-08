import { expect, test } from '@playwright/test';

test('Go To Signup', async ({ page }) => {
  await page.goto('https://localhost:3000/');
  await page.getByTestId('link-signup').click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveURL('http://localhost:3000/signup');
});
