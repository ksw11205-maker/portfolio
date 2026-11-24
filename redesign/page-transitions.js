// A parser-blocking head script registers pagereveal before the first paint.
// No click interception, navigation delay or permanent page-cover element.
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const root=document.documentElement;
  const navigationType=performance.getEntriesByType('navigation')[0]?.type;
  if(navigationType==='back_forward'||navigationType==='reload'){
    // Native history restores the saved Y. Do not then add the Work spacer's
    // height a second time through automatic scroll anchoring during module setup.
    root.dataset.restoringLayout='';
    const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>addEventListener('load',resolve,{once:true}));
    Promise.all([loaded,document.fonts?.ready]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>delete root.dataset.restoringLayout))));
  }
  addEventListener('pageswap',event=>{
    dispatchEvent(new Event('portfolio:navigating'));
    if(reduced.matches||document.body?.classList.contains('motion-paused'))event.viewTransition?.skipTransition();
  });
  addEventListener('pagereveal',event=>{
    const root=document.documentElement,activation=window.navigation?.activation;
    const from=activation?.from;
    const to=activation?.entry;
    let back=activation?.navigationType==='traverse'&&to?.index<from?.index;
    if(from?.url){
      const previous=new URL(from.url);
      back ||= previous.pathname.startsWith('/work/')&&!location.pathname.startsWith('/work/');
    }
    root.dataset.pageDirection=back?'back':'forward';
    if(reduced.matches||document.body?.classList.contains('motion-paused'))event.viewTransition?.skipTransition();
    event.viewTransition?.finished.finally(()=>delete root.dataset.pageDirection);
  });
})();
