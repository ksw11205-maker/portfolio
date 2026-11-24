// Material and assembly animation over the original high resolution textures.
// SVG masks retain the photographed reflections without replacing them with a flat mesh.
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n);};
export const CUTS=[
 {a:[245,925],b:[300,510],start:.6,duration:1.8,width:275},
 {a:[300,510],b:[875,725],start:2.6,duration:1.8,width:300},
 {a:[270,780],b:[635,655],start:4.6,duration:.75,width:245},
 {a:[710,385],b:[1120,620],start:5.55,duration:1.8,width:235}
];
// Boundary follows the photographed seams of the silver lower-right piece.
export const PIECE_PATH=`M650 603 C689 592 736 573 767 580 C784 582 786 604 795 619 C816 645 856 647 888 637 C916 629 933 611 928 589 C925 572 904 559 906 548 C910 533 949 528 1055 513 L1400 513 L1400 1400 L740 1400 L740 960 C768 953 777 929 769 885 L757 821 C752 794 734 783 708 790 C672 806 637 808 616 783 C594 761 595 736 614 718 C634 701 663 711 685 701 C712 690 695 657 679 632 Z`;
export function materialState(time,still=false){
 const phase=still?9:Math.max(0,time)%11.6;
 const reset=1-ease((phase-10.7)/.9);
 const cuts=CUTS.map(s=>clamp((phase-s.start)/s.duration));
 const active=still?-1:CUTS.findIndex(s=>phase>=s.start&&phase<s.start+s.duration);
 const cut=CUTS[active];const t=active<0?0:cuts[active];
 return {cuts,finish:ease((phase-7.35)/.45)*reset,reset,active,
  tip:cut?cut.a.map((v,i)=>v+(cut.b[i]-v)*t):[0,0]};
}
export function puzzleState(time,still=false){
 const t=Math.max(0,time)%8;
 // Connected hold, detach, separate hold, reconnect, connected hold.
 const gap=still?0:t<1?0:t<2.6?ease((t-1)/1.6):t<4?1:t<5.8?1-ease((t-4)/1.8):0;
 return {gap,x:110*gap,y:65*gap,angle:7*gap};
}
const image=(src,attributes='')=>`<image href="${src}" x="0" y="0" width="1254" height="1254" ${attributes}/>`;
export function artworkMarkup(kind,src,id){
 const start=`<svg xmlns="http://www.w3.org/2000/svg" class="artwork-motion" viewBox="${kind==='puzzle'?'-50 -70 1450 1450':'0 0 1254 1254'}" aria-hidden="true" focusable="false" overflow="visible">`;
 if(kind==='puzzle')return start+`<defs><clipPath id="${id}-piece"><path d="${PIECE_PATH}"/></clipPath><mask id="${id}-rest" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1800" height="1800"><rect x="-200" y="-200" width="1800" height="1800" fill="white"/><path d="${PIECE_PATH}" fill="black"/></mask></defs><g data-whole="">${image(src)}</g><g data-split="" visibility="hidden">${image(src,`mask="url(#${id}-rest)"`)}<g data-piece="">${image(src,`clip-path="url(#${id}-piece)"`)}</g></g></svg>`;
 return start+`<defs><filter id="${id}-raw" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".13 .13 .13 0 .32 .13 .13 .13 0 .34 .13 .13 .13 0 .37 0 0 0 1 0"/></filter><radialGradient id="${id}-glow"><stop offset="0" stop-color="#fffdf0" stop-opacity="1"/><stop offset=".18" stop-color="#ffe4ad" stop-opacity=".9"/><stop offset="1" stop-color="#ffbc69" stop-opacity="0"/></radialGradient><mask id="${id}-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><g data-cut-mask="">${CUTS.map(s=>`<line data-cut="" x1="${s.a[0]}" y1="${s.a[1]}" x2="${s.a[0]}" y2="${s.a[1]}" stroke="white" stroke-width="${s.width}" stroke-linecap="round" opacity="0"/>`).join('')}<rect data-finish="" width="1254" height="1254" fill="white" opacity="0"/></g></mask></defs>${image(src,`data-raw="" filter="url(#${id}-raw)"`)}${image(src,`mask="url(#${id}-cut)"`)}<g data-tool="" visibility="hidden"><circle r="45" fill="url(#${id}-glow)"/><circle r="5" fill="#fffdf1"/><path data-chips="" d="M9 -7 l12 -9 M10 6 l16 7 M-8 9 l-8 13" fill="none" stroke="#ffe9ba" stroke-width="2" stroke-linecap="round"/></g></svg>`;
}
export function applyArtworkState(svg,kind,state){
 if(kind==='puzzle'){
  const split=state.gap>1e-6;
  svg.querySelector('[data-whole]').setAttribute('visibility',split?'hidden':'visible');
  svg.querySelector('[data-split]').setAttribute('visibility',split?'visible':'hidden');
  svg.querySelector('[data-piece]').setAttribute('transform',`translate(${state.x} ${state.y}) rotate(${state.angle} 885 755)`);
  return;
 }
 svg.querySelectorAll('[data-cut]').forEach((line,i)=>{
  const s=CUTS[i],t=state.cuts[i];line.setAttribute('x2',s.a[0]+(s.b[0]-s.a[0])*t);line.setAttribute('y2',s.a[1]+(s.b[1]-s.a[1])*t);line.setAttribute('opacity',t>0?1:0);
 });
 svg.querySelector('[data-raw]').setAttribute('opacity',1-state.finish);
 svg.querySelector('[data-cut-mask]').setAttribute('opacity',state.reset);
 svg.querySelector('[data-finish]').setAttribute('opacity',state.finish);
 const tool=svg.querySelector('[data-tool]');tool.setAttribute('visibility',state.active<0?'hidden':'visible');tool.setAttribute('transform',`translate(${state.tip.join(' ')})`);
}
let serial=0;
export function createArtworkMotion(host){
 const art=host.querySelector('img'),kind=host.dataset.motionObject;
 const mount=document.createElement('div');mount.innerHTML=artworkMarkup(kind,art.getAttribute('src'),`qa-art-${++serial}`);
 const svg=mount.firstElementChild;host.append(svg);
 function resize(){
  // Match the existing object-fit:contain image box in untransformed layout space.
  Object.assign(svg.style,{left:art.offsetLeft+'px',top:art.offsetTop+'px',width:art.clientWidth+'px',height:art.clientHeight+'px'});
 }
 function update(time,still){
  applyArtworkState(svg,kind,kind==='puzzle'?puzzleState(time,still):materialState(time,still));
  if(art.complete&&art.naturalWidth)host.dataset.renderState='artwork';
 }
 const onLoad=()=>{resize();update(0,true);};art.addEventListener('load',onLoad);resize();update(0,true);
 return {resize,update,dispose(){art.removeEventListener('load',onLoad);svg.remove();}};
}
