// Keep the real symbol out of the magnifying portal. Reveal one settled surface
// only after the portal has gone, even when WebGL finishes late.
export function prepareHeroLogoReveal(brand,{reduced}){
  const trigger=brand?.querySelector('.brand-trigger');
  if(!trigger)return {open(){},cancel(){}};
  let opened=false,ended=false,animation,firstFrame=0,secondFrame=0;
  brand.dataset.introLogo='waiting';
  const finish=()=>{
    if(ended)return;ended=true;
    cancelAnimationFrame(firstFrame);cancelAnimationFrame(secondFrame);observer.disconnect();
    reduced.removeEventListener('change',finish);removeEventListener('pagehide',finish);
    brand.dataset.introLogo='shown';animation?.cancel();
  };
  const start=()=>{
    if(!opened||ended||animation||firstFrame||secondFrame||!['ready','fallback'].includes(brand.dataset.renderState))return;
    if(reduced.matches){finish();return;}
    // Leave a paint between removing the portal and showing the stationary logo.
    firstFrame=requestAnimationFrame(()=>{
      firstFrame=0;secondFrame=requestAnimationFrame(()=>{
        secondFrame=0;if(ended)return;
        animation=trigger.animate([{opacity:0},{opacity:1}],{
          duration:420,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'
        });
        brand.dataset.introLogo='revealing';
        animation.finished.then(finish).catch(()=>{});
      });
    });
  };
  const observer=new MutationObserver(start);
  observer.observe(brand,{attributes:true,attributeFilter:['data-render-state']});
  reduced.addEventListener('change',finish);addEventListener('pagehide',finish,{once:true});
  return {open(){opened=true;start();},cancel:finish};
}
