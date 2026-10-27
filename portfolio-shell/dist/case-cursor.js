(()=>{
 const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const cursor=document.createElement('div');cursor.className='case-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<span class="case-cursor-disc"><span class="case-cursor-i">i</span></span>';document.body.append(cursor);
 const disc=cursor.querySelector('.case-cursor-disc'),tooltip=document.createElement('div');tooltip.className='case-image-tooltip';tooltip.setAttribute('aria-hidden','true');document.body.append(tooltip);
 const images=[...document.querySelectorAll('main img[alt]')].filter(img=>img.alt.trim()&&!img.closest('.cover-tools,.meta-tools,.project-tool-list,a,button,dialog,[data-no-image-info]'));
 images.forEach(img=>{img.classList.add('case-info-image');img.setAttribute('tabindex','0');});
 let x=0,y=0,rx=0,ry=0,frame=0,last=0,inside=false,dragging=false,focusImage=null,touchImage=null;
 const allowed=()=>fine.matches&&!reduced.matches&&!document.hidden&&!dragging;
 function hideCursor(){document.documentElement.classList.remove('case-cursor-ready');cursor.classList.remove('is-visible','is-link','is-info');cancelAnimationFrame(frame);frame=0;}
 function showTip(img,px,py){
  if(!img||!images.includes(img)){tooltip.classList.remove('is-open');return;}
  tooltip.textContent=img.alt;tooltip.classList.add('is-open');
  const w=tooltip.offsetWidth,h=tooltip.offsetHeight,pad=16;
  const left=px+24+w>innerWidth-pad?px-w-24:px+24,top=py+24+h>innerHeight-pad?py-h-24:py+24;
  tooltip.style.transform=`translate(${Math.max(pad,Math.min(innerWidth-w-pad,left))}px,${Math.max(pad,Math.min(innerHeight-h-pad,top))}px)`;
 }
 function tick(now){frame=0;if(!allowed()){hideCursor();return;}const blend=1-Math.exp(-24*Math.min((now-last)/1000,.05));last=now;rx+=(x-rx)*blend;ry+=(y-ry)*blend;if(Math.abs(rx-x)+Math.abs(ry-y)<.1){rx=x;ry=y;}disc.style.transform=`translate3d(${rx}px,${ry}px,0)`;if(rx!==x||ry!==y)frame=requestAnimationFrame(tick);}
 function imageAt(target,px,py){
  const direct=target.closest('img.case-info-image');if(direct)return direct;
  // A figure or its decorative overlay can receive the pointer above its image.
  if(target.closest('a,button,p,h1,h2,h3,h4,input,textarea,select'))return null;
  const container=target.closest('figure,.image-button,.captured-viewport,.prototype-original,section.hero');
  if(!container)return null;
  return images.find(img=>{if(!container.contains(img))return false;const r=img.getBoundingClientRect();return px>=r.left&&px<=r.right&&py>=r.top&&py<=r.bottom;})||null;
 }
 function state(target){
  if(!inside||dragging||document.hidden||!(target instanceof Element)||target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')||getSelection()?.toString()){hideCursor();if(!focusImage&&!touchImage)showTip(null);return;}
  const img=imageAt(target,x,y),interactive=target.closest('a,button,[role="button"]');
  if(!allowed()){hideCursor();showTip(img,x,y);return;}
  if(!img&&!interactive&&target.closest('p:not(.eyebrow)')){hideCursor();showTip(null);return;}
  cursor.classList.toggle('is-info',!!img);cursor.classList.toggle('is-link',!!interactive);showTip(img,x,y);
  if(!cursor.classList.contains('is-visible')){rx=x;ry=y;disc.style.transform=`translate3d(${x}px,${y}px,0)`;cursor.classList.add('is-visible');document.documentElement.classList.add('case-cursor-ready');}
  if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}
 }
 document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'){inside=false;hideCursor();return;}inside=true;x=event.clientX;y=event.clientY;dragging=!!event.buttons;state(event.target);},{passive:true});
 document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'){dragging=true;hideCursor();}},{passive:true});
 document.addEventListener('pointerup',event=>{if(event.pointerType==='mouse'){dragging=false;state(document.elementFromPoint(x,y));}},{passive:true});
 document.addEventListener('click',event=>{if(fine.matches)return;const img=event.target instanceof Element?imageAt(event.target,event.clientX,event.clientY):null;touchImage=img===touchImage?null:img;if(touchImage){const rect=touchImage.getBoundingClientRect();showTip(touchImage,rect.left+rect.width/2,rect.top+Math.min(rect.height/2,80));}else showTip(null);});
 document.addEventListener('focusin',event=>{const img=event.target.closest?.('img.case-info-image');focusImage=img||null;if(img){const rect=img.getBoundingClientRect();showTip(img,rect.left+Math.min(rect.width/2,200),rect.top+Math.min(rect.height/2,80));}});
 document.addEventListener('focusout',()=>{focusImage=null;if(!touchImage)showTip(null);});
 document.addEventListener('keydown',event=>{if(event.key==='Tab')hideCursor();if(event.key==='Escape'){focusImage=touchImage=null;showTip(null);}});
 const leave=()=>{inside=false;dragging=false;hideCursor();if(!focusImage&&!touchImage)showTip(null);};
 document.documentElement.addEventListener('pointerleave',leave);document.addEventListener('pointercancel',leave);addEventListener('blur',leave);
 addEventListener('scroll',()=>{if(touchImage){touchImage=null;showTip(null);}else if(inside&&!focusImage)state(document.elementFromPoint(x,y));},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();});reduced.addEventListener('change',leave);fine.addEventListener('change',leave);
})();
