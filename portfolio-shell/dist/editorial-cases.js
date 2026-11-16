import {initScrollMotion} from '/scroll-motion.js';
import {initReadingSnap} from '/reading-snap.js';
import {initCaseSteps,stepReadingPoints,stepRanges} from '/case-steps.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const motion=initScrollMotion({reduced});
await document.fonts.ready;
if(document.body.dataset.editorial==='cafekok')initCaseSteps();
const header=document.querySelector('.case-shared');
const reading=initReadingSnap({header,getRanges:stepRanges,getPoints:offset=>[...document.querySelectorAll('main>.ed-chapter')].flatMap(section=>stepReadingPoints(section)||[{top:section.getBoundingClientRect().top+scrollY-offset,radius:64}])});
const observer=new IntersectionObserver(items=>items.forEach(({isIntersecting,target})=>{if(isIntersecting){target.dataset.entered='true';observer.unobserve(target)}}),{threshold:.08,rootMargin:'0px 0px -3% 0px'});
for(const node of document.querySelectorAll('.ed-intro,.ed-columns>article,.ed-facts,.ed-origins,.ed-concept,.ed-flow,.ed-swatches,.ed-type-block,.ed-showcase,.ed-paired,.ed-devices,.ed-cafe-reflection .ed-decisions')){
 node.classList.add('ed-reveal');node.dataset.entered=reduced.matches?'true':'false';observer.observe(node);
}
// The fixed chapter context becomes the current screen's own explanation.
const screens=document.querySelector('#screens .chapter-step-heading');
if(screens){const copy=document.createElement('div');copy.className='ed-active-copy';screens.prepend(copy);let previous=-1;
 motion.subscribe(()=>{const parent=screens.closest('.chapter-step-layout');if(!parent.classList.contains('chapter-step-pinned'))return;const number=Number(screens.querySelector('.chapter-step-nav span')?.textContent.split('/')[0])-1;if(number===previous||number<0)return;const source=parent.querySelectorAll('.ed-screen-copy')[number];if(!source)return;previous=number;copy.replaceChildren(...[...source.childNodes].map(n=>n.cloneNode(true)));const title=copy.querySelector('h3');if(title){const h=document.createElement('h2');h.innerHTML=title.innerHTML;title.replaceWith(h);}});
}
for(const button of document.querySelectorAll('[data-capture]'))button.addEventListener('click',()=>{
 const image=document.querySelector('.ed-comparison-preview>img');if(!image)return;
 image.src='case-study-assets/editorial/'+button.dataset.capture+'.jpg';
 image.alt=button.dataset.capture==='filtered'?'OFFER 카테고리와 상태 조건을 적용한 실제 실행 화면':'OFFER 전체 혜택 탐색 화면';
 document.querySelectorAll('[data-capture]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelector('[data-capture-caption]').textContent=button.dataset.capture==='filtered'?'실제 실행본에서 카테고리와 진행 상태 조건을 적용한 캡처입니다. 정렬과 필터는 서로 다른 역할을 합니다.':'실제 실행본의 전체 혜택 화면입니다. 위 버튼으로 조건을 적용한 캡처와 비교할 수 있습니다.';
 reading.refresh();
});
reduced.addEventListener('change',e=>{if(e.matches)document.querySelectorAll('.ed-reveal').forEach(n=>n.dataset.entered='true')});
addEventListener('pagehide',event=>{if(!event.persisted)observer.disconnect()});
if(document.body.dataset.editorial==='cafekok')import('/cafe-callouts.js');
