const widePage = matchMedia('(min-width: 1100px)');
const notesSeen = new WeakSet();
const rails = [...document.querySelectorAll('.case-page-board')];
const drawPath = (svg, d, note) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',d);
  path.setAttribute('pathLength','1');
  svg.append(path);
  note.arrow = path;
  if (!notesSeen.has(note)) path.classList.add('is-pending');
};
function layoutRails(board) {
  if (!widePage.matches) return;
  const svg = board.querySelector('.case-page-arrows');
  const image = board.querySelector('.case-page-image');
  const frame=board.getBoundingClientRect();
  if (!frame.height) return;
  const bounds=image.getBoundingClientRect();
  svg.replaceChildren();
  svg.setAttribute('viewBox', '0 0 '+frame.width+' '+frame.height);
  for (const side of ['start','end']) {
    const items=[...board.querySelectorAll('[data-side="'+side+'"]')]
      .map(el=>({el,y:Number(el.dataset.y)*bounds.height,h:el.offsetHeight}))
      .sort((a,b)=>a.y-b.y);
    let end=0;
    for(const item of items) {
      item.top=Math.max(item.y-16,end);
      end=item.top+item.h+10;
    }
    let limit=frame.height;
    for(const item of [...items].reverse()) {
      item.top=Math.max(0,Math.min(item.top,limit-item.h));
      limit=item.top-10;
    }
    for(const {el,top,y} of items) {
      el.style.top=top+'px';
      if (el.hasAttribute('data-no-arrow')) continue;
      const left=side==='start';
      const rect=el.getBoundingClientRect();
      const x1=(left?rect.right:rect.left)-frame.left+(left?3:-3);
      const x2=(left?bounds.left:bounds.right)-frame.left+(left?-2:2);
      const startY=top+16;
      const wing = x2 + (left ? -5 : 5);
      const middle = (x1 + x2) / 2;
      const shaft = `M ${x1} ${startY} C ${middle} ${startY}, ${middle} ${y}, ${x2} ${y}`;
      const head = `L ${wing} ${y - 3} L ${x2} ${y} L ${wing} ${y + 3}`;
      drawPath(svg, `${shaft} ${head}`, el);
    }
  }
}
if ('ResizeObserver' in window) {
  const resizer=new ResizeObserver(entries=>entries.forEach(({target})=>layoutRails(target)));
  rails.forEach(board=>resizer.observe(board));
}
widePage.addEventListener('change',()=>rails.forEach(layoutRails));
if ('IntersectionObserver' in window) {
  const reveal=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries) {
      if(!isIntersecting) continue;
      if(target.matches('.case-page-notes li')) {
        notesSeen.add(target);
        target.arrow?.classList.remove('is-pending');
        target.arrow?.classList.add('is-entered');
      } else target.classList.add('is-entered');
      reveal.unobserve(target);
    }
  },{threshold:.05});
  document.querySelectorAll('.case-page-head,.case-page-image,.case-page-notes li').forEach(el=>reveal.observe(el));
}
