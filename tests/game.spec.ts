import { test, expect } from "@playwright/test";
import {
  add,
  backup,
  cell,
  fixture,
  object,
  publicSnapshot,
  ready,
  restore,
  settings,
  token,
} from "./helpers";
import { randomUUID } from "node:crypto";

test("start, validate placement, edit, undo, save and reload", async ({
  page,
}) => {
  await ready(page);
  await expect(
    page.getByRole("button", { name: "Place River stone", exact: true }),
  ).toBeDisabled();
  await add(page, "Cloudwood", [
    [-2, 0],
    [0, 0],
    [2, 0],
  ]);
  await expect(
    page.getByRole("button", { name: "Place River stone", exact: true }),
  ).toBeEnabled();
  let b = await backup(page);
  expect(b.world.objects).toHaveLength(3);
  expect(b.world.completed).toBe(1);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await cell(page, 0, 0);
  await page.getByRole("button", { name: "Move selected object" }).click();
  await page.keyboard.press("Escape");
  b = await backup(page);
  expect(b.world.objects.find((o: any) => o.x === 0 && o.z === 0)).toBeTruthy();
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await cell(page, 0, 0);
  await page.getByRole("button", { name: "Move selected object" }).click();
  await cell(page, 0, 2);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  b = await backup(page);
  expect(b.world.objects.some((o: any) => o.x === 0 && o.z === 2)).toBe(true);
  await page.reload();
  await expect(page.getByText("Saved locally", { exact: true })).toBeVisible();
  expect((await backup(page)).world.objects).toHaveLength(3);
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toBeDisabled();
  await add(page, "River stone", [[0, 2]]);
  await expect(
    page.getByText("That space is already occupied.", { exact: true }),
  ).toBeVisible();
  expect((await backup(page)).world.objects).toHaveLength(3);
});
test("first three challenges and permanent rewards", async ({ page }) => {
  await ready(page);
  await add(page, "Cloudwood", [
    [-3, 1],
    [-1, 1],
    [1, 1],
  ]);
  await add(page, "River stone", [
    [-3, 3],
    [-1, 3],
    [1, 3],
  ]);
  await add(page, "Wildflowers", [
    [-2, 2],
    [0, 2],
    [2, 2],
    [-2, 3],
    [0, 3],
  ]);
  await expect(
    page.getByRole("button", { name: "Place Cozy cottage", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  const b = await backup(page);
  expect(b.world.completed).toBe(3);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Place Cozy cottage", exact: true }),
  ).toBeEnabled();
});
test("cottage fences and lamps use one qualifying target", async ({ page }) => {
  await ready(page);
  await restore(page, fixture(3));
  await add(page, "Cozy cottage", [[0, 0]]);
  await expect(
    page.getByRole("button", { name: "Place Picket fence", exact: true }),
  ).toBeEnabled();
  await add(page, "Picket fence", [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
  ]);
  await expect(
    page.getByRole("button", { name: "Place Street lamp", exact: true }),
  ).toBeEnabled();
  await add(page, "Street lamp", [
    [3, 0],
    [3, 1],
    [3, 2],
  ]);
  expect((await backup(page)).world.completed).toBe(6);
});
test("pond garden, bridge, entrance and second-island finale", async ({
  page,
}) => {
  await ready(page);
  await restore(page, fixture(6));
  await add(page, "Windmill", [[-2, -2]]);
  await expect(
    page.getByRole("button", { name: "Place Garden pond", exact: true }),
  ).toBeEnabled();
  await add(page, "Garden pond", [[0, 1]]);
  await add(page, "Wildflowers", [
    [-1, 1],
    [-1, 2],
    [-1, 3],
    [0, 3],
    [1, 3],
  ]);
  expect((await backup(page)).world.completed).toBe(8);
  await add(page, "Street lamp", [
    [3, -2],
    [4, -2],
  ]);
  await add(page, "Wildflowers", [
    [2, -1],
    [3, -1],
    [4, -1],
    [2, 0],
    [3, 0],
  ]);
  expect((await backup(page)).world.completed).toBe(9);
  await add(page, "Cozy cottage", [[-1, -1]], 1);
  await add(
    page,
    "Cloudwood",
    [
      [-2, 0],
      [-2, 1],
      [-1, 2],
    ],
    1,
  );
  await add(
    page,
    "Wildflowers",
    [
      [0, 2],
      [1, 2],
      [2, 1],
      [2, 0],
      [2, -1],
    ],
    1,
  );
  await add(
    page,
    "Street lamp",
    [
      [1, -1],
      [1, 0],
      [1, 1],
    ],
    1,
  );
  await expect(
    page.getByRole("button", { name: "Place Sky castle", exact: true }),
  ).toBeEnabled();
  const b = await backup(page);
  expect(b.world.completed).toBe(10);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Place Sky castle", exact: true }),
  ).toBeEnabled();
});
test("reject bad backups, preserve data, and confirm resets", async ({
  page,
}) => {
  await ready(page);
  await restore(page, fixture(1, [object("tree", 0, 0)]));
  const original = await backup(page);
  await settings(page);
  await page
    .getByLabel("Import backup", { exact: true })
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          ...original,
          world: { ...original.world, version: 99 },
        }),
      ),
    });
  await expect(
    page.getByRole("alert").filter({ hasText: "Unsupported world version" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  expect((await backup(page)).world.id).toBe(original.world.id);
  await settings(page);
  await page.getByRole("button", { name: "Reset world…" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Close panel" }).click();
  expect((await backup(page)).world.objects).toHaveLength(1);
});
test("atmosphere and detail settings restore; screenshot contains only scene", async ({
  page,
}) => {
  await ready(page);
  await page.getByRole("button", { name: "Atmosphere settings" }).click();
  await page.getByRole("button", { name: "rainy", exact: true }).click();
  await page.getByRole("button", { name: "Night", exact: true }).click();
  await page.getByRole("button", { name: "Close panel" }).click();
  await settings(page);
  await page.getByLabel("Soft shadows").uncheck();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page.reload();
  await expect(page.locator("main.game")).toHaveClass(/night/);
  const b = await backup(page);
  expect(b.world.settings.atmosphere).toMatchObject({
    weather: "rainy",
    hour: 23,
    autoWeather: false,
    autoTime: false,
  });
  expect(b.world.settings.shadows).toBe(false);
  await page.getByRole("button", { name: "Screenshot mode" }).click();
  await expect(
    page.getByRole("region", { name: "Building catalog" }),
  ).toBeHidden();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Capture PNG", exact: true }).click();
  const d = await pending;
  expect(d.suggestedFilename()).toBe("floating-world.png");
  const { stat } = await import("node:fs/promises");
  expect((await stat((await d.path())!)).size).toBeGreaterThan(10000);
  await page
    .getByRole("button", { name: "Back to world", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Building catalog" }),
  ).toBeVisible();
});
test("publish, isolate visits, keep local edits private, update and unpublish", async ({
  page,
  context,
  request,
}) => {
  await ready(page);
  await restore(page, fixture(1, [object("tree", 0, 0)]));
  await page.getByRole("button", { name: "Share world", exact: true }).click();
  await page
    .getByRole("button", { name: "Publish snapshot", exact: true })
    .click();
  const input = page.getByRole("textbox", { name: "Visiting link" });
  await expect(input).toBeVisible();
  const url = await input.inputValue(),
    id = url.split("/").at(-1)!;
  await page.getByRole("button", { name: "Close panel" }).click();
  const privateBackup = await backup(page);
  expect(privateBackup.management.publicId).toBe(id);
  await add(page, "Cloudwood", [[2, 0]]);
  const remote1 = await (await request.get(`/api/worlds/${id}`)).json();
  expect(remote1.snapshot.objects).toHaveLength(1);
  expect(JSON.stringify(remote1)).not.toContain(privateBackup.management.token);
  const visitor = await context.newPage();
  await visitor.goto(url);
  await expect(
    visitor.getByText("SHARED FLOATING WORLD", { exact: true }),
  ).toBeVisible();
  await expect(
    visitor.getByRole("region", { name: "Building catalog" }),
  ).toHaveCount(0);
  await visitor.getByRole("button", { name: "Atmosphere settings" }).click();
  await visitor.getByRole("button", { name: "Night", exact: true }).click();
  await visitor.goto("/");
  await expect(
    visitor.getByRole("button", { name: "World settings" }),
  ).toBeVisible();
  expect((await backup(visitor)).world.objects).toHaveLength(2);
  await visitor.close();
  await page.getByRole("button", { name: "Share world", exact: true }).click();
  await page.getByRole("button", { name: "Update published snapshot" }).click();
  await expect
    .poll(
      async () =>
        (await (await request.get(`/api/worlds/${id}`)).json()).snapshot.objects
          .length,
    )
    .toBe(2);
  await page.getByRole("button", { name: "Unpublish world…" }).click();
  await page.getByRole("button", { name: "Confirm unpublish" }).click();
  await expect
    .poll(async () => (await request.get(`/api/worlds/${id}`)).status())
    .toBe(404);
});
test("local work survives offline and failed publication, owner backup restores", async ({
  page,
  context,
  request,
}) => {
  await ready(page);
  const credential = token(),
    response = await request.post("/api/worlds", {
      headers: {
        Authorization: `Bearer ${credential}`,
        "CF-Connecting-IP": randomUUID(),
      },
      data: {
        requestId: randomUUID(),
        snapshot: publicSnapshot(fixture(1).world),
      },
    });
  const { publicId } = await response.json();
  const b = {
    ...fixture(1),
    management: { token: credential, requestId: randomUUID(), publicId },
  };
  await restore(page, b);
  await context.setOffline(true);
  await add(page, "Cloudwood", [[0, 0]]);
  await expect(page.getByText("Saved locally", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Share world", exact: true }).click();
  await page.getByRole("button", { name: "Update published snapshot" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await context.setOffline(false);
  await page.getByRole("button", { name: "Update published snapshot" }).click();
  await expect
    .poll(
      async () =>
        (await (await request.get(`/api/worlds/${publicId}`)).json()).snapshot
          .objects.length,
    )
    .toBe(1);
});

test("split decorations do not pool across cottages; rotations respect occupied footprints", async ({
  page,
}) => {
  await ready(page);
  await restore(
    page,
    fixture(4, [
      object("cottage", -3, -3),
      object("cottage", 2, 1),
      ...[
        [-4, -2],
        [-4, -1],
        [-3, -1],
        [3, 0],
        [4, 0],
        [4, 1],
      ].map(([x, z]) => object("fence", x, z)),
    ]),
  );
  await expect(
    page.getByRole("button", { name: "Place Street lamp", exact: true }),
  ).toBeDisabled();
  await add(page, "Picket fence", [
    [-2, -1],
    [-1, -2],
    [-1, -3],
  ]);
  await expect(
    page.getByRole("button", { name: "Place Street lamp", exact: true }),
  ).toBeEnabled();
  await restore(
    page,
    fixture(4, [object("cottage", 0, 0), object("rock", -1, 0)]),
  );
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await cell(page, 0.5, 0.5);
  await page.getByRole("button", { name: "Rotate selected object" }).click();
  await expect(
    page.getByText("That space is already occupied.", { exact: true }),
  ).toBeVisible();
  expect(
    (await backup(page)).world.objects.find((o: any) => o.kind === "cottage")
      .rotation,
  ).toBe(0);
});
test("storage failure offers backup and retry without losing live edits", async ({
  page,
}) => {
  await ready(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    (window as any).restoreStorage = () => {
      IDBObjectStore.prototype.put = original;
    };
    IDBObjectStore.prototype.put = function () {
      throw new DOMException("Storage quota exceeded", "QuotaExceededError");
    };
  });
  await add(page, "Cloudwood", [[0, 0]]);
  await expect(
    page.getByRole("alert").filter({ hasText: "Local save failed" }),
  ).toBeVisible();
  expect((await backup(page)).world.objects).toHaveLength(1);
  await page.evaluate(() => (window as any).restoreStorage());
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(page.getByText("Saved locally", { exact: true })).toBeVisible();
});
test("castle fits island two and creation survives an interrupted response", async ({
  page,
  request,
}) => {
  await ready(page);
  await restore(page, fixture(10));
  await add(page, "Sky castle", [[-1, -1]], 1);
  expect((await backup(page)).world.objects[0].kind).toBe("castle");
  let intercepted = false;
  await page.route("**/api/worlds", async (route) => {
    if (!intercepted) {
      intercepted = true;
      await route.fetch();
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Share world", exact: true }).click();
  await page
    .getByRole("button", { name: "Publish snapshot", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page
    .getByRole("button", { name: "Publish snapshot", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Visiting link" }),
  ).toBeVisible();
  const url = await page
    .getByRole("textbox", { name: "Visiting link" })
    .inputValue();
  expect((await request.get(url)).status()).toBe(200);
  await page.getByRole("button", { name: "Close panel" }).click();
  const b = await backup(page);
  expect(b.management.publicId).toBeTruthy();
  await settings(page);
  await page.getByRole("button", { name: "Reset world…" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  const resetBackup = await backup(page);
  expect(resetBackup.world.completed).toBe(0);
  expect(resetBackup.management).toEqual(b.management);
  expect(
    (await request.get(`/api/worlds/${b.management.publicId}`)).status(),
  ).toBe(200);
});
