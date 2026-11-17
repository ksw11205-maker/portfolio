/* User-driven concept depth and region cues; no changes to study data or scrolling. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(min-width: 900px) and (hover:hover) and (pointer:fine)');
 const concept=document.querySelector('#direction .concept-image');
 const image=concept?.querySelector('img');
 const reflection=document.getElementById('reflection');
 let raf=0,conceptStarted=false,entrance=null;
 function syncBackground(){const src=image?.currentSrc||image?.src;if(src&&reflection)reflection.style.setProperty('--ivi-final-concept',`url("${src.replaceAll('"','%22')}")`)}
 function draw(){raf=0;
  for(const target of document.querySelectorAll('#layouts .layout-item')){
   const state=window.PortfolioReadingGate?.state(target,{scene:target});
   const active=reduce.matches||!!state?.started&&!!state?.visible;
   target.classList.toggle('editorial-viewing',active);target.dataset.readingGate=(reduce.matches||state?.started)?'started':'waiting';
  }
  if(!concept)return;
  const state=window.PortfolioReadingGate?.state(concept,{scene:document.getElementById('direction')});
  const started=reduce.matches||!!state?.started;
  concept.classList.toggle('editorial-viewing',started&&(reduce.matches||!!state?.visible));concept.dataset.readingGate=started?'started':'waiting';
  if(started&&!conceptStarted&&!reduce.matches){entrance?.cancel();entrance=image?.animate([{opacity:.35,transform:'translate3d(0,64px,0) scale(.92) rotateX(7deg)'},{opacity:1,transform:'translate3d(0,0,0) scale(1) rotateX(0deg)'}],{duration:1100,easing:'cubic-bezier(.22,1,.36,1)'})}
  if(!started||reduce.matches)entrance?.cancel();conceptStarted=started;
  if(!started||reduce.matches||!fine.matches){concept.style.removeProperty('--ivi-concept-y');concept.style.removeProperty('--ivi-concept-tilt');return}
  const progress=Math.max(0,Math.min(1,state?.progress||0));
  concept.style.setProperty('--ivi-concept-y',`${progress*-16}px`);concept.style.setProperty('--ivi-concept-tilt',`${progress*1.5}deg`);
 }
 function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
 // Ordinary reading-copy/gallery reveals retain their original entry timing.
 const targets=[...document.querySelectorAll('#layouts .study-gallery,#voices .voice-row')];const entered=new WeakSet();let observer;
 if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{for(const e of entries){
  if(e.isIntersecting&&!entered.has(e.target)&&!reduce.matches){entered.add(e.target);
   if(e.target.matches('.voice-row'))e.target.animate([{opacity:.4,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
   else if(e.target.matches('.study-gallery'))e.target.querySelectorAll('figure').forEach((n,i)=>n.animate([{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:600,delay:i*35,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  }
 }},{threshold:.12});targets.forEach(n=>observer.observe(n))}
 image?.addEventListener('load',syncBackground);syncBackground();
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{syncBackground();schedule()});reduce.addEventListener('change',draw);fine.addEventListener('change',draw);
 addEventListener('pagehide',event=>{if(!event.persisted){observer?.disconnect();cancelAnimationFrame(raf);removeEventListener('scroll',schedule);entrance?.cancel()}});draw();
})();

/* Cycle 58 — viewport-relative evidence navigation. Avoid offsetParent-dependent
   offsetLeft arithmetic; preserve touch scrolling and native disclosure behavior. */
(() => {
  const gallery = document.querySelector('#layouts .study-evidence--disclosure .study-gallery');
  if (!gallery) return;
  const figures = [...gallery.querySelectorAll(':scope > figure')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  gallery.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!matchMedia('(max-width: 600px)').matches || !figures.length) return;
    if (event.target !== gallery || gallery.scrollWidth <= gallery.clientWidth + 2) return;
    const viewportLeft = gallery.getBoundingClientRect().left;
    const closest = figures.reduce((best, figure, index) =>
      Math.abs(figure.getBoundingClientRect().left - viewportLeft) <
      Math.abs(figures[best].getBoundingClientRect().left - viewportLeft) ? index : best, 0);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? figures.length - 1 :
      Math.max(0, Math.min(figures.length - 1, closest + (event.key === 'ArrowRight' ? 1 : -1)));
    const target = figures[index];
    event.preventDefault();
    gallery.scrollTo({
      left: gallery.scrollLeft + target.getBoundingClientRect().left - viewportLeft,
      behavior: reduced.matches ? 'auto' : 'smooth'
    });
  });
})();

/* Cycle 63: mobile-only gallery focus and intentional live announcements.
   Avoid a dead tab stop on desktop and unsolicited announcements on load/resize. */
(() => {
  const gallery = document.querySelector('#layouts .study-evidence--disclosure .study-gallery');
  const status = document.querySelector('#layouts .study-gallery__status');
  if (!gallery || !status) return;
  const figures = [...gallery.querySelectorAll(':scope > figure')];
  const mobile = matchMedia('(max-width: 600px)');
  let frame = 0, last = -1, engaged = false;
  let settle = 0;
  function syncMode() {
    gallery.tabIndex = mobile.matches ? 0 : -1;
    gallery.setAttribute('aria-label', mobile.matches
      ? '조사한 차량 인터페이스 15개. 좌우로 밀거나 방향키, Home, End로 탐색'
      : '조사한 차량 인터페이스 15개');
    if (!mobile.matches) { status.textContent = ''; engaged = false; last = -1; }
  }
  function update() {
    frame = 0;
    if (!mobile.matches || !engaged || !figures.length) return;
    const left = gallery.getBoundingClientRect().left;
    const current = figures.reduce((best, item, i) =>
      Math.abs(item.getBoundingClientRect().left - left) <
      Math.abs(figures[best].getBoundingClientRect().left - left) ? i : best, 0);
    if (current === last) return;
    last = current;
    const caption = figures[current].querySelector('figcaption')?.textContent?.trim() || '연구 사례';
    status.textContent = `${current + 1} / ${figures.length}: ${caption}`;
  }
  function schedule() {
    if (!mobile.matches || !engaged) return;
    clearTimeout(settle);
    settle = setTimeout(() => { if (!frame) frame = requestAnimationFrame(update); }, 180);
  }
  gallery.addEventListener('keydown', e => {
    if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key) && e.target === gallery) {
      engaged = true;
      schedule();
    }
  });
  gallery.addEventListener('pointerdown', () => { engaged = true; }, { passive: true });
  gallery.addEventListener('scroll', schedule, { passive: true });
  mobile.addEventListener('change', syncMode);
  gallery.closest('details')?.addEventListener('toggle', () => { if (!gallery.closest('details')?.open) { engaged = false; status.textContent = ''; last = -1; } });
  syncMode();
})();
