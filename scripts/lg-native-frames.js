(() => {
const frames = document.querySelectorAll('body.lg-final-spec .native-ui-frame');
const resize = el => { const width=el.getBoundingClientRect().width; el.style.setProperty('--ui-scale', Math.max(.1,width/1600)); el.style.height=(width*1000/1600)+'px'; };
const observer=new ResizeObserver(entries=>entries.forEach(e=>resize(e.target)));
frames.forEach(el=>{observer.observe(el);resize(el)});
})();