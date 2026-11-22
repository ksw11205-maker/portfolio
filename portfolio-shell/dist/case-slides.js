/* Adapted from GSAP's Slides Pinning – Overscroll Solution (MIT).
 * https://codepen.io/GreenSock/pen/bGRdvMy
 * License: /vendor/slides-pinning/LICENSE.txt
 * Keep tall chapters in native document flow; only pin their exit transition.
 */
import { initReadingSnap } from '/reading-snap.js';
import { initCaseSteps, stepPosition, stepReadingPoints, stepRanges } from '/case-steps.js';

const header = document.querySelector('.case-shared');
const chapters = [...document.querySelectorAll('main section')].filter(section =>
  !section.matches('.project-cover') && !section.parentElement.closest('section'));

let entries = [];
let timelines = [];
let readingController;

function readingOffset() {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || header.offsetHeight + 56;
}
function withinSurface(target, surface) {
  let top = 0;
  for (let node = target; node && node !== surface; node = node.offsetParent) top += node.offsetTop;
  return top;
}
function readingStart(entry, offset = readingOffset()) {
  const staged = stepPosition(entry.section);
  if(staged !== null)return staged;
  const target = entry.section.querySelector('.chapter-label,.section-intro,.section-head,.eyebrow') || entry.section.firstElementChild || entry.section;
  return naturalTop(entry.frame) + withinSurface(target, entry.surface) - offset;
}
function readingPoints(offset) {
  const available = Math.max(200, innerHeight - offset - 32);
  const points = [];
  entries.forEach((entry, index) => {
    const staged=stepReadingPoints(entry.section);
    if(staged){points.push(...staged);return;}
    const first = readingStart(entry, offset);
    const last = Math.max(first, timelines[index]?.scrollTrigger.start ??
      naturalTop(entry.frame) + entry.surface.offsetHeight - innerHeight + 32);
    const count = Math.max(1, Math.ceil((last - first) / (available * .8)));
    entry.frame.dataset.readStart = String(first);
    entry.frame.dataset.readEnd = String(last);
    const stops = [first];
    for (let page = 1; page <= count; page++) stops.push(first + (last - first) * page / count);
    entry.frame.dataset.readStops = JSON.stringify(stops);
    points.push(first);
    const radius = Math.min(64, ((last - first) / count) * .3);
    points.push(...stops.slice(1).map(top => ({ top, radius })));
  });
  return points;
}
function transitionRanges() {
  return [...stepRanges(), ...timelines.map((timeline, index) => {
    const { start, end } = timeline.scrollTrigger;
    entries[index].frame.dataset.transitionStart = String(start);
    entries[index].frame.dataset.transitionEnd = String(end);
    return { start, end };
  })];
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src; script.onload = resolve; script.onerror = reject;
    document.head.append(script);
  });
}
function backgroundFor(section) {
  for (let node = section; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
  }
  return '#0b0d10';
}
function naturalTop(frame) {
  // ScrollTrigger's spacer stays in document flow even while its child is fixed.
  let top = 0;
  const node = frame.parentElement?.classList.contains('pin-spacer') ? frame.parentElement : frame;
  for (let item = node; item; item = item.offsetParent) top += item.offsetTop;
  return top;
}
async function init() {
  if (!header || chapters.length < 2) return;
  readingController = initReadingSnap({ header, getPoints: readingPoints, getRanges: transitionRanges });
  if (!window.gsap) await loadScript('/vendor/gsap/gsap.min.js');
  if (!window.ScrollTrigger) await loadScript('/vendor/gsap/ScrollTrigger.min.js');
  await document.fonts.ready;
  initCaseSteps();
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    entries = chapters.map((section, index) => {
      const frame = document.createElement('div');
      const surface = document.createElement('div');
      frame.className = 'case-slide-frame';
      if (index === chapters.length - 1) frame.classList.add('case-slide-frame--last');
      surface.className = 'case-slide-surface';
      surface.style.backgroundColor = backgroundFor(section);
      section.before(frame); frame.append(surface); surface.append(section);
      return { section, frame, surface };
    });
    document.documentElement.dataset.caseSlides = 'active';
    timelines = entries.slice(0, -1).map(({ section, frame, surface }, index) => {
      const tl = gsap.timeline({ scrollTrigger: {
        id: 'case-slide-' + section.id,
        trigger: frame,
        start: () => naturalTop(frame) + frame.offsetHeight - innerHeight,
        end: () => readingStart(entries[index + 1]),
        pin: frame, pinSpacing: false, scrub: true,
        invalidateOnRefresh: true,
      }});
      // Keep the last reading view intact before a restrained depth transition.
      // The incoming opaque chapter covers this surface; text never fades away.
      // On gesture end, reading-snap settles to either full-size reading endpoint.
      tl.set(surface, { scale: 1, opacity: 1 })
        .to(surface, { scale: 1, duration: .3, ease: 'none' })
        .to(surface, {
          scale: () => parseFloat(getComputedStyle(surface).getPropertyValue('--case-exit-scale')) || .94,
          duration: .7, ease: 'sine.inOut',
        });
      return tl;
    });
    // Initial deep links can be displaced by a later pin/font layout refresh.
    // Follow that destination only until the first reader input, never while reading.
    const initialHash = location.hash;
    let initialAnchorActive = !!initialHash && performance.getEntriesByType('navigation')[0]?.type === 'navigate';
    let initialAnchorFrame = 0;
    function stopInitialAnchor() {
      initialAnchorActive = false;
      cancelAnimationFrame(initialAnchorFrame);
    }
    function settleInitialAnchor() {
      if (!initialAnchorActive || location.hash !== initialHash) return;
      cancelAnimationFrame(initialAnchorFrame);
      initialAnchorFrame = requestAnimationFrame(() => {
        initialAnchorFrame = requestAnimationFrame(() => {
          if (initialAnchorActive && location.hash === initialHash) followHash();
        });
      });
    }
    const initialInputs = ['wheel', 'pointerdown', 'touchstart', 'keydown', 'hashchange'];
    initialInputs.forEach(type => addEventListener(type, stopInitialAnchor, { capture: true, passive: true }));
    const syncReading = () => { readingController.refresh(); settleInitialAnchor(); };
    ScrollTrigger.addEventListener('refresh', syncReading);
    let refreshTimer;
    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => { ScrollTrigger.refresh(); readingController.refresh(); }, 120);
    };
    // Lazy images, disclosure widgets and resizing must not leave stale pins.
    const heights = new WeakMap();
    const observer = new ResizeObserver(items => {
      let changed = false;
      for (const item of items) {
        const height = item.borderBoxSize?.[0]?.blockSize ?? item.contentRect.height;
        if (heights.has(item.target) && Math.abs(heights.get(item.target) - height) > 1) changed = true;
        heights.set(item.target, height);
      }
      if (changed) refresh();
    });
    entries.forEach(({section}) => observer.observe(section));
    ScrollTrigger.refresh();
    readingController.refresh();
    function anchorTarget() {
      if (!location.hash) return null;
      let target;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
      catch { return null; }
      const staged=stepPosition(target);if(staged !== null)return staged;
      const index = entries.findIndex(({section}) => section === target || section.contains(target));
      if (index < 0) return null;
      const { frame, surface, section } = entries[index];
      if (target === section) return Math.max(0, readingStart(entries[index]));
      // A pinned/transformed element's client rect is not its document address.
      const top = naturalTop(frame);
      let within = 0;
      if (target !== section) {
        for (let node = target; node && node !== surface; node = node.offsetParent) within += node.offsetTop;
      }
      return Math.max(0, Math.min(top + within - readingOffset(), timelines[index]?.scrollTrigger.start ?? Infinity));
    }
    const followHash = () => {
      const top = anchorTarget();
      if (top !== null) { readingController.cancel?.(); window.scrollTo({top, behavior: 'instant'}); }
    };
    const followLink = event => {
      const link = event.target.closest('a[href]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const oldHash = location.hash;
      // Only handle anchors belonging to the enhanced chapters.
      let target;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!entries.some(({section}) => section === target || section.contains(target))) return;
      event.preventDefault();
      if (oldHash !== url.hash) history.pushState(null, '', url.hash);
      followHash();
    };
    let focusFrame;
    const followFocus = event => {
      const target = event.target;
      const index = entries.findIndex(({section}) => section.contains(target));
      if (index < 0) return;
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const trigger = timelines[index]?.scrollTrigger;
        if (rect.top >= header.offsetHeight + 12 && rect.bottom <= innerHeight - 12 && !(trigger?.progress > 0)) return;
        const {frame, surface} = entries[index];
        const top = naturalTop(frame);
        let within = 0;
        for (let node = target; node && node !== surface; node = node.offsetParent) within += node.offsetTop;
        readingController.cancel?.();
        scrollTo({top: Math.max(0, Math.min(top + within - header.offsetHeight - 24, trigger?.start ?? Infinity)), behavior: 'instant'});
      });
    };
    document.addEventListener('focusin', followFocus);
    addEventListener('hashchange', followHash);
    document.addEventListener('click', followLink);
    followHash();
    settleInitialAnchor();
    return () => {
      stopInitialAnchor();
      initialInputs.forEach(type => removeEventListener(type, stopInitialAnchor, true));
      readingController.cancel?.();
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('focusin', followFocus);
      removeEventListener('hashchange', followHash);
      document.removeEventListener('click', followLink);
      clearTimeout(refreshTimer); observer.disconnect();
      ScrollTrigger.removeEventListener('refresh', syncReading);
      timelines.forEach(tl => { tl.scrollTrigger?.kill(); tl.kill(); });
      entries.forEach(({section, frame}) => { frame.before(section); frame.remove(); });
      entries = []; timelines = [];
      readingController.refresh();
      delete document.documentElement.dataset.caseSlides;
    };
  });
  // Native hash/focus navigation continues to target the actual chapter.
  // Reduced motion leaves the original static DOM intact.
}
init().catch(error => console.warn('Chapter transitions unavailable; native reading remains enabled.', error));
