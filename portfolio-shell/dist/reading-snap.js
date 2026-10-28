// Reading navigation: section transitions and overlapping views of tall evidence.
export function layoutTop(element){
 let top=0;for(let node=element;node;node=node.offsetParent)top+=node.offsetTop;return top;
}
export function initReadingSnap({header,getPoints}){
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let points=[],frame=0,refreshFrame=0,lastWheel=-Infinity;
 const blocked=()=>reduced.matches||document.body.classList.contains('motion-paused')||document.body.classList.contains('intro-active');
 function sync(){root.dataset.readingSnap=blocked()?'disabled':'scripted';}
 function refresh(){
  refreshFrame=0;const gap=innerWidth<=600?40:Math.round(Math.max(56,Math.min(80,innerWidth*.045)));
  const offset=Math.max(0,header?.getBoundingClientRect().bottom||0)+gap;
  root.style.scrollPaddingTop=offset+'px';
  const max=Math.max(0,root.scrollHeight-innerHeight);
  const candidates=[...new Set([0,...getPoints(offset),max].filter(Number.isFinite).map(p=>Math.round(Math.max(0,Math.min(max,p)))))].sort((a,b)=>a-b);
  points=[];
  const minStep=Math.min(160,innerHeight*.18);
  candidates.forEach(point=>{if(!points.length||point-points.at(-1)>=minStep||point===Math.round(max))points.push(point);});
  sync();
 }
 function schedule(){if(!refreshFrame)refreshFrame=requestAnimationFrame(refresh);}
 function cancel(){cancelAnimationFrame(frame);frame=0;}
 function nested(target,delta){
  for(let node=target;node&&node!==document.body&&node!==root;node=node.parentElement){
   if(/auto|scroll/.test(getComputedStyle(node).overflowY)&&node.scrollHeight>node.clientHeight+1&&(delta>0?node.scrollTop+node.clientHeight<node.scrollHeight-1:node.scrollTop>0))return true;
  }return false;
 }
 function navigate(dir){
  if(frame||blocked())return;
  refresh();const ordered=dir>0?points:[...points].reverse();
  const target=ordered.find(point=>dir*(point-scrollY)>8);if(target===undefined)return;
  const origin=scrollY,start=performance.now();
  function tick(time){
   if(blocked()){cancel();return;}
   const p=Math.min(1,(time-start)/650);
   window.scrollTo({top:origin+(target-origin)*(1-Math.pow(1-p,3)),behavior:'instant'});
   if(p<1)frame=requestAnimationFrame(tick);else frame=0;
  }frame=requestAnimationFrame(tick);
 }
 const fields='input,textarea,select,[contenteditable],dialog';
 addEventListener('wheel',event=>{
  if(blocked()||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>=Math.abs(event.deltaY)||event.target.closest(fields)||nested(event.target,event.deltaY)||getSelection()?.toString())return;
  event.preventDefault();event.stopImmediatePropagation();
  const now=performance.now(),ongoing=now-lastWheel<650;lastWheel=now;
  if(!ongoing)navigate(Math.sign(event.deltaY));
 },{capture:true,passive:false});
 addEventListener('keydown',event=>{
  if(blocked()||event.ctrlKey||event.metaKey||event.altKey||event.target.closest(fields+',a,button')||getSelection()?.toString())return;
  const dir={ArrowDown:1,ArrowUp:-1,PageDown:1,PageUp:-1,' ':event.shiftKey?-1:1}[event.key];
  if(!dir||nested(event.target,dir))return;
  event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)navigate(dir);
 },{capture:true});
 let touch=null;
 addEventListener('touchstart',event=>{
  cancel();touch=null;
  if(blocked()||event.touches.length!==1||event.target.closest(fields))return;
  const p=event.touches[0];touch={x:p.clientX,y:p.clientY,dy:0,swiping:false};
 },{passive:true});
 addEventListener('touchmove',event=>{
  if(!touch||event.touches.length!==1||blocked()){touch=null;return;}
  const p=event.touches[0],dx=touch.x-p.clientX,dy=touch.y-p.clientY;
  if(Math.abs(dx)>Math.abs(dy)||nested(event.target,dy)){touch=null;return;}
  if(Math.abs(dy)>8){event.preventDefault();touch.dy=dy;touch.swiping=true;}
 },{passive:false});
 addEventListener('touchend',event=>{
  if(touch?.swiping){event.preventDefault();if(Math.abs(touch.dy)>28)navigate(Math.sign(touch.dy));}
  touch=null;
 },{passive:false});
 addEventListener('touchcancel',()=>{touch=null;},{passive:true});
 addEventListener('pointerdown',cancel,{passive:true});document.addEventListener('click',cancel,true);
 addEventListener('keydown',e=>{if(['Home','End','Tab','Escape'].includes(e.key))cancel();});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 reduced.addEventListener('change',()=>{cancel();sync();});
 addEventListener('resize',schedule);addEventListener('pageshow',schedule);
 document.fonts?.ready.then(schedule);document.fonts?.addEventListener('loadingdone',schedule);
 refresh();return {refresh:schedule};
}
export function initCaseReadingSnap(){
 const header=document.querySelector('.case-shared');if(!header)return;
 const sections=[...document.querySelectorAll('main section[id],main section.hero:not([id]),main section.cover:not([id])')];
 sections.forEach(section=>{
  let container=section;
  if(section.children.length===1&&section.firstElementChild.matches('.wrap,.container'))container=section.firstElementChild;
  const label=container.querySelector(':scope > .chapter-label'),heading=container.querySelector(':scope > .chapter-heading');
  if(label&&heading){
   const intro=document.createElement('div');intro.className='case-reading-intro';
   label.before(intro);intro.append(label,heading);
  }
  const children=[...container.children].filter(node=>!node.matches('script,nav'));
  if(section.matches('.hero,.cover'))section.classList.add('case-reading-panel');
  else children.forEach(node=>node.classList.add('case-reading-panel'));
 });
 document.querySelector('.case-end')?.classList.add('case-reading-panel');
 document.querySelector('main > .overview')?.classList.add('case-reading-panel');
 const controller=initReadingSnap({header,getPoints:offset=>{
  const points=[0],available=Math.max(240,innerHeight-offset-48);
  document.querySelectorAll('.case-reading-panel').forEach(panel=>{
   if(panel.matches('.hero,.cover'))return;
   const top=layoutTop(panel)-offset,height=panel.offsetHeight;
   points.push(top);
   // Overlap successive views of tall evidence, rather than skip its middle.
   const travel=height-available;
   if(travel>48){const count=Math.ceil(travel/(available*.85));for(let i=1;i<=count;i++)points.push(top+travel*i/count);}
  });
  return points;
 }});
 if('ResizeObserver' in window){const observer=new ResizeObserver(controller.refresh);observer.observe(document.body);observer.observe(header);}
 document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)controller.refresh();},true);
}
