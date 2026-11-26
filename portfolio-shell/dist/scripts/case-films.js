const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const observer = new IntersectionObserver(entries => {
  for (const {target, isIntersecting} of entries) {
    if (!isIntersecting || reducedMotion.matches) target.pause();
    else target.play().catch(() => {});
  }
}, {threshold: 0.2});
document.querySelectorAll('.case-film').forEach(video => {
  video.playbackRate = Number(video.dataset.playbackRate || 1);
  observer.observe(video);
});
