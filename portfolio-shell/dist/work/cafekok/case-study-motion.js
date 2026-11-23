const story = document.querySelector('.ck-story');

if (story && 'IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const arrivals = story.querySelectorAll([
    '.ck-overview .ck-heading', '.ck-overview-visual',
    '.ck-concept .ck-heading', '.ck-venn', '.ck-flow',
    '.ck-system-bottom h3', '.ck-components',
    '.ck-app-intro .ck-heading', '.ck-app-intro-mockup',
    '.ck-pair-section .ck-heading', '.ck-phone-pair',
    '#home .ck-app-heading', '#home .ck-annotated',
    '#cafe-detail .ck-app-heading', '#explore .ck-app-heading', '#saved .ck-app-heading',
  ].join(', '));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      entry.target.classList.add('ck-entered');
    }
  }, { rootMargin: '0px 0px -24px' });

  for (const arrival of arrivals) observer.observe(arrival);
}

function connectScreens(layout, connections) {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(svgNamespace, 'svg');
  overlay.classList.add('ck-connectors');
  overlay.setAttribute('aria-hidden', 'true');
  layout.append(overlay);

  const links = connections.map(({ from, to, targetHeight = 0, dashed = false }) => {
    const line = document.createElementNS(svgNamespace, 'path');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'currentColor');
    if (dashed) line.setAttribute('stroke-dasharray', '4 3');
    const dot = document.createElementNS(svgNamespace, 'circle');
    dot.setAttribute('r', '2.5');
    dot.setAttribute('fill', 'currentColor');
    overlay.append(line, dot);
    return { source: layout.querySelector(from), target: layout.querySelector(to), line, dot, targetHeight };
  });

  const align = () => {
    const bounds = layout.getBoundingClientRect();
    for (const { source, target, line, dot, targetHeight } of links) {
      const start = source.getBoundingClientRect();
      const end = target.getBoundingClientRect();
      const x = start.left - bounds.left;
      const y = start.top - bounds.top;
      const targetX = end.left - bounds.left - 5;
      const targetY = end.top - bounds.top + targetHeight * end.height;
      const bend = targetX - 16;
      line.setAttribute('d', `M ${x} ${y} H ${bend} V ${targetY} H ${targetX}`);
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
    }
  };

  const observer = new ResizeObserver(align);
  observer.observe(layout);
  for (const { target } of links) observer.observe(target);
  document.fonts.ready.then(align);
}

const explore = story?.querySelector('.ck-explore');
const tastePair = story?.querySelector('#my-taste .ck-phone-pair');
if (explore && tastePair && 'ResizeObserver' in window) {
  connectScreens(explore, [
    { from: '.ck-origin-filter', to: '.ck-target-filter h3', targetHeight: .5 },
    { from: '.ck-origin-map', to: '.ck-target-map h3', targetHeight: .5 },
  ]);
  connectScreens(tastePair, [
    { from: '.ck-edit-origin', to: ':scope > div:nth-child(2) > .ck-phone', targetHeight: .54, dashed: true },
  ]);
}
