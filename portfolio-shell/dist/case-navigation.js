(()=>{
 const top=document.querySelector('.case-top'),progress=document.querySelector('.reading-progress');
 if(!top||!progress)return;
 const coverAction=document.querySelector('.case-cover-action'),floatAction=document.querySelector('.case-float-action'),header=document.querySelector('.case-shared');
 let frame=0;
 function update(){
  frame=0;const range=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${range>0?Math.max(0,Math.min(1,scrollY/range)):0})`;
  if(coverAction&&floatAction&&header){
   const passed=coverAction.getBoundingClientRect().bottom<=header.getBoundingClientRect().bottom;
   if(floatAction.hidden===passed){
    if(!passed&&document.activeElement===floatAction)coverAction.focus({preventScroll:true});
    floatAction.hidden=!passed;
   }
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);
 document.fonts?.ready.then(schedule);
 document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)schedule();},true);
 top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
 update();
 const ending=document.querySelector('.case-end');
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

import('/reading-snap.js').then(({initCaseReadingSnap})=>initCaseReadingSnap());
