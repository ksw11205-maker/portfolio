(()=>{
 const motion=matchMedia('(prefers-reduced-motion: no-preference)'),fine=matchMedia('(min-width: 1001px) and (hover: hover)');
 const chapter=document.querySelector('#goal'),path=chapter?.querySelector('.lg-research-path'),timeline=chapter?.querySelector('.research-timeline'),hero=document.querySelector('.project-cover');let raf=0;
 const nodes=[...(path?.querySelectorAll('.lg-system-port circle')||[])],labels=[...(path?.querySelectorAll('figcaption span')||[])],items=[...(timeline?.children||[])];
 function update(){raf=0;const enabled=motion.matches&&!document.body.classList.contains('motion-paused');
  if(path&&timeline){const gate=window.PortfolioReadingGate?.state(path,{scene:chapter,travel:Math.min(360,innerHeight*.45)}),progress=enabled?(gate?.progress||0):1,started=!enabled||gate?.started;
   path.classList.toggle('lg-flow-motion',enabled);timeline.classList.toggle('lg-goal-progress',enabled);chapter.dataset.readingGate=started?'started':'waiting';
   const current=started?Math.min(nodes.length-1,Math.floor(progress*Math.max(1,nodes.length-1)+.0001)):-1;
   nodes.forEach((node,i)=>{node.classList.toggle('is-active',started&&i<=current);node.classList.toggle('is-current',i===current)});
   labels.forEach((label,i)=>label.classList.toggle('is-active',started&&i<=current));items.forEach((item,i)=>item.classList.toggle('lg-goal-reached',started&&i<=current));
  }
  if(hero){const r=hero.getBoundingClientRect();hero.style.setProperty('--hero-shift',enabled&&fine.matches&&r.bottom>0?`${Math.min(24,Math.max(0,-r.top)*.035)}px`:'0px')}
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);motion.addEventListener('change',schedule);fine.addEventListener('change',schedule);addEventListener('pageshow',schedule);
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});document.fonts.ready.then(schedule);
 addEventListener('pagehide',e=>{if(!e.persisted){cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);motion.removeEventListener('change',schedule);fine.removeEventListener('change',schedule)}});schedule();
})();
// Preserve the original line breaks and emphasis in the current tool title.
(()=>{const section=document.querySelector('#tool-flow');if(!section)return;let raf=0;const sync=()=>{raf=0;const stage=section.querySelector('.chapter-step-pinned .chapter-step-stage');const number=Number(stage?.querySelector('.chapter-step-nav span')?.textContent.split('/')[0])-1;if(stage&&number>=0){const total=stage.querySelectorAll('.chapter-step-layer').length;stage.style.setProperty('--lg-step-progress',String((number+1)/total))}const source=stage?.querySelectorAll('.chapter-step-layer')[number]?.querySelector('.chapter-heading h2');const heading=stage?.querySelector('.chapter-step-heading h2');if(source&&heading&&heading.innerHTML!==source.innerHTML)heading.innerHTML=source.innerHTML};new MutationObserver(()=>{if(!raf)raf=requestAnimationFrame(sync)}).observe(section,{childList:true,subtree:true});})();
// A single direct jump avoids competing pinned-section animations on long returns.
document.querySelector('.case-top')?.addEventListener('click',event=>{event.stopImmediatePropagation();window.scrollTo({top:0,behavior:'instant'})},{capture:true});
