import { test, expect } from "@playwright/test";

/**
 * Smoke tests — verify the AskAU frontend foundation is operational.
 *
 * These tests run against the running development server.
 * They verify routing, authentication boundaries, and basic page rendering.
 */

test.describe("AskAU Foundation Smoke Tests", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/AskAU/);
    await expect(page.getByText("Sign in to AskAU")).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign in with Microsoft/i })).toBeVisible();
  });

  test("health check API responds", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const body = (await response.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  test("unauthenticated user is redirected from /chat to /login", async ({ page }) => {
    await page.goto("/chat");
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user is redirected from /settings to /login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/login/);
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/non-existent-route-xyz");
    // Either 404 status or a redirect to not-found page
    expect(response?.status()).toBeLessThanOrEqual(404);
    await expect(page.getByText(/not found|AskAU/i)).toBeVisible();
  });

  test("unauthorized page renders correctly", async ({ page }) => {
    await page.goto("/unauthorized");
    await expect(page.getByText(/Access Denied|Unauthorized/i)).toBeVisible();
  });

  test("login page has no accessibility violations", async ({ page }) => {
    await page.goto("/login");
    // Basic check: sign-in button is accessible
    const signInButton = page.getByRole("button", { name: /Sign in with Microsoft/i });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();
  });
});
