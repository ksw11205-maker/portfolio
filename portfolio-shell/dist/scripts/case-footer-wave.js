const footer = document.querySelector('.case-footer');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

if (footer && 'IntersectionObserver' in window) {
  let nearFooter = false;
  const observer = new IntersectionObserver(([entry]) => {
    nearFooter = entry.isIntersecting;
    start();
  }, { rootMargin: '160px' });

  function start() {
    if (!nearFooter || reduced.matches) return;
    observer.disconnect();
    reduced.removeEventListener('change', start);
    import('../hero-waves.js')
      .then(({ initHeroWaves }) => initHeroWaves({ hero: footer, reduced, amplitude: .65, motionLimit: 4.5 }))
      .catch(() => {});
  }

  observer.observe(footer);
  reduced.addEventListener('change', start);
}
