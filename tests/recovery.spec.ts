import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import {
  ready,
  restore,
  fixture,
  object,
  add,
  backup,
  settings,
  token,
  publicSnapshot,
} from "./helpers";

test("the shared 80-object cap rejects placement and import without losing the world", async ({
  page,
  request,
}) => {
  await ready(page);
  const objects = [];
  for (let x = -5; x <= 5; x++)
    for (let z = -5; z <= 5; z++)
      if (x * x + z * z <= 25 && (x !== 0 || z !== 0))
        objects.push(object("rock", x, z));
  const b = fixture(10, objects);
  expect(objects).toHaveLength(80);
  await restore(page, b);
  await add(page, "Cloudwood", [[0, 0]]);
  await expect(page.getByText(/reached its 80-object limit/)).toBeVisible();
  expect((await backup(page)).world.objects).toHaveLength(80);
  const oversized = fixture(10, [...objects, object("rock", 0, 0)]);
  await settings(page);
  await page
    .getByLabel("Import backup", { exact: true })
    .setInputFiles({
      name: "large.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(oversized)),
    });
  await expect(
    page.getByRole("alert").filter({ hasText: "maximum 80" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  expect((await backup(page)).world.objects).toHaveLength(80);
  const response = await request.post("/api/worlds", {
    headers: {
      Authorization: `Bearer ${token()}`,
      "CF-Connecting-IP": randomUUID(),
    },
    data: {
      requestId: randomUUID(),
      snapshot: publicSnapshot(oversized.world),
    },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).error).toContain("maximum 80");
});

test("corrupt saved data remains untouched until a deliberate reset", async ({
  page,
}) => {
  await ready(page);
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open("floating-world-builder");
        open.onsuccess = () => {
          const db = open.result,
            tx = db.transaction("worlds", "readwrite");
          tx.objectStore("worlds").put(
            { version: 999, doNotDiscard: "preserved" },
            "active",
          );
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your save needs attention" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await add(page, "Cloudwood", [[0, 0]]);
  const stored = await page.evaluate(
    () =>
      new Promise<any>((resolve) => {
        const open = indexedDB.open("floating-world-builder");
        open.onsuccess = () => {
          const db = open.result,
            r = db.transaction("worlds").objectStore("worlds").get("active");
          r.onsuccess = () => {
            resolve(r.result);
            db.close();
          };
        };
      }),
  );
  expect(stored.doNotDiscard).toBe("preserved");
  expect((await backup(page)).world.objects).toHaveLength(1);
  await settings(page);
  await page.getByRole("button", { name: "Reset world…" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await expect(page.getByText("Saved locally", { exact: true })).toBeVisible();
  expect((await backup(page)).world.objects).toHaveLength(0);
});

test("unsupported WebGL and missing visitor links have usable recovery screens", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: any,
      ...args: any[]
    ): any {
      if (type === "webgl2") return null;
      return (original as any).call(this, type, ...args);
    };
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "This browser needs WebGL 2" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "World settings" }),
  ).toBeVisible();
  await page.goto(`/world/${randomUUID()}`);
  await expect(
    page.getByRole("heading", { name: "This world is unavailable" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("alert")).toContainText("not found");
  await expect(
    page.getByRole("link", { name: "Return to your world" }),
  ).toHaveAttribute("href", "/");
});

test("camera drags do not place objects and capture is a rendered PNG", async ({
  page,
}) => {
  await ready(page);
  await page
    .getByRole("button", { name: "Place Cloudwood", exact: true })
    .click();
  await page.mouse.move(700, 350);
  await page.mouse.down();
  await page.mouse.move(820, 420, { steps: 12 });
  await page.mouse.up();
  expect((await backup(page)).world.objects).toHaveLength(0);
  await page.getByRole("button", { name: "Screenshot mode" }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Capture PNG", exact: true }).click();
  const d = await pending;
  const { readFile } = await import("node:fs/promises");
  const bytes = await readFile((await d.path())!);
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  const pixels = await page.evaluate(async (data) => {
    const image = await createImageBitmap(
      await (await fetch(`data:image/png;base64,${data}`)).blob(),
    );
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    const colors = new Set<string>();
    for (let y = 0; y < canvas.height; y += 30)
      for (let x = 0; x < canvas.width; x += 30)
        colors.add(Array.from(ctx.getImageData(x, y, 1, 1).data).join(","));
    return {
      width: image.width,
      height: image.height,
      colors: colors.size,
      frame: document.querySelector("canvas")!.getBoundingClientRect().height,
    };
  }, bytes.toString("base64"));
  expect(pixels.colors).toBeGreaterThan(100);
  expect(pixels.height).toBeGreaterThanOrEqual(pixels.frame);
  expect(pixels.width).toBeGreaterThanOrEqual(1440);
});

test("unpublish failures remain visible and preserve publication ownership", async ({
  page,
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
  await restore(page, {
    ...fixture(1),
    management: { token: credential, requestId: randomUUID(), publicId },
  });
  await page.route(`**/api/worlds/${publicId}`, (route) =>
    route.request().method() === "DELETE"
      ? route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "Service temporarily unavailable" }),
        })
      : route.continue(),
  );
  await page.getByRole("button", { name: "Share world", exact: true }).click();
  await page.getByRole("button", { name: "Unpublish world…" }).click();
  await page.getByRole("button", { name: "Confirm unpublish" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Service temporarily unavailable",
  );
  await expect(
    page.getByRole("textbox", { name: "Visiting link" }),
  ).toHaveValue(new RegExp(publicId));
  expect((await request.get(`/api/worlds/${publicId}`)).status()).toBe(200);
});
