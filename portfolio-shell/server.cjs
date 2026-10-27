// Serve the current static snapshot. Never rebuild from older sibling folders.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.glb':'model/gltf-binary'};
const port = Number(process.env.PORT) || 4173;
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end(); }
  let target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    if (!pathname.endsWith('/')) {
      res.writeHead(308, {Location:pathname + '/' + new URL(req.url, 'http://localhost').search}); return res.end();
    }
    target = path.join(target, 'index.html');
  }
  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));
