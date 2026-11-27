// The blue rule follows the reading position and remains on the end card.
document.addEventListener('DOMContentLoaded', () => {
  const deck = document.querySelector('#qa .qa-deck');
  const viewport = document.querySelector('#qa .qa-viewport');
  if (!deck || !viewport) return;
  const qa = deck.closest('#qa');
  const cards = [...deck.querySelectorAll('.qa-card')];
  if (!cards.length) return;
  let current;
  let frame = 0;

  function update() {
    frame = 0;
    const pinned = qa.classList.contains('is-scroll-driven');
    const nativeRange = deck.scrollWidth - deck.clientWidth;
    const horizontal = pinned || nativeRange > 2;
    const clip = (pinned ? viewport : deck).getBoundingClientRect();
    const top = Math.max(0, clip.top);
    const bottom = Math.min(innerHeight, clip.bottom);
    const left = Math.max(0, clip.left);
    const right = Math.min(document.documentElement.clientWidth, clip.right);
    if (bottom <= top || right <= left) return;

    let next;
    if (pinned && (qa.hasAttribute('data-at-reading-end') || deck.getBoundingClientRect().right <= right + 2)) {
      next = cards.at(-1);
    } else if (!pinned && horizontal && deck.scrollLeft >= nativeRange - 2) {
      next = cards.at(-1);
    } else if (!pinned && horizontal && deck.scrollLeft <= 2) {
      next = cards[0];
    } else {
      let closest = Infinity;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        if (rect.right <= left || rect.left >= right || rect.bottom <= top || rect.top >= bottom) continue;
        const distance = horizontal
          ? Math.abs((rect.left + rect.right - left - right) / 2)
          : Math.abs((rect.top + rect.bottom - top - bottom) / 2);
        if (distance <= closest) {
          next = card;
          closest = distance;
        }
      }
    }

    if (!next || next === current) return;
    current?.classList.remove('shell-qa-current');
    current = next;
    current.classList.add('shell-qa-current');
  }

  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', schedule);
  deck.addEventListener('scroll', schedule, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(deck);
  schedule();
}, { once: true });
