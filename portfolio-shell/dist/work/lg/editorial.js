/* Selection is the only content motion. No scroll capture, pinning or reveal gates. */
(()=>{
 const root=document.querySelector('#tool-flow'),tabs=[...root.querySelectorAll('.tool-tabs button')],panels=[...root.querySelectorAll('.tool-panel')];
 const nav=root.querySelector('.tool-tabs');nav.setAttribute('role','tablist');nav.setAttribute('aria-label','AI Design Tool 기능 단계');
 function select(index,focus=false){
  tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;panels[i].classList.toggle('is-selected',active);panels[i].inert=!active;panels[i].setAttribute('aria-hidden',String(!active))});
  if(focus){tabs[index].focus({preventScroll:true});tabs[index].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
 }
 tabs.forEach((tab,index)=>{
  tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[index].id);panels[index].setAttribute('role','tabpanel');panels[index].setAttribute('aria-labelledby',tab.id);
  tab.addEventListener('click',()=>select(index));
  tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(next,true)});
 });
 root.classList.add('tool-enhanced');select(0);
 function deepLink(){const id=location.hash.slice(1),i=panels.findIndex(panel=>panel.id===id);if(i>=0){select(i);requestAnimationFrame(()=>root.scrollIntoView({block:'start',behavior:'instant'}))}}
 addEventListener('hashchange',deepLink);deepLink();
})();
