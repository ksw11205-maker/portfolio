/* Finite, content-led motion for the four case studies.
   Images, annotation coordinates, research values and native scroll stay intact. */
(() => {
  const boot = () => {
    const body = document.body;
    if (body?.dataset.page !== 'case' || body.dataset.caseMotionReady) return;
    body.dataset.caseMotionReady = 'true';
    if (!('IntersectionObserver' in window) || typeof Element.prototype.animate !== 'function') return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const ease = 'cubic-bezier(.22,1,.36,1)';
    const active = new Set();
    const seen = new WeakSet();
    const targets = new Map();
    let userPaused = body.classList.contains('is-motion-paused');
    let disposed = false;
    try { userPaused ||= sessionStorage.getItem('ksw-motion-paused') === 'true'; } catch {}
    const allowed = () => !disposed && !reduced.matches && !userPaused && !document.hidden;

    function animate(element, frames, options = {}) {
      if (!element || !allowed()) return;
      const animation = element.animate(frames, {
        duration: 620, easing: ease, fill: 'none', ...options
      });
      active.add(animation);
      animation.finished.then(() => active.delete(animation), () => active.delete(animation));
    }
    function finishAll() {
      // No inline hidden states and no persistent fill: cancellation reveals
      // the authored final layout immediately, including on reduced-motion.
      active.forEach(animation => animation.cancel());
      active.clear();
    }
    const lift = (element, delay = 0, distance = 15) => animate(element, [
      { opacity: .45, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' }
    ], { delay });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        if (allowed()) targets.get(entry.target)?.();
        targets.delete(entry.target);
      });
    }, { threshold: .05, rootMargin: '0px 0px -8% 0px' });
    function observe(element, run) {
      if (!element || targets.has(element)) return;
      targets.set(element, run);
      observer.observe(element);
    }

    // A fast editorial introduction; no blocking loading screen or cover zoom.
    const hero = document.querySelector('.case-hero-copy');
    observe(hero, () => {
      const parts = [...hero.querySelectorAll('.case-type, .case-title, .case-hero-description, .case-meta, .prototype-link')];
      parts.forEach((element, index) => lift(element, Math.min(index * 65, 260), index === 1 ? 20 : 12));
    });

    // Only chapter headings move. Body copy remains fully readable in place.
    document.querySelectorAll('.case-section .case-heading').forEach(heading => {
      observe(heading, () => {
        const kicker = heading.previousElementSibling;
        if (kicker?.classList.contains('section-kicker')) lift(kicker, 0, 8);
        lift(heading, 65, 17);
      });
    });
    document.querySelectorAll('.tool-story-head, .product-section-intro, .offer-section-head').forEach(group => {
      // These groups already use the chapter-heading animation when present.
      if (group.querySelector('.case-heading')) return;
      observe(group, () => {
        [...group.children].forEach((element, index) => lift(element, index * 75, 12));
      });
    });

    // The image and boxes keep the exact same geometry. Opacity introduces
    // the numbered regions in reading order without scaling the UI itself.
    document.querySelectorAll('.research-ui-stage, .ui-annotated').forEach(stage => {
      observe(stage, () => {
        const regions = [...stage.querySelectorAll('.research-ui-region, .ui-focus')];
        regions.forEach((region, index) => {
          animate(region, [{ opacity: .12 }, { opacity: 1 }], { delay: index * 110, duration: 560 });
          animate(region.querySelector('b'), [
            { opacity: .35, scale: '.86' }, { opacity: 1, scale: '1' }
          ], { delay: 100 + index * 110, duration: 420 });
        });
      });
    });
    document.querySelectorAll('.research-ui-notes, .screen-notes').forEach(notes => {
      observe(notes, () => {
        [...notes.children].forEach((element, index) => lift(element, Math.min(index * 70, 210), 9));
      });
    });

    // The research module exclusively owns --value and the selected task.
    // This one-time scale only introduces the first comparison, then releases it.
    const chart = document.querySelector('[data-time-chart]');
    observe(chart, () => {
      [...chart.querySelectorAll('.time-track > span')].forEach((bar, index) => {
        animate(bar, [{ transform: 'scaleX(.12)' }, { transform: 'scaleX(1)' }], {
          duration: 720, delay: index * 70
        });
      });
    });
    document.querySelectorAll('[data-research-task]').forEach(button => {
      button.addEventListener('click', () => {
        // Selection is immediately legible if it occurs during first entry.
        if (chart) chart.querySelectorAll('.time-track > span').forEach(bar => {
          bar.getAnimations().forEach(animation => animation.cancel());
        });
      });
    });

    document.querySelectorAll('.research-reflection-qa > article, .reflection-qa > article').forEach(row => {
      observe(row, () => {
        const question = row.querySelector('h3');
        const answer = row.querySelector('p');
        lift(question, 0, 10);
        animate(answer, [{ opacity: .5 }, { opacity: 1 }], { delay: 90, duration: 520 });
      });
    });

    // Reading a numbered note gently emphasizes its corresponding UI region.
    // It adds no controls and does not make any information hover-dependent.
    document.querySelectorAll('figure').forEach(figure => {
      const stage = figure.querySelector('.research-ui-stage, .ui-annotated');
      const notes = figure.querySelector('.research-ui-notes, .screen-notes');
      if (!stage || !notes) return;
      const regions = [...stage.querySelectorAll('.research-ui-region, .ui-focus')];
      [...notes.children].forEach((note, index) => {
        const region = regions[index];
        if (!region) return;
        const highlight = () => {
          if (!fine.matches || !allowed()) return;
          region.classList.add('is-note-focused');
        };
        const clear = () => region.classList.remove('is-note-focused');
        note.addEventListener('pointerenter', highlight);
        note.addEventListener('pointerleave', clear);
        note.addEventListener('focusin', highlight);
        note.addEventListener('focusout', clear);
      });
    });

    const sync = () => {
      body.classList.toggle('case-motion-enhanced', !reduced.matches && !userPaused);
      if (!allowed()) {
        finishAll();
        document.querySelectorAll('.is-note-focused').forEach(node => node.classList.remove('is-note-focused'));
      }
    };
    reduced.addEventListener('change', sync);
    document.addEventListener('portfolio:motion-change', event => {
      userPaused = !!event.detail?.paused;
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    addEventListener('pagehide', event => {
      finishAll();
      if (!event.persisted) { disposed = true; observer.disconnect(); targets.clear(); }
    });
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
