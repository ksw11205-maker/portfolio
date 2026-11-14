/* A scroll-linked reading cue and restrained motion on real captured screens. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const flow=document.querySelector('#flow .ed-flow'),flowScene=document.getElementById('flow');
 const group=document.querySelector('#responsive .ed-devices'),deviceScene=document.getElementById('responsive');
 const figures=group?[...group.querySelectorAll('figure')]:[];
 let frame=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 const readingState=(target,scene)=>window.PortfolioReadingGate?.state(target,{scene,travel:Math.max(1,innerHeight*.45)})||{started:false,progress:0,visible:false};
 const nodes=flow?[...flow.querySelectorAll('li')]:[];
 if(flow)flow.classList.add('offer-flow-motion');
 function update(){
  frame=0;
  if(flow){const state=readingState(flow,flowScene),progress=reduced.matches?1:clamp(state.progress);flow.style.setProperty('--offer-flow-progress',progress);const current=Math.min(nodes.length-1,Math.floor(progress*nodes.length));nodes.forEach((node,index)=>node.classList.toggle('offer-flow-current',(reduced.matches||state.started)&&index===current));}
  if(group){const state=readingState(group,deviceScene),progress=reduced.matches?1:clamp(state.progress);figures.forEach((figure,i)=>{const phase=reduced.matches?1:clamp((progress-i*.16)/.66);figure.style.opacity=String(.72+.28*phase);figure.style.transform=`translateY(${(1-phase)*18}px)`;});}
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);addEventListener('pageshow',schedule);document.fonts?.ready.then(schedule);update();
 addEventListener('pagehide',e=>{if(!e.persisted){cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);removeEventListener('pageshow',schedule);reduced.removeEventListener('change',schedule)}});
 // Shared comparison controls switch between existing captures; never fabricate a product state.
 const preview=document.querySelector('#compare .ed-comparison-preview>img');
 if(preview){new MutationObserver(()=>{if(!reduced.matches)preview.animate([{opacity:.68},{opacity:1}],{duration:320,easing:'ease-out'});}).observe(preview,{attributes:true,attributeFilter:['src']});}
})();
