const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const visibleFilms = new Set();
const films = document.querySelectorAll('.case-film');

function update(video) {
  if (reducedMotion.matches || document.hidden || !visibleFilms.has(video)) {
    video.pause();
  } else {
    video.play().catch(() => {});
  }
}

const observer = new IntersectionObserver(entries => {
  for (const { target, isIntersecting } of entries) {
    if (isIntersecting) visibleFilms.add(target);
    else visibleFilms.delete(target);
    update(target);
  }
}, { threshold: .2 });
for (const video of films) {
  video.playbackRate = Number(video.dataset.playbackRate || 1);
  observer.observe(video);
}

reducedMotion.addEventListener('change', () => visibleFilms.forEach(update));
document.addEventListener('visibilitychange', () => visibleFilms.forEach(update));
