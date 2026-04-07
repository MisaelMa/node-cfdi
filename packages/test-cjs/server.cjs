const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3001;
const routesDir = path.join(__dirname, 'routes');

function loadRoutes() {
  const routes = {};
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.cjs'));

  for (const file of files) {
    const route = require(path.join(routesDir, file));
    routes[route.path] = route;
  }

  return routes;
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

const routes = loadRoutes();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (pathname === '/') {
    const available = Object.values(routes).map(r => ({
      name: r.name,
      path: r.path,
    }));
    return json(res, {
      type: 'cjs',
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
      type: 'cjs',
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
  console.log(`[CJS] Server running on http://localhost:${PORT}`);
  console.log(`Routes loaded: ${Object.keys(routes).length}`);
  Object.keys(routes).forEach(r => console.log(`  ${r}`));
});
