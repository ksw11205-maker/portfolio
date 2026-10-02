import {projects,questions,CONTACT_EMAIL} from './data.js';
const toolLogos = [
{name:'Figma',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/figma/figma-original.svg'},
{name:'Adobe Photoshop',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/photoshop/photoshop-original.svg'},
{name:'Adobe Illustrator',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/illustrator/illustrator-plain.svg'},
{name:'Adobe After Effects',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/aftereffects/aftereffects-original.svg'},
{name:'HTML',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/html5/html5-original.svg'},
{name:'CSS',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/css3/css3-original.svg'},
{name:'JavaScript',src:'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/javascript/javascript-original.svg'},
{name:'GPT',src:'/assets/gpt.svg'},
{name:'Codex',src:'/assets/codex.svg'}
];
const app=document.querySelector('#app');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(hover: hover) and (pointer: fine)');
const nav=[['about','ABOUT'],['work','WORK'],['qa','Q&A'],['contact','CONTACT']];
const arrow='<span class="arrow" aria-hidden="true">↗</span>';
const button=(label,href,cls='')=>`<a class="liquid ${cls}" href="${href}"><span>${label}</span>${arrow}</a>`;
const links=()=>nav.map(([id,label])=>`<a href="/#${id}" data-nav="${id}">${label}</a>`).join('');
const header=()=>`<header class="header"><a class="monogram" href="/" aria-label="Kim Seongwon home">KS<span>.</span></a><nav id="navigation" aria-label="Main navigation">${links()}</nav><button class="menu" aria-controls="navigation" aria-expanded="false">MENU <span>+</span></button></header>`;
const heading=(num,label,title)=>`<div class="section-heading reveal"><p class="eyebrow">${num} / ${label}</p><h2>${title}</h2></div>`;
const preview=p=>`<article class="project project-${p.slug} reveal"><a class="project-visual ${p.tone}" href="/work/${p.slug}${['cafekok','offer'].includes(p.slug)?'/':''}" aria-label="${p.title} ${p.slug==='offer'?'제품 보기':'case study'}">${p.cover?`<div class="art mockup-preview"><img src="/assets/projects/${p.cover}-1920.jpg" srcset="/assets/projects/${p.cover}-960.jpg 960w, /assets/projects/${p.cover}-1920.jpg 1920w" sizes="(max-width:600px) calc(100vw - 64px), (max-width:1100px) 85vw, 70vw" alt="${p.coverAlt}" width="1920" height="${p.coverHeight}" loading="lazy"></div>`:p.slug==='cafekok'?`<div class="cafekok-photo-preview"><img src="/work/cafekok/assets/cafe-cover.webp" srcset="/work/cafekok/assets/cafe-cover-800.webp 800w, /work/cafekok/assets/cafe-cover.webp 1600w" sizes="(max-width:1100px) 90vw, 60vw" alt="밝은 외벽과 나무 벤치 앞에서 사람들이 머무는 카페" width="1920" height="1280" loading="lazy"><div><span>취향이 머무는 곳</span><strong class="cafekok-brand-logo" role="img" aria-label="카페콕 CAFÉKOK"></strong></div></div>`:`<div class="art" role="img" aria-label="${p.title} — 실제 프로젝트 이미지로 교체할 타이포그래피 썸네일"><div class="art-top"><span>${p.label}</span><span>${p.number} / 04</span></div><p class="art-word">${p.word}</p><div class="art-bottom"><span>${p.title}</span><span>PROJECT PREVIEW</span></div></div>`}</a><div class="project-info"><span class="project-number">${p.number}</span><div><h3>${p.title}</h3><p>${p.category}</p><p class="project-summary" lang="ko">${p.summary}</p></div>${button(p.slug==='offer'?'VIEW PROJECT':'VIEW CASE STUDY','/work/'+p.slug+(['cafekok','offer'].includes(p.slug)?'/':''))}</div></article>`;
const footer=()=>`<footer class="container site-footer"><p>© 2026 KIM SEONGWON</p></footer>`;
const qaSection=()=>`<section id="qa" class="qa qa-process container section" aria-labelledby="qa-title"><div class="qa-stage"><div class="qa-viewport"><div class="section-heading qa-heading"><p class="eyebrow">03 / A LITTLE MORE</p><h2 id="qa-title">Questions,<br><em>answered.</em></h2><p class="qa-scroll-hint">SCROLL TO READ</p></div><ol class="qa-deck" aria-label="디자인에 관한 다섯 가지 질문과 답변">${questions.map(([q,a],i)=>`<li class="qa-card" tabindex="0" aria-labelledby="qa-question-${i}"><div class="qa-card-top"><p class="eyebrow">0${i+1} / 0${questions.length}</p><h3 id="qa-question-${i}">${q}</h3></div><p class="qa-card-answer" lang="ko">${a}</p></li>`).join('')}</ol></div></div></section>`;
function home(){return `${header()}<main id="main"><section class="hero" id="home"><div class="marquee" aria-label="2026 UX/UI Designer Portfolio"><div class="marquee-track" aria-hidden="true">${Array(2).fill('<span>2026 UX/UI DESIGNER PORTFOLIO <i>—</i>&nbsp;</span>').join('')}</div></div><div class="hero-bottom container"><div class="hero-name"><p class="hero-role">UX/UI DESIGNER</p><h1>KIM SEONGWON</h1></div><div class="hero-controls"><button class="motion-toggle" aria-pressed="false" aria-label="Pause continuous motion">Ⅱ</button><a class="scroll-link" href="#about">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div></div></section><aside class="tools" aria-label="사용 가능한 디자인 및 개발 도구"><div class="tool-marquee"><div class="tool-marquee-track">${[0,1].map(copy=>`<div class="tool-logos" ${copy?'aria-hidden="true"':''}>${toolLogos.map(t=>`<span class="tool-logo" ${copy?'tabindex="-1"':'tabindex="0"'} aria-label="${t.name}"><img src="${t.src}" alt="" width="40" height="40" loading="lazy"><span class="tool-tooltip" aria-hidden="true">${t.name}</span></span>`).join('')}</div>`).join('')}</div></div></aside><section id="about" class="about container section">${heading('01','PROFILE','About <em>Me.</em>')}<div class="about-intro reveal"><p lang="ko">인간공학을 바탕으로,<br>사용자에게 명확한 경험을 설계합니다.</p></div><div class="about-grid profile-details"><div class="reveal"><p class="eyebrow">01 — EXPERIENCE</p><h3>동의대학교 UXU LAB</h3><p class="profile-role">학부 연구생</p><p class="profile-date">2024.03–2025.12</p><p class="profile-description" lang="ko">스마트 TV와 차량 IVI의 사용성을 연구하며, 사용자 행동 분석과 인터페이스 개선을 수행했습니다.</p></div><div class="reveal"><p class="eyebrow">02 — BACKGROUND</p><ul class="profile-list"><li><h3>동의대학교 인간공학과 졸업</h3><p class="profile-date">2026.02</p></li><li><h3>인간공학기사</h3><p class="profile-date">2024.11</p></li><li class="profile-training"><h3>SBS 아카데미 UX/UI 디자인 교육과정</h3><p class="profile-date">수강 중 · 2026.07–12</p></li></ul></div><div class="reveal"><p class="eyebrow">03 — AWARDS</p><ul class="profile-list"><li><div class="award-heading"><h3>장려상</h3><span class="profile-date">2025</span></div><p class="award-event">대한인간공학회 캡스톤 디자인 경진대회</p></li><li><div class="award-heading"><h3>혁신상</h3><span class="profile-date">2024</span></div><p class="award-event">BDIA 해커톤</p></li><li><div class="award-heading"><h3>장려상</h3><span class="profile-date">2024</span></div><p class="award-event">대한인간공학회 캡스톤 디자인 경진대회</p></li></ul></div></div></section><section id="work" class="work container section">${heading('02','SELECTED WORK','Things I’ve<br><em>Designed.</em>')}<div class="work-layout"><aside class="work-rail" aria-label="현재 프로젝트 소개"><div class="rail-descriptions">${projects.map((p,i)=>`<div class="rail-description ${i===0?'is-current':''}" data-project="${p.slug}" aria-hidden="${i!==0}"><span class="rail-count">${p.number} / 04</span><h3>${p.title}</h3><p lang="ko">${p.summary}</p><span class="rail-category">${p.category}</span></div>`).join('')}</div><div class="rail-progress" aria-hidden="true">${projects.map((p,i)=>`<span class="${i===0?'is-current':''}"></span>`).join('')}</div></aside><div class="gallery">${projects.map(preview).join('')}</div></div></section>${qaSection()}<section id="contact" class="contact contact-finale container section"><div class="contact-heading reveal"><p class="eyebrow">04 / GET IN TOUCH</p><h2><span>Let’s make</span><em>it clear.</em><span class="contact-period" aria-hidden="true">↗</span></h2></div><div class="contact-note reveal"><p lang="ko">좋은 경험의 시작,<br>함께 이야기하고 싶습니다.</p><span class="contact-signature">UX/UI DESIGNER · 김성원</span></div><div class="contact-card-stage reveal"><div class="contact-card"><div class="contact-card-top"><span class="contact-card-mark">KS<span>.</span></span><span class="contact-card-label">HUMAN FACTORS<br>MEETS DESIGN</span></div><div class="contact-card-name">KIM<br>SEONGWON<small>UX/UI DESIGNER</small></div><a class="contact-card-link" href="mailto:${CONTACT_EMAIL}" aria-label="김성원에게 이메일 보내기"><span><small>LET’S TALK</small><span class="contact-email">${CONTACT_EMAIL}</span></span><span class="contact-card-arrow" aria-hidden="true">↗</span></a></div><p class="contact-card-caption">A small card. A new connection.</p></div></section></main>${footer()}<div class="project-cursor" aria-hidden="true"><span>VIEW<br>CASE STUDY ↗</span></div>`;}
const slug=location.pathname.replace(/\/$/,'').split('/')[2];
const project=projects.find(p=>p.slug===slug);
if(location.pathname.startsWith('/work/')&&project){app.innerHTML=`${header()}<main id="main" class="placeholder container"><p class="eyebrow">SELECTED WORK / ${project.number}</p><h1>${project.title}</h1><p>${project.category}</p><h2>Case study coming next.</h2><a class="back" href="/#work">← BACK TO WORK</a></main>${footer()}`;document.title=project.title+' — Kim Seongwon';}else{app.innerHTML=home();}
const menu=document.querySelector('.menu');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);document.querySelector('.header').classList.toggle('open',open);});
function closeMenu(){menu.setAttribute('aria-expanded','false');document.querySelector('.header').classList.remove('open');}
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
// Reserve the full title layout while revealing letters, preserving emphasis and breaks.
const titleSequences=new Map(),entranceTimers=new Set();
document.querySelectorAll('main > .section h2').forEach(title=>{
  const section=title.closest('.section');
  const label=title.cloneNode(true);
  label.querySelectorAll('[aria-hidden="true"]').forEach(el=>el.remove());
  label.querySelectorAll('br').forEach(el=>el.replaceWith(' '));
  title.setAttribute('aria-label',[...label.childNodes].map(node=>node.textContent).join(' ').replace(/\s+/g,' ').trim());
  const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())if(!walker.currentNode.parentElement.closest('[aria-hidden="true"]'))nodes.push(walker.currentNode);
  let count=0;
  nodes.forEach(node=>node.replaceWith(...Array.from(node.textContent,letter=>{
    const span=document.createElement('span');span.className='typing-char';span.textContent=letter;span.setAttribute('aria-hidden','true');
    span.style.setProperty('--typing-delay',`${count++*32}ms`);return span;
  })));
  title.classList.add('typing-title');
  title.parentElement.classList.remove('reveal');
  titleSequences.set(section,{title,duration:count*32+100,started:null});
});
function startTitle(sequence){
  if(!sequence||sequence.started!==null)return;
  sequence.started=performance.now();sequence.title.classList.add('is-typing');
}
const titleObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){startTitle(titleSequences.get(entry.target.closest('.section')));titleObserver.unobserve(entry.target);}
}),{threshold:.15});
titleSequences.forEach(sequence=>titleObserver.observe(sequence.title));
// Q&A retains its horizontal travel; reveal only the content inside each card.
document.querySelectorAll('.qa-card-top,.qa-card-answer').forEach(el=>el.classList.add('reveal'));
function showContent(el){el.classList.add('visible');}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const el=entry.target,sequence=titleSequences.get(el.closest('.section'));
  startTitle(sequence);
  const delay=reduced.matches?0:Math.max(0,(sequence?.duration||0)-(performance.now()-(sequence?.started??0)));
  if(delay){const timer=setTimeout(()=>{entranceTimers.delete(timer);showContent(el);},delay);entranceTimers.add(timer);}else showContent(el);
  observer.unobserve(el);
}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>{observer.observe(el);el.classList.add('observed');});
// Keyboard navigation never waits for decorative animation.
document.addEventListener('focusin',event=>{
  event.target.closest('.reveal')?.classList.add('visible');
  event.target.closest('.qa-card')?.querySelectorAll('.reveal').forEach(showContent);
});
reduced.addEventListener('change',()=>{
  if(!reduced.matches)return;
  entranceTimers.forEach(clearTimeout);entranceTimers.clear();
  document.querySelectorAll('.reveal.observed').forEach(showContent);
});
const sections=[...document.querySelectorAll('main > section[id]')];
const activeObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -55% 0px'});
sections.forEach(s=>activeObserver.observe(s));
const track=document.querySelector('.marquee-track');
const cursor=document.querySelector('.project-cursor');
let marqueeWidth=0,marqueeViewport=innerWidth,heroVisible=true,introElapsed=0;
const marqueeChars=[];
if(track){
  // Keep the original accessible label; animate only the decorative copies.
  [...track.children].forEach(group=>{
    const text=group.textContent;
    group.replaceChildren(...[...text].map((letter,index)=>{
      const char=document.createElement('span');
      char.className='marquee-char'+(letter==='—'?' marquee-accent':'');
      char.textContent=/\s/.test(letter)?'\u00a0':letter;
      const seed=Math.sin((index+1)*127.1)*43758.5453;
      const variation=seed-Math.floor(seed);
      marqueeChars.push({el:char,left:0,y:(index%2?-1:1)*(65+variation*95),rotation:(variation-.5)*40,delay:variation*.45});
      return char;
    }));
  });
  const measure=()=>{
    marqueeChars.forEach(char=>char.el.style.removeProperty('transform'));
    const origin=track.getBoundingClientRect().left;
    marqueeWidth=track.firstElementChild.getBoundingClientRect().width;
    marqueeViewport=document.documentElement.clientWidth;
    marqueeChars.forEach(char=>char.left=char.el.getBoundingClientRect().left-origin);
  };
  new ResizeObserver(measure).observe(track.firstElementChild);
  measure();
  new IntersectionObserver(([entry])=>heroVisible=entry.isIntersecting).observe(track.closest('.hero'));
}
const settle=p=>{const t=Math.max(0,Math.min(1,p))-1;return 1+2.2*t*t*t+1.2*t*t;};
function animateMarquee(dt){
  introElapsed+=dt;
  offset+=dt*((marqueeViewport<=600?42:64)+momentum);
  if(marqueeWidth)offset%=marqueeWidth;
  track.style.transform=`translate3d(${-offset}px,0,0)`;
  marqueeChars.forEach(char=>{
    const left=char.left-offset;
    if(left < -180 || left > marqueeViewport+180)return;
    // Match the reference's scattered-to-baseline travel across the right edge.
    const travel=(marqueeViewport-left)/(marqueeViewport*.55);
    const entrance=(introElapsed-char.delay)/1.35;
    const amount=1-settle(Math.min(travel,entrance));
    char.el.style.transform=`translate3d(0,${char.y*amount}%,0) rotate(${char.rotation*amount}deg)`;
  });
  momentum*=Math.exp(-4*dt);
}
let paused=false,x=0,y=0,tx=0,ty=0,cursorActive=false,offset=0,last=0,momentum=0,previousScroll=scrollY,raf;
document.querySelectorAll('.project-visual').forEach(el=>{el.addEventListener('pointerenter',e=>{if(!fine.matches||reduced.matches||e.pointerType==='touch')return;cursorActive=true;x=tx=e.clientX;y=ty=e.clientY;cursor.classList.add('active');});el.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches||e.pointerType==='touch')return;tx=e.clientX;ty=e.clientY;cursorActive=true;cursor.classList.add('active');});el.addEventListener('pointerleave',()=>{cursorActive=false;cursor.classList.remove('active');});});
addEventListener('scroll',()=>{momentum=Math.min(100,momentum+Math.abs(scrollY-previousScroll)*.15);previousScroll=scrollY;cursorActive=false;cursor?.classList.remove('active');},{passive:true});
function frame(t){const dt=Math.min((t-last)/1000||0,.05);last=t;if(track&&!paused&&heroVisible&&!document.hidden)animateMarquee(dt);if(cursorActive&&cursor){x+=(tx-x)*.14;y+=(ty-y)*.14;cursor.style.transform='translate('+x+'px,'+y+'px)';}raf=requestAnimationFrame(frame);}
function motion(){cancelAnimationFrame(raf);cursor?.classList.remove('active');cursorActive=false;if(!reduced.matches){last=0;raf=requestAnimationFrame(frame);}else if(track){track.style.transform='none';marqueeChars.forEach(char=>char.el.style.removeProperty('transform'));}}
reduced.addEventListener('change',motion);motion();
document.querySelector('.motion-toggle')?.addEventListener('click',e=>{paused=!paused;document.body.classList.toggle('motion-paused',paused);e.currentTarget.setAttribute('aria-pressed',paused);e.currentTarget.setAttribute('aria-label',paused?'Resume continuous motion':'Pause continuous motion');e.currentTarget.textContent=paused?'▷':'Ⅱ';});
addEventListener('pagehide',()=>cancelAnimationFrame(raf));
addEventListener('pageshow',motion);

