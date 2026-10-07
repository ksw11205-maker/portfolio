import {projects,questions,CONTACT_EMAIL} from './data.js';
import {preparePortfolioIntro} from './intro.js';
import {initSectionFlow} from './section-flow.js';
import {initScrollMotion} from './scroll-motion.js';
import {initMobius} from './mobius.js';
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
const preview=p=>`<article class="project project-${p.slug}"><a class="project-visual ${p.tone}" href="/work/${p.slug}${['cafekok','offer'].includes(p.slug)?'/':''}" aria-label="${p.title} ${p.slug==='offer'?'제품 보기':'case study'}">${p.cover?`<div class="art mockup-preview"><img src="/assets/projects/${p.cover}-1920.jpg" srcset="/assets/projects/${p.cover}-960.jpg 960w, /assets/projects/${p.cover}-1920.jpg 1920w" sizes="(max-width:600px) calc(100vw - 64px), (max-width:1100px) 85vw, 70vw" alt="${p.coverAlt}" width="1920" height="${p.coverHeight}" loading="lazy"></div>`:p.slug==='cafekok'?`<div class="cafekok-photo-preview"><img src="/work/cafekok/assets/cafe-cover.webp" srcset="/work/cafekok/assets/cafe-cover-800.webp 800w, /work/cafekok/assets/cafe-cover.webp 1600w" sizes="(max-width:1100px) 90vw, 60vw" alt="밝은 외벽과 나무 벤치 앞에서 사람들이 머무는 카페" width="1920" height="1280" loading="lazy"><div><span>취향이 머무는 곳</span><strong class="cafekok-brand-logo" role="img" aria-label="카페콕 CAFÉKOK"></strong></div></div>`:`<div class="art" role="img" aria-label="${p.title} — 실제 프로젝트 이미지로 교체할 타이포그래피 썸네일"><div class="art-top"><span>${p.label}</span><span>${p.number} / 04</span></div><p class="art-word">${p.word}</p><div class="art-bottom"><span>${p.title}</span><span>PROJECT PREVIEW</span></div></div>`}</a><div class="project-info"><span class="project-number">${p.number}</span><div><h3>${p.title}</h3><p>${p.category}</p><p class="project-summary" lang="ko">${p.summary}</p></div>${button(p.slug==='offer'?'VIEW PROJECT':'VIEW CASE STUDY','/work/'+p.slug+(['cafekok','offer'].includes(p.slug)?'/':''))}</div></article>`;
const footer=(light=false)=>`<footer class="container site-footer${light?' is-light':''}"><p>© 2026 KIM SEONGWON</p></footer>`;
const qaSection=()=>`<section id="qa" class="qa qa-process container section" aria-labelledby="qa-title"><div class="qa-stage"><div class="qa-viewport"><div class="section-heading qa-heading"><p class="eyebrow">04 / PERSPECTIVE</p><h2 id="qa-title">How I Think</h2><p class="qa-scroll-hint">SCROLL TO READ</p></div><ol class="qa-deck" aria-label="디자인에 관한 다섯 가지 질문과 답변">${questions.map(([q,a],i)=>`<li class="qa-card" tabindex="0" aria-labelledby="qa-question-${i}"><div class="qa-card-top"><p class="eyebrow">0${i+1} / 0${questions.length}</p><h3 id="qa-question-${i}">${q}</h3></div><p class="qa-card-answer" lang="ko">${a}</p></li>`).join('')}</ol></div></div></section>`;
function toolsSection(){return `<section class="tools" id="tools" aria-labelledby="tools-title"><div class="container"><div class="tools-heading"><p class="eyebrow">02 / APPROACH</p><h2 id="tools-title">How I Work</h2></div><p class="tools-accessible">사용하는 도구: ${toolLogos.map(tool=>tool.name).join(', ')}.</p><div class="tools-visual" aria-hidden="true"><div class="tool-marquee"><div class="tool-marquee-track">${[0,1].map(copy=>`<div class="tool-logos" data-copy="${copy}">${toolLogos.map(tool=>`<span class="tool-logo"><img src="${tool.src}" alt="" width="40" height="40" loading="lazy" draggable="false"></span>`).join('')}</div>`).join('')}</div></div><div class="tools-sculpture"><img src="/assets/tools-mobius.svg" alt="" width="640" height="640" decoding="async" loading="lazy" draggable="false"><canvas aria-hidden="true" width="640" height="640"></canvas></div></div><div class="tools-capabilities" lang="ko"><article><h3>AI 활용</h3><p class="capability-lead"><span>아이디어를 빠르게 검증하고,</span> <span>구현까지 연결합니다.</span></p><p class="capability-detail">GPT와 Codex를 활용해 시안을 탐색하고 프로토타입을 구현합니다.</p></article><article><h3>인간공학</h3><p class="capability-lead"><span>사용자 행동을 분석하고,</span> <span>판단의 근거를 만듭니다.</span></p><p class="capability-detail">이용 맥락과 인지부하를 살피고 사용성 평가로 설계를 점검합니다.</p></article><article><h3>UX/UI</h3><p class="capability-lead"><span>복잡한 정보를 정리해,</span> <span>명확한 경험을 설계합니다.</span></p><p class="capability-detail">정보 구조부터 화면과 인터랙션까지 일관된 흐름으로 연결합니다.</p></article></div></div></section>`;}

