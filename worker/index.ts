import { MAX_BYTES, validateSnapshot } from "../src/game/world";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
}
type Row = {
  public_id: string;
  snapshot_json: string;
  owner_token_hash: string;
  created_at: string;
  updated_at: string;
};
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
async function hash(text: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++)
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
async function body(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("Use a JSON request body.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("A JSON body is required.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {
      await reader.cancel();
      throw new Error("Snapshot request is too large.");
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(all));
}
async function api(
  request: Request,
  env: Env,
  path: string,
): Promise<Response> {
  const id = path.split("/")[3],
    method = request.method;
  if (method === "GET" && id) {
    const row = await env.DB.prepare(
      "SELECT public_id,snapshot_json,created_at,updated_at FROM publications WHERE public_id=?",
    )
      .bind(id)
      .first<Row>();
    if (!row)
      return json(
        { error: "This world was not found or has been unpublished." },
        404,
      );
    try {
      return json({
        publicId: row.public_id,
        snapshot: validateSnapshot(JSON.parse(row.snapshot_json)),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch {
      return json(
        { error: "This publication uses incompatible or invalid world data." },
        422,
      );
    }
  }
  if (
    !["POST", "PUT", "DELETE"].includes(method) ||
    (method === "POST" && id) ||
    (method !== "POST" && !id)
  )
    return json({ error: "Unsupported publication operation." }, 405);
  // Consume bounded write bodies before an early auth response. This also keeps
  // HTTP keep-alive streams correct in the local Vite/Miniflare transport.
  let payload: unknown;
  if (method === "POST" || method === "PUT")
    try {
      payload = await body(request);
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Invalid JSON." },
        400,
      );
    }
  const token =
    request.headers.get("Authorization")?.replace(/^Bearer /, "") ?? "";
  if (!/^[a-f0-9]{64}$/.test(token))
    return json(
      { error: "A valid private owner credential is required." },
      401,
    );
  const ownerHash = await hash(token),
    now = Math.floor(Date.now() / 1000),
    bucket = await hash(
      (request.headers.get("CF-Connecting-IP") ?? "local") +
        ":" +
        Math.floor(now / 600),
    );
  const limit = await env.DB.prepare(
    "INSERT INTO publication_write_limits(bucket,attempts,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts",
  )
    .bind(bucket, now + 1200)
    .first<{ attempts: number }>();
  if ((limit?.attempts ?? 31) > 30)
    return json(
      {
        error:
          "Too many publication writes. Please wait before retrying; local building is still available.",
      },
      429,
    );
  await env.DB.prepare(
    "DELETE FROM publication_write_limits WHERE expires_at < ?",
  )
    .bind(now)
    .run();
  if (method === "POST") {
    const value = payload as { snapshot?: unknown; requestId?: unknown };
    if (
      !value ||
      typeof value.requestId !== "string" ||
      !/^[a-f0-9-]{36}$/.test(value.requestId)
    )
      return json({ error: "A creation request identity is required." }, 400);
    let snapshot;
    try {
      snapshot = validateSnapshot(value.snapshot);
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Invalid snapshot." },
        400,
      );
    }
    const publicId = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO publications(public_id,schema_version,snapshot_json,owner_token_hash,creation_request_id) VALUES(?,1,?,?,?) ON CONFLICT(creation_request_id) DO NOTHING",
    )
      .bind(publicId, JSON.stringify(snapshot), ownerHash, value.requestId)
      .run();
    const row = await env.DB.prepare(
      "SELECT public_id,owner_token_hash FROM publications WHERE creation_request_id=?",
    )
      .bind(value.requestId)
      .first<Row>();
    if (!row || !equal(row.owner_token_hash, ownerHash))
      return json(
        { error: "This creation identity belongs to a different owner." },
        409,
      );
    return json(
      { publicId: row.public_id },
      row.public_id === publicId ? 201 : 200,
    );
  }
  const row = await env.DB.prepare(
    "SELECT public_id,owner_token_hash FROM publications WHERE public_id=?",
  )
    .bind(id)
    .first<Row>();
  if (!row)
    return json(
      { error: "This world was not found or has been unpublished." },
      404,
    );
  if (!equal(row.owner_token_hash, ownerHash))
    return json(
      { error: "This credential does not own the publication." },
      403,
    );
  if (method === "DELETE") {
    await env.DB.prepare(
      "DELETE FROM publications WHERE public_id=? AND owner_token_hash=?",
    )
      .bind(id, ownerHash)
      .run();
    return json({ removed: true });
  }
  let snapshot;
  try {
    snapshot = validateSnapshot(payload);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Invalid snapshot." },
      400,
    );
  }
  const updated = await env.DB.prepare(
    "UPDATE publications SET snapshot_json=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE public_id=? AND owner_token_hash=?",
  )
    .bind(JSON.stringify(snapshot), id, ownerHash)
    .run();
  return updated.meta.changes
    ? json({ publicId: id })
    : json({ error: "This world has been unpublished." }, 404);
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname;
    try {
      if (path === "/api/health") {
        await env.DB.prepare("SELECT 1").first();
        return json({ status: "ok", database: true });
      }
      if (path === "/api/worlds" || /^\/api\/worlds\/[^/]+$/.test(path))
        return await api(request, env, path);
      if (path.startsWith("/api/")) return json({ error: "Not found." }, 404);
      return env.ASSETS.fetch(request);
    } catch {
      return json(
        {
          error:
            "The publication service is temporarily unavailable, or its quota/storage limit has been reached. Your local world is safe. Please retry later.",
        },
        503,
      );
    }
  },
} satisfies ExportedHandler<Env>;
