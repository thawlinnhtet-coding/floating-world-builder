interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      const database = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();
      return Response.json({ status: 'ok', app: 'floating-world-builder', database: database?.ok === 1 });
    }
    if (url.pathname.startsWith('/api/worlds')) {
      return Response.json({ error: 'Publication API is not implemented in this scaffold.' }, { status: 501 });
    }
    if (url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
