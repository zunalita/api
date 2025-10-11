import fs from 'fs';
import path from 'path';

// Path to your /api folder
const apiDir = path.join(process.cwd(), 'api');

// Make sure the folder exists
if (!fs.existsSync(apiDir)) {
  console.error('Directory /api not found.');
  process.exit(1);
}

// Read all .js files except index.js
const files = fs.readdirSync(apiDir).filter(file => {
  return file.endsWith('.js') && file !== 'index.js';
});

// Get route names (filenames without .js)
const routes = files.map(file => file.replace('.js', ''));

// Write to api-map.json
const outputPath = path.join(process.cwd(), 'api-map.json');
fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));

console.log('api-map.json generated:');
console.log(routes);
