// 繧ｰ繝ｪ繝・ラ繧ｿ繝ｯ繝ｼ(莉ｮ) 繝励Ο繝育畑縺ｮ霆ｽ驥城撕逧・し繝ｼ繝舌・・井ｾ晏ｭ倥↑縺暦ｼ・// 菴ｿ縺・婿: node serve.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const port = process.argv[2] || 3110;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon'
};

http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/' || u === '') u = '/index.html';
  const file = path.normalize(path.join(dir, u));
  if (!file.startsWith(dir)) { res.writeHead(403); res.end('forbidden'); return; }
  fs.readFile(file, (e, d) => {
    if (e) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(d);
  });
}).listen(port, () => console.log('spinner-tower on http://localhost:' + port));

