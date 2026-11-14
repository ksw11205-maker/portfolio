// Use the same project identity and artwork in the shell and case cover.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),site=path.join(root,'redesign');
const data=fs.readFileSync(path.join(site,'data.js'),'utf8');
const expression=data.match(/export const projects = (\[[\s\S]*?\n\]);/)[1];
const projects=vm.runInNewContext(expression);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const p of projects){
  const file=path.join(site,'work',p.slug,p.slug==='offer'?'case-study.html':'index.html');
  let html=fs.readFileSync(file,'utf8');
  const old=html.match(/<section class="case-hero[^"]*"[\s\S]*?<\/section>/)[0];
  const cta=old.match(/<a class="prototype-link"[\s\S]*?<\/a>/)[0];
  const id=old.match(/aria-labelledby="([^"]+)"/)[1];
  const image=p.slug==='ivi'?'/assets/projects/ivi-cover-clean-1920.jpg':`/assets/covers/${p.slug}.svg`;
  const title=p.title.split('\n').map(line=>`<span>${esc(line)}</span>`).join('');
  const hero=`<section class="case-hero case-hero--shared" aria-labelledby="${id}">
      <img class="case-cover" src="${image}" width="${p.slug==='ivi'?1920:2400}" height="${p.slug==='ivi'?1081:1350}" alt="${esc(p.coverAlt||'카페 배경과 실제 카페콕 홈 화면 목업')}" fetchpriority="high" decoding="async" style="view-transition-name:cover-${p.slug}">
      <div class="case-hero-copy">
        <div class="case-identity"><p class="case-type">${p.number} / ${esc(p.category)}</p><h1 class="case-title" id="${id}">${title}</h1><p class="case-hero-description">${esc(p.summary)}</p></div>
        <dl class="case-meta"><div><dt>ROLE</dt><dd>${esc(p.role)}</dd></div><div><dt>PERIOD</dt><dd>${esc(p.period)}</dd></div><div><dt>TOOLS</dt><dd>${p.tools.map(esc).join(' · ')}</dd></div></dl>
        <div class="case-cover-action">${cta}</div>
      </div>
    </section>`;
  html=html.replace(old,hero);
  if(!html.includes('/styles/case-cover.css'))html=html.replace('</head>','<link rel="stylesheet" href="/styles/case-cover.css">\n</head>');
  if(!html.includes('/styles/case-motion.css'))html=html.replace('</head>','<link rel="stylesheet" href="/styles/case-motion.css"><script type="module" src="/scripts/case-motion.js"></script>\n</head>');
  fs.writeFileSync(file,html.replace(/\r\n/g,'\n'));
}
console.log('Four case covers share exact shell titles, descriptions, metadata and artwork.');
