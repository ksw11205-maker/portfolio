import {initScrollMotion} from '/scroll-motion.js';
const entries=[];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function topOf(node){let y=0;for(let n=node;n;){if(n.parentElement?.classList.contains('pin-spacer'))n=n.parentElement;y+=n.offsetTop;n=n.offsetParent;}return y;}
function startOf(e){return topOf(e.parent)+(parseFloat(getComputedStyle(e.parent).paddingTop)||0)-e.top;}
export function stepPosition(target){
 const e=entries.find(e=>e.active&&(e.parent===target||e.parent.contains(target)));if(!e)return null;
 const i=e.layers.findIndex(n=>n===target||n.contains(target));
 return startOf(e)+(i<0?0:e.stops[i]+clamp(target.getBoundingClientRect().top-e.layers[i].getBoundingClientRect().top,0,e.reads[i]));
}
export function stepReadingPoints(section){const e=entries.find(e=>e.active&&(e.parent===section||section.contains(e.parent)));return e?e.stops.map(n=>({top:startOf(e)+n,radius:60})):null;}
export function stepRanges(){return entries.filter(e=>e.active).flatMap(e=>e.stops.slice(1).map((end,i)=>({start:startOf(e)+end-e.slide,end:startOf(e)+end})));}
export function initCaseSteps(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=initScrollMotion();
 const project=document.querySelector('.case-end')?.dataset.project;
 const ids={lg:['sequences','factors','tool-flow','tool-settings'],ivi:['method','findings'],cafekok:['features','screens','feasibility'],offer:['direction','screens','responsive']}[project]||[];
 for(const id of ids){
  const section=document.getElementById(id);if(!section)continue;
  const title=section.querySelector(':scope > .split,.chapter-heading,.section-intro,.section-head')||section.querySelector('h2');if(!title)continue;
  const parent=title.parentElement,children=[...parent.children],cut=children.indexOf(title)+1,content=children.slice(cut);if(!content.length)continue;
  const stage=document.createElement('div'),heading=document.createElement('div'),body=document.createElement('div');
  stage.className='chapter-step-stage';heading.className='chapter-step-heading';body.className='chapter-step-content';
  parent.insertBefore(stage,children[0]);stage.append(heading,body);children.slice(0,cut).forEach(n=>heading.append(n));
  let groups=content.map(n=>[n]);
  if(content.length===1&&content[0].children.length>1){groups=[...content[0].children].map(n=>[n]);}
  if(id==='findings'){groups=[];for(const node of content){if(node.matches('.result-panel')&&groups.length)groups.at(-1).push(node);else groups.push([node]);}}
  const layers=groups.map(nodes=>{const layer=document.createElement('div');layer.className='chapter-step-layer';if(content.length===1)layer.className+=' '+content[0].className;body.append(layer);nodes.forEach(n=>layer.append(n));return layer;});
  content.filter(n=>!n.parentElement).forEach(n=>n.remove());
  if(content.length===1&&content[0].children.length===0)content[0].remove();
  if(layers.length<2){parent.insertBefore(heading,stage);parent.insertBefore(body,stage);stage.remove();continue;}
  parent.classList.add('chapter-step-layout');
  let background='#0b0d10';for(let n=parent;n;n=n.parentElement){const c=getComputedStyle(n).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'&&c!=='transparent'){background=c;break;}}
  body.style.setProperty('--step-background',background);
  const nav=document.createElement('div');nav.className='chapter-step-nav';nav.innerHTML='<button type="button" aria-label="이전 내용">←</button><span></span><button type="button" aria-label="다음 내용">→</button>';heading.append(nav);
  const e={parent,stage,heading,body,layers,nav,active:false,stops:[],reads:[],current:0,fade:project==='lg'&&id==='tool-flow'};entries.push(e);
  nav.querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>motion.scrollTo(startOf(e)+e.stops[clamp(e.current+(i?1:-1),0,layers.length-1)])));
  body.addEventListener('focusin',event=>{if(!e.active)return;const y=stepPosition(event.target);if(y!==null)motion.scrollTo(y,{immediate:true});});
 }
 function measure(){
  for(const e of entries){
   e.top=(document.querySelector('.case-shared')?.offsetHeight||68)+24;
   e.active=innerWidth>=1100&&innerHeight>=650&&!reduced.matches;
   e.parent.classList.toggle('chapter-step-pinned',e.active);
   e.parent.style.height='';e.stage.style.top=e.top+'px';
   e.body.style.height=e.active?(innerHeight-e.top-40)+'px':'';
   e.stage.style.minHeight=e.active?(innerHeight-e.top-40)+'px':'';
   e.slide=e.fade?Math.min(240,innerHeight*.28):Math.min(560,innerHeight*.65);e.stops=[];e.reads=[];let cursor=0;
   for(const layer of e.layers){e.stops.push(cursor);const read=Math.max(0,layer.scrollHeight-e.body.clientHeight);e.reads.push(read);cursor+=read+(e.fade?Math.max(120,innerHeight*.14):Math.max(140,innerHeight*.22))+e.slide;}
   e.travel=cursor-e.slide;
   if(e.active)e.parent.style.height=e.stage.offsetHeight+e.travel+80+'px';
  }paint();
 }
 function paint(){for(const e of entries){
  const progress=scrollY-(startOf(e));let current=0;
  e.layers.forEach((layer,i)=>{
   const entry=i?clamp((progress-(e.stops[i]-e.slide))/e.slide):1;
   const y=clamp(progress-e.stops[i],0,e.reads[i]);
   layer.style.transform=e.active?`translate3d(${(1-entry)*100}%,${-y}px,0)`:'';
   if(e.fade&&e.active){const next=i<e.layers.length-1?clamp((progress-(e.stops[i+1]-e.slide))/e.slide):0;layer.style.transform=`translate3d(0,${-y}px,0)`;layer.style.opacity=String(entry*(1-next));}else layer.style.opacity='1';
   layer.style.zIndex=String(i+1);if(progress>=e.stops[i]-e.slide*.5)current=i;
   layer.dataset.readStart=String(startOf(e)+e.stops[i]);
   layer.dataset.readEnd=String(startOf(e)+e.stops[i]+e.reads[i]);
  });if(e.fade&&e.active){const source=e.layers[current].querySelector('.chapter-heading');const h=e.heading.querySelector('h2'),p=e.heading.querySelector('.lead');if(source&&h){const next=source.querySelector('h2')?.textContent;if(next&&h.textContent!==next)h.textContent=next;const lead=source.querySelector('.lead')?.textContent;if(p&&lead&&p.textContent!==lead)p.textContent=lead;}}e.current=current;e.nav.querySelector('span').textContent=`${current+1} / ${e.layers.length}`;
  e.nav.querySelectorAll('button').forEach((n,i)=>n.disabled=i?current===e.layers.length-1:current===0);
 }}
 let timer;function refresh(){clearTimeout(timer);timer=setTimeout(()=>{measure();window.ScrollTrigger?.refresh();},120);}
 motion.subscribe(paint);addEventListener('resize',refresh);reduced.addEventListener('change',refresh);
 document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)refresh();},true);
 document.addEventListener('toggle',refresh,true);document.fonts.ready.then(refresh);
 window.ScrollTrigger?.addEventListener('refreshInit',measure);
 measure();
}
