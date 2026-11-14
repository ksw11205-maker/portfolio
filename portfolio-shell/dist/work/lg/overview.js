// Compact source words settle only when their own classification panel is readable.
(()=>{const section=document.getElementById('sequences');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
 const panels=[...section.querySelectorAll('.subsection')];
 section.querySelectorAll('.feature-inventory,.steps').forEach(list=>[...list.children].forEach((node,i)=>node.style.setProperty('--overview-order',i)));
 function update(){frame=0;panels.forEach(panel=>{if(panel.classList.contains('lg-sequence-arrived'))return;const state=window.PortfolioReadingGate?.state(panel,{scene:panel.closest('.chapter-step-layer')||panel});if(reduced.matches||(state?.started&&state?.visible))panel.classList.add('lg-sequence-arrived')})}
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);schedule();
 addEventListener('pagehide',event=>{if(!event.persisted){cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)}});
})();
