/* LG-only floating navigation. Other projects use existing case-navigation.js. */
'use strict';
(()=>{
 const top=document.querySelector('.case-top'),floatAction=document.querySelector('.case-float-action');
 const coverAction=document.querySelector('.case-cover-action'),header=document.querySelector('.shell-header'),ending=document.querySelector('.end-footer');
 if(!top||!floatAction||!coverAction)return;
 let raf=0;
 function update(){
   raf=0;
   const headerBottom=header?.getBoundingClientRect().bottom||0;
   const passed=coverAction.getBoundingClientRect().bottom<=headerBottom;
   const end=ending?.getBoundingClientRect();
   const atEnding=!!end&&end.top<innerHeight&&end.bottom>headerBottom;
   const clearance=atEnding?Math.max(0,innerHeight-end.top+16):0;
   top.style.setProperty('--case-footer-clearance',clearance+'px');
   floatAction.style.setProperty('--case-footer-clearance',clearance+'px');
   // Keep the cover uncluttered until the primary CTA has scrolled away.
   const showTop=passed&&!atEnding;
   if(top.hidden===showTop){
     if(!showTop&&document.activeElement===top) (atEnding?ending?.querySelector('.footer-links a'):coverAction)?.focus({preventScroll:true});
     top.hidden=!showTop;
   }
   const show=passed&&!atEnding;
   if(floatAction.hidden===show){
     if(!show&&document.activeElement===floatAction) (atEnding?ending?.querySelector('.footer-links a'):coverAction)?.focus({preventScroll:true});
     floatAction.hidden=!show;
   }
 }
 function schedule(){if(!raf)raf=requestAnimationFrame(update)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);
 document.fonts?.ready.then(schedule);
 document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)schedule()},true);
 top.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}));
 update();
})();
