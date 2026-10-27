// Gentle proximity snapping. A single controller works with native scrolling
// and the shell's Lenis clock, without competing CSS snap or wheel interception.
export function layoutTop(element){
 let top=0;
 for(let node=element;node;node=node.offsetParent)top+=node.offsetTop;
 return top;
}

export function initReadingSnap({header,getPoints,move=(top)=>window.scrollTo({top,behavior:'instant'})}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let points=[],timer=0,frame=0,armed=false,pressed=false,touch=null,direction=0,lastSnap=null;
 let offset=0;
 const blocked=()=>reduced.matches||document.hidden||document.body.classList.contains('intro-active')||
  document.body.classList.contains('motion-paused')||!!window.getSelection()?.toString().trim();
 function cancel(){clearTimeout(timer);cancelAnimationFrame(frame);timer=frame=0;}
 function disarm(){cancel();armed=false;}
 function refresh(){
  disarm();
  const gap=Math.round(Math.max(24,Math.min(36,innerWidth*.025)));
  offset=Math.max(0,header?.getBoundingClientRect().bottom||0)+gap;
  document.documentElement.style.scrollPaddingTop=offset+'px';
  points=getPoints(offset).filter(Number.isFinite).sort((a,b)=>a-b);
 }
 function settle(){
  timer=0;
  if(!armed||pressed||blocked())return;
  armed=false;
  const y=scrollY,max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const radius=Math.min(innerWidth<=600?48:80,innerHeight*.1);
  if(lastSnap!==null&&Math.abs(y-lastSnap)>radius*2)lastSnap=null;
  const candidates=points.map(p=>Math.max(0,Math.min(max,p)))
   .filter(p=>Math.abs(p-y)>2&&Math.abs(p-y)<=radius&&direction*(p-y)>=-8&&p!==lastSnap);
  const target=candidates.sort((a,b)=>Math.abs(a-y)-Math.abs(b-y))[0];
  if(target===undefined)return;
  const start=performance.now(),duration=320;
  function tick(time){
   if(blocked()){disarm();return;}
   const p=Math.min(1,(time-start)/duration),ease=1-Math.pow(1-p,3);
   move(y+(target-y)*ease);
   if(p<1)frame=requestAnimationFrame(tick);
   else{frame=0;lastSnap=target;}
  }
  frame=requestAnimationFrame(tick);
 }
 function schedule(){clearTimeout(timer);if(armed&&!frame&&!pressed)timer=setTimeout(settle,220);}
 function nestedScroll(target,delta){
  for(let node=target;node&&node!==document.body;node=node.parentElement){
   if(node.scrollHeight>node.clientHeight+1&&/(auto|scroll)/.test(getComputedStyle(node).overflowY)&&
    (delta>0?node.scrollTop+node.clientHeight<node.scrollHeight-1:node.scrollTop>0))return true;
  }
  return false;
 }
 function input(target,delta){
  cancel();
  if(!delta||blocked()||target?.closest?.('input,textarea,select,[contenteditable="true"],dialog')||nestedScroll(target,delta)){
   armed=false;return;
  }
  direction=Math.sign(delta);armed=true;schedule();
 }
 addEventListener('wheel',event=>{
  if(event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>=Math.abs(event.deltaY)){disarm();return;}
  input(event.target,event.deltaY);
 },{passive:true});
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('pointerdown',()=>{pressed=true;disarm();},{passive:true});
 addEventListener('pointerup',()=>{pressed=false;schedule();},{passive:true});
 addEventListener('pointercancel',()=>{pressed=false;disarm();},{passive:true});
 addEventListener('touchstart',event=>{
  disarm();pressed=true;const p=event.touches[0];touch=p?{x:p.clientX,y:p.clientY}:null;
 },{passive:true});
 addEventListener('touchmove',event=>{
  const p=event.touches[0];if(!p||!touch||event.touches.length!==1){disarm();return;}
  const dx=touch.x-p.clientX,dy=touch.y-p.clientY;
  if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>3)input(event.target,dy);
  else if(Math.abs(dx)>3)disarm();
 },{passive:true});
 addEventListener('touchend',()=>{touch=null;pressed=false;schedule();},{passive:true});
 addEventListener('touchcancel',()=>{touch=null;pressed=false;disarm();},{passive:true});
 addEventListener('keydown',event=>{
  const delta={ArrowDown:1,ArrowUp:-1,PageDown:1,PageUp:-1,' ':event.shiftKey?-1:1}[event.key];
  if(delta&&!event.ctrlKey&&!event.metaKey&&!event.altKey)input(event.target,delta);
  else disarm();
 });
 // Anchor navigation, focus, TOP, restoration and text selection keep control.
 document.addEventListener('click',disarm,true);
 document.addEventListener('focusin',disarm);
 document.addEventListener('selectionchange',()=>{if(window.getSelection()?.toString().trim())disarm();});
 document.addEventListener('visibilitychange',disarm);
 reduced.addEventListener('change',refresh);
 addEventListener('resize',refresh);addEventListener('pageshow',refresh);addEventListener('pagehide',disarm);
 document.fonts?.ready.then(refresh);document.fonts?.addEventListener('loadingdone',refresh);
 refresh();
 return {refresh};
}

export function initCaseReadingSnap(){
 const header=document.querySelector('.case-shared');if(!header)return;
 const chapters=[...document.querySelectorAll('main section[id]')]
  .filter(section=>!section.matches('.hero,.cover'));
 const anchors=chapters.map(section=>({section,anchor:section.querySelector('.chapter-label,.section-intro,.section-head,.eyebrow')||section}));
 const ending=document.querySelector('.case-end');
 const controller=initReadingSnap({header,getPoints:offset=>[
  0,...anchors.map(({section,anchor})=>{
   const top=layoutTop(anchor),leading=top-layoutTop(section);
   // Hash links to a chapter align its content rather than its large top padding.
   section.style.scrollMarginTop=-leading+'px';
   return top-offset;
  }),...(ending?[layoutTop(ending)+parseFloat(getComputedStyle(ending).paddingTop)-offset]:[])
 ]});
 // Cache settled geometry, including lazy images and tab-dependent chart height.
 if('ResizeObserver' in window){
  const observer=new ResizeObserver(controller.refresh);observer.observe(document.body);observer.observe(header);
 }
 document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)controller.refresh();},true);
}