// Select the last project whose top has crossed the reading line.
// Works in both directions and after large scroll jumps, without queued fades.
const projectArticles=[...document.querySelectorAll('.gallery > .project')];
const railPanels=[...document.querySelectorAll('.rail-description')];
const railSteps=[...document.querySelectorAll('.rail-progress span')];
let railIndex=-1,railFrame=0;
function updateProjectRail(){
  railFrame=0;
  if(!projectArticles.length)return;
  const readingLine=innerHeight*.45;
  let next=0;
  projectArticles.forEach((article,index)=>{if(article.getBoundingClientRect().top<=readingLine)next=index;});
  if(next===railIndex)return;
  railIndex=next;
  railPanels.forEach((panel,index)=>{panel.classList.toggle('is-current',index===next);panel.setAttribute('aria-hidden',String(index!==next));});
  railSteps.forEach((step,index)=>step.classList.toggle('is-current',index===next));
}
function scheduleRail(){if(!railFrame)railFrame=requestAnimationFrame(updateProjectRail);}
if(projectArticles.length){
  addEventListener('scroll',scheduleRail,{passive:true});
  addEventListener('resize',scheduleRail);
  addEventListener('pageshow',scheduleRail);
  new ResizeObserver(scheduleRail).observe(document.querySelector('.gallery'));
  document.fonts?.ready.then(scheduleRail);
  updateProjectRail();
}
// Bring covered sticky links to the front when navigating with the keyboard.
const stackedWork=matchMedia('(min-width:1101px) and (min-height:650px) and (prefers-reduced-motion:no-preference)');
document.querySelector('.gallery')?.addEventListener('focusin',event=>{
  if(!stackedWork.matches)return;
  const article=event.target.closest('.project'),index=projectArticles.indexOf(article);
  if(index<0)return;
  const gallery=document.querySelector('.gallery');
  const flowTop=gallery.getBoundingClientRect().top+scrollY+projectArticles.slice(0,index).reduce((sum,el)=>sum+el.offsetHeight+parseFloat(getComputedStyle(el).marginBottom),0);
  window.scrollTo({top:flowTop-parseFloat(getComputedStyle(article).top),behavior:'instant'});
  updateProjectRail();
});
// Small, bounded card tilt; static on touch and with reduced motion.
const contactCard=document.querySelector('.contact-card');
if(contactCard){
  const resetCard=()=>{contactCard.style.removeProperty('--card-rx');contactCard.style.removeProperty('--card-ry');contactCard.style.removeProperty('--shine-x');contactCard.style.removeProperty('--shine-y');};
  contactCard.addEventListener('pointermove',event=>{
    if(!fine.matches||reduced.matches||paused||event.pointerType==='touch')return;
    const box=contactCard.getBoundingClientRect();
    const px=Math.max(0,Math.min(1,(event.clientX-box.left)/box.width));
    const py=Math.max(0,Math.min(1,(event.clientY-box.top)/box.height));
    contactCard.style.setProperty('--card-rx',((.5-py)*8)+'deg');
    contactCard.style.setProperty('--card-ry',((px-.5)*10)+'deg');
    contactCard.style.setProperty('--shine-x',(px*100)+'%');
    contactCard.style.setProperty('--shine-y',(py*100)+'%');
  });
  contactCard.addEventListener('pointerleave',resetCard);
  contactCard.addEventListener('pointercancel',resetCard);
  reduced.addEventListener('change',resetCard);
  fine.addEventListener('change',resetCard);
  document.querySelector('.motion-toggle')?.addEventListener('click',resetCard);
}

