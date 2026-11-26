const boot=()=>{
  const clearImageTips=()=>document.querySelectorAll('[title]').forEach(el=>{
    if((el.matches('img,.image-button')||el.querySelector('img'))&&!el.closest('.hero-brand,.brand-experience'))el.removeAttribute('title');
  });
  clearImageTips();
  new MutationObserver(clearImageTips).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
  if(document.body.dataset.page!=='case')return;
  const toc=document.querySelector('.case-toc');
  const restoredEntry=document.body.hasAttribute('data-case-entry');
  const hero=document.querySelector(restoredEntry ? '.project-cover, .archive-hero' : '.archive-hero');
  const header=document.querySelector(restoredEntry ? '.case-shared' : '.header');
  const cue=hero?.querySelector('.case-cover-cue');
  if(cue&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(([entry])=>{
      cue.classList.toggle('is-in-view',entry.intersectionRatio>=.75);
    },{threshold:.75});
    observer.observe(cue);
  }
  // Keep the chapter links immediately after the cover on tablet/mobile, even
  // when an interface showcase precedes them in the older case markup.
  if(!restoredEntry&&toc&&hero&&toc.previousElementSibling!==hero)hero.after(toc);
  const links=Array.from(document.querySelectorAll('.case-nav a[href^="#"], .case-overview-links a[href^="#"]'));
  const sections=Array.from(new Set(links.map(link=>document.getElementById(link.hash.slice(1))).filter(Boolean)));
  const unified=document.body.hasAttribute('data-unified-case');
  let frame=0;
  const update=()=>{
    frame=0;
    const headerEdge=header?.getBoundingClientRect().bottom||0;
    const revealAfter=restoredEntry ? headerEdge + 1 : Math.max(headerEdge + 12,124);
    const isAfterCover=!hero||hero.getBoundingClientRect().bottom<=revealAfter;
    if(toc){
      toc.classList.toggle('is-after-cover',isAfterCover);
      toc.inert=(restoredEntry||!unified)&&!isAfterCover;
    }
    if(restoredEntry&&header){
      const scrollRange=document.documentElement.scrollHeight-innerHeight;
      header.style.setProperty('--case-reading-progress', scrollRange>0 ? Math.min(1,Math.max(0,scrollY/scrollRange)) : 0);
    }
    const readingLine=Math.min(260,innerHeight*.3);
    const current=sections.filter(section=>section.getBoundingClientRect().top<=readingLine).at(-1)||(!restoredEntry&&sections[0]);
    links.forEach(link=>{if(current&&link.hash==='#'+current.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update)};
  if(restoredEntry){
    // A chapter above the destination can still grow while its assets load.
    // Correct the landing briefly, then give scrolling back to the reader.
    let cancelLanding;
    const interrupt=()=>cancelLanding?.();
    const main=document.getElementById('main');
    main.addEventListener('click',event=>{
      const link=event.target.closest('.case-nav a, .case-overview-links a');
      if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const target=document.getElementById(link.hash.slice(1));
      if(!target)return;
      interrupt();
      const controller=new AbortController();
      const align=()=>{
        if(location.hash===link.hash)target.scrollIntoView({block:'start',behavior:'instant'});
      };
      const observer='ResizeObserver' in window ? new ResizeObserver(align) : null;
      const initial=requestAnimationFrame(align);
      const timer=setTimeout(interrupt,1000);
      cancelLanding=()=>{
        cancelAnimationFrame(initial);
        clearTimeout(timer);
        observer?.disconnect();
        controller.abort();
        cancelLanding=null;
      };
      observer?.observe(main);
      for(const type of ['wheel','touchstart','pointerdown','keydown']){
        addEventListener(type,interrupt,{once:true,passive:true,signal:controller.signal});
      }
    });
  }
  document.body.classList.add('case-toc-ready');
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);addEventListener('pageshow',request);
  if(restoredEntry&&hero&&'ResizeObserver' in window)new ResizeObserver(request).observe(hero);
  update();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
