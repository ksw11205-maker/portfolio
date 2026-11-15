const boot=()=>{
  // Alt and aria labels stay intact; only visual hover tooltips are removed.
  const removeTips=root=>root.querySelectorAll('[title]').forEach(el=>{
    if((el.matches('img,.image-button')||el.querySelector('img'))&&!el.closest('.hero-brand,.brand-experience'))el.removeAttribute('title');
  });
  removeTips(document);
  new MutationObserver(()=>removeTips(document)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
  if(document.body.dataset.page!=='case'){
    const compact=matchMedia('(max-width:1000px)');
    const groups=[...document.querySelectorAll('#about .profile-details>div')].map(group=>{
      const label=group.querySelector('.eyebrow')?.textContent;if(!label)return null;
      const details=document.createElement('details');details.className='profile-group';
      const summary=document.createElement('summary');summary.textContent=label;details.append(summary);
      [...group.childNodes].forEach(node=>details.append(node));group.append(details);return details;
    }).filter(Boolean);
    const sync=()=>groups.forEach(group=>group.open=!compact.matches);sync();compact.addEventListener('change',sync);return;
  }
  const menu=document.querySelector('.header .menu'),nav=document.querySelector('.header nav');
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}});
  const toc=document.querySelector('.case-toc'),hero=document.querySelector('.archive-hero');
  const links=[...document.querySelectorAll('.case-nav a[href^="#"]')].map(link=>({link,section:document.querySelector(link.hash)})).filter(x=>x.section);
  const mobile=matchMedia('(max-width:1100px)');
  const arrange=()=>{if(toc)toc.open=!mobile.matches};arrange();mobile.addEventListener('change',arrange);
  links.forEach(({link})=>link.addEventListener('click',()=>{if(mobile.matches)toc.open=false}));
  let frame=0;
  const update=()=>{
    frame=0;const cover=hero?.getBoundingClientRect();
    toc?.classList.toggle('is-cover-visible',!!cover&&cover.bottom>innerHeight*.45);
    const line=Math.min(260,innerHeight*.3);
    const current=links.filter(x=>x.section.getBoundingClientRect().top<=line).at(-1)||links[0];
    links.forEach(x=>{if(x===current)x.link.setAttribute('aria-current','location');else x.link.removeAttribute('aria-current')});
  };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update)};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);update();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
