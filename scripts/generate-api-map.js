// scripts/generate-api-map.js
import fs from 'fs';
import path from 'path';

/**
 * Recursively find all .js files in the /api directory,
 * excluding index.js and any test or helper files.
 */
function getApiRoutes(dir = path.join(process.cwd(), 'api'), prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const routePath = path.join(prefix, entry.name);

    if (entry.isDirectory()) {
      routes = routes.concat(getApiRoutes(entryPath, routePath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.js') &&
      entry.name !== 'index.js'
    ) {
      const route = routePath.replace(/\.js$/, '').replace(/\\/g, '/');
      routes.push(route.startsWith('/') ? route.slice(1) : route);
    }
  }

  return routes;
}

try {
  const routes = getApiRoutes();
  const outputPath = path.join(process.cwd(), 'api-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log('api-map.json generated successfully:\n', routes);
} catch (error) {
  console.error('Failed to generate api-map.json:', error);
  process.exit(1);
}
