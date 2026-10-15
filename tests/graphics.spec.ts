import { test, expect } from "@playwright/test";
import { fixture, object, ready, restore } from "./helpers";
import { writeFile, mkdir } from "node:fs/promises";
test("record dense-world frame, heap and capture evidence", async ({
  page,
}) => {
  test.setTimeout(150_000);
  await ready(page);
  const objects = [];
  for (let x = -5; x <= 5; x++)
    for (let z = -5; z <= 5; z++)
      if (x * x + z * z <= 25) objects.push(object("tree", x, z));
  const b = fixture(10, objects.slice(0, 80));
  const measure = async () => {
    await page.waitForTimeout(1500);
    return page.evaluate(
      () =>
        new Promise<any>((resolve) => {
          let last = performance.now();
          const samples: number[] = [];
          function frame(now: number) {
            samples.push(now - last);
            last = now;
            if (samples.length < 185) requestAnimationFrame(frame);
            else {
              const useful = samples.slice(5).sort((a, b) => a - b),
                canvas = document.querySelector("canvas")!,
                gl = canvas.getContext("webgl2")!,
                extension = gl.getExtension("WEBGL_debug_renderer_info");
              resolve({
                medianMs: useful[Math.floor(useful.length / 2)],
                p95Ms: useful[Math.floor(useful.length * 0.95)],
                jsHeapBytes:
                  (performance as any).memory?.usedJSHeapSize ?? null,
                renderer: extension
                  ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)
                  : gl.getParameter(gl.RENDERER),
                userAgent: navigator.userAgent,
                viewport: [innerWidth, innerHeight],
                objects: 80,
              });
            }
          }
          requestAnimationFrame(frame);
        }),
    );
  };
  await restore(page, b);
  const normal = await measure();
  b.world.settings.shadows = false;
  b.world.settings.particles = false;
  await restore(page, b);
  const reduced = await measure();
  b.world.settings.shadows = true;
  b.world.settings.particles = true;
  b.world.settings.atmosphere.weather = "rainy";
  b.world.settings.atmosphere.hour = 23;
  await restore(page, b);
  const rainyNight = await measure();
  b.world.settings.atmosphere.weather = "snowy";
  b.world.settings.atmosphere.hour = 14;
  await restore(page, b);
  const snowy = await measure();
  await page.getByRole("button", { name: "Screenshot mode" }).click();
  const screenshotMode = await measure(),
    start = Date.now(),
    pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Capture PNG", exact: true }).click();
  const download = await pending;
  await mkdir("outputs", { recursive: true });
  await download.saveAs("outputs/dense-clean.png");
  const captureMs = Date.now() - start;
  expect(Number.isFinite(normal.p95Ms)).toBe(true);
  expect(Number.isFinite(reduced.p95Ms)).toBe(true);
  await writeFile(
    "outputs/graphics-measurement.json",
    JSON.stringify(
      {
        normal,
        reduced,
        rainyNight,
        snowy,
        screenshotMode,
        captureMs,
        snapshotBytes: Buffer.byteLength(JSON.stringify(b.world)),
        notes:
          "One local Intel UHD Chrome session. rAF includes scheduling; JS heap excludes GPU memory. Capture timing includes automation/download. No cross-device guarantee.",
      },
      null,
      2,
    ),
  );
  await page
    .getByRole("button", { name: "Back to world", exact: true })
    .click();
  await page.screenshot({ path: "outputs/dense-world.png" });
});
