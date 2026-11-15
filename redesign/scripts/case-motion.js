/* Scroll-linked reading fades. Covers and native scrolling stay intact. */
(() => {
  const boot = () => {
    const body = document.body;
    if (body?.dataset.page !== 'case' || body.dataset.caseMotionReady) return;
    body.dataset.caseMotionReady = 'true';
    if (!('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = body.classList.contains('is-motion-paused');
    try { paused ||= sessionStorage.getItem('ksw-motion-paused') === 'true'; } catch {}
    let targets = [], frame = 0, rebuildFrame = 0;
    const nearby = new Set();
    const clamp = n => Math.max(0, Math.min(1, n));
    const enabled = () => !reduced.matches && !paused;
    const roots = [...document.querySelectorAll('main .case-section, main .ui-showcase, main .next-projects')]
      .filter(node => !node.parentElement.closest('.case-section'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) nearby.add(target);
        else { nearby.delete(target); target.style.setProperty('--reading-opacity', '0'); }
      });
      request();
    }, {rootMargin:'100px 0px', threshold:0});
    function draw() {
      frame = 0;
      if (!enabled() || document.hidden) return;
      const height = innerHeight;
      const navBottom = document.querySelector('.case-nav')?.getBoundingClientRect().bottom || 0;
      const topEdge = Math.max(24, Math.min(90, navBottom));
      nearby.forEach(node => {
        const rect = node.getBoundingClientRect();
        const enter = clamp((height - rect.top) / Math.min(160, height * .18));
        const leave = clamp((rect.bottom - topEdge) / Math.min(120, height * .14));
        node.style.setProperty('--reading-opacity', Math.min(enter, leave).toFixed(3));
      });
    }
    function request() { if (!frame) frame = requestAnimationFrame(draw); }
    function rebuild() {
      observer.disconnect(); nearby.clear();
      targets.forEach(node => { node.removeAttribute('data-reading-fade'); node.style.removeProperty('--reading-opacity'); });
      targets = [];
      // Never split screenshots from their annotations. Subdivide long chapters.
      const collect = node => {
        const children = [...node.children].filter(child => !child.matches('script, style, svg') && child.getBoundingClientRect().height > 0);
        const indivisible = node.matches('figure, .annotated-interface, .annotation-stage, .ui-showcase, .next-projects, table');
        if (!indivisible && children.length && node.getBoundingClientRect().height > Math.max(620, innerHeight * .8)) children.forEach(collect);
        else targets.push(node);
      };
      roots.forEach(collect);
      targets.forEach(node => { node.setAttribute('data-reading-fade', ''); observer.observe(node); nearby.add(node); });
      draw();
    }
    const scheduleRebuild = () => {
      if (!rebuildFrame) rebuildFrame = requestAnimationFrame(() => { rebuildFrame = 0; rebuild(); });
    };
    function sync() {
      body.classList.toggle('case-motion-enhanced', enabled());
      if (enabled()) { targets.forEach(node => nearby.add(node)); request(); }
      else targets.forEach(node => node.style.removeProperty('--reading-opacity'));
    }
    addEventListener('scroll', request, {passive:true});
    addEventListener('resize', scheduleRebuild, {passive:true});
    addEventListener('pageshow', () => { targets.forEach(node => nearby.add(node)); request(); });
    document.addEventListener('visibilitychange', request);
    document.addEventListener('portfolio:motion-change', event => { paused = !!event.detail?.paused; sync(); });
    reduced.addEventListener('change', sync);
    const resize = new ResizeObserver(scheduleRebuild);
    roots.forEach(node => resize.observe(node));
    document.fonts?.ready.then(scheduleRebuild);
    rebuild(); sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
