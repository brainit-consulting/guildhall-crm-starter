import { expect, test } from "@playwright/test";

test("the welcome page shows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Guildhall" })).toBeVisible();
});

test("sign-up and sign-in work on the built-in database, on this copy's own port", async ({ request, baseURL }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const headers = { origin: baseURL! }; // as a browser on this page would send
  const up = await request.post("/api/auth/sign-up/email", { headers, data: { name: "E2E", email, password: "correct horse" } });
  expect(up.status()).toBe(200);
  const inRes = await request.post("/api/auth/sign-in/email", { headers, data: { email, password: "correct horse" } });
  expect(inRes.status()).toBe(200);
});
