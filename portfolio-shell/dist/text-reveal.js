// Line masks follow the semantic hierarchy after the complete section title.
// Native finite animations run the text; the existing scroll clock owns positioning.
export function createTextReveal(entries,{requestUpdate=()=>{}}={}){
  const records=[],groups=[],states=new Map();let selectedProject=null;
  const selectors={
    about:'.about-intro p,.profile-details h3,.profile-details p',
    tools:'.tools-capabilities h3,.capability-lead,.capability-detail',
    work:'.project-number,.project-info h3,.project-info p,.project-info .liquid>span:first-child',
    qa:'.qa-card-top .eyebrow,.qa-card h3,.qa-card-answer',
    contact:'.contact-note>p,.contact-signature,.contact-card-name,.contact-card-role,.contact-email'
  };
  const observer=new IntersectionObserver(changes=>{
    changes.forEach(change=>{const group=groups.find(g=>g.root===change.target);if(group)group.visible=change.isIntersecting;});requestUpdate();
  },{threshold:.08});
  function groupFor(root,entry,kind='content',project=-1){
    let group=groups.find(g=>g.root===root);
    if(!group){group={root,entry,kind,project,records:[],start:null,duration:0,visible:false};groups.push(group);if(kind!=='title')observer.observe(root);}
    return group;
  }
  function add(node,group,tier=0){
    const blocks=[...node.children].filter(el=>el.getAttribute('aria-hidden')!=='true'&&getComputedStyle(el).display==='block');
    if(blocks.length){blocks.forEach(el=>add(el,group,tier));return;}
    if(!node.textContent.trim())return;
    const record={node,group,tier,html:node.innerHTML,lines:[],animations:[],delay:0,duration:440};
    records.push(record);group.records.push(record);node.dataset.revealTier=String(tier);
  }
  entries.forEach(entry=>{
    const title=groupFor(entry.title,entry,'title');add(entry.title,title);
    states.set(entry,{title,contentStarted:false});
    entry.heading.querySelectorAll('.eyebrow,.qa-scroll-hint').forEach(node=>add(node,groupFor(entry.heading,entry)));
    const projects=[...entry.section.querySelectorAll('.project')];
    entry.section.querySelectorAll(selectors[entry.id]).forEach(node=>{
      let root,tier=0,index=-1;
      if(entry.id==='about'){
        root=node.closest('.profile-details>div')||node.closest('.about-intro');
        tier=node.closest('.profile-details')?(node.matches('.eyebrow')?0:node.matches('h3')?1:2):0;
      }else if(entry.id==='tools'){
        root=node.closest('article');tier=node.matches('h3')?0:node.matches('.capability-lead')?1:2;
      }else if(entry.id==='work'){
        root=node.closest('.project-info');index=projects.indexOf(node.closest('.project'));
        tier=node.matches('.project-number,h3')?0:node.matches('.project-summary')?2:node.closest('.liquid')?3:1;
      }else if(entry.id==='qa'){
        root=node.closest('.qa-card');tier=node.matches('.qa-card-answer')?1:0;
      }else{
        root=node.closest('.contact-card,.contact-note');
        tier=node.matches('.contact-card-role,.contact-signature')?1:node.matches('.contact-email')?2:0;
      }
      add(node,groupFor(root,entry,'content',index),tier);
    });
  });
  function cancel(record){record.animations.forEach(a=>{a.onfinish=null;a.cancel();});record.animations=[];}
  function finish(record){
    cancel(record);record.lines.forEach(line=>{line.style.transform='';line.style.opacity='1';});record.node.dataset.revealState='shown';
  }
  function hide(record){
    cancel(record);record.lines.forEach(line=>{line.style.transform='translate3d(0,108%,0)';line.style.opacity='0';});record.node.dataset.revealState='waiting';
  }
  const segmenter=new Intl.Segmenter('ko',{granularity:'grapheme'});
  function split(record){
    const {node}=record;
    node.innerHTML=record.html;node.classList.remove('masked-text');
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),groups=[];let text;
    while(text=walker.nextNode()){
      for(const part of segmenter.segment(text.data)){
        const range=document.createRange(),end=part.index+part.segment.length;
        range.setStart(text,part.index);range.setEnd(text,end);
        const box=range.getBoundingClientRect();
        let group=groups.at(-1);
        if(!group||box.height&&Math.abs(box.top-group.top)>1){
          group={top:box.top,start:text,startOffset:part.index,end:text,endOffset:end};groups.push(group);
        }else{group.end=text;group.endOffset=end;}
      }
    }
    const fragment=document.createDocumentFragment();record.lines=[];
    groups.forEach(group=>{
      const mask=document.createElement('span'),line=document.createElement('span'),range=document.createRange();
      mask.className='text-line-mask';line.className='text-line';
      range.setStart(group.start,group.startOffset);range.setEnd(group.end,group.endOffset);
      line.append(range.cloneContents());mask.append(line);fragment.append(mask);record.lines.push(line);
    });
    if(record.lines.length){node.replaceChildren(fragment);node.classList.add('masked-text');}
    record.last=NaN;
  }

  function compile(group){
    let end=0;
    [...new Set(group.records.map(r=>r.tier))].sort((a,b)=>a-b).forEach(tier=>{
      const peers=group.records.filter(r=>r.tier===tier);let local=0,lineOffset=0;
      peers.forEach((record,index)=>{
        record.duration=group.kind==='title'?600:tier===0?480:420;
        record.delay=end+(group.kind==='title'?lineOffset*80:Math.min(index*35,120));
        lineOffset+=record.lines.length;
        local=Math.max(local,record.delay+record.duration+Math.max(0,record.lines.length-1)*65);
      });
      end=local+90;
    });
    group.duration=end-90;
  }
  const done=group=>group.start!==null&&performance.now()>=group.start+group.duration;
  function play(group){
    const now=performance.now();if(group.start===null)group.start=now;
    if(done(group)){group.records.forEach(finish);return;}
    group.records.forEach(record=>{
      cancel(record);record.node.dataset.revealState='playing';
      record.lines.forEach((line,index)=>{
        const animation=line.animate([{transform:'translate3d(0,108%,0)',opacity:0},{transform:'translate3d(0,0,0)',opacity:1}],
          {duration:record.duration,delay:record.delay+index*65,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
        animation.currentTime=Math.max(0,now-group.start);
        animation.onfinish=()=>{line.style.transform='';line.style.opacity='1';animation.cancel();if(record.lines.every(el=>el.style.opacity==='1'))record.node.dataset.revealState='shown';requestUpdate();};
        record.animations.push(animation);
      });
    });
  }
  function reset(group){group.start=null;group.records.forEach(hide);}
  function begin(group){if(group.start===null)play(group);}
  return {
    measure(){
      document.body.classList.add('measuring-text');
      try{
        records.forEach(record=>{cancel(record);split(record);});
        groups.forEach(group=>{compile(group);if(group.start===null)group.records.forEach(hide);else play(group);});
      }finally{document.body.classList.remove('measuring-text');}
    },
    renderEntry(entry,progress,resting){
      const state=states.get(entry),related=groups.filter(g=>g.entry===entry);
      if(resting){related.forEach(g=>{g.start=performance.now()-g.duration;g.records.forEach(finish);});state.contentStarted=true;return true;}
      const gate=entry.id==='contact'?.56:.025;
      if(progress<=gate){
        if(state.title.start!==null){related.forEach(reset);state.contentStarted=false;}return false;
      }
      begin(state.title);
      const ready=done(state.title)&&progress>=(entry.id==='contact'?.9:.85);
      if(ready){
        state.contentStarted=true;
        related.filter(g=>g.kind!=='title'&&g.project<0&&g.visible).forEach(begin);
      }
      return ready;
    },
    renderProjects(position,resting,pinned=true){
      const projectGroups=groups.filter(g=>g.project>=0),workState=states.get(entries.find(e=>e.id==='work'));
      if(resting){projectGroups.forEach(g=>{g.start=performance.now()-g.duration;g.records.forEach(finish);});selectedProject=null;return;}
      if(!pinned){if(workState.contentStarted)projectGroups.filter(g=>g.visible).forEach(begin);return;}
      const current=Math.round(position);
      if(current!==selectedProject){const group=projectGroups.find(g=>g.project===current);if(group)reset(group);selectedProject=current;}
      if(workState.contentStarted&&Math.abs(position-current)<.025){const group=projectGroups.find(g=>g.project===current);if(group)begin(group);}
    },
    finishEntry(entry){
      const state=states.get(entry);state.contentStarted=true;
      groups.filter(g=>g.entry===entry).forEach(g=>{g.start=performance.now()-g.duration;g.records.forEach(finish);});requestUpdate();
    }
  };
}
