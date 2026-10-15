import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { OrthographicCamera, Vector3 } from "three";
import { readFile } from "node:fs/promises";
import { randomUUID, randomBytes } from "node:crypto";
export const token = () => randomBytes(32).toString("hex");
export function fixture(completed = 0, objects: any[] = []) {
  return {
    format: "floating-world-backup",
    version: 1,
    world: {
      version: 1,
      sceneVersion: 1,
      id: randomUUID(),
      name: "Test Haven",
      objects,
      completed,
      settings: {
        atmosphere: {
          weather: "sunny",
          hour: 14,
          autoWeather: false,
          autoTime: false,
        },
        shadows: true,
        particles: true,
      },
    },
  };
}
export function object(
  kind: string,
  x: number,
  z: number,
  island = 0,
  rotation = 0,
) {
  return { id: randomUUID(), kind, x, z, island, rotation };
}
export function publicSnapshot(world: any) {
  return {
    version: 1,
    sceneVersion: 1,
    name: world.name,
    objects: world.objects,
    completed: world.completed,
    atmosphere: world.settings.atmosphere,
  };
}
export async function ready(page: Page) {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "World settings", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".preview img").first()).toBeVisible();
}
export async function settings(page: Page) {
  if (
    !(await page
      .getByRole("heading", { name: "Your world", exact: true })
      .isVisible())
  )
    await page
      .getByRole("button", { name: "World settings", exact: true })
      .click();
}
export async function restore(page: Page, backup: any) {
  await settings(page);
  await page
    .getByLabel("Import backup", { exact: true })
    .setInputFiles({
      name: "world.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(backup)),
    });
  await page
    .getByRole("button", { name: "Confirm import", exact: true })
    .click();
  await expect(page.getByText("Saved locally", { exact: true })).toBeVisible();
}
export async function backup(page: Page) {
  await settings(page);
  const pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export private backup", exact: true })
    .click();
  const download = await pending;
  const data = JSON.parse(await readFile((await download.path())!, "utf8"));
  await page.getByRole("button", { name: "Close panel" }).click();
  return data;
}
export async function cell(page: Page, x: number, z: number, island = 0) {
  const box = (await page.locator(".world-frame").boundingBox())!,
    zoom = Math.min(48, box.width / 26),
    camera = new OrthographicCamera(
      -box.width / (2 * zoom),
      box.width / (2 * zoom),
      box.height / (2 * zoom),
      -box.height / (2 * zoom),
      0.1,
      150,
    );
  camera.position.set(15, 13, 19);
  camera.lookAt(1, 0, 0);
  camera.updateMatrixWorld();
  const p = island === 0 ? [-1.5, 0, 0.8] : [8.7, -0.55, -2.5],
    v = new Vector3(x + p[0], p[1], z + p[2]).project(camera);
  await page.mouse.click(
    box.x + ((v.x + 1) * box.width) / 2,
    box.y + ((1 - v.y) * box.height) / 2,
  );
}
export async function add(
  page: Page,
  name: string,
  points: number[][],
  island = 0,
) {
  await page
    .getByRole("button", { name: `Place ${name}`, exact: true })
    .click();
  for (const [x, z] of points) await cell(page, x, z, island);
}
