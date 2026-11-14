/* Native scrolling and small, independent enhancements. The HTML works without JS. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
try { userPaused = sessionStorage.getItem('ksw-motion-paused') === 'true'; } catch {}
const motionPaused = () => userPaused || reduced.matches;
function syncMotion() {
  document.body.classList.toggle('is-motion-paused', motionPaused());
  document.querySelectorAll('[data-motion-toggle]').forEach(button => {
    button.disabled = reduced.matches;
    button.setAttribute('aria-pressed', String(motionPaused()));
    button.setAttribute('aria-label', reduced.matches ? '시스템 설정에 따라 모션이 축소됨' : motionPaused() ? '연속 모션 재생' : '연속 모션 정지');
    button.querySelector('[data-motion-label]').textContent = reduced.matches ? 'MOTION REDUCED' : motionPaused() ? 'RESUME MOTION' : 'PAUSE MOTION';
    button.querySelector('[data-motion-icon]').textContent = motionPaused() ? '▷' : 'Ⅱ';
  });
  document.dispatchEvent(new CustomEvent('portfolio:motion-change', { detail: { paused: motionPaused() } }));
}
document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
  userPaused = !motionPaused();
  try { sessionStorage.setItem('ksw-motion-paused', String(userPaused)); } catch {}
  syncMotion();
}));
reduced.addEventListener('change', syncMotion);
syncMotion();

const menuToggle = document.querySelector('.menu-toggle');
const menu = menuToggle && document.getElementById(menuToggle.getAttribute('aria-controls'));
if (menuToggle && menu) {
  const setMenu = open => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setMenu(false); menuToggle.focus(); }
    if (event.key === 'Tab') {
      const items = [...document.querySelectorAll('.site-header a, .site-header button')].filter(el => el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  matchMedia('(min-width:641px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
}

// Section navigation never changes the scroll position by script.
const localLinks = [...document.querySelectorAll('.site-nav a[href^="#"], .case-nav a[href^="#"]')];
const sectionLinks = localLinks.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) })).filter(x => x.section);
if (sectionLinks.length && 'IntersectionObserver' in window) {
  const visible = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target, entry.isIntersecting));
    const current = sectionLinks.filter(x => visible.get(x.section)).sort((a, b) => Math.abs(a.section.getBoundingClientRect().top - 100) - Math.abs(b.section.getBoundingClientRect().top - 100))[0];
    sectionLinks.forEach(({ link, section }) => {
      if (current?.section === section) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-90px 0px -40% 0px', threshold: 0 });
  sectionLinks.forEach(({ section }) => observer.observe(section));
}

// One destination, two entry points: cover button OR floating button.
const coverCTA = document.querySelector('[data-prototype-cover]');
const floatingCTA = document.querySelector('[data-prototype-float]');
if (coverCTA && floatingCTA && 'IntersectionObserver' in window) {
  const hero = coverCTA.closest('.case-hero');
  const end = document.querySelector('.next-projects');
  let heroVisible = true, endVisible = false;
  const syncCTA = () => {
    const hide = heroVisible || endVisible;
    if (hide && document.activeElement === floatingCTA) {
      if (heroVisible) coverCTA.focus({ preventScroll: true });
      else end?.querySelector('a')?.focus({ preventScroll: true });
    }
    floatingCTA.hidden = hide;
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === end) endVisible = entry.isIntersecting;
    });
    syncCTA();
  }, { threshold: 0, rootMargin: '0px 0px -15px 0px' });
  observer.observe(hero);
  if (end) observer.observe(end);
}

const track = document.querySelector('[data-qa-track]');
if (track) {
  const prev = document.querySelector('[data-qa-prev]'), next = document.querySelector('[data-qa-next]');
  const progress = document.querySelector('[data-qa-progress]');
  const step = () => (track.querySelector('.qa-card')?.getBoundingClientRect().width || 320) + parseFloat(getComputedStyle(track).gap || 0);
  const move = direction => track.scrollBy({ left: direction * step(), behavior: motionPaused() ? 'instant' : 'smooth' });
  prev?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Home') { event.preventDefault(); track.scrollTo({ left: 0, behavior: motionPaused() ? 'instant' : 'smooth' }); }
    if (event.key === 'End') { event.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: motionPaused() ? 'instant' : 'smooth' }); }
  });
  const syncTrack = () => {
    const max = track.scrollWidth - track.clientWidth;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
    if (progress) progress.style.width = `${max > 0 ? 20 + Math.max(0, Math.min(1, track.scrollLeft / max)) * 80 : 100}%`;
  };
  track.addEventListener('scroll', syncTrack, { passive: true });
  new ResizeObserver(syncTrack).observe(track);
  syncTrack();
}

// Scroll-linked wave, batched to the display. Scrolling stays native.
const wave = document.querySelector('[data-wave]');
if (wave) {
  const paths = [...wave.querySelectorAll('path')];
  let frame = 0, inView = true;
  const drawWave = () => {
    frame = 0;
    if (!inView || motionPaused()) return;
    const rect = wave.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height * .45)));
    paths.forEach((path, i) => {
      const t = Math.max(0, Math.min(1, (p - i * .075) / .76));
      const y = 104 - t * 111;
      const bend = Math.sin(t * Math.PI) * (35 - i * 4);
      path.setAttribute('d', `M0 ${y + bend * .25} C25 ${y - bend} 65 ${y + bend * .7} 100 ${y - bend * .15} V102 H0 Z`);
    });
  };
  const requestWave = () => { if (!frame && inView && !motionPaused()) frame = requestAnimationFrame(drawWave); };
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; requestWave(); }, { rootMargin: '100px' }).observe(wave);
  addEventListener('scroll', requestWave, { passive: true });
  addEventListener('resize', requestWave, { passive: true });
  document.addEventListener('portfolio:motion-change', () => {
    if (motionPaused()) paths.forEach((path, i) => path.setAttribute('d', ['M0 35 Q50 -10 100 30V102H0Z', 'M0 58 Q50 15 100 53V102H0Z', 'M0 78 Q50 44 100 76V102H0Z'][i]));
    else requestWave();
  });
  requestWave();
}

const card = document.querySelector('[data-contact-card]');
if (card && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  let raf = 0;
  card.addEventListener('pointermove', event => {
    if (motionPaused() || raf) return;
    const x = event.clientX, y = event.clientY;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${-(y - r.top - r.height / 2) / r.height * 6}deg`);
      card.style.setProperty('--card-y', `${(x - r.left - r.width / 2) / r.width * 7}deg`);
    });
  });
  const resetCard = () => { cancelAnimationFrame(raf); raf = 0; card.style.removeProperty('--card-x'); card.style.removeProperty('--card-y'); };
  card.addEventListener('pointerleave', resetCard);
  document.addEventListener('portfolio:motion-change', resetCard);
}

const heroObject = document.querySelector('[data-hero-object]');
if (heroObject && !reduced.matches && !navigator.connection?.saveData) {
  import('./hero.js').then(({ createHero }) => createHero(heroObject, motionPaused())).catch(() => {
    // The original SVG mark is a complete, deliberate fallback.
    heroObject.classList.remove('is-ready');
  });
}
