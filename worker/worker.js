// Cloudflare Worker: API de datos del apartamento Valdelagrana
// - GET  /api/state        -> lectura pública (precios + fechas)
// - GET  /api/admin        -> escritura autorizada (mismo contenido)
// - PUT  /api/admin        -> guarda precios + fechas en KV
// El acceso de escritura se protege con Cloudflare Access sobre /api/admin.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'GET' && path === '/api/state') {
      return json(await load(env));
    }

    if (path === '/api/admin') {
      if (request.method === 'GET') return json(await load(env));
      if (request.method === 'PUT' || request.method === 'POST') {
        let body;
        try { body = await request.json(); } catch { return json({ error: 'json invalido' }, 400); }
        const next = sanitize(body);
        await env.VDL_STATE.put('state', JSON.stringify(next));
        return json(next);
      }
      return new Response('Method not allowed', { status: 405 });
    }

    return new Response('Not found', { status: 404 });
  },
};

async function load(env) {
  const raw = await env.VDL_STATE.get('state');
  if (!raw) return emptyState();
  try { return JSON.parse(raw); } catch { return emptyState(); }
}

function emptyState() {
  return { prices: { jul: '', ago: '', sep: '' }, availability: [] };
}

function sanitize(body) {
  const p = body.prices || {};
  return {
    prices: {
      jul: String(p.jul ?? ''),
      ago: String(p.ago ?? ''),
      sep: String(p.sep ?? ''),
    },
    availability: Array.isArray(body.availability)
      ? body.availability.map((a) => ({
          from: String((a && a.from) || ''),
          to: String((a && a.to) || ''),
          status: a && a.status === 'res' ? 'res' : 'libre',
        }))
      : [],
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
