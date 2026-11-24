// Highlight the question most visible in the viewport without controlling scroll.
(()=>{
 const deck=document.querySelector('#qa .qa-deck'),viewport=document.querySelector('#qa .qa-viewport');
 const cards=[...document.querySelectorAll('#qa .qa-card')];if(!deck||!viewport||!cards.length)return;
 let current=null,frame=0;
 function update(){frame=0;const v=viewport.getBoundingClientRect();const left=Math.max(0,v.left),right=Math.min(innerWidth,v.right),top=Math.max(0,v.top),bottom=Math.min(innerHeight,v.bottom);let best=null,bestScore=0;
  for(const card of cards){const r=card.getBoundingClientRect();const w=Math.max(0,Math.min(right,r.right)-Math.max(left,r.left)),h=Math.max(0,Math.min(bottom,r.bottom)-Math.max(top,r.top));const score=w*h/Math.max(1,r.width*r.height);if(score>bestScore){bestScore=score;best=card}}
  if(best===current)return;current?.classList.remove('shell-qa-current');current=best;current?.classList.add('shell-qa-current');
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);deck.addEventListener('scroll',schedule,{passive:true});addEventListener('pageshow',schedule);
 addEventListener('pagehide',event=>{if(event.persisted)return;cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);deck.removeEventListener('scroll',schedule)},{once:true});schedule();
})();
