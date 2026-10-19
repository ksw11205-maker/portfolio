// Display the actual product at each device width without intercepting reading or scrolling.
const frames = document.querySelectorAll('.viewport');
const resize = new ResizeObserver(entries => entries.forEach(({target}) => {
  const iframe = target.querySelector('iframe');
  const width = Number(target.dataset.width), height = Number(target.dataset.height);
  const scale = target.clientWidth / width;
  target.style.aspectRatio = `${width} / ${height}`;
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.transform = `scale(${scale})`;
}));
frames.forEach(frame => resize.observe(frame));
const chapters = document.querySelectorAll('.chapter');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  document.querySelectorAll('.chapter-nav a').forEach(a => {
    if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
}), {rootMargin:'-10% 0px -60% 0px'});
chapters.forEach(chapter => observer.observe(chapter));
