/* Open research timelines and the actual IA vectors. Effects begin after their reading frame enters. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const lists=[...document.querySelectorAll('#experiment-1 .research-steps,#model .research-steps')];
 const workflow=document.querySelector('#workflow .workflow-steps');
 const settings=document.querySelector('#workflow .settings-strip');
 const clamp=n=>Math.max(0,Math.min(1,n));let raf=0,svg=null,stageNodes=[],links=[],dot=null,iaPlane=null,iaEntered=false;
 const iconMarkup=[
  '<rect x="8" y="10" width="48" height="43" rx="4"/><path d="M8 43h48M22 27l10-10 10 10M32 17v21" class="lg-icon-accent"/>',
  '<path d="M9 10v44h47M20 43V31M32 43V19M44 43V26"/><path d="M15 24l13-12 11 6 15-11" class="lg-icon-accent"/>',
  '<rect x="5" y="15" width="22" height="34" rx="3"/><rect x="37" y="15" width="22" height="34" rx="3"/><path d="M22 7h20l-5-4m5 4-5 4M42 57H22l5-4m-5 4 5 4" class="lg-icon-accent"/>',
  '<path d="M8 16h48M8 32h48M8 48h48"/><path d="M22 9v14M43 25v14M28 41v14" class="lg-icon-accent"/>'
 ];
 function addIcon(node,index){if(!node||node.querySelector('.lg-workflow-icon'))return;const icon=document.createElement('span');icon.className='lg-workflow-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML=`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconMarkup[index]}</svg>`;icon.querySelectorAll('path,rect').forEach(n=>n.setAttribute('pathLength','1'));node.append(icon)}
 [...(workflow?.children||[])].forEach((node,i)=>addIcon(node,i));addIcon(settings,3);
 function readingProgress(node,{scene,travel=240}={}){const rect=node.getBoundingClientRect(),header=document.querySelector('.case-shared')?.getBoundingClientRect().bottom||68;const frame=scene||node.closest('.chapter-step-layer,.subsection,section.chapter')||node;const gate=window.PortfolioReadingGate?.state(node,{scene:frame,travel});const visible=rect.bottom>header&&rect.top<innerHeight;if(gate)return {rect,entered:gate.started,visible:gate.visible&&visible,p:reduced.matches?1:gate.progress};const bottom=frame.getBoundingClientRect().bottom;return {rect,entered:bottom<=innerHeight,visible,p:reduced.matches?1:clamp((innerHeight-bottom)/travel)}}
 function update(){raf=0;
  for(const list of lists){const rows=[...list.children];let current=-1,closest=Infinity;rows.forEach((row,i)=>{const state=readingProgress(row,{scene:row});row.style.setProperty('--process-progress',state.p.toFixed(3));row.classList.toggle('process-visible',state.visible);if(state.entered&&state.visible){const distance=Math.abs(state.rect.top+state.rect.height/2-innerHeight*.55);if(distance<closest){closest=distance;current=i}}});rows.forEach((row,i)=>row.classList.toggle('process-current',i===current))}
  const workflowState=workflow?readingProgress(workflow,{scene:document.getElementById('workflow'),travel:Math.min(420,innerHeight*.5)}):null;
  if(workflow&&workflowState){const items=[...workflow.children],phase=workflowState.entered?Math.min(items.length-1,Math.floor(workflowState.p*items.length)):-1;items.forEach((row,i)=>{const r=row.getBoundingClientRect(),visible=r.bottom>68&&r.top<innerHeight;row.classList.toggle('process-visible',visible);row.classList.toggle('workflow-current',i===phase&&workflowState.visible);if(workflowState.entered&&(reduced.matches||workflowState.p*items.length>=i))row.classList.add('workflow-icon-ready')});workflow.style.setProperty('--workflow-progress',workflowState.p.toFixed(3))}
  if(settings&&workflowState){const rect=settings.getBoundingClientRect();settings.classList.toggle('process-visible',rect.bottom>68&&rect.top<innerHeight);if(workflowState.entered&&(reduced.matches||workflowState.p>=.85))settings.classList.add('workflow-icon-ready')}
  if(svg){const state=readingProgress(svg,{scene:document.getElementById('architecture'),travel:Math.min(420,innerHeight*.5)}),phase=state.entered?Math.min(3,Math.floor(state.p*4)):-1;stageNodes.forEach((n,i)=>n.classList.toggle('ia-active',reduced.matches||i===phase));links.forEach((n,i)=>n.classList.toggle('ia-active',reduced.matches||i<=phase));iaPlane.style.setProperty('--ia-scan-height',`${svg.getBoundingClientRect().height}px`);iaPlane.classList.toggle('process-visible',state.visible);if(state.entered&&!iaEntered){iaEntered=true;iaPlane.classList.add('ia-holo-entered')}if(dot){dot.style.display=reduced.matches||phase<0?'none':'';const xs=[352,765,1183,1585];dot.setAttribute('cx',String(xs[Math.max(0,phase)]));dot.setAttribute('cy','518')}}
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
 async function inlineIA(){const img=document.querySelector('#architecture .architecture-image img');if(!img)return;try{const response=await fetch(img.currentSrc||img.src);if(!response.ok)return;const doc=new DOMParser().parseFromString(await response.text(),'image/svg+xml');const vector=doc.documentElement;if(vector.tagName!=='svg')return;vector.setAttribute('role','img');vector.setAttribute('aria-label',img.alt);vector.removeAttribute('width');vector.removeAttribute('height');
   stageNodes=[...vector.querySelectorAll('path')].filter(n=>n.getAttribute('fill')==='#18131D'&&n.getAttribute('stroke')==='#E34891');stageNodes.forEach(n=>n.classList.add('ia-stage'));
   links=[...vector.querySelectorAll('path')].filter(n=>!n.hasAttribute('fill')&&n.getAttribute('stroke')==='#F2EDF3');links.forEach(n=>n.classList.add('ia-link'));
   dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('r','6');dot.classList.add('ia-flow-dot');dot.setAttribute('aria-hidden','true');vector.append(dot);img.replaceWith(vector);svg=vector;iaPlane=svg.parentElement;iaPlane.classList.add('ia-holo-plane');update();
  }catch{/* Keep the original readable image if vector enhancement cannot load. */}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);addEventListener('pageshow',schedule);
 addEventListener('pagehide',event=>{if(!event.persisted){cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)}});inlineIA();update();
})();
