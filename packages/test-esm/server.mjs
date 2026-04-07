import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;
const routesDir = path.join(__dirname, 'routes');

async function loadRoutes() {
  const routes = {};
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.mjs'));

  for (const file of files) {
    const mod = await import(path.join(routesDir, file));
    const route = mod.default;
    routes[route.path] = route;
  }

  return routes;
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

const routes = await loadRoutes();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (pathname === '/') {
    const available = Object.values(routes).map(r => ({
      name: r.name,
      path: r.path,
    }));
    return json(res, {
      type: 'esm',
      routes: available,
      endpoints: {
        '/': 'Lista de rutas',
        '/all': 'Ejecutar todas las rutas',
        '/@scope/pkg': 'Ruta individual',
      },
    });
  }

  if (pathname === '/all') {
    const results = [];
    let ok = 0;
    let failed = 0;

    for (const route of Object.values(routes)) {
      try {
        const result = await route.test();
        results.push({ name: route.name, status: 'ok', ...result });
        ok++;
      } catch (err) {
        results.push({ name: route.name, status: 'error', message: err.message });
        failed++;
      }
    }

    return json(res, {
      type: 'esm',
      timestamp: new Date().toISOString(),
      summary: { total: results.length, ok, failed },
      results,
    });
  }

  const route = routes[pathname];
  if (route) {
    try {
      const result = await route.test();
      return json(res, { name: route.name, status: 'ok', ...result });
    } catch (err) {
      return json(res, { name: route.name, status: 'error', message: err.message }, 500);
    }
  }

  json(res, { error: 'Not found', available: Object.keys(routes) }, 404);
});

server.listen(PORT, () => {
  console.log(`[ESM] Server running on http://localhost:${PORT}`);
  console.log(`Routes loaded: ${Object.keys(routes).length}`);
  Object.keys(routes).forEach(r => console.log(`  ${r}`));
});
