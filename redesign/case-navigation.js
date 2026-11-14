(()=>{
 const top=document.querySelector('.case-top'),progress=document.querySelector('.reading-progress');
 if(!top||!progress)return;
 const coverAction=document.querySelector('.case-cover-action'),floatAction=document.querySelector('.case-float-action'),header=document.querySelector('.case-shared'),ending=document.querySelector('.case-end');
 let frame=0;
 function update(){
  frame=0;const range=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${range>0?Math.max(0,Math.min(1,scrollY/range)):0})`;
  if(coverAction&&floatAction&&header){
   const passed=coverAction.getBoundingClientRect().bottom<=header.getBoundingClientRect().bottom;
   const endBounds=ending?.getBoundingClientRect(),atEnding=!!endBounds&&endBounds.top<innerHeight&&endBounds.bottom>header.getBoundingClientRect().bottom;
   const clearance=atEnding?Math.max(0,innerHeight-endBounds.top+16):0;
   top.style.setProperty('--case-footer-clearance',`${clearance}px`);
   floatAction.style.setProperty('--case-footer-clearance',`${clearance}px`);
   // Match the floating launch control: no TOP action while the cover CTA is visible.
   const showTop=passed&&!atEnding;
   if(top.hidden===showTop){
    if(!showTop&&document.activeElement===top)(atEnding?ending?.querySelector('.case-end__back'):coverAction)?.focus({preventScroll:true});
    top.hidden=!showTop;
   }
   const showAction=passed&&!atEnding;
   if(floatAction.hidden===showAction){
    if(!showAction&&document.activeElement===floatAction)(atEnding?ending.querySelector('.case-end__back'):coverAction)?.focus({preventScroll:true});
    floatAction.hidden=!showAction;
   }
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);
 document.fonts?.ready.then(schedule);
 document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)schedule();},true);
 top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
 update();
 if(ending&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){
    ending.classList.add('is-visible');observer.disconnect();
   }
  },{threshold:.12});
  ending.classList.add('is-motion-ready');observer.observe(ending);
  // Keyboard navigation should never land on an invisible return link.
  ending.addEventListener('focusin',()=>{ending.classList.add('is-visible');observer.disconnect();},{once:true});
 }
})();

if(!document.body.hasAttribute('data-editorial'))import('/case-slides.js');
