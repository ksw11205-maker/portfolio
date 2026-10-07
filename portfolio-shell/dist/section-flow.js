// A single scroll clock drives all title entrances and the existing Work/Q&A stages.
// Ordinary sections have a short sticky shell; Work/Q&A reuse their own single pin.
export function initSectionFlow({reduced,scrollMotion}){
  const hero=document.querySelector('.hero');if(!hero)return;
  const sections=[...document.querySelectorAll('main > section[id]')];
  const header=document.querySelector('.header'),guide=document.querySelector('.scroll-guide');
  const work=document.querySelector('#work'),qa=document.querySelector('#qa'),contact=document.querySelector('#contact');
  const projects=[...work.querySelectorAll('.project')],cards=[...qa.querySelectorAll('.qa-card')];
  const workStage=work.querySelector('.work-stage'),qaStage=qa.querySelector('.qa-stage'),deck=qa.querySelector('.qa-deck');
  const coverLink=document.createElement('a');coverLink.className='work-current-link';workStage.append(coverLink);
  const desktop=matchMedia('(min-width:1101px) and (min-height:760px)');
  const desktopQA=matchMedia('(min-width:801px) and (min-height:650px)');
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n)),smooth=n=>n*n*(3-2*n);
  const resting=()=>reduced.matches||document.body.classList.contains('motion-paused');
  const labels={home:'Hero',about:'Who I Am',tools:'How I Work',work:'Projects',qa:'How I Think',contact:'Contact'};
  const configs=[
    {id:'about',heading:'.section-heading',content:'.about-graphic,.about-intro,.profile-details'},
    {id:'tools',heading:'.tools-heading',content:'.tools-visual,.tools-capabilities'},
    {id:'work',heading:'.work-heading',content:'.project-list'},
    {id:'qa',heading:'.qa-heading',content:'.qa-deck'},
    {id:'contact',heading:'.contact-heading',content:'.contact-note,.contact-card-stage'}
  ];
  const entries=configs.map(config=>{
    const section=document.getElementById(config.id),heading=section.querySelector(config.heading),title=heading.querySelector('h2');
    const shell=document.createElement('div');shell.className='section-entry-shell';section.before(shell);shell.append(section);
    section.classList.add('entry-section');title.classList.add('entry-title');
    const content=[...section.querySelectorAll(config.content),...heading.querySelectorAll('.eyebrow,.qa-scroll-hint')];
    content.forEach(node=>node.classList.add('entry-content'));
    // Scroll progress is the only owner of the entrance, including reverse scroll.
    section.querySelectorAll('.reveal').forEach(node=>node.classList.remove('reveal','observed','visible'));
    return {...config,section,shell,heading,title,content};
  });
  const workEntry=entries.find(e=>e.id==='work'),qaEntry=entries.find(e=>e.id==='qa');
  let layoutFrame=0,active='',lastDestination='',headerLight=false,measured=false,pendingAnchor=null;
  // Measure actual painted text without changing its width, wrapping or final layout.
  function textBounds(title){
    const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT),rects=[];let node;
    while(node=walker.nextNode()){
      if(!node.textContent.trim())continue;
      const range=document.createRange();range.selectNodeContents(node);
      rects.push(...[...range.getClientRects()].filter(r=>r.width&&r.height));
    }
    const left=Math.min(...rects.map(r=>r.left)),right=Math.max(...rects.map(r=>r.right));
    const top=Math.min(...rects.map(r=>r.top)),bottom=Math.max(...rects.map(r=>r.bottom));
    return {left,top,width:right-left,height:bottom-top};
  }
  function measure(){
    layoutFrame=0;const enabled=!resting(),h=innerHeight,w=document.documentElement.clientWidth;
    const compact=w<=800||h<760;
    const intro=enabled?h*(compact?.42:.7):0;
    work.classList.toggle('is-pinned',enabled&&desktop.matches);
    qa.classList.toggle('is-scroll-driven',enabled&&desktopQA.matches);
    entries.forEach(entry=>{
      const {section,shell,title}=entry;
      entry.mode=entry.id==='work'&&desktop.matches?'work':entry.id==='qa'&&desktopQA.matches?'qa':'flow';
      entry.enabled=enabled;entry.intro=intro;
      title.style.removeProperty('transform');
      section.classList.remove('is-entry-pinned');shell.classList.remove('has-entry-pin');
      shell.style.height='';shell.style.marginTop='';section.style.marginTop='';
      section.style.removeProperty('--entry-top');
      if(!enabled){section.style.setProperty('--section-content','1');}
    });
    // Existing reading distances are unchanged; only the title phase is prepended.
    workEntry.slot=h*.8;workEntry.run=intro+workEntry.slot*projects.length;
    if(enabled&&workEntry.mode==='work')work.style.setProperty('--work-height',h+workEntry.run+'px');
    else work.style.removeProperty('--work-height');
    qaEntry.travel=Math.max(0,deck.scrollWidth-qaStage.clientWidth);
    qaEntry.run=Math.max(1,qaEntry.travel*1.35);qaEntry.hold=h*.18;
    if(enabled&&qaEntry.mode==='qa')qa.style.setProperty('--qa-height',h+intro+qaEntry.run+qaEntry.hold+'px');
    else qa.style.removeProperty('--qa-height');
    // Set all spacer sizes before reading document positions of later sections.
    entries.forEach(entry=>{
      if(!enabled||entry.mode!=='flow')return;
      const {section,shell}=entry;
      const margin=getComputedStyle(section).marginTop;
      shell.style.marginTop=margin;section.style.marginTop='0px';
      entry.pinTop=entry.id==='tools'?header.getBoundingClientRect().bottom+24:0;
      section.style.setProperty('--entry-top',entry.pinTop+'px');
      shell.classList.add('has-entry-pin');section.classList.add('is-entry-pinned');
      shell.style.height=section.offsetHeight+intro+'px';
    });
    entries.forEach(entry=>{
      const {section,shell,title}=entry;
      const stage=entry.mode==='work'?workStage:entry.mode==='qa'?qaStage:section;
      const stageBox=stage.getBoundingClientRect(),box=title.getBoundingClientRect(),text=textBounds(title);
      const pinTop=entry.mode==='flow'?entry.pinTop||0:0;
      entry.start=(entry.mode==='flow'?shell:section).getBoundingClientRect().top+scrollY-pinTop;
      const font=parseFloat(getComputedStyle(title).fontSize),largeFont=compact?Math.max(font*1.3,68):Math.min(160,w*.105);
      entry.scale=Math.max(1,Math.min(largeFont/font,(w-48)/text.width,h*.5/text.height));
      entry.x=w/2-(box.left+(text.left-box.left+text.width/2)*entry.scale);
      entry.y=h/2-(pinTop+box.top-stageBox.top+(text.top-box.top+text.height/2)*entry.scale);
      section.dataset.entryStart=String(entry.start);section.dataset.entryDistance=String(intro);
      section.dataset.entryMode=enabled?entry.mode:'static';
    });
    work.dataset.intro=String(intro);work.dataset.slot=String(workEntry.slot);work.dataset.run=String(workEntry.run);
    qa.dataset.intro=String(intro);qa.dataset.run=String(qaEntry.run);
    guide.style.setProperty('--guide-mobile-top',Math.max(0,hero.offsetTop+hero.offsetHeight-116)+'px');
    measured=true;update();scrollMotion.resize();
    // Fonts/images may finish after an anchor click. Keep that destination exact
    // until deliberate input takes over; reload/back restoration has no pending anchor.
    if(pendingAnchor)scrollMotion.scrollTo(Math.max(0,anchorPosition(pendingAnchor)),{immediate:true});
  }
  function scheduleLayout(){if(!layoutFrame)layoutFrame=requestAnimationFrame(measure);}
  function update(){
    if(!measured)return;
    const h=innerHeight,headerBox=header.getBoundingClientRect(),line=Math.max(headerBox.bottom+24,h*.3);
    let current=sections[0];
    sections.forEach(section=>{if(section.getBoundingClientRect().top<=line)current=section;});
    if(current.id!==active){
      active=current.id;
      document.querySelectorAll('[data-nav]').forEach(a=>{
        if(a.dataset.nav===(active==='tools'?'about':active))a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
      });
    }
    const destination=sections[sections.indexOf(current)+1]?.id||'contact';
    if(destination!==lastDestination){guide.href='#'+destination;guide.setAttribute('aria-label',labels[destination]+' 섹션으로 이동');lastDestination=destination;}
    guide.hidden=current===contact||(innerWidth<=800&&current!==hero);
    const light=contact.getBoundingClientRect().top<=headerBox.top+headerBox.height/2;
    if(light!==headerLight){headerLight=light;header.classList.toggle('is-light',light);dispatchEvent(new Event('portfolio:surface'));}
    const atRest=resting();
    const heroProgress=smooth(clamp((scrollY-hero.offsetHeight*.18)/(hero.offsetHeight*.82)));
    hero.style.setProperty('--hero-presence',atRest?'1':String(1-heroProgress*.82));
    entries.forEach(entry=>{
      const progress=entry.enabled?clamp((scrollY-entry.start)/entry.intro):1,p=smooth(progress);
      const content=smooth(clamp((progress-.62)/.38));
      entry.progress=progress;
      entry.title.style.transform=progress<1?`translate3d(${entry.x*(1-p)}px,${entry.y*(1-p)}px,0) scale(${entry.scale+(1-entry.scale)*p})`:'';
      entry.section.style.setProperty('--section-content',String(content));
      entry.section.style.setProperty('--entry-interaction',content>.05?'auto':'none');
      entry.section.dataset.entryProgress=progress.toFixed(4);
    });
    const wp=workEntry.progress;
    if(workEntry.enabled&&workEntry.mode==='work'){
      const distance=clamp(scrollY-workEntry.start-workEntry.intro,0,workEntry.run-workEntry.intro);
      work.style.setProperty('--work-content',work.style.getPropertyValue('--section-content'));
      let current=0;
      projects.forEach((project,index)=>{
        const cover=project.querySelector('.project-visual');
        const fraction=index===0?1:clamp((distance-workEntry.slot*(index-1)-workEntry.slot*.55)/(workEntry.slot*.45));
        cover.style.setProperty('--cover-inset',(1-fraction)*100+'%');cover.style.setProperty('--cover-y',(1-fraction)*100+'%');
        if(fraction>=.5)current=index;
      });
      setProject(current,true,wp>=.999);
    }else{
      work.style.removeProperty('--work-content');
      projects.forEach(project=>{const cover=project.querySelector('.project-visual');cover.style.removeProperty('--cover-inset');cover.style.removeProperty('--cover-y');});
      setProject(0,false);
    }
    if(qaEntry.enabled&&qaEntry.mode==='qa'){
      const progress=clamp((scrollY-qaEntry.start-qaEntry.intro)/qaEntry.run),shift=progress*qaEntry.travel;
      qa.style.setProperty('--qa-x',-shift+'px');
      qa.style.setProperty('--qa-heading-opacity',String(1-clamp((shift-qaStage.clientWidth*.06)/(qaStage.clientWidth*.28))));
      cards.forEach((card,index)=>{
        const center=card.offsetLeft+card.offsetWidth/2-shift;
        const tilt=index===0?0:clamp((center-qaStage.clientWidth*.55)/(qaStage.clientWidth*.65))*(1-progress),direction=index%2?-1:1;
        card.style.setProperty('--qa-angle',direction*3*tilt+'deg');card.style.setProperty('--qa-lift',direction*card.offsetHeight*.08*tilt+'px');
      });
    }else{
      ['--qa-x','--qa-heading-opacity'].forEach(key=>qa.style.removeProperty(key));
      cards.forEach(card=>{card.style.removeProperty('--qa-angle');card.style.removeProperty('--qa-lift');});
    }
  }
  function setProject(current,pinned,ready=true){
    work.dataset.current=String(current);
    coverLink.href=projects[current].querySelector('.project-visual').getAttribute('href');
    coverLink.setAttribute('aria-label',projects[current].querySelector('h3').textContent+' 상세 보기');coverLink.inert=!pinned||!ready;
    const activeInfo=projects[current].querySelector('.project-info');activeInfo.inert=false;
    projects.forEach((project,index)=>{
      const info=project.querySelector('.project-info'),cover=project.querySelector('.project-visual'),inactive=pinned&&(index!==current||!ready);
      if(inactive&&info.contains(document.activeElement)){
        if(ready)activeInfo.querySelector('.liquid').focus({preventScroll:true});
        else{workEntry.title.tabIndex=-1;workEntry.title.focus({preventScroll:true});}
      }
      project.classList.toggle('is-current',index===current);info.inert=inactive;cover.inert=pinned;
      if(inactive)info.setAttribute('aria-hidden','true');else info.removeAttribute('aria-hidden');
      if(pinned)cover.setAttribute('aria-hidden','true');else cover.removeAttribute('aria-hidden');
      if(pinned&&index===current)info.setAttribute('aria-current','true');else info.removeAttribute('aria-current');
    });
  }
  const schedule=scrollMotion.requestUpdate;
  function anchorPosition(target){
    const entry=entries.find(entry=>entry.section===target);
    if(entry?.enabled)return entry.start;
    return target.getBoundingClientRect().top+scrollY-header.getBoundingClientRect().bottom-24;
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
    const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!sections.includes(target))return;
    event.preventDefault();history.pushState(null,'',url.hash);pendingAnchor=target;
    scrollMotion.scrollTo(Math.max(0,anchorPosition(target)),{immediate:resting()});
    target.tabIndex=-1;target.focus({preventScroll:true});schedule();
  });
  // Keyboard focus reveals content by completing the same scroll phase.
  entries.forEach(entry=>entry.section.addEventListener('focusin',event=>{
    if(event.target===entry.section||event.target===entry.title||!entry.content.some(node=>node.contains(event.target)))return;
    if(entry.enabled&&entry.progress<1)scrollMotion.scrollTo(entry.start+entry.intro,{immediate:true});
    if(entry===qaEntry&&entry.enabled&&entry.mode==='qa'){
      const card=event.target.closest('.qa-card');if(!card)return;
      const gutter=parseFloat(getComputedStyle(qa).marginLeft)||32,shift=clamp(card.offsetLeft-gutter,0,entry.travel);
      scrollMotion.scrollTo(entry.start+entry.intro+shift/Math.max(1,entry.travel)*entry.run,{immediate:true});
    }
    schedule();
  }));
  let initialAnchor=true;
  ['wheel','pointerdown','touchstart','keydown'].forEach(type=>addEventListener(type,()=>{initialAnchor=false;pendingAnchor=null;},{passive:true}));
  function restoreInitialAnchor(){
    if(!initialAnchor)return;initialAnchor=false;
    const navigation=performance.getEntriesByType('navigation')[0]?.type;
    if(navigation==='reload'||navigation==='back_forward')return;
    const target=document.getElementById(location.hash.slice(1));
    if(sections.includes(target)){pendingAnchor=target;scrollMotion.scrollTo(Math.max(0,anchorPosition(target)),{immediate:true});}schedule();
  }
  scrollMotion.subscribe(update);
  addEventListener('resize',scheduleLayout);addEventListener('pageshow',scheduleLayout);
  addEventListener('hashchange',()=>{const target=document.getElementById(location.hash.slice(1));if(sections.includes(target)){pendingAnchor=target;scrollMotion.scrollTo(Math.max(0,anchorPosition(target)),{immediate:true});}schedule();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleLayout();});
  document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)scheduleLayout();},true);
  reduced.addEventListener('change',scheduleLayout);desktop.addEventListener('change',scheduleLayout);desktopQA.addEventListener('change',scheduleLayout);
  let paused=document.body.classList.contains('motion-paused');
  new MutationObserver(()=>{const value=document.body.classList.contains('motion-paused');if(value!==paused){paused=value;scheduleLayout();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
  const observer=new ResizeObserver(scheduleLayout);observer.observe(header);
  entries.forEach(entry=>observer.observe(entry.id==='work'?workStage:entry.id==='qa'?qaStage:entry.section));
  document.fonts?.ready.then(scheduleLayout);document.fonts?.addEventListener('loadingdone',scheduleLayout);
  measure();
  const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>addEventListener('load',resolve,{once:true}));
  Promise.all([loaded,document.fonts?.ready]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{measure();restoreInitialAnchor();})));
  initCursor({reduced,scrollMotion});
}


