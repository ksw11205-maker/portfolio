// Synchronize only artwork. Preserve case copy, menus, research and layout.
const fs=require('node:fs'),vm=require('node:vm');
const art=vm.runInNewContext(fs.readFileSync('redesign/scripts/archive-cover.js','utf8').replace('export function art','function art')+';art');
for(const slug of ['lg','ivi','cafekok','offer']){
 const file='redesign/work/'+slug+'/'+(slug==='offer'?'case-study.html':'index.html');
 const html=fs.readFileSync(file,'utf8');
 fs.writeFileSync(file,html.replace(/<div class="archive-hero-art">[\s\S]*?<div class="archive-hero-intro">/,'<div class="archive-hero-art">'+art(slug)+'</div><div class="archive-hero-intro">'));
}
console.log('Refreshed case artwork without replacing content.');