function home(){return `${header()}<main id="main"><section class="hero" id="home"><div class="marquee" aria-label="2026 UX/UI Designer Portfolio"><div class="marquee-track" aria-hidden="true">${Array(2).fill('<span>2026 UX/UI DESIGNER PORTFOLIO <i>—</i>&nbsp;</span>').join('')}</div></div><div class="hero-bottom container"><div class="hero-name"><p class="hero-role">UX/UI DESIGNER</p><h1>KIM SEONGWON</h1></div><div class="hero-controls"><button class="motion-toggle" aria-pressed="false" aria-label="Pause continuous motion">Ⅱ</button></div></div></section><section id="about" class="about container section"><div class="about-graphic" aria-hidden="true"><img src="/assets/ergonomic-proportions.svg" alt="" width="640" height="760" decoding="async"></div>${heading('01','PROFILE','Who I Am')}<div class="about-intro reveal"><p lang="ko">인간공학을 바탕으로,<br>사용자에게 명확한 경험을 설계합니다.</p></div><div class="about-grid profile-details"><div class="reveal"><p class="eyebrow">01 — EXPERIENCE</p><h3>동의대학교 UXU LAB</h3><p class="profile-role">학부 연구생</p><p class="profile-date">2024.03–2025.12</p><p class="profile-description" lang="ko">스마트 TV와 차량 IVI의 사용성을 연구하며, 사용자 행동 분석과 인터페이스 개선을 수행했습니다.</p></div><div class="reveal"><p class="eyebrow">02 — BACKGROUND</p><ul class="profile-list"><li><h3>동의대학교 인간공학과 졸업</h3><p class="profile-date">2026.02</p></li><li><h3>인간공학기사</h3><p class="profile-date">2024.11</p></li><li class="profile-training"><h3>SBS 아카데미 UX/UI 디자인 교육과정</h3><p class="profile-date">수강 중 · 2026.07–12</p></li></ul></div><div class="reveal"><p class="eyebrow">03 — AWARDS</p><ul class="profile-list"><li><div class="award-heading"><h3>장려상</h3><span class="profile-date">2025</span></div><p class="award-event">대한인간공학회 캡스톤 디자인 경진대회</p></li><li><div class="award-heading"><h3>혁신상</h3><span class="profile-date">2024</span></div><p class="award-event">BDIA 해커톤</p></li><li><div class="award-heading"><h3>장려상</h3><span class="profile-date">2024</span></div><p class="award-event">대한인간공학회 캡스톤 디자인 경진대회</p></li></ul></div></div></section>${toolsSection()}<section id="work" class="work container section" aria-labelledby="work-title"><div class="work-stage"><div class="work-heading"><p class="eyebrow">03 / SELECTED WORK</p><h2 id="work-title"><span>Things I’ve</span> <span>Designed</span></h2></div><div class="project-list">${projects.map(preview).join('')}</div></div></section>${qaSection()}<section id="contact" class="contact contact-finale container section"><div class="contact-heading reveal"><p class="eyebrow">05 / GET IN TOUCH</p><h2><span>Let’s Make</span> <span class="contact-title-end">It Clear.</span><span class="contact-period" aria-hidden="true">↗</span></h2></div><div class="contact-note reveal"><p lang="ko">좋은 경험의 시작,<br>함께 이야기하고 싶습니다.</p><span class="contact-signature">UX/UI DESIGNER · 김성원</span></div><div class="contact-card-stage reveal"><div class="contact-card"><svg class="contact-engraving-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="contact-engraving" x="-5%" y="-10%" width="110%" height="125%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dy="1" result="cut-offset"/><feComposite in="SourceAlpha" in2="cut-offset" operator="out" result="inner-edge"/><feFlood flood-color="#080e14" flood-opacity=".8"/><feComposite in2="inner-edge" operator="in"/><feComposite in2="SourceGraphic" operator="over"/></filter></defs></svg><div class="contact-card-identity"><p class="contact-card-name">KIM SEONGWON</p><p class="contact-card-role">UX/UI DESIGNER</p></div><a class="contact-card-link" href="mailto:${CONTACT_EMAIL}" aria-label="김성원에게 이메일 보내기"><span class="contact-email">${CONTACT_EMAIL}</span><span class="contact-card-arrow" aria-hidden="true">↗</span></a></div></div></section></main>${footer(true)}<a class="scroll-guide" href="#about" aria-label="Who I Am 섹션으로 이동"><span class="scroll-guide-label">SCROLL</span><span class="scroll-guide-track" aria-hidden="true"></span></a><div class="site-cursor" aria-hidden="true"><span class="cursor-dot"></span><span class="cursor-follower"><span class="cursor-label">VIEW<br>CASE STUDY ↗</span></span></div>`;}
const slug=location.pathname.replace(/\/$/,'').split('/')[2];
const project=projects.find(p=>p.slug===slug);
if(location.pathname.startsWith('/work/')&&project){app.innerHTML=`${header()}<main id="main" class="placeholder container"><p class="eyebrow">SELECTED WORK / ${project.number}</p><h1>${project.title}</h1><p>${project.category}</p><h2>Case study coming next.</h2><a class="back" href="/#work">← BACK TO WORK</a></main>${footer()}`;document.title=project.title+' — Kim Seongwon';}else{app.innerHTML=home();}
app.classList.remove('static-home');
const scrollMotion=initScrollMotion({reduced});
const portfolioIntro=preparePortfolioIntro({app,reduced});
const menu=document.querySelector('.menu');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);document.querySelector('.header').classList.toggle('open',open);});
function closeMenu(){menu.setAttribute('aria-expanded','false');document.querySelector('.header').classList.remove('open');}
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
const track=document.querySelector('.marquee-track');
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
  document.fonts?.ready.then(measure);
  document.fonts?.addEventListener('loadingdone',measure);
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
let paused=false,offset=0,last=0,momentum=0,previousScroll=scrollY,raf;
addEventListener('scroll',()=>{momentum=Math.min(100,momentum+Math.abs(scrollY-previousScroll)*.15);previousScroll=scrollY;},{passive:true});
function frame(t){const dt=Math.min((t-last)/1000||0,.05);last=t;if(track&&!paused&&heroVisible&&!document.hidden&&!portfolioIntro.blocksHero)animateMarquee(dt);raf=requestAnimationFrame(frame);}
function motion(){cancelAnimationFrame(raf);if(!reduced.matches){last=0;raf=requestAnimationFrame(frame);}else if(track){track.style.transform='none';marqueeChars.forEach(char=>char.el.style.removeProperty('transform'));}}
reduced.addEventListener('change',motion);motion();
document.querySelector('.motion-toggle')?.addEventListener('click',e=>{paused=!paused;document.body.classList.toggle('motion-paused',paused);e.currentTarget.setAttribute('aria-pressed',paused);e.currentTarget.setAttribute('aria-label',paused?'Resume continuous motion':'Pause continuous motion');e.currentTarget.textContent=paused?'▷':'Ⅱ';});
addEventListener('pagehide',()=>cancelAnimationFrame(raf));
addEventListener('pageshow',motion);

