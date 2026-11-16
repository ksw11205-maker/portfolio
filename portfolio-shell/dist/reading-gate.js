/* One onset for explanatory motion: finish bringing the reading screen into view.
 * Layout coordinates stay stable while ScrollTrigger pins an outgoing chapter.
 */
(()=>{
 const clamp=n=>Math.max(0,Math.min(1,n));
 function naturalTop(node){let top=0;for(let item=node;item;item=item.offsetParent)top+=item.offsetTop;return top}
 function frameTop(frame){return naturalTop(frame.parentElement?.classList.contains('pin-spacer')?frame.parentElement:frame)}
 function within(node,ancestor){let top=0;for(let item=node;item&&item!==ancestor;item=item.offsetParent)top+=item.offsetTop;return top}
 function defaultScene(target){return target.closest('.chapter-step-layer,.ed-screen-row,.subsection,section[id]')||target}
 function state(target,options={}){
  if(!target)return {started:false,progress:0,visible:false,bottom:Infinity,start:Infinity};
  const scene=options.scene||defaultScene(target),layer=scene.closest('.chapter-step-layer');
  let start;
  if(layer?.closest('.chapter-step-pinned')&&Number.isFinite(parseFloat(layer.dataset.readEnd))){start=parseFloat(layer.dataset.readEnd)}
  else{
   const surface=scene.closest('.case-slide-surface'),frame=surface?.parentElement;
   if(surface&&frame?.classList.contains('case-slide-frame')){
    const top=frameTop(frame);
    // The outer frame's separation gap belongs to the next chapter, not this scene.
    const bottom=scene.matches('section')?top+surface.offsetHeight:top+within(scene,surface)+scene.offsetHeight;
    start=bottom-innerHeight;
   }else start=naturalTop(scene)+scene.offsetHeight-innerHeight;
  }
  start=Math.max(0,start);
  const rect=target.getBoundingClientRect(),header=document.querySelector('.case-shared')?.offsetHeight||0;
  const visible=rect.bottom>header&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;
  const ready=document.fonts.status==='loaded'&&[...scene.querySelectorAll('img')].every(img=>img.offsetWidth<=2||img.complete&&img.naturalWidth>0);
  const travel=Math.max(1,options.travel??Math.min(360,innerHeight*.45));
  const distance=scrollY-start,started=ready&&distance>=-.5;
  return {started,progress:ready?clamp(distance/travel):0,visible,start,bottom:start+innerHeight,scene,ready};
 }
 window.PortfolioReadingGate=Object.freeze({state});
})();
