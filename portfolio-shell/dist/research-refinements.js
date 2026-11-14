// Use the study's actual nodes and final values; enhancement never fabricates data.
addEventListener('DOMContentLoaded',()=>{
 if(!window.gsap||!window.ScrollTrigger)return;
 const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  for(const selector of ['#goal .research-timeline','#experiment-1 .research-steps','#model .research-steps']){
   const list=document.querySelector(selector);if(!list)continue;
   const tl=gsap.timeline({scrollTrigger:{trigger:list,start:'top 88%',once:true}});
   [...list.children].forEach(node=>{tl.fromTo(node,{opacity:0,y:24,'--line-progress':0},{opacity:1,y:0,duration:.45,ease:'power2.out'}).to(node,{'--line-progress':1,duration:.3},'-=.1');});
  }
  const workflow=[...document.querySelectorAll('#workflow .workflow-steps>li,#workflow .settings-strip')];
  if(workflow.length)gsap.fromTo(workflow,{y:-30,opacity:0},{y:0,opacity:1,duration:.55,stagger:.18,scrollTrigger:{trigger:workflow[0],start:'top 88%',once:true}});
 });
 addEventListener('pagehide',event=>{if(!event.persisted)media.revert();},{once:true});
});
// Inline the existing IA vectors so their original paths can be drawn in place.
addEventListener('DOMContentLoaded',async()=>{
 const image=document.querySelector('#architecture .architecture-image img');
 if(!image||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 try{
  const response=await fetch(image.src);if(!response.ok)return;
  const svg=new DOMParser().parseFromString(await response.text(),'image/svg+xml').documentElement;
  if(svg.tagName!=='svg')return;
  svg.setAttribute('role','img');svg.setAttribute('aria-label',image.alt);svg.style.cssText='display:block;width:100%;height:auto';
  image.replaceWith(svg);
  const shapes=[...svg.querySelectorAll('path,rect,line')];
  const nodes=shapes.filter(n=>n.getAttribute('fill')&&n.getAttribute('fill')!=='none');
  const lines=shapes.filter(n=>!nodes.includes(n)&&n.getAttribute('stroke'));
  const tl=gsap.timeline({scrollTrigger:{trigger:svg,start:'top 85%',once:true}});
  nodes.sort((a,b)=>a.getBBox().y-b.getBBox().y);
  tl.fromTo(nodes,{opacity:0,y:24},{opacity:1,y:0,duration:.5,stagger:{amount:.4},ease:'power2.out'});
  const finish=()=>{tl.progress(1);tl.scrollTrigger?.kill();tl.kill();};
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)finish();});
  addEventListener('pagehide',e=>{if(!e.persisted)finish();},{once:true});
  for(const line of lines){const length=line.getTotalLength();tl.fromTo(line,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.35},'-=.25');}
 }catch{ /* The original image remains available if fetching fails. */ }
});
