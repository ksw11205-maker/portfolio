const boot=()=>{
  const clearImageTips=()=>document.querySelectorAll('[title]').forEach(el=>{
    if((el.matches('img,.image-button')||el.querySelector('img'))&&!el.closest('.hero-brand,.brand-experience'))el.removeAttribute('title');
  });
  clearImageTips();
  new MutationObserver(clearImageTips).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
  if(document.body.dataset.page!=='case')return;
  const toc=document.querySelector('.case-toc'),hero=document.querySelector('.archive-hero');
  const links=[...document.querySelectorAll('.case-nav a[href^="#"]')].map(link=>({link,section:document.querySelector(link.hash)})).filter(x=>x.section);
  let frame=0;
  const update=()=>{
    frame=0;
    toc?.classList.toggle('is-cover-visible',!!hero&&hero.getBoundingClientRect().bottom>innerHeight*.45);
    const current=links.filter(x=>x.section.getBoundingClientRect().top<=Math.min(260,innerHeight*.3)).at(-1)||links[0];
    links.forEach(x=>{if(x===current)x.link.setAttribute('aria-current','location');else x.link.removeAttribute('aria-current')});
  };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update)};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);update();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
