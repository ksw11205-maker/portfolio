// Runs before body paint. Failure never leaves the static content hidden.
(()=>{
  if(location.pathname.startsWith('/work/'))return;
  const type=performance.getEntriesByType('navigation')[0]?.type;
  const deep=location.hash&&!['#home','#main'].includes(location.hash);
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||type==='back_forward'||(deep&&type!=='reload'))return;
  document.documentElement.classList.add('intro-pending');
  setTimeout(()=>document.documentElement.classList.remove('intro-pending'),3200);
  addEventListener('pagehide',()=>document.documentElement.classList.remove('intro-pending'),{once:true});
})();
