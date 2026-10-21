const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'dist');
const shape=vm.runInNewContext(fs.readFileSync(path.join(root,'brand-shape.js'),'utf8').replace('export const brandShape =','var brandShape =')+';brandShape');
const d=shape.commands.map(c=>c.join(' ')).join(' '),mirror=`rotate(180 ${shape.width/2} ${shape.height/2})`;
const base=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${shape.width} ${shape.height}" fill="none"><path fill="${shape.blue}" d="${d}"/><path fill="${shape.silver}" d="${d}" transform="${mirror}"/></svg>\n`;
fs.mkdirSync(path.join(root,'assets/brand'),{recursive:true});
fs.writeFileSync(path.join(root,'assets/brand/symbol.svg'),base);
fs.writeFileSync(path.join(root,'assets/brand/favicon.svg'),base);
fs.writeFileSync(path.join(root,'assets/brand/symbol-on-light.svg'),base.replace(shape.silver,'#586575'));
// A small, deterministic vector fallback. The live model uses the same geometry.
const defs=`<defs><linearGradient id="b" x1="0" y1="0" x2=".7" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#4e96ff"/><stop offset=".2" stop-color="#1549cd"/><stop offset=".6" stop-color="#2164ff"/><stop offset="1" stop-color="#052a91"/></linearGradient><linearGradient id="s" x1=".1" y1="0" x2=".8" y2="1"><stop stop-color="#f3f5f8"/><stop offset=".35" stop-color="#b3beca"/><stop offset=".65" stop-color="#596572"/><stop offset=".82" stop-color="#d3dbe2"/><stop offset="1" stop-color="#8c99a8"/></linearGradient><linearGradient id="e"><stop stop-color="#0b234c"/><stop offset=".4" stop-color="#d4e7ff"/><stop offset=".55" stop-color="#183768"/><stop offset="1" stop-color="#748da6"/></linearGradient></defs>`;
const pieces=(fill,dx=0,dy=0)=>`<g transform="translate(${dx} ${dy})"><path d="${d}" fill="${fill==='faces'?'url(#b)':fill}" stroke="${fill==='faces'?'#72aaff':fill}" stroke-width="1.6"/><path d="${d}" transform="${mirror}" fill="${fill==='faces'?'url(#s)':fill}" stroke="${fill==='faces'?'#d6e5f4':fill}" stroke-width="1.6"/></g>`;
const poster=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -30 800 790">${defs}<g transform="translate(12 16) skewY(-3)">${Array.from({length:21},(_,i)=>pieces('url(#e)',-21+i,15-i*.7)).join('')}${pieces('faces')}</g></svg>\n`;
fs.writeFileSync(path.join(root,'assets/brand/poster.svg'),poster);
module.exports={shape};
