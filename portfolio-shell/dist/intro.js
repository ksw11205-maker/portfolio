// The overlay exists only after JS runs. The static page remains accessible on failure.
const SEEN_KEY='ksw-main-intro-v1';
const scriptLoads=new Map();
function loadScript(src,signal){
  if(scriptLoads.has(src))return scriptLoads.get(src);
  const promise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    const cleanup=()=>{script.onload=script.onerror=null;signal.removeEventListener('abort',abort);};
    const abort=()=>{cleanup();script.remove();reject(new Error('Intro cancelled'));};
    script.src=src;script.async=true;
    script.onload=()=>{cleanup();resolve();};
    script.onerror=()=>{cleanup();script.remove();reject(new Error('Intro dependency unavailable'));};
    signal.addEventListener('abort',abort,{once:true});
    if(signal.aborted){abort();return;}
    document.head.append(script);
  });
  scriptLoads.set(src,promise);return promise;
}
export function preparePortfolioIntro({app,reduced,force=false}){
  const state={blocksHero:false};
  if(!document.querySelector('.hero')||location.pathname.startsWith('/work/'))return state;
  let seen;
  try{
    seen=sessionStorage.getItem(SEEN_KEY);
    force ||= sessionStorage.getItem('ksw-replay-intro')==='1';
    sessionStorage.removeItem('ksw-replay-intro');sessionStorage.setItem(SEEN_KEY,'1');
  }
  catch{if(!force)return state;} // Explicit replay also works without storage.
  const middleAnchor=location.hash&&!['#home','#main'].includes(location.hash);
  let returningFromProject=false;
  try{const referrer=new URL(document.referrer);returningFromProject=referrer.origin===location.origin&&referrer.pathname.startsWith('/work/');}catch{}
  const navigationType=performance.getEntriesByType('navigation')[0]?.type;
  if(reduced.matches||(!force&&(seen||middleAnchor||returningFromProject||navigationType==='reload'||navigationType==='back_forward'||scrollY>2)))return state;

  state.blocksHero=true;
  const overlay=document.createElement('div');
  overlay.className='portfolio-intro';overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML='<div class="intro-panel intro-panel-lower"></div><div class="intro-panel intro-panel-upper"></div><div class="intro-logo"></div>';
  const logo=overlay.querySelector('.intro-logo');
  const panels=[overlay.querySelector('.intro-panel-lower'),overlay.querySelector('.intro-panel-upper')];
  const controller=new AbortController();
  const roots=[app,document.querySelector('.skip')].filter(Boolean);
  const previousInert=roots.map(root=>root.inert);
  const previousFocus=document.activeElement;
  const bodyOverflow=document.body.style.overflow;
  const htmlOverflow=document.documentElement.style.overflow;
  const previousGutter=document.documentElement.style.scrollbarGutter;
  let timeline,animationFrame,finished=false,opening=false,loadTimer,watchdog;
  function openHero(){
    if(opening)return;opening=true;state.blocksHero=false;
    document.body.classList.remove('intro-closed');
    overlay.classList.add('is-opening');
  }
  function finish(){
    if(finished)return;finished=true;
    clearTimeout(loadTimer);clearTimeout(watchdog);
    cancelAnimationFrame(animationFrame);timeline?.kill();controller.abort();
    openHero();overlay.remove();
    roots.forEach((root,index)=>root.inert=previousInert[index]);
    document.body.style.overflow=bodyOverflow;
    document.documentElement.style.overflow=htmlOverflow;
    document.documentElement.style.scrollbarGutter=previousGutter;
    document.body.classList.remove('intro-active','intro-closed');
    reduced.removeEventListener('change',finish);
    removeEventListener('pagehide',finish);removeEventListener('resize',resize);
    if(previousFocus&&previousFocus!==document.body&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
    requestAnimationFrame(()=>{window.ScrollTrigger?.refresh();dispatchEvent(new Event('resize'));});
  }
  function resize(){if(opening)finish();} // A resize during the exit must not leave a panel fragment.
  roots.forEach(root=>root.inert=true);
  if(previousFocus instanceof HTMLElement)previousFocus.blur();
  document.documentElement.style.scrollbarGutter='stable';
  document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  document.body.classList.add('intro-active','intro-closed');document.body.append(overlay);
  reduced.addEventListener('change',finish,{once:true});
  addEventListener('pagehide',finish,{once:true});addEventListener('resize',resize);
  loadTimer=setTimeout(finish,1200); // Slow or missing local dependencies reveal the real page.
  watchdog=setTimeout(finish,4000); // Includes a stalled animation ticker or hidden tab.
  (async()=>{
    try{
      const [svgText]=await Promise.all([
        fetch('/assets/ksw-intro.svg',{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('Intro SVG unavailable');return response.text();}),
        (async()=>{
          if(!window.gsap)await loadScript('/vendor/gsap/gsap.min.js',controller.signal);
          if(!window.MorphSVGPlugin)await loadScript('/vendor/gsap/MorphSVGPlugin.min.js',controller.signal);
          if(!window.gsap||!window.MorphSVGPlugin)throw new Error('Intro animation unavailable');
          window.gsap.registerPlugin(window.MorphSVGPlugin);
        })()
      ]);
      if(finished)return;
      const svg=new DOMParser().parseFromString(svgText,'image/svg+xml').documentElement;
      if(svg.localName!=='svg'||svg.querySelector('parsererror'))throw new Error('Invalid intro SVG');
      const shapes=[...svg.querySelectorAll('.intro-shape')];
      if(shapes.length!==3||shapes.some(shape=>!svg.querySelector('#'+shape.dataset.letter)))throw new Error('Missing letter paths');
      logo.append(document.importNode(svg,true));
      clearTimeout(loadTimer);
      const gsap=window.gsap;
      timeline=gsap.timeline({paused:true,onComplete:finish,defaults:{ease:'power2.inOut'}});
      logo.querySelectorAll('.intro-shape').forEach((shape,index)=>{
        timeline.to(shape,{morphSVG:logo.querySelector('#'+shape.dataset.letter),duration:.8},.12+index*.1);
      });
      // Last morph ends at 1.12s; 0.2s hold, then a 0.9s diagonal exit: 2.22s total.
      timeline.call(openHero,[],1.32)
        .to(logo,{opacity:0,duration:.15,ease:'power1.out'},1.32)
        // More than a full viewport in both axes guarantees every clipped corner exits.
        .to(panels[0],{x:()=>-innerWidth-8,y:()=>innerHeight+8,duration:.9},1.32)
        .to(panels[1],{x:()=>innerWidth+8,y:()=>-innerHeight-8,duration:.9},1.32);
      // Keep this short intro on wall-clock time even if GSAP's shared ticker is
      // lag-smoothed or the browser throttles frames. Do not alter global ticker settings.
      const started=performance.now();
      const tick=now=>{
        if(finished)return;
        try{timeline.totalTime(Math.min((now-started)/1000,timeline.duration()),false);}
        catch{finish();return;}
        if(!finished)animationFrame=requestAnimationFrame(tick);
      };
      animationFrame=requestAnimationFrame(tick);
    }catch{finish();}
  })();
  return state;
}
