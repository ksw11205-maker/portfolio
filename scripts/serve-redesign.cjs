// Explicit local preview entry point. Creating this file does not start it.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../redesign');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf', '.glb':'model/gltf-binary' };
const port = Number(process.env.PORT) || 4175;
http.createServer((req, res) => {
  let url, pathname;
  try { url = new URL(req.url, 'http://localhost'); pathname = decodeURIComponent(url.pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  let target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403); return res.end('Forbidden'); }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    if (!pathname.endsWith('/')) { res.writeHead(308, { Location: url.pathname + '/' + url.search }); return res.end(); }
    target = path.join(target, 'index.html');
  }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', mime[path.extname(target).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    if (req.method === 'HEAD') return res.end();
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`Redesign preview: http://localhost:${port}`));
