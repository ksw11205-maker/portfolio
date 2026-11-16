// Scroll-linked meaning, without moving the document or hiding the explanation.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const vertical=matchMedia('(max-width:700px)');
const flow=document.querySelector('#flow .ed-flow');
const screens=document.querySelector('#screens');
const concept=document.querySelector('#service .ed-concept');
let frame=0,conceptVisible=false,conceptStarted=false,navObserver,structureObserver;
const flowScene=document.getElementById('flow');
const conceptScene=document.getElementById('service');
function readingState(target,scene){return window.PortfolioReadingGate?.state(target,{scene,travel:Math.max(1,innerHeight*.45)})||{started:false,progress:0,visible:false};}
const clamp=n=>Math.max(0,Math.min(1,n));
let stage;
if(concept){
 const figure=concept.querySelector('figure');
 if(figure){
  stage=document.createElement('div');stage.className='cm-concept-stage';stage.setAttribute('aria-hidden','true');
  stage.innerHTML='<div class="cm-concept-field cm-concept-field--taste"></div><div class="cm-concept-field cm-concept-field--purpose"></div><div class="cm-concept-intersection"></div><div class="cm-concept-object cm-concept-object--heart"><svg viewBox="0 0 48 48"><path d="M24 39 8 24C-3 12 13 0 24 12 35 0 51 12 40 24Z" fill="#d8b99c66"/></svg></div><div class="cm-concept-object cm-concept-object--beans"><svg viewBox="0 0 48 48"><ellipse cx="19" cy="23" rx="10" ry="17" transform="rotate(25 19 23)" fill="#9a755d30"/><path d="M26 9C11 17 28 25 12 37"/><path d="M37 10c11 2 12 18 4 26-5 5-10 5-13 1M39 14c-8 5 5 11-5 19"/></svg></div><div class="cm-concept-object cm-concept-object--pin"><svg viewBox="0 0 48 48"><path d="M39 20C39 8 28 3 24 3S9 8 9 20c0 10 15 25 15 25s15-15 15-25Z" fill="#dec39650"/><circle cx="24" cy="18" r="6"/></svg></div><div class="cm-concept-object cm-concept-object--book"><svg viewBox="0 0 48 48"><path d="M24 12c-7-6-14-6-21-4v30c7-2 14-2 21 4 7-6 14-6 21-4V8c-7-2-14-2-21 4Z" fill="#e6cfac60"/><path d="M24 12v30M9 17l9 2m-9 5 9 2m12-7 9-2m-9 9 9-2"/></svg></div><div class="cm-coffee"><i class="cm-coffee-steam"></i><i class="cm-coffee-steam"></i><i class="cm-coffee-saucer"></i><i class="cm-coffee-handle"></i><i class="cm-coffee-cup"></i></div>';
  figure.prepend(stage);concept.classList.add('cm-concept-enhanced');
 }
}
function renderFlow(){
 if(!flow)return;
 const nodes=[...flow.querySelectorAll('li')];
 const track=vertical.matches&&nodes.length>1?nodes.at(-1).offsetTop-nodes[0].offsetTop:0;
 if(track)flow.style.setProperty('--cafe-flow-track',`${track}px`);
 if(reduced.matches){flow.style.setProperty('--cafe-flow-progress','1');nodes.forEach(n=>n.classList.add('cm-flow-reached'));return}
 const state=readingState(flow,flowScene),progress=clamp(state.progress);
 flow.style.setProperty('--cafe-flow-progress',progress.toFixed(4));
 nodes.forEach((node,i)=>node.classList.toggle('cm-flow-reached',state.started&&progress>=i/Math.max(1,nodes.length-1)));
}
function renderConcept(){
 if(!stage)return;
 const state=readingState(stage,conceptScene);
 conceptVisible=state.visible;conceptStarted=state.started;
 stage.style.setProperty('--cm-service-open',(reduced.matches?1:clamp(state.progress)).toFixed(3));
 visibility();
}
function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;renderFlow();renderConcept()})}
if(flow)flow.classList.add('cm-enabled');
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',refresh);reduced.addEventListener('change',refresh);vertical.addEventListener('change',refresh);
function refresh(){renderFlow();renderConcept();schedule()}
function visibility(){concept?.classList.toggle('cm-concept-visible',conceptVisible&&conceptStarted&&!document.hidden&&!reduced.matches)}
document.addEventListener('visibilitychange',visibility);
document.fonts?.ready.then(refresh);refresh();
function bindScreens(){
 const nav=screens?.querySelector('.chapter-step-nav');if(!nav)return false;
 let previous='';
 function update(){
  const label=nav.querySelector('span')?.textContent||'';if(label===previous)return;previous=label;
  const [current,total]=label.split('/').map(Number);if(!current||!total)return;
  nav.style.setProperty('--cafe-phase-progress',`${current/total*100}%`);
  screens.querySelectorAll('.chapter-step-layer').forEach((layer,i)=>layer.classList.toggle('cm-current',i===current-1));
 }
 navObserver=new MutationObserver(update);navObserver.observe(nav.querySelector('span'),{childList:true,characterData:true,subtree:true});update();return true;
}
if(screens&&!bindScreens()){structureObserver=new MutationObserver(()=>{if(bindScreens())structureObserver.disconnect()});structureObserver.observe(screens,{childList:true,subtree:true})}
addEventListener('pagehide',event=>{if(event.persisted)return;navObserver?.disconnect();structureObserver?.disconnect();cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',refresh);reduced.removeEventListener('change',refresh);vertical.removeEventListener('change',refresh);document.removeEventListener('visibilitychange',visibility)});
