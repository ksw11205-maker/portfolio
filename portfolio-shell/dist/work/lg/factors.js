/* Factor grouping, real-screen emphasis and a digit reel for the original model values. */
(()=>{
 const section=document.getElementById('factors');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 for(const grid of section.querySelectorAll('.factor-inventory,.variable-grid'))[...grid.children].forEach((node,i)=>node.style.setProperty('--lf-index',i));
 section.querySelectorAll('.mapping-labels li').forEach((node,i)=>node.style.setProperty('--lf-index',i));
 for(const summary of section.querySelectorAll('.source-summary')){
  if(summary.querySelector('.lg-factor-value'))continue;
  for(const node of [...summary.childNodes]){if(node.nodeType!==Node.TEXT_NODE)continue;const parts=node.textContent.split(/(53|22|9|8|6)/g);if(parts.length===1)continue;const f=document.createDocumentFragment();parts.forEach((part,i)=>{if(i%2){const span=document.createElement('span');span.className='lg-factor-value';span.textContent=part;f.append(span)}else f.append(document.createTextNode(part))});node.replaceWith(f)}
 }
 // Only Thumbnail Item Count carries Main Factor in the source report.
 for(const node of document.querySelectorAll('#experiment-1 .factor-list>li')){
  node.classList.toggle('lf-main-factor',node.textContent.includes('Thumbnail Item Count')&&node.textContent.includes('Main Factor'));
 }
 const tvScreens=[...document.querySelectorAll('#screens .screen-columns article>figure,#factors .mapping-row>figure')];
 tvScreens.forEach(node=>node.classList.add('lf-tv-screen'));
 const reels=[];
 for(const value of document.querySelectorAll('#model .metric>span:first-child')){
  const actual=value.textContent.trim();if(!/^\d+\.\d+$/.test(actual)||value.querySelector('.lf-metric-reel'))continue;
  value.classList.add('lf-metric-value');value.removeAttribute('data-count');
  const readable=document.createElement('span');readable.className='lf-metric-source';readable.textContent=actual;
  const reel=document.createElement('span');reel.className='lf-metric-reel';reel.setAttribute('aria-hidden','true');
  [...actual].forEach((digit,i)=>{if(digit==='.'){const dot=document.createElement('span');dot.className='lf-metric-dot';dot.textContent='.';reel.append(dot);return}
   const window=document.createElement('span');window.className='lf-metric-digit';const track=document.createElement('span');track.className='lf-metric-track';const stop=20+Number(digit);track.style.setProperty('--lf-reel-end',`${-stop*1.05}em`);track.style.setProperty('--lf-reel-delay',`${i*.065}s`);for(let n=0;n<=stop;n++){const cell=document.createElement('span');cell.textContent=String(n%10);track.append(cell)}window.append(track);reel.append(window);
  });
  value.replaceChildren(readable,reel);reels.push(value.closest('.metric'));
 }
 const targets=[...section.querySelectorAll('.factor-inventory,.variable-grid,.mapping-row'),document.querySelector('#experiment-1 .factor-results'),...tvScreens,...reels].filter(Boolean);
 const pending=new Set(targets);let raf=0;
 function readingScene(node){
  // The representative TV screen pair is one reading scene, including the
  // chapter's full padding. Factor panels use their actual pinned layer or
  // natural subsection; model values share the entire results subsection.
  if(node.closest('#screens'))return document.getElementById('screens');
  if(node.matches('.metric'))return node.closest('.subsection')||document.querySelector('#model .subsection:last-child');
  return node.closest('.chapter-step-layer')||node.closest('.subsection')||node.closest('section');
 }
 function inspect(){raf=0;if(reduced.matches)return;
  const gate=window.PortfolioReadingGate;if(!gate)return;
  for(const node of pending){
   const state=gate.state(node,{scene:readingScene(node)});
   if(!state.started||!state.visible)continue;
   node.classList.add(node.classList.contains('lf-tv-screen')?'lf-tv-on':node.matches('.metric')?'lf-roll':'lf-arrived');pending.delete(node);
  }
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(inspect)};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('load',schedule,true);addEventListener('pageshow',schedule);
 reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(raf);raf=0;targets.forEach(node=>node.classList.remove('lf-arrived','lf-tv-on','lf-roll'))}else schedule()});
 addEventListener('pagehide',event=>{if(event.persisted)return;cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);document.removeEventListener('load',schedule,true);removeEventListener('pageshow',schedule)},{once:true});schedule();
})();
