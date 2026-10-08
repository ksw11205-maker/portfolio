// One wheel smoother and one scroll/render clock. Touch and browser navigation stay native.
import Lenis from './vendor/lenis/lenis.js';

export function initScrollMotion({reduced}){
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const listeners=new Set();
  let lenis=null,frame=0,hidden=false,lastSize='',lastFrameTime=0,scrollTime=0,wheelHandler=null;
  const enabled=()=>fine.matches&&!reduced.matches&&!hidden&&!document.hidden&&
    !document.body.classList.contains('motion-paused')&&!document.body.classList.contains('intro-active');
  function update(time){
    frame=0;
    // Lenis expects a continuous clock. Our demand-driven RAF sleeps at rest;
    // passing wall time after that sleep would finish the next wheel in one frame.
    scrollTime+=lastFrameTime?Math.max(0,time-lastFrameTime):1000/60;
    lastFrameTime=time;
    lenis?.raf(scrollTime);
    listeners.forEach(listener=>listener());
    if(lenis?.isScrolling==='smooth')requestUpdate();
    if(!frame)lastFrameTime=0;
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
          if(wheelHandler?.({deltaX,deltaY,event}))return false;
          // Reverse from the displayed position, never from an old destination.
          const remaining=lenis.targetScroll-lenis.actualScroll;
          if(deltaY*remaining<0)cancelMomentum();
          requestUpdate();
        }
      });
      lastSize='';
    }else if(!enabled()&&lenis){lenis.destroy();lenis=null;}
    requestUpdate();
  }
  function resize(){
    // Observers can report the same settled layout twice. Do not cancel a wheel
    // gesture just because an image/font or sticky stage requested a refresh.
    const size=[document.documentElement.clientWidth,document.documentElement.clientHeight,document.documentElement.scrollHeight].join(':');
    if(size!==lastSize){lastSize=size;cancelMomentum();lenis?.resize();}
    requestUpdate();
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
  addEventListener('pagehide',()=>{hidden=true;sync();cancelAnimationFrame(frame);frame=0;lastFrameTime=0;});
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
    setWheelHandler(handler){wheelHandler=handler;},
    scrollTo(top,{immediate=false,duration,easing,onComplete}={}){
      if(lenis){lenis.scrollTo(top,{immediate,lerp:.24,duration,easing,onComplete});requestUpdate();}
      else window.scrollTo({top,behavior:immediate||reduced.matches?'instant':'smooth'});
    }
  };
}
