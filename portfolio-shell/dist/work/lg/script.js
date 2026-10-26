/* Progressive enhancement: all research content is present in static HTML. */
(() => {
  const header=document.querySelector('.topbar'),reflection=document.querySelector('#reflection');
  let motion;
  const showAll=()=>{
    document.querySelectorAll('[data-reveal],[data-reveal-item]').forEach(n=>{n.style.removeProperty('opacity');n.style.removeProperty('visibility');n.style.removeProperty('transform');});
    document.querySelectorAll('[data-count]').forEach(n=>n.textContent=Number(n.dataset.count).toFixed(2));
  };
  function initMotion(){
    if(!window.gsap||!window.ScrollTrigger){showAll();return;}
    const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);motion=gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)',()=>{
      const distance=matchMedia('(max-width:600px)').matches?12:20;
      if(performance.getEntriesByType('navigation')[0]?.type!=='back_forward'){
        gsap.fromTo('.hero-copy > *',{y:distance,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,stagger:.12,ease:'power2.out',clearProps:'transform,opacity,visibility'});
      }
      document.querySelectorAll('[data-reveal-group]').forEach(group=>{
        const nodes=group.querySelectorAll('[data-reveal-item]');if(!nodes.length)return;
        const stagger=Math.min(.08,.32/Math.max(1,nodes.length-1));
        gsap.fromTo(nodes,{y:distance,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,stagger,ease:'power2.out',clearProps:'transform,opacity,visibility',scrollTrigger:{trigger:group,start:'top 90%',once:true}});
      });
      document.querySelectorAll('[data-reveal]').forEach(node=>{
        gsap.fromTo(node,{y:distance,autoAlpha:0},{y:0,autoAlpha:1,duration:.65,ease:'power2.out',clearProps:'transform,opacity,visibility',scrollTrigger:{trigger:node,start:'top 92%',once:true}});
      });
      document.querySelectorAll('[data-count]').forEach(node=>{
        const value={n:0},final=Number(node.dataset.count);
        gsap.to(value,{n:final,duration:1.15,ease:'power2.out',onUpdate:()=>{node.textContent=value.n.toFixed(2);},onComplete:()=>{node.textContent=final.toFixed(2);},scrollTrigger:{trigger:node.closest('.model-card'),start:'top 85%',once:true}});
      });
      return showAll;
    });
    motion.add('(prefers-reduced-motion: reduce)',showAll);
    document.fonts?.ready.then(()=>ScrollTrigger.refresh());
    // All figures reserve their dimensions in HTML. Per-image refreshes would
    // interrupt native anchor navigation while lazy images enter the viewport.
    addEventListener('pageshow',()=>ScrollTrigger.refresh());
  }
  try{initMotion();}catch(error){motion?.revert();showAll();}
  if(reflection&&header){
    const update=()=>header.classList.toggle('is-light',reflection.getBoundingClientRect().top<=64);
    let ticking=false;addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{update();ticking=false;});}},{passive:true});addEventListener('pageshow',update);update();
  }
  const dialog=document.querySelector('.image-dialog'),image=dialog?.querySelector('.zoom-image'),title=dialog?.querySelector('#image-dialog-title'),viewport=dialog?.querySelector('.zoom-viewport'),size=dialog?.querySelector('.zoom-size');
  if(!dialog||!image||!viewport||!size||!title)return;
  let opener;
  document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;image.src=button.dataset.zoom;image.alt=button.dataset.zoomTitle||'화면 확대';title.textContent=image.alt;
    viewport.classList.add('is-fit');size.setAttribute('aria-pressed','false');size.textContent='원본 크기';
    document.body.classList.add('image-open');dialog.showModal();viewport.scrollTo(0,0);
  }));
  const close=()=>{if(dialog.open)dialog.close();};
  dialog.querySelector('.dialog-close').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('image-open');opener?.focus({preventScroll:true});});
  size.addEventListener('click',()=>{const fit=viewport.classList.toggle('is-fit');size.setAttribute('aria-pressed',String(!fit));size.textContent=fit?'원본 크기':'화면에 맞추기';viewport.scrollTo(0,0);});
})();
