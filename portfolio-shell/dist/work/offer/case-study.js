// Actual screen captures are static; chapter navigation follows the reading position.
const chapters = document.querySelectorAll('.chapter');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  document.querySelectorAll('.chapter-nav a').forEach(a => {
    if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
}), {rootMargin:'-10% 0px -60% 0px'});
chapters.forEach(chapter => observer.observe(chapter));
