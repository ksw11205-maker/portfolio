const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
require('./build.cjs')();
const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2'};
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end(); }
  let target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403); return res.end(); }
  if (pathname === '/work/cafekok' || pathname === '/work/offer') {
    res.writeHead(308, {Location:pathname + '/' + new URL(req.url, 'http://localhost').search}); return res.end();
  }
  if (!path.extname(target)) {
    const index = path.join(target, 'index.html');
    target = fs.existsSync(index) ? index : path.join(root, 'index.html');
  }
  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://localhost:4173/work/cafekok/'));
