const boot=()=>{
  const clearImageTips=()=>document.querySelectorAll('[title]').forEach(el=>{
    if((el.matches('img,.image-button')||el.querySelector('img'))&&!el.closest('.hero-brand,.brand-experience'))el.removeAttribute('title');
  });
  clearImageTips();
  new MutationObserver(clearImageTips).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
  if(document.body.dataset.page!=='case')return;
  const toc=document.querySelector('.case-toc'),hero=document.querySelector('.archive-hero');
  // Keep the chapter links immediately after the cover on tablet/mobile, even
  // when an interface showcase precedes them in the older case markup.
  if(toc&&hero&&toc.previousElementSibling!==hero)hero.after(toc);
  const links=[...document.querySelectorAll('.case-nav a[href^="#"]')].map(link=>({link,section:document.querySelector(link.hash)})).filter(x=>x.section);
  let frame=0;
  const update=()=>{
    frame=0;
    const header=document.querySelector('.header');
    const revealAfter=Math.max(72,(header?.getBoundingClientRect().bottom||72)+12);
    const isAfterCover=!hero||hero.getBoundingClientRect().bottom<=Math.max(revealAfter,124);
    toc?.classList.toggle('is-after-cover',isAfterCover);
    if(toc)toc.inert=document.querySelector('link[href="/styles/master-editorial.css"]')?false:!isAfterCover;
    const current=links.filter(x=>x.section.getBoundingClientRect().top<=Math.min(260,innerHeight*.3)).at(-1)||links[0];
    links.forEach(x=>{if(x===current)x.link.setAttribute('aria-current','location');else x.link.removeAttribute('aria-current')});
  };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update)};
  document.body.classList.add('case-toc-ready');
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);update();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
