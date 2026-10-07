// One wheel smoother and one scroll/render clock. Touch and browser navigation stay native.
import Lenis from './vendor/lenis/lenis.js';

export function initScrollMotion({reduced}){
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const listeners=new Set();
  let lenis=null,frame=0,hidden=false;
  const enabled=()=>fine.matches&&!reduced.matches&&!hidden&&!document.hidden&&
    !document.body.classList.contains('motion-paused')&&!document.body.classList.contains('intro-active');
  function update(time){
    frame=0;
    lenis?.raf(time);
    listeners.forEach(listener=>listener());
    if(lenis?.isScrolling==='smooth')requestUpdate();
  }
  function requestUpdate(){if(!frame&&!document.hidden)frame=requestAnimationFrame(update);}
  function cancelMomentum(){
    if(lenis?.isScrolling==='smooth')lenis.scrollTo(lenis.actualScroll,{immediate:true});
  }
  function sync(){
    if(enabled()&&!lenis){
      lenis=new Lenis({
        autoRaf:false,autoResize:false,smoothWheel:true,syncTouch:false,
        lerp:.24,wheelMultiplier:1,anchors:false,allowNestedScroll:true,
        virtualScroll:({deltaX,deltaY,event})=>{
          if(event.type!=='wheel'||event.ctrlKey||Math.abs(deltaX)>Math.abs(deltaY)){
            cancelMomentum();return false;
          }
          // Reverse from the displayed position, never from an old destination.
          const remaining=lenis.targetScroll-lenis.actualScroll;
          if(deltaY*remaining<0)cancelMomentum();
          requestUpdate();
        }
      });
    }else if(!enabled()&&lenis){lenis.destroy();lenis=null;}
    requestUpdate();
  }
  function resize(){
    // Resize only after both pinned spacers have settled. Cancel the old target first.
    cancelMomentum();lenis?.resize();requestUpdate();
  }
  const nativeKeys=new Set(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Tab']);
  addEventListener('keydown',event=>{if(nativeKeys.has(event.key))cancelMomentum();},{capture:true});
  addEventListener('pointerdown',cancelMomentum,{passive:true,capture:true});
  addEventListener('scroll',()=>{
    // Scrollbar dragging and browser restoration can change Y without a DOM
    // pointer event. Yield if the browser moved independently of our last frame.
    if(lenis?.isScrolling==='smooth'&&Math.abs(lenis.actualScroll-lenis.animatedScroll)>2)cancelMomentum();
    requestUpdate();
  },{passive:true});
  addEventListener('pageshow',()=>{hidden=false;sync();resize();});
  addEventListener('pagehide',()=>{hidden=true;sync();cancelAnimationFrame(frame);frame=0;});
  document.addEventListener('visibilitychange',sync);
  fine.addEventListener('change',sync);reduced.addEventListener('change',sync);
  let paused=false,intro=false;
  new MutationObserver(()=>{
    const nextPause=document.body.classList.contains('motion-paused');
    const nextIntro=document.body.classList.contains('intro-active');
    if(paused!==nextPause||intro!==nextIntro){paused=nextPause;intro=nextIntro;sync();}
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
  // Includes image/font loading, viewport changes and Work/Q&A spacer changes.
  new ResizeObserver(resize).observe(document.documentElement);
  new ResizeObserver(resize).observe(document.body);
  addEventListener('resize',resize);
  document.fonts?.addEventListener('loadingdone',resize);
  sync();
  return {
    subscribe(listener){listeners.add(listener);requestUpdate();return ()=>listeners.delete(listener);},
    requestUpdate,resize,
    scrollTo(top,{immediate=false}={}){
      if(lenis){lenis.scrollTo(top,{immediate,lerp:.24});requestUpdate();}
      else window.scrollTo({top,behavior:immediate||reduced.matches?'instant':'smooth'});
    }
  };
}
