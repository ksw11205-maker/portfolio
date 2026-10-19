// Use the supplied transparent render unchanged; only its orientation moves.
const instances=new WeakMap();
export function initReferenceRing({host,reduced}) {
  const image=host?.querySelector('img');
  if(!image)return;
  if(instances.has(host))return instances.get(host);
  let visible=false,animation=null;
  const mobile=matchMedia('(max-width:600px)');
  function sync(){
    const paused=!visible||document.hidden||reduced.matches||document.body.classList.contains('motion-paused');
    host.dataset.ringQuality=mobile.matches?'mobile':'desktop';
    host.dataset.rendering=paused?'paused':'running';
    if(reduced.matches){animation?.cancel();animation=null;return;}
    if(!animation&&!paused){
      animation=image.animate([
        {transform:'perspective(900px) rotateX(-4deg) rotateY(-8deg) rotateZ(-5deg)'},
        {transform:'perspective(900px) rotateX(4deg) rotateY(8deg) rotateZ(6deg)'},
        {transform:'perspective(900px) rotateX(-4deg) rotateY(-8deg) rotateZ(-5deg)'}
      ],{duration:36000,iterations:Infinity,easing:'ease-in-out'});
    }
    if(animation){if(paused)animation.pause();else animation.play();}
  }
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host);
  const state=new MutationObserver(sync);state.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);mobile.addEventListener('change',sync);
  function dispose(){animation?.cancel();observer.disconnect();state.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);mobile.removeEventListener('change',sync);instances.delete(host);}
  instances.set(host,dispose);sync();return dispose;
}
