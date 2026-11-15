// Keep the curated shell in app.js/profile-sections.js and refresh the static fallback.
const fs=require('node:fs'),vm=require('node:vm');
const art=vm.runInNewContext(fs.readFileSync('redesign/scripts/archive-cover.js','utf8').replace('export function art','function art')+';art');
const file='redesign/index.html';let html=fs.readFileSync(file,'utf8');
for(const slug of ['lg','ivi','cafekok','offer']){
 const re=new RegExp('(<article class="project project-'+slug+'"><a[^>]*>)[\\s\\S]*?(<\\/a>)');
 html=html.replace(re,(_,head,tail)=>head+art(slug)+tail);
}
fs.writeFileSync(file,html);
require('./sync-case-covers.cjs');
console.log('Refreshed shell cover fallback; current header, typography and profile retained.');
