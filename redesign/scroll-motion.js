// One shared clock for wheel easing, readable landings and scene rendering.
// Touch, keyboard and nested scroll containers keep their browser behaviour.
import Lenis from './vendor/lenis/lenis.js';

let sharedMotion;
export function initScrollMotion({reduced=matchMedia('(prefers-reduced-motion: reduce)')}={}){
  if(sharedMotion)return sharedMotion;
  const root=document.documentElement,fine=matchMedia('(hover:hover) and (pointer:fine)');
  const listeners=new Set(),ease=t=>t*t*t*(t*(t*6-15)+10);
  let lenis=null,frame=0,hidden=false,lastSize='',lastFrameTime=0,scrollTime=0;
  let programmatic=false,transition=null;
  const resting=()=>reduced.matches||document.body.classList.contains('motion-paused');
  const enabled=()=>fine.matches&&!resting()&&!hidden&&!document.hidden&&
    !document.body.classList.contains('intro-active');
  function requestUpdate(){if(!frame&&!document.hidden)frame=requestAnimationFrame(update);}
  function update(time){
    frame=0;
    // The RAF sleeps at rest. Do not count that sleep as wheel animation time.
    scrollTime+=lastFrameTime?Math.min(50,Math.max(0,time-lastFrameTime)):1000/60;
    lastFrameTime=time;
    lenis?.raf(scrollTime);
    if(transition){
      const current=transition;
      current.start??=time;
      const progress=Math.min(1,(time-current.start)/current.duration);
      window.scrollTo({top:current.origin+(current.top-current.origin)*current.easing(progress),behavior:'instant'});
      if(progress===1){transition=null;programmatic=false;current.onComplete?.();}
    }
    listeners.forEach(listener=>listener());
    if(transition||lenis?.isScrolling==='smooth')requestUpdate();
    if(!frame)lastFrameTime=0;
  }
  function cancel(){
    transition=null;programmatic=false;
    // reset() adopts the displayed position, releasing any old destination.
    lenis?.reset();
  }
  function sync(){
    if(enabled()&&!lenis){
      lenis=new Lenis({
        autoRaf:false,autoResize:false,smoothWheel:true,syncTouch:false,
        lerp:.12,wheelMultiplier:1,anchors:false,allowNestedScroll:true,
        prevent:node=>node.matches('input,textarea,select,[contenteditable],dialog'),
        virtualScroll:({deltaX,deltaY,event})=>{
          if(event.type!=='wheel'||event.ctrlKey||event.metaKey||Math.abs(deltaX)>Math.abs(deltaY)){
            cancel();return false;
          }
          if(deltaY*(lenis.targetScroll-lenis.actualScroll)<0)cancel();
          requestUpdate();
        }
      });
      lastSize='';
    }else if(!enabled()&&lenis){cancel();lenis.destroy();lenis=null;}
    root.dataset.scrollMotion=lenis?'smooth-wheel':'native';
    if(resting()){cancel();cancelAnimationFrame(frame);frame=0;lastFrameTime=0;}
    requestUpdate();
  }
  function resize(){
    const size=[root.clientWidth,root.clientHeight,root.scrollHeight].join(':');
    if(size!==lastSize){lastSize=size;lenis?.resize();}
    requestUpdate();
  }
  const nativeKeys=new Set(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Tab','Escape']);
  addEventListener('keydown',event=>{if(nativeKeys.has(event.key))cancel();},{capture:true});
  addEventListener('wheel',()=>{if(programmatic)cancel();},{capture:true,passive:true});
  addEventListener('pointerdown',cancel,{passive:true,capture:true});
  addEventListener('touchstart',cancel,{passive:true,capture:true});
  addEventListener('scroll',()=>{
    // Scrollbar dragging, focus and browser history can move independently.
    if(lenis?.isScrolling==='smooth'&&Math.abs(lenis.actualScroll-lenis.animatedScroll)>2)cancel();
    requestUpdate();
  },{passive:true});
  addEventListener('pageshow',()=>{hidden=false;sync();resize();});
  addEventListener('pagehide',()=>{hidden=true;cancel();sync();cancelAnimationFrame(frame);frame=0;lastFrameTime=0;});
  addEventListener('blur',cancel);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();sync();});
  fine.addEventListener('change',sync);reduced.addEventListener('change',sync);
  let paused=false,intro=false;
  new MutationObserver(()=>{
    const nextPause=document.body.classList.contains('motion-paused'),nextIntro=document.body.classList.contains('intro-active');
    if(paused!==nextPause||intro!==nextIntro){paused=nextPause;intro=nextIntro;sync();}
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
  new ResizeObserver(resize).observe(root);
  new ResizeObserver(resize).observe(document.body);
  addEventListener('resize',resize);
  document.fonts?.addEventListener('loadingdone',resize);
  sharedMotion={
    subscribe(listener){listeners.add(listener);requestUpdate();return ()=>listeners.delete(listener);},
    requestUpdate,resize,cancel,
    get isMoving(){return !!transition||lenis?.isScrolling==='smooth';},
    scrollTo(top,{immediate=false,duration=.8,easing=ease,onComplete}={}){
      cancel();
      top=Math.max(0,Math.min(root.scrollHeight-innerHeight,top));
      if(immediate||resting()||Math.abs(top-scrollY)<1){
        if(lenis)lenis.scrollTo(top,{immediate:true,onComplete});
        else{window.scrollTo({top,behavior:'instant'});onComplete?.();}
      }else if(lenis){
        programmatic=true;
        lenis.scrollTo(top,{lerp:0,duration,easing,onComplete(){programmatic=false;onComplete?.();}});
      }else{
        programmatic=true;
        transition={origin:scrollY,top,duration:duration*1000,easing,onComplete,start:null};
      }
      requestUpdate();
    }
  };
  sync();return sharedMotion;
}
