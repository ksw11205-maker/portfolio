// Soft wheel motion and readable scene landings share one animation owner.
import { initScrollMotion } from './scroll-motion.js';
export function layoutTop(element){
 let top=0;for(let node=element;node;node=node.offsetParent)top+=node.offsetTop;return top;
}
export function initReadingSnap({header,getPoints=()=>[],getRanges=()=>[]}){
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const motion=initScrollMotion({reduced});
 let points=[],ranges=[],aligning=false,refreshFrame=0,idle=0,direction=0,lastY=scrollY;
 let manual=false,moved=false,touching=false,pressed=false,lastSettled=null;
 const fields='input,textarea,select,[contenteditable],dialog';
 const blocked=()=>reduced.matches||document.body.classList.contains('motion-paused')||document.body.classList.contains('intro-active');
 function cancel(){clearTimeout(idle);if(aligning)motion.cancel();aligning=false;root.dataset.readingPhase='idle';}
 function sync(){cancel();manual=false;root.dataset.readingSnap=blocked()?'disabled':'smooth-proximity';}
 function refresh(){
  refreshFrame=0;
  const gap=innerWidth<=600?24:32,offset=Math.max(0,header?.getBoundingClientRect().bottom||0)+gap;
  root.style.scrollPaddingTop=offset+'px';
  const max=Math.max(0,root.scrollHeight-innerHeight),available=Math.max(180,innerHeight-offset-32);
  const clamp=n=>Math.max(0,Math.min(max,n));
  points=getPoints(offset).map(point=>typeof point==='number'?{top:point}:point)
   .filter(point=>Number.isFinite(point?.top)).map(point=>({...point,top:clamp(point.top),radius:point.radius??Math.min(96,available*.14)}));
  ranges=getRanges(offset).filter(range=>Number.isFinite(range.start)&&Number.isFinite(range.end)&&range.end>range.start)
   .map(range=>({...range,start:clamp(range.start),end:clamp(range.end)}));
 }
 function schedule(){
  // Loaded images or disclosures can move the destination during alignment.
  // Re-evaluate after layout settles instead of stopping at stale coordinates.
  if(aligning){cancel();manual=true;moved=true;queue();}
  if(!refreshFrame)refreshFrame=requestAnimationFrame(refresh);
 }
 function nested(target,delta){
  for(let node=target;node instanceof Element&&node!==document.body&&node!==root;node=node.parentElement){
   if(/auto|scroll/.test(getComputedStyle(node).overflowY)&&node.scrollHeight>node.clientHeight+1&&(delta>0?node.scrollTop+node.clientHeight<node.scrollHeight-1:node.scrollTop>0))return true;
  }return false;
 }
 function settle(){
  if(!manual||blocked()||touching||pressed||getSelection()?.toString()||document.activeElement?.matches(fields))return;
  // Finish the user's own wheel momentum before choosing a reading position.
  if(motion.isMoving){queue();return;}
  manual=false;if(!moved)return;refresh();const origin=scrollY;
  const range=ranges.find(range=>origin>range.start+2&&origin<range.end-2);
  const point=points.filter(point=>Math.abs(point.top-origin)<=point.radius&&Math.abs(point.top-origin)>2&&
    (lastSettled===null||Math.abs(point.top-lastSettled)>3))
    .sort((a,b)=>Math.abs(a.top-origin)-Math.abs(b.top-origin))[0];
  const target=range?(direction<0?range.start:range.end):point?.top;
  if(target===undefined||Math.abs(target-origin)<2)return;
  range?.onSettle?.(direction,target);
  const duration=Math.min(.95,Math.max(.42,Math.abs(target-origin)*.0011));
  aligning=true;
  root.dataset.readingPhase='aligning';root.dataset.readingTarget=String(target);
  motion.scrollTo(target,{duration,onComplete(){
   aligning=false;lastY=scrollY;lastSettled=target;root.dataset.readingPhase='idle';
  }});
 }
 function queue(){clearTimeout(idle);if(manual&&!touching&&!pressed)idle=setTimeout(settle,180);}
 function begin(delta,target){
  cancel();manual=false;
  if(blocked()||target?.closest?.(fields)||nested(target,delta)||getSelection()?.toString())return;
  manual=true;moved=!!delta;lastY=scrollY;if(delta)direction=Math.sign(delta);
  // Leaving an aligned position must remain possible with small wheel steps.
  if(lastSettled!==null&&Math.abs(scrollY-lastSettled)>innerHeight*.45)lastSettled=null;
  queue();
 }
 addEventListener('wheel',event=>{
  if(event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>=Math.abs(event.deltaY)){cancel();manual=false;return;}
  begin(event.deltaY,event.target);
 },{capture:true,passive:true});
 addEventListener('scroll',()=>{
  if(aligning)return;
  const delta=scrollY-lastY;lastY=scrollY;
  if(manual&&Math.abs(delta)>.5){moved=true;direction=Math.sign(delta);queue();}
 },{passive:true});
 addEventListener('touchstart',event=>{touching=true;begin(0,event.target);},{capture:true,passive:true});
 addEventListener('touchend',()=>{touching=false;queue();},{capture:true,passive:true});
 addEventListener('touchcancel',()=>{touching=false;manual=false;cancel();},{capture:true,passive:true});
 addEventListener('pointerdown',()=>{pressed=true;cancel();manual=false;},{capture:true,passive:true});
 addEventListener('pointerup',()=>{pressed=false;queue();},{capture:true,passive:true});
 addEventListener('pointercancel',event=>{
  pressed=false;
  // Native touch panning hands the pointer to the browser; touchend still owns
  // the reading settle after its momentum finishes.
  if(event.pointerType==='touch'&&touching)return;
  cancel();manual=false;
 },{capture:true,passive:true});
 addEventListener('keydown',event=>{
  const down=['ArrowDown','PageDown',' '].includes(event.key),up=['ArrowUp','PageUp'].includes(event.key)||event.key===' '&&event.shiftKey;
  if((down||up)&&!event.ctrlKey&&!event.metaKey&&!event.altKey)begin(up?-1:1,event.target);
  else{cancel();manual=false;}
 },{capture:true});
 for(const type of ['click','hashchange','blur','pagehide'])addEventListener(type,()=>{cancel();manual=false;},{capture:true});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 reduced.addEventListener('change',sync);
 addEventListener('resize',()=>{cancel();manual=false;schedule();});addEventListener('pageshow',schedule);
 document.fonts?.ready.then(schedule);document.fonts?.addEventListener('loadingdone',schedule);
 sync();refresh();return {refresh:schedule,cancel(){cancel();manual=false;}};
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
