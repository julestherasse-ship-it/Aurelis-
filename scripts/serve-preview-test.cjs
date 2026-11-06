// Local smoke-test server only. It never enables production forwarding.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const handler = require('../api/leads.js');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 3448);
process.env.VERCEL_ENV = 'preview';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/leads') return handler(req, res);
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(url.pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Preview test server: http://127.0.0.1:${port}/preview-3/`));
