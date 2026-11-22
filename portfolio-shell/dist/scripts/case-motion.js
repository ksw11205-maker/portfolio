/* Case studies: reveal new content once; never fade away text already read. */
(() => {
  const boot = () => {
    const body = document.body;
    if (body?.dataset.page !== 'case' || body.dataset.caseMotionReady) return;
    body.dataset.caseMotionReady = 'true';
    if (!('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = body.classList.contains('is-motion-paused');
    try { paused ||= sessionStorage.getItem('ksw-motion-paused') === 'true'; } catch {}
    const targets = [...document.querySelectorAll(
      'main .case-section, main .ui-showcase, main .next-projects:not(.case-next), ' +
      'main .case-section > figure, main .case-section > article.tool-story, ' +
      'main .case-section > .results-collection, main .case-section > .layout-comparison, ' +
      'main .case-section > .cafe-taste-layout, main .case-section > .cafe-explore-layout, ' +
      'main .case-section > .cafe-return-layout, main .case-section > .offer-responsive'
    )].filter(node => node.getBoundingClientRect().height > 0);
    const visible = new WeakSet();
    let observer;
    const enabled = () => !reduced.matches && !paused;
    const reveal = el => {
      visible.add(el);
      el.classList.add('is-reading-visible');
      observer?.unobserve(el);
    };
    function sync() {
      body.classList.toggle('case-motion-enhanced',enabled());
      if (!enabled()) targets.forEach(el => el.classList.add('is-reading-visible'));
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    targets.forEach(el => {
      el.setAttribute('data-reading-fade','');
      if (el.getBoundingClientRect().top < innerHeight * .96 || !enabled()) reveal(el);
      else observer.observe(el);
    });
    sync();
    document.addEventListener('portfolio:motion-change', event => {
      paused = !!event.detail?.paused;
      sync();
    });
    reduced.addEventListener('change',sync);
    addEventListener('pageshow', () => {
      targets.forEach(el => {
        if (!visible.has(el) && el.getBoundingClientRect().top < innerHeight) reveal(el);
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