function initCursor({reduced,scrollMotion}){
  const cursor=document.querySelector('.site-cursor');if(!cursor||cursor.dataset.initialized)return;
  const fine=matchMedia('(hover:hover) and (pointer:fine)'),root=document.documentElement;
  const dot=cursor.querySelector('.cursor-dot'),follower=cursor.querySelector('.cursor-follower');
  if(!dot||!follower)return;
  cursor.dataset.initialized='true';
  const projectTarget='.project-visual,.work-current-link';
  const fields='input,textarea,select,[contenteditable]:not([contenteditable="false"]),[data-native-cursor]';
  let x=0,y=0,rx=0,ry=0,frame=0,last=0,inside=false,visible=false,dragging=false,failed=false;
  const allowed=()=>!failed&&fine.matches&&!reduced.matches&&!document.hidden&&!dragging&&
    !document.body.classList.contains('intro-active')&&!document.body.classList.contains('motion-paused');
  function position(element,px,py){element.style.transform='translate3d('+px+'px,'+py+'px,0)';}
  function hide(){
    visible=false;root.classList.remove('cursor-ready');
    cursor.classList.remove('is-visible','is-project','is-link','is-light');
    cancelAnimationFrame(frame);frame=0;
  }
  function schedule(){if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  function state(target){
    if(!allowed()||!inside||!(target instanceof Element)||target.closest(fields)||getSelection()?.toString()){
      hide();return;
    }
    const interactive=target.closest('a,button,[role="button"]');
    // Native I-beam for readable copy, even when the page is otherwise enhanced.
    if(!interactive&&target.closest('p:not(.eyebrow):not(.art-word),.contact-card-name,.contact-card-role')){hide();return;}
    const project=target.closest(projectTarget);
    cursor.classList.toggle('is-project',!!project);
    if(project){
      const owner=project.closest('.project')||document.querySelector('.project.is-current');
      const label=cursor.querySelector('.cursor-label');
      const action=owner?.querySelector('.liquid > span')?.textContent||'VIEW CASE STUDY';
      const text=action.replace('VIEW ','VIEW\n')+' ↗';
      if(label.textContent!==text)label.textContent=text;
    }
    cursor.classList.toggle('is-link',!!interactive);
    cursor.classList.toggle('is-light',!!target.closest('#contact,.contact-card,.site-footer.is-light,.header.is-light'));
    position(dot,x,y);
    if(!visible){
      rx=x;ry=y;position(follower,rx,ry);
      visible=true;cursor.classList.add('is-visible');root.classList.add('cursor-ready');
    }
    schedule();
  }
  function refresh(){
    if(!inside)return;
    try{state(document.elementFromPoint(x,y));}catch{failed=true;hide();}
  }
  function tick(now){
    frame=0;if(!allowed()){hide();return;}
    try{
      const blend=1-Math.exp(-24*Math.min((now-last)/1000,.05));last=now;
      rx+=(x-rx)*blend;ry+=(y-ry)*blend;
      if(Math.abs(rx-x)+Math.abs(ry-y)<.1){rx=x;ry=y;}
      position(follower,rx,ry);
      if(rx!==x||ry!==y)frame=requestAnimationFrame(tick);
    }catch{failed=true;hide();}
  }
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'){inside=false;hide();return;}
    inside=true;x=event.clientX;y=event.clientY;
    dragging=!!event.buttons;
    try{state(event.target);}catch{failed=true;hide();}
  },{passive:true});
  document.addEventListener('pointerover',event=>{if(inside)refresh();},{passive:true});
  document.addEventListener('pointerdown',()=>{dragging=true;hide();},{passive:true});
  document.addEventListener('pointerup',()=>{dragging=false;refresh();},{passive:true});
  const leave=()=>{inside=false;dragging=false;hide();};
  document.documentElement.addEventListener('pointerleave',leave);
  document.addEventListener('pointercancel',leave);
  document.addEventListener('dragstart',()=>{dragging=true;hide();});
  document.addEventListener('dragend',()=>{dragging=false;refresh();});
  document.addEventListener('selectionchange',refresh);
  document.addEventListener('keydown',event=>{if(event.key==='Tab')hide();});
  scrollMotion.subscribe(refresh);
  addEventListener('portfolio:surface',refresh);
  ['blur','pagehide','portfolio:navigating','resize'].forEach(type=>addEventListener(type,leave));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();});
  fine.addEventListener('change',leave);reduced.addEventListener('change',leave);
  let blocked=!allowed();
  new MutationObserver(()=>{
    const next=!allowed();if(next!==blocked){blocked=next;if(blocked)hide();else refresh();}
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
}
