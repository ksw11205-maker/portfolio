// Geometry stays local to each screen. Native scroll and pinned chapter reading remain intact.
const section=document.querySelector('#screens');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(section){
 const ns='http://www.w3.org/2000/svg',rows=[...section.querySelectorAll('.ed-screen-row')];
 // Image index, right edge of the described component, and its vertical midpoint.
 const targets=[[[0,.938,.945],[1,.938,.319]],[[0,.949,.605],[0,.94,.829]],[[0,.8,.182],[0,.581,.329]],[[0,.482,.398],[1,.414,.547]],[[0,.938,.439],[0,.938,.835]]];
 const records=rows.map((row,index)=>{const list=row.querySelector('.ed-decisions'),svg=document.createElementNS(ns,'svg');svg.classList.add('cf-leaders');svg.setAttribute('aria-hidden','true');row.append(svg);return {row,index,list,svg,notes:[...(list?.children||[])],points:[]}});
 let frame=0;
 function draw(){frame=0;gateRequest();
  for(const r of records){const {row,index,list,svg,notes}=r;if(!list)continue;
   const phones=[...row.querySelectorAll('.ed-phone>img')];if(phones.some(p=>!p.naturalWidth))continue;
   const root=row.getBoundingClientRect(),rail=list.getBoundingClientRect();if(!root.width||!rail.width)continue;
   row.classList.add('cf-layout-ready');
   svg.setAttribute('viewBox',`0 0 ${root.width} ${root.height}`);
   const placements=notes.map((note,i)=>{const target=targets[index]?.[i],phone=phones[target?.[0]||0];if(!target||!phone)return null;const a=phone.getBoundingClientRect();return {note,i,target,a,y:a.top+a.height*target[2]-rail.top-note.offsetHeight/2}}).filter(Boolean).sort((a,b)=>a.y-b.y);
   let lastBottom=0;for(const p of placements){p.y=Math.max(0,lastBottom,p.y);lastBottom=p.y+p.note.offsetHeight+24;}
   let ceiling=rail.height;for(const p of [...placements].reverse()){p.y=Math.min(p.y,ceiling-p.note.offsetHeight);ceiling=p.y-24;}
   placements.forEach(({note,i,target,a,y})=>{
    note.style.setProperty('--cf-note-y',`${Math.max(0,y)}px`);note.style.setProperty('--cf-delay',`${i*.2}s`);
    const b=note.getBoundingClientRect(),x=a.left+a.width*target[1]-root.left,sy=a.top+a.height*target[2]-root.top,ex=b.left-root.left-10,ey=b.top-root.top+12;
    let point=r.points[i];if(!point){const path=document.createElementNS(ns,'path'),dot=document.createElementNS(ns,'circle');path.setAttribute('pathLength','1');dot.setAttribute('r','3.5');svg.append(path,dot);point=r.points[i]={path,dot};}
    const elbow=x+(ex-x)*.52;point.path.setAttribute('d',`M${x},${sy} H${elbow} V${ey} H${ex}`);
    point.dot.setAttribute('cx',x);point.dot.setAttribute('cy',sy);point.path.style.setProperty('--cf-delay',`${i*.2}s`);point.dot.style.setProperty('--cf-delay',`${i*.2}s`);
   });
  }
 }
 function request(){if(!frame)frame=requestAnimationFrame(draw)}
 const resize=new ResizeObserver(request);records.forEach(r=>{resize.observe(r.row);resize.observe(r.list);r.row.querySelectorAll('img').forEach(img=>{resize.observe(img);img.addEventListener('load',request)})});
 let gateFrame=0;
 function gates(){gateFrame=0;for(const {row} of records){const state=window.PortfolioReadingGate?.state(row,{scene:row.closest('.chapter-step-layer')||row}),started=reduced.matches||!!state?.started;row.dataset.readingGate=started?'started':'waiting';row.classList.toggle('cf-gate-waiting',!started);row.classList.toggle('cf-callouts-visible',reduced.matches||started&&state?.visible)}}
 const gateRequest=()=>{if(!gateFrame)gateFrame=requestAnimationFrame(gates)};
 addEventListener('scroll',gateRequest,{passive:true});addEventListener('resize',gateRequest);reduced.addEventListener('change',gateRequest);document.fonts.ready.then(gateRequest);gates();
 const atmosphere=document.createElement('div');atmosphere.className='cf-atmosphere';atmosphere.setAttribute('aria-hidden','true');atmosphere.innerHTML='<div class="cf-atmosphere-field"><i></i><i></i><i></i></div>';section.prepend(atmosphere);
 let ambientVisible=false;const ambientState=()=>section.classList.toggle('cf-atmosphere-visible',ambientVisible&&!document.hidden);
 const ambient=new IntersectionObserver(entries=>{ambientVisible=entries.some(e=>e.isIntersecting);ambientState()},{threshold:0});ambient.observe(section);document.addEventListener('visibilitychange',ambientState);
 addEventListener('resize',request);document.fonts.ready.then(request);reduced.addEventListener('change',request);draw();
 addEventListener('pagehide',e=>{if(e.persisted)return;cancelAnimationFrame(frame);resize.disconnect();cancelAnimationFrame(gateFrame);removeEventListener('scroll',gateRequest);removeEventListener('resize',gateRequest);ambient.disconnect();removeEventListener('resize',request);document.removeEventListener('visibilitychange',ambientState)});
}
