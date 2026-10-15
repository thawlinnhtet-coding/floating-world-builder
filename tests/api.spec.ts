import { test, expect } from "@playwright/test";
import { fixture, object, publicSnapshot, token } from "./helpers";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

test("publication contract: idempotency, privacy, authorization and stable mutation", async ({
  request,
}) => {
  const owner = token(),
    headers = {
      Authorization: `Bearer ${owner}`,
      "CF-Connecting-IP": randomUUID(),
    },
    requestId = randomUUID(),
    snapshot = publicSnapshot(fixture(1, [object("tree", 0, 0)]).world);
  const first = await request.post("/api/worlds", {
    headers,
    data: { requestId, snapshot },
  });
  expect(first.status()).toBe(201);
  const { publicId } = await first.json();
  const retry = await request.post("/api/worlds", {
    headers,
    data: { requestId, snapshot },
  });
  expect((await retry.json()).publicId).toBe(publicId);
  const stolen = await request.post("/api/worlds", {
    headers: { ...headers, Authorization: `Bearer ${token()}` },
    data: { requestId, snapshot },
  });
  expect(stolen.status()).toBe(409);
  const read = await (await request.get(`/api/worlds/${publicId}`)).json();
  expect(read.snapshot).toEqual(snapshot);
  expect(Object.keys(read).sort()).toEqual([
    "createdAt",
    "publicId",
    "snapshot",
    "updatedAt",
  ]);
  expect(JSON.stringify(read)).not.toContain(owner);
  expect(
    (await request.put(`/api/worlds/${publicId}`, { data: snapshot })).status(),
  ).toBe(401);
  expect(
    (
      await request.delete(`/api/worlds/${publicId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      })
    ).status(),
  ).toBe(403);
  const update = await request.put(`/api/worlds/${publicId}`, {
    headers,
    data: { ...snapshot, name: "Updated Haven" },
  });
  expect(update.status()).toBe(200);
  expect((await update.json()).publicId).toBe(publicId);
  expect(
    (
      await request.put(`/api/worlds/${publicId}`, {
        headers,
        data: { ...snapshot, objects: [object("tree", 99, 99)] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (await (await request.get(`/api/worlds/${publicId}`)).json()).snapshot.name,
  ).toBe("Updated Haven");
  expect(
    (await request.delete(`/api/worlds/${publicId}`, { headers })).status(),
  ).toBe(200);
  expect((await request.get(`/api/worlds/${publicId}`)).status()).toBe(404);
  expect(
    (
      await request.put(`/api/worlds/${publicId}`, { headers, data: snapshot })
    ).status(),
  ).toBe(404);
});
test("reject invalid public data and oversized requests before publication", async ({
  request,
}) => {
  const headers = {
      Authorization: `Bearer ${token()}`,
      "CF-Connecting-IP": randomUUID(),
    },
    base = publicSnapshot(fixture(10).world);
  const cases = [
    { ...base, version: 99 },
    { ...base, ownerToken: "private" },
    { ...base, objects: [object("unknown", 0, 0)] },
    { ...base, objects: [object("tree", 0, 0, 0, 4)] },
    { ...base, objects: [object("tree", 0, 0), object("rock", 0, 0)] },
    {
      ...base,
      objects: Array.from({ length: 241 }, () => object("tree", 0, 0)),
    },
    { ...base, completed: 0, objects: [object("tree", 0, 0, 1)] },
  ];
  for (const snapshot of cases)
    expect(
      (
        await request.post("/api/worlds", {
          headers,
          data: { requestId: randomUUID(), snapshot },
        })
      ).status(),
    ).toBe(400);
  expect(
    (
      await request.post("/api/worlds", {
        headers,
        data: {
          requestId: randomUUID(),
          snapshot: { ...base, name: "x".repeat(200_000) },
        },
      })
    ).status(),
  ).toBe(400);
});
test("anonymous writes are throttled and missing worlds are clear", async ({
  request,
}) => {
  const headers = {
    Authorization: `Bearer ${token()}`,
    "CF-Connecting-IP": randomUUID(),
  };
  for (let i = 0; i < 30; i++)
    expect(
      (
        await request.delete(`/api/worlds/${randomUUID()}`, { headers })
      ).status(),
    ).toBe(404);
  expect(
    (await request.delete(`/api/worlds/${randomUUID()}`, { headers })).status(),
  ).toBe(429);
  expect((await request.get(`/api/worlds/${randomUUID()}`)).status()).toBe(404);
});
test("real local D1 service faults return a recoverable API outcome", async ({
  request,
}) => {
  // Only the isolated Playwright database is altered; ordinary dev saves/publications are untouched.
  const root = resolve(".wrangler/test-state");
  if (!root.startsWith(resolve(".") + "\\"))
    throw new Error("Unexpected test database location.");
  const sql = (command: string) =>
    execFileSync(
      process.execPath,
      [
        "node_modules/wrangler/bin/wrangler.js",
        "d1",
        "execute",
        "floating-worlds",
        "--local",
        "--persist-to",
        root,
        "--command",
        command,
      ],
      { encoding: "utf8", stdio: "pipe" },
    );
  sql("ALTER TABLE publications RENAME TO publications_fault_backup");
  try {
    const result = await request.get(`/api/worlds/${randomUUID()}`);
    expect(result.status()).toBe(503);
    expect((await result.json()).error).toContain("local world is safe");
  } finally {
    sql("ALTER TABLE publications_fault_backup RENAME TO publications");
  }
});
