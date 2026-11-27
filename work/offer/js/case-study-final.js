const widePage = matchMedia('(min-width: 1200px)');
const ns = 'http://www.w3.org/2000/svg';
const notesSeen = new WeakSet();
const rails = [...document.querySelectorAll('.case-page-board')];
const pending = new Set();
let frameId = 0;

function layoutRails(board) {
  if (!widePage.matches) return;
  const svg = board.querySelector('.case-page-arrows');
  const image = board.querySelector('.case-page-image img');
  const frame = board.getBoundingClientRect();
  const bounds = image.getBoundingClientRect();
  if (!frame.width || !bounds.height) return;

  svg.replaceChildren();
  svg.setAttribute('viewBox', `0 0 ${frame.width} ${frame.height}`);
  for (const side of ['start', 'end']) {
    const left = side === 'start';
    const items = [...board.querySelectorAll('[data-side="' + side + '"]')].map(el => ({
      el,
      y: bounds.top - frame.top + Number(el.dataset.y) * bounds.height,
      height: el.offsetHeight,
    })).sort((a, b) => a.y - b.y);

    let end = 0;
    for (const item of items) {
      item.top = Math.max(item.y - 16, end);
      end = item.top + item.height + 10;
    }
    let limit = frame.height;
    for (const item of [...items].reverse()) {
      item.top = Math.max(0, Math.min(item.top, limit - item.height));
      limit = item.top - 10;
    }

    for (const { el, top, y } of items) {
      el.style.top = top + 'px';
      if (el.hasAttribute('data-no-arrow')) continue;
      const label = el.getBoundingClientRect();
      const x1 = (left ? label.right : label.left) - frame.left + (left ? 4 : -4);
      const x2 = (left ? bounds.left : bounds.right) - frame.left + (left ? 1 : -1);
      const headX = x2 - Math.sign(x2 - x1) * 5;
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M ${x1} ${y} H ${x2} M ${headX} ${y - 3} L ${x2} ${y} L ${headX} ${y + 3}`);
      path.setAttribute('pathLength', '1');
      if (!notesSeen.has(el)) path.classList.add('is-pending');
      svg.append(path);
      el.arrow = path;
    }
  }
}

function schedule(board) {
  pending.add(board);
  if (frameId) return;
  frameId = requestAnimationFrame(() => {
    frameId = 0;
    pending.forEach(layoutRails);
    pending.clear();
  });
}

if ('ResizeObserver' in window) {
  const resizer = new ResizeObserver(entries => entries.forEach(({ target }) => schedule(target.closest('.case-page-board'))));
  for (const board of rails) {
    resizer.observe(board);
    for (const element of board.querySelectorAll('.case-page-image img, .case-page-notes li')) resizer.observe(element);
  }
}
widePage.addEventListener('change', () => rails.forEach(schedule));
document.fonts.ready.then(() => rails.forEach(schedule));

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      if (target.matches('.case-page-notes li')) {
        notesSeen.add(target);
        target.arrow?.classList.remove('is-pending');
        target.arrow?.classList.add('is-entered');
      } else target.classList.add('is-entered');
      reveal.unobserve(target);
    }
  }, { threshold: .05 });
  document.querySelectorAll('.case-page-head,.case-page-image,.case-page-notes li').forEach(el => reveal.observe(el));
}
