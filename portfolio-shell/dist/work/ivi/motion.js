(()=>{
 // Keep TOP reliable across the long pinned research sections.
 document.querySelector('.case-top')?.addEventListener('click',event=>{event.stopImmediatePropagation();window.scrollTo({top:0,behavior:'instant'})},{capture:true});
 // Pointer focus must not trigger the pinned-step focus navigation before click.
 // Keyboard focus retains the existing automatic navigation.
 const findings=document.getElementById('findings');let pointerTask=false;
 findings?.addEventListener('pointerdown',event=>{pointerTask=!!event.target.closest('.result-switch button')},{capture:true});
 findings?.addEventListener('focusin',event=>{if(pointerTask&&event.target.matches('.result-switch button'))event.stopPropagation()},{capture:true});
 addEventListener('pointerup',()=>{pointerTask=false},{capture:true});
 addEventListener('pointercancel',()=>{pointerTask=false},{capture:true});
 const targets=[...document.querySelectorAll('#layouts .research-strip,#method .measure-row,#click-patterns .heatmaps')];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0;
 function draw(){raf=0;for(const target of targets){
  const scene=target.closest('.chapter-step-layer')||(target.matches('.heatmaps')?target.closest('.chapter'):target.closest('.ivi-layout-survey')||target);
  const state=window.PortfolioReadingGate?.state(target,{scene});
  const started=reduce.matches||!!state?.started;
  target.classList.toggle('ivi-motion-entered',started);
  target.dataset.readingGate=started?'started':'waiting';
 }}
 function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);reduce.addEventListener('change',schedule);
 addEventListener('pagehide',event=>{if(!event.persisted){cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduce.removeEventListener('change',schedule)}});draw();
})();