// Native vertical scroll drives the Q&A deck; no wheel interception or library.
const qa=document.querySelector('.qa-process');
if(qa){
  const stage=qa.querySelector('.qa-stage');
  const deck=qa.querySelector('.qa-deck');
  const cards=[...qa.querySelectorAll('.qa-card')];
  const desktopQA=matchMedia('(min-width:801px) and (min-height:650px)');
  let qaTravel=0,qaRun=0,qaTop=0,qaFrame=0,qaLayoutFrame=0;
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
  function updateQA(){
    qaFrame=0;
    if(!qa.classList.contains('is-scroll-driven'))return;
    const progress=clamp((scrollY-qaTop)/qaRun);
    const shift=progress*qaTravel;
    qa.style.setProperty('--qa-x',-shift+'px');
    cards.forEach((card,index)=>{
      const center=card.offsetLeft+card.offsetWidth/2-shift;
      const tilt=index===0?0:clamp((center-stage.clientWidth*.55)/(stage.clientWidth*.65))*(1-progress);
      const direction=index%2?-1:1;
      card.style.setProperty('--qa-angle',direction*3*tilt+'deg');
      card.style.setProperty('--qa-lift',direction*card.offsetHeight*.08*tilt+'px');
    });
  }
  function scheduleQA(){if(!qaFrame)qaFrame=requestAnimationFrame(updateQA);}
  function layoutQA(){
    qaLayoutFrame=0;
    const enabled=desktopQA.matches&&!reduced.matches;
    qa.classList.toggle('is-scroll-driven',enabled);
    if(enabled){
      qaTravel=Math.max(0,deck.scrollWidth-stage.clientWidth);
      qaRun=Math.max(1,qaTravel*1.35);
      qa.style.setProperty('--qa-height',stage.clientHeight+qaRun+'px');
      qaTop=qa.getBoundingClientRect().top+scrollY;
    }else{
      qa.style.removeProperty('--qa-height');
      qa.style.removeProperty('--qa-x');
      cards.forEach(card=>{card.style.removeProperty('--qa-angle');card.style.removeProperty('--qa-lift');});
    }
    updateQA();
  }
  function scheduleQALayout(){if(!qaLayoutFrame)qaLayoutFrame=requestAnimationFrame(layoutQA);}
  deck.addEventListener('focusin',event=>{
    const card=event.target.closest('.qa-card');
    if(!card||!qa.classList.contains('is-scroll-driven'))return;
    const gutter=parseFloat(getComputedStyle(qa).marginLeft)||32;
    const shift=clamp(card.offsetLeft-gutter,0,qaTravel);
    window.scrollTo({top:qaTop+shift/qaTravel*qaRun,behavior:'instant'});
    updateQA();
  });
  addEventListener('scroll',scheduleQA,{passive:true});
  addEventListener('resize',scheduleQALayout);
  addEventListener('pageshow',scheduleQALayout);
  desktopQA.addEventListener('change',scheduleQALayout);
  reduced.addEventListener('change',scheduleQALayout);
  new ResizeObserver(scheduleQALayout).observe(stage);
  document.fonts?.ready.then(scheduleQALayout);
  layoutQA();
  // The HTML is rendered by this module, so restore a direct Q&A hash once ready.
  const restoreQAHash=()=>{if(location.hash==='#qa')qa.scrollIntoView({behavior:'instant',block:'start'});};
  requestAnimationFrame(restoreQAHash);
  if(document.readyState==='complete')restoreQAHash();
  else addEventListener('pageshow',event=>{if(!event.persisted)requestAnimationFrame(restoreQAHash);},{once:true});
}
