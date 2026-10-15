import { test, expect } from "@playwright/test";
import { add, backup, ready } from "./helpers";
import { writeFile, mkdir } from "node:fs/promises";
test("complete all ten challenges from an empty world using only player actions", async ({
  page,
}) => {
  test.setTimeout(150_000);
  await ready(page);
  await add(page, "Cloudwood", [
    [-4, 0],
    [-4, 2],
    [-3, -3],
  ]);
  await add(page, "River stone", [
    [-3, 0],
    [-3, 2],
    [-2, -3],
  ]);
  await add(page, "Wildflowers", [
    [-2, 2],
    [-2, 3],
    [-1, 2],
    [-1, 3],
    [0, 4],
  ]);
  await add(page, "Cozy cottage", [[-1, -1]]);
  await add(page, "Picket fence", [
    [-2, -1],
    [-2, 0],
    [-2, 1],
    [-1, 1],
    [0, 1],
    [1, 0],
  ]);
  await add(page, "Street lamp", [
    [3, -2],
    [4, -2],
    [1, -2],
  ]);
  await add(page, "Windmill", [[1, -4]]);
  await add(page, "Garden pond", [[0, 2]]);
  await add(page, "Wildflowers", [
    [2, -1],
    [3, -1],
    [4, -1],
    [2, 0],
    [3, 0],
  ]);
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
  expect(b.world.objects).toHaveLength(40);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Place Sky castle", exact: true }),
  ).toBeEnabled();
  const frames = await page.evaluate(
    () =>
      new Promise<any>((resolve) => {
        const samples: number[] = [];
        let last = performance.now();
        function frame(now: number) {
          samples.push(now - last);
          last = now;
          if (samples.length < 95) requestAnimationFrame(frame);
          else {
            const sorted = samples.slice(5).sort((a, b) => a - b);
            resolve({
              objects: 40,
              medianMs: sorted[45],
              p95Ms: sorted[85],
              jsHeapBytes: (performance as any).memory?.usedJSHeapSize ?? null,
              viewport: [innerWidth, innerHeight],
              notes:
                "Full continuous player journey on the same Intel UHD Chrome laptop. rAF intervals include browser scheduling.",
            });
          }
        }
        requestAnimationFrame(frame);
      }),
  );
  await mkdir("outputs", { recursive: true });
  await writeFile(
    "outputs/journey-measurement.json",
    JSON.stringify(frames, null, 2),
  );
  await page.screenshot({ path: "outputs/completed-world.png" });
});
