// Give first-frame rendering a bounded head start behind the closed portal.
// A slow GPU or failed asset must never trap visitors in the loading screen.
export function prepareHeroReadiness(hero,{timeout=1500}={}){
  let done=false,observer,timer,resolveReady;
  const ready=new Promise(resolve=>resolveReady=resolve);
  const poster=hero?.querySelector('.brand-poster'),brand=hero?.querySelector('.hero-brand');
  let posterReady=!poster,fontReady=!document.fonts;
  const finish=()=>{
    if(done)return;done=true;clearTimeout(timer);observer?.disconnect();
    poster?.removeEventListener('load',onPoster);poster?.removeEventListener('error',onPoster);
    resolveReady();
  };
  const check=()=>{if(posterReady&&fontReady&&(!brand||['ready','fallback'].includes(brand.dataset.renderState)))finish();};
  const onPoster=()=>{
    const decoded=poster?.decode?poster.decode():Promise.resolve();
    Promise.resolve(decoded).catch(()=>{}).then(()=>{posterReady=true;check();});
  };
  timer=setTimeout(finish,timeout);
  if(brand){observer=new MutationObserver(check);observer.observe(brand,{attributes:true,attributeFilter:['data-render-state']});}
  if(poster){poster.addEventListener('load',onPoster);poster.addEventListener('error',onPoster);if(poster.complete)onPoster();}
  if(document.fonts)Promise.resolve(document.fonts.ready).catch(()=>{}).then(()=>{fontReady=true;check();});
  check();return {ready,cancel:finish};
}
