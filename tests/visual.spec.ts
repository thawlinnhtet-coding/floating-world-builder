import { test, expect } from "@playwright/test";
import { ready, restore, fixture, object, cell } from "./helpers";
import { mkdir } from "node:fs/promises";
test("review both islands, castle, editing toolbar and changing light", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  const b = fixture(10, [
    object("rock", 3, 0),
    object("castle", -1, -1, 1),
    object("cottage", -1, -1),
    object("windmill", -4, -1),
    object("pond", 0, 2),
    ...[
      [-3, -3],
      [-3, 2],
      [2, -3],
      [-2, 3],
    ].map(([x, z]) => object("tree", x, z)),
    ...[
      [-1, 2],
      [-1, 3],
      [-2, 2],
      [2, 3],
      [2, 2],
    ].map(([x, z]) => object("flowers", x, z)),
    ...[
      [-2, -1],
      [-2, 0],
      [-2, 1],
      [-1, 1],
    ].map(([x, z]) => object("fence", x, z)),
    ...[
      [3, -2],
      [4, -2],
      [1, 0],
    ].map(([x, z]) => object("lamp", x, z)),
    ...[
      [-2, 0],
      [-1, 2],
      [2, 0],
    ].map(([x, z]) => object("tree", x, z, 1)),
    ...[
      [2, 1],
      [-2, -1],
    ].map(([x, z]) => object("lamp", x, z, 1)),
    ...[
      [0, 2],
      [1, 2],
      [-2, 1],
    ].map(([x, z]) => object("flowers", x, z, 1)),
  ]);
  b.world.name = "Willow Haven";
  await restore(page, b);
  await mkdir("outputs", { recursive: true });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: "outputs/showcase-day.png" });
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await cell(page, 3, 0);
  await expect(
    page.getByRole("button", { name: "Delete selected object" }),
  ).toBeVisible();
  await page.screenshot({ path: "outputs/editing-controls.png" });
  await page.getByRole("button", { name: "Deselect object" }).click();
  for (const time of ["Dusk", "Night"]) {
    await page.getByRole("button", { name: "Atmosphere settings" }).click();
    await page.getByRole("button", { name: time, exact: true }).click();
    await page.getByRole("button", { name: "Close panel" }).click();
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: `outputs/showcase-${time.toLowerCase()}.png`,
    });
  }
  expect(errors).toEqual([]);
});
