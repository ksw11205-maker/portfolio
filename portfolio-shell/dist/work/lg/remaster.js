'use strict';
(() => {
  const header = document.getElementById('site-header');
  const setScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
  window.addEventListener('scroll', setScrolled, { passive: true });
  setScrolled();
  const menuToggle = header?.querySelector('.shell-menu-toggle');
  const menu = header?.querySelector('.header-nav');
  const setMenuOpen = (open) => {
    header?.classList.toggle('is-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };
  menuToggle?.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header?.classList.contains('is-open')) {
      setMenuOpen(false);
      menuToggle?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (header?.classList.contains('is-open') && !header.contains(event.target)) setMenuOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) setMenuOpen(false);
  });
  const targets = ['research','evidence','interface'];
  const links = [...document.querySelectorAll('.header-nav a')];
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          links.forEach(link => {
            const selected = link.getAttribute('href') === '#' + e.target.id;
            if (selected) link.setAttribute('aria-current','location');
            else link.removeAttribute('aria-current');
          });
        }
      }
    }, { rootMargin: '-25% 0px -65% 0px' });
    targets.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
  }
})();
