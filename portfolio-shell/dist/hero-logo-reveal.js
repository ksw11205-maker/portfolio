// Keep the flat contour present until the actual model can crossfade in place.
export function prepareHeroLogoReveal(brand,{reduced}){
  const trigger=brand?.querySelector('.brand-trigger');
  if(!trigger)return {open(){return Promise.resolve();},cancel(){}};
  let opened=false,ended=false,animation,deadline,resolveVisible;
  const visible=new Promise(resolve=>resolveVisible=resolve);
  brand.dataset.introLogo='waiting';
  const finish=()=>{
    if(ended)return;ended=true;clearTimeout(deadline);observer.disconnect();
    reduced.removeEventListener('change',finish);removeEventListener('pagehide',finish);
    brand.dataset.introLogo='shown';animation?.cancel();resolveVisible();
  };
  const start=(allowPoster=false)=>{
    if(!opened||ended||animation)return;
    if(!allowPoster&&!['ready','fallback'].includes(brand.dataset.renderState))return;
    if(reduced.matches){finish();return;}
    clearTimeout(deadline);
    brand.dataset.introLogo='revealing';
    animation=trigger.animate([{opacity:0},{opacity:1,offset:.4},{opacity:1}],{
      duration:900,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'
    });
    resolveVisible();
    animation.finished.then(finish).catch(()=>{});
  };
  const observer=new MutationObserver(()=>start());
  observer.observe(brand,{attributes:true,attributeFilter:['data-render-state']});
  reduced.addEventListener('change',finish);addEventListener('pagehide',finish,{once:true});
  return {open(){
    if(!opened){opened=true;deadline=setTimeout(()=>start(true),650);start();}
    return visible;
  },cancel:finish};
}