// One smoothed pointer state owns translation, tilt and metallic reflection.
const contactCard=document.querySelector('.contact-card');
if(contactCard){
  const region=contactCard.closest('.contact-card-stage');
  let targetX=0,targetY=0,currentX=0,currentY=0,cardFrame=0,cardLast=0,cardVisible=false;
  const paintCard=()=>{
    contactCard.style.setProperty('--card-x',`${currentX*7}px`);
    contactCard.style.setProperty('--card-y',`${currentY*7}px`);
    contactCard.style.setProperty('--card-rx',`${-currentY*4}deg`);
    contactCard.style.setProperty('--card-ry',`${currentX*4}deg`);
    contactCard.style.setProperty('--reflection-x',`${currentX*18}%`);
    contactCard.style.setProperty('--reflection-y',`${currentY*10}%`);
  };
  function followCard(time){
    cardFrame=0;
    if(!cardVisible||document.hidden||reduced.matches||paused)return;
    const dt=Math.min((time-cardLast)/1000||1/60,.05);cardLast=time;
    const blend=1-Math.exp(-11*dt);
    currentX+=(targetX-currentX)*blend;currentY+=(targetY-currentY)*blend;
    const settled=Math.abs(targetX-currentX)+Math.abs(targetY-currentY)<.0005;
    if(settled){currentX=targetX;currentY=targetY;}
    paintCard();
    if(!settled)cardFrame=requestAnimationFrame(followCard);
  }
  const scheduleCard=()=>{if(!cardFrame&&cardVisible&&!document.hidden&&!reduced.matches&&!paused){cardLast=performance.now();cardFrame=requestAnimationFrame(followCard);}};
  const resetCard=(immediate=false)=>{
    targetX=targetY=0;
    if(immediate){cancelAnimationFrame(cardFrame);cardFrame=0;currentX=currentY=0;paintCard();}
    else scheduleCard();
  };
  new IntersectionObserver(([entry])=>{cardVisible=entry.isIntersecting;if(!cardVisible)resetCard(true);}).observe(region);
  region.addEventListener('pointermove',event=>{
    if(!cardVisible||document.hidden||!fine.matches||reduced.matches||paused||event.pointerType==='touch')return;
    const box=region.getBoundingClientRect();
    targetX=Math.max(-1,Math.min(1,(event.clientX-box.left-box.width/2)/(box.width/2)));
    targetY=Math.max(-1,Math.min(1,(event.clientY-box.top-box.height/2)/(box.height/2)));
    scheduleCard();
  });
  region.addEventListener('pointerleave',()=>resetCard());
  region.addEventListener('pointercancel',()=>resetCard());
  region.addEventListener('focusin',()=>resetCard());
  reduced.addEventListener('change',()=>resetCard(true));
  fine.addEventListener('change',()=>resetCard(true));
  document.querySelector('.motion-toggle')?.addEventListener('click',()=>resetCard(true));
  addEventListener('blur',()=>resetCard(true));
  addEventListener('pagehide',()=>resetCard(true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)resetCard(true);});
}

// Preserve decorative animation phases while the section is offscreen.
const toolsSectionElement=document.querySelector('.tools');
if(toolsSectionElement){
  const sculpture=toolsSectionElement.querySelector('.tools-sculpture');
  sculpture.querySelectorAll('img').forEach(img=>{
    const unavailable=()=>{img.hidden=true;};
    img.addEventListener('error',unavailable,{once:true});
    if(img.complete&&!img.naturalWidth)unavailable();
  });
  initMobius({host:sculpture,section:toolsSectionElement,reduced});
  let toolsVisible=false;
  const syncTools=()=>toolsSectionElement.classList.toggle('tools-sleeping',!toolsVisible||document.hidden);
  new IntersectionObserver(([entry])=>{toolsVisible=entry.isIntersecting;syncTools();}).observe(toolsSectionElement.querySelector('.tools-visual'));
  document.addEventListener('visibilitychange',syncTools);
}
initSectionFlow({reduced,scrollMotion});
