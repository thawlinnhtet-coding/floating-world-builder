import { test, expect } from "@playwright/test";
import { ready, restore, fixture, object, cell, backup } from "./helpers";
import { mkdir } from "node:fs/promises";

test("labeled editing actions delete objects and keyboard deletion can be undone", async ({
  page,
}) => {
  await ready(page);
  await restore(page, fixture(1, [object("rock", 0, 0)]));
  const edit = page.getByRole("button", { name: "Explore", exact: true });
  await expect(edit).toHaveText("Select & edit");
  await edit.click();
  await cell(page, 0, 0);
  const remove = page.getByRole("button", { name: "Delete selected object" });
  await expect(remove).toHaveText("Delete");
  await remove.click();
  expect((await backup(page)).world.objects).toHaveLength(0);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await edit.click();
  await cell(page, 0, 0);
  await page.keyboard.press("Delete");
  expect((await backup(page)).world.objects).toHaveLength(0);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  expect((await backup(page)).world.objects).toHaveLength(1);
  await edit.click();
  await cell(page, 0, 0);
  await page.getByRole("button", { name: "Screenshot mode" }).click();
  await page.keyboard.press("Delete");
  await cell(page, 2, 0);
  await page
    .getByRole("button", { name: "Back to world", exact: true })
    .click();
  await expect(remove).toBeVisible();
  expect((await backup(page)).world.objects).toHaveLength(1);
  await page
    .getByRole("button", { name: "Place Cloudwood", exact: true })
    .click();
  await page.getByRole("button", { name: "Screenshot mode" }).click();
  await cell(page, 2, 0);
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Capture PNG", exact: true }).click();
  const d = await pending;
  await mkdir("outputs", { recursive: true });
  await d.saveAs("outputs/photo-editing-clean.png");
  await page
    .getByRole("button", { name: "Back to world", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Place Cloudwood", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect((await backup(page)).world.objects).toHaveLength(1);
});

test("each weather has an observable mood", async ({ page }) => {
  await ready(page);
  await restore(
    page,
    fixture(10, [
      object("tree", 0, 0),
      object("windmill", -3, -2),
      object("pond", 1, 1),
    ]),
  );
  await mkdir("outputs", { recursive: true });
  for (const weather of ["sunny", "cloudy", "rainy", "snowy"]) {
    await page.getByRole("button", { name: "Atmosphere settings" }).click();
    await page.getByRole("button", { name: weather, exact: true }).click();
    await page.getByRole("button", { name: "Close panel" }).click();
    await expect(page.locator(".weather-name")).toHaveText(weather);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `outputs/weather-${weather}.png` });
    expect((await backup(page)).world.settings.atmosphere).toMatchObject({
      weather,
      autoWeather: false,
    });
  }
});

test("automatic weather and time resume and persist", async ({ page }) => {
  await page.clock.install();
  await ready(page);
  const b0 = fixture(1);
  b0.world.settings.atmosphere.weather = "snowy";
  await restore(page, b0);
  await page.getByRole("button", { name: "Atmosphere settings" }).click();
  await page.getByLabel("Automatic weather", { exact: true }).check();
  await page.getByLabel("Automatic day/night", { exact: true }).check();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page.clock.fastForward(61_000);
  await expect(page.locator(".weather-name")).toHaveText("sunny");
  await page.clock.fastForward(31_000);
  const b = await backup(page);
  expect(b.world.settings.atmosphere.autoWeather).toBe(true);
  expect(b.world.settings.atmosphere.hour).toBeGreaterThan(14);
  await page.reload();
  await expect(page.locator(".weather-name")).toHaveText("sunny");
});
