/* Screenshot coordinates remain native and normalized. Device padding is measured,
   not assumed; ResizeObserver follows fonts, image decoding and container changes. */
const NS='http://www.w3.org/2000/svg';
export function layoutInterface(figure){
 const stage=figure.querySelector('.annotation-stage'),img=figure.querySelector('.interface-image'),svg=figure.querySelector('.annotation-wires'),labels=[...figure.querySelectorAll('.feature-label')];
 if(!img.complete||!img.naturalWidth)return;
 const box=stage.getBoundingClientRect(),image=img.getBoundingClientRect();
 const scale=Math.min(image.width/img.naturalWidth,image.height/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
 const left=image.left-box.left+(image.width-w)/2,top=image.top-box.top+(image.height-h)/2;
 const mobile=matchMedia('(max-width: 1400px)').matches;
 svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);svg.replaceChildren();
 const paths=[];
 if(!mobile){for(const side of ['left','right']){
  const group=labels.filter(e=>e.dataset.side===side).sort((a,b)=>a.dataset.y-b.dataset.y);let bottom=8;
  group.forEach(label=>{label.style.top='0px';const height=label.getBoundingClientRect().height;const ideal=top+Number(label.dataset.y)*h-height/2;const y=Math.max(bottom,Math.min(box.height-height-8,ideal));label.style.top=y+'px';bottom=y+height+24;});
  if(bottom>box.height){let ceiling=box.height-8;[...group].reverse().forEach(label=>{const height=label.getBoundingClientRect().height;const y=Math.min(parseFloat(label.style.top),ceiling-height);label.style.top=y+'px';ceiling=y-24;});}
 }}else labels.forEach(label=>label.style.removeProperty('top'));
 labels.forEach((label,i)=>{
  const ax=left+Number(label.dataset.x)*w,ay=top+Number(label.dataset.y)*h;
  const rect=label.getBoundingClientRect(),side=label.dataset.side;
  const tx=side==='left'?rect.right-box.left+7:rect.left-box.left-7,ty=rect.top-box.top+9;
  const elbow=side==='left'?left-12-i*5:left+w+12+i*5;
  const d=mobile?`M${ax} ${ay}v10`:`M${ax} ${ay}H${elbow}V${ty}H${tx}`;
  const path=document.createElementNS(NS,'path');path.setAttribute('d',d);path.dataset.feature=i;svg.append(path);
  const dot=document.createElementNS(NS,'circle');dot.setAttribute('cx',ax);dot.setAttribute('cy',ay);dot.setAttribute('r',3);dot.dataset.feature=i;svg.append(dot);
  paths.push({feature:label.querySelector('strong').textContent,normalized:[Number(label.dataset.x),Number(label.dataset.y)],anchor:[ax,ay],endpoint:mobile?null:[tx,ty],image:[left,top,w,h]});
 });
 figure.annotationGeometry=paths;figure.dataset.geometryReady='true';
}
const viewer=document.createElement('dialog');viewer.className='interface-viewer';viewer.innerHTML='<button type="button" class="viewer-close" autofocus>닫기 ×</button><p class="viewer-caption"></p><div class="viewer-scroll"><img alt=""></div>';document.body.append(viewer);viewer.querySelector('button').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close()});
for(const figure of document.querySelectorAll('.annotated-interface')){
 const update=()=>requestAnimationFrame(()=>layoutInterface(figure));
 const observer=new ResizeObserver(update);observer.observe(figure.querySelector('.annotation-stage'));observer.observe(figure.querySelector('.interface-image'));
 for(const label of figure.querySelectorAll('.feature-label')){label.setAttribute('aria-label',label.textContent+' · 화면에서 위치 강조');observer.observe(label);for(const event of ['pointerenter','focus','click'])label.addEventListener(event,()=>{figure.querySelectorAll('[data-active]').forEach(e=>e.removeAttribute('data-active'));label.dataset.active='true';figure.querySelectorAll(`.annotation-wires [data-feature="${label.dataset.feature}"]`).forEach(e=>e.dataset.active='true');});}
 figure.querySelector('img').decode().then(update,update);document.fonts.ready.then(update);addEventListener('resize',update,{passive:true});
 const image=figure.querySelector('.interface-image');image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label',image.alt+' · 원본 화면 확대');image.removeAttribute('title');
 const open=()=>{viewer.querySelector('img').src=image.src;viewer.querySelector('img').alt=image.alt;viewer.querySelector('.viewer-caption').textContent=image.alt;viewer.dataset.mobileUi=figure.classList.contains('is-mobile-ui');viewer.showModal();};image.addEventListener('click',open);image.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}});
}
