// Transform-only light fields; no gesture capture or continuous JS render loop.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function attach() {
    const contact = document.getElementById('contact');
    const background = contact?.querySelector('.contact-background');
    if (!background) return false;
    if (background.querySelector('.contact-atmosphere')) return true;
    const layer = document.createElement('div');
    layer.className = 'contact-atmosphere';
    layer.setAttribute('aria-hidden', 'true');
    for (const name of ['blue', 'pearl', 'cyan']) {
      const field = document.createElement('div');
      field.className = 'contact-atmosphere__field contact-atmosphere__field--' + name;
      layer.append(field);
    }
    background.append(layer);
    let visible = false;
    const sync = () => {
      contact.dataset.atmosphereActive = String(visible && !document.hidden && !reduced.matches && !document.body.classList.contains('motion-paused'));
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, {threshold:0});
    observer.observe(contact);
    new MutationObserver(sync).observe(document.body, {attributes:true, attributeFilter:['class']});
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    addEventListener('pagehide', () => { visible = false; sync(); });
    addEventListener('pageshow', () => { const box = contact.getBoundingClientRect(); visible = box.bottom > 0 && box.top < innerHeight; sync(); });
    sync();
    return true;
  }
  // The existing section-flow module owns the wave and its clipped background.
  if (!attach()) {
    const waiting = new MutationObserver(() => { if (attach()) waiting.disconnect(); });
    waiting.observe(document.documentElement, {childList:true, subtree:true});
  }
})();
