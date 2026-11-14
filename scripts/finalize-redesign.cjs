// Harmonize the authored portfolio shell only. Does not execute site code.
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), site = path.join(root, 'redesign');
const cases = ['work/lg/index.html', 'work/ivi/index.html', 'work/cafekok/index.html', 'work/offer/case-study.html'];
const header = `<header class="site-header"><a class="wordmark" href="/" aria-label="김성원 포트폴리오 홈"><img src="/assets/brand/symbol.svg" alt="" width="32" height="32"><span>KSW<span class="wordmark-period">.</span></span></a><nav class="site-nav" aria-label="주요 메뉴"><a href="/#work">WORK</a><a href="/#profile">PROFILE</a><a href="/#contact">CONTACT <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg></a></nav></header>`;
for (const relative of cases) {
  const file = path.join(site, relative);
  let text = fs.readFileSync(file, 'utf8').replace(/<header class="site-header">[\s\S]*?<\/header>/, header);
  if (!text.includes('rel="icon"')) text = text.replace('</head>', '  <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">\n</head>');
  if (!text.includes('rel="preload"')) text = text.replace('</head>', '  <link rel="preload" href="/assets/fonts/SUIT-Variable.woff2" as="font" type="font/woff2" crossorigin>\n</head>');
  if (!text.includes('case-cursor.css')) text = text.replace('</head>', '  <link rel="stylesheet" href="/case-cursor.css"><script defer src="/case-cursor.js"></script>\n</head>');
  text = text.replaceAll('href="/#profile"','href="/#about"');
  text = text.replace(/(src="\/assets\/covers\/(?:lg|cafekok|offer)\.svg"[^>]*?)width="1920" height="1080"/g, '$1width="2400" height="1350"');
  fs.writeFileSync(file, text.replace(/\r\n/g, '\n'));
}
const home = path.join(site, 'index.html');
fs.writeFileSync(home, fs.readFileSync(home, 'utf8').replace(/(src="\/assets\/covers\/(?:lg|cafekok|offer)\.svg"[^>]*?)width="1920" height="1080"/g, '$1width="2400" height="1350"').replace(/\r\n/g, '\n'));
console.log('Five portfolio headers, cover dimensions and source formatting finalized. No website execution.');
