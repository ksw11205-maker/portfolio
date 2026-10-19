// One title group and one content group; no cascading body-line delays.
// References: GreenSock QWzZwxR (scramble), LEYqezo (masked lines),
// dPMjJWv (character rotation). Original implementation, no SplitText dependency.
export function createTextReveal(entries,{requestUpdate=()=>{}}={}){
  const clamp=n=>Math.max(0,Math.min(1,n));
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const states=new Map(entries.map(entry=>{
    const title=entry.title,text=title.textContent.trim().replace(/\s+/g,' ');
    let glyphs=[],lines=[];
    if(['about','tools','qa'].includes(entry.id)){
      title.setAttribute('aria-label',text);
      const visual=document.createElement('span');visual.className='title-visual';visual.setAttribute('aria-hidden','true');
      [...text].forEach((letter,i)=>{
        const span=document.createElement('span');span.className='title-glyph';span.textContent=letter===' '?'\u00a0':letter;
        visual.append(span);glyphs.push({node:span,letter:span.textContent,index:i});
      });
      title.replaceChildren(visual);title.dataset.effect=entry.id==='qa'?'roll':'scramble';
    }else if(entry.id==='work'){
      title.setAttribute('aria-label',text);title.dataset.effect='lines';
      [...title.children].forEach(node=>{
        const line=document.createElement('span');line.className='title-line';line.textContent=node.textContent;
        node.classList.add('title-mask');node.setAttribute('aria-hidden','true');node.replaceChildren(line);lines.push(line);
      });
    }
    return [entry,{start:null,finished:false,glyphs,lines,duration:entry.id==='work'?920:760,lastStep:-1}];
  }));
  function paint(entry,p){
    const state=states.get(entry),step=Math.floor(p*22);if(step===state.lastStep&&p!==1&&!['qa','work'].includes(entry.id))return;state.lastStep=step;
    state.glyphs.forEach(({node,letter,index},i)=>{
      const local=clamp((p-i/Math.max(1,state.glyphs.length-1)*.23)/.77);
      if(entry.id==='qa'){
        const q=1-Math.pow(1-local,3);node.style.transform=q===1?'':`perspective(700px) translateY(${(1-q)*45}%) rotateX(${(q-1)*85}deg)`;node.style.opacity=String(q);
      }else{
        node.textContent=local>.46||letter==='\u00a0'?letter:alphabet[(index*7+step*3)%alphabet.length];
        node.style.opacity=String(.3+.7*clamp(local*2.2));
      }
    });
    state.lines.forEach((line,i)=>{
      const q=1-Math.pow(1-clamp((p-i*.14)/.86),4);
      line.style.transform=q===1?'':`translateY(${(1-q)*105}%)`;line.style.opacity=String(q);
    });
  }
  function finishEntry(entry){
    const state=states.get(entry);if(state.finished)return;state.finished=true;paint(entry,1);
    entry.section.dataset.revealState='shown';requestUpdate();
  }
  return {
    measure(){
      entries.forEach(entry=>{
        const state=states.get(entry);
        // Measure fixed glyph advances after fonts settle, preventing scramble jitter.
        state.glyphs.forEach(g=>{g.node.style.width='';g.node.style.transform='';g.node.style.opacity='';g.node.textContent=g.letter;});
        state.lines.forEach(line=>{line.style.transform='';line.style.opacity='';});
        state.lastStep=-1;
        const widths=state.glyphs.map(g=>parseFloat(getComputedStyle(g.node).width)||g.node.offsetWidth);
        state.glyphs.forEach((g,i)=>g.node.style.width=widths[i]+'px');
        entry.content.forEach(node=>node.classList.remove('entry-content'));
        const blocks=entry.content.filter(node=>getComputedStyle(node).display!=='contents');
        blocks.filter(node=>!blocks.some(parent=>parent!==node&&parent.contains(node))).forEach(node=>node.classList.add('entry-content'));
        entry.heading.querySelectorAll('.eyebrow,.qa-scroll-hint').forEach(node=>node.classList.add('entry-label'));
      });
    },
    renderEntry(entry,progress,resting){
      const state=states.get(entry),now=performance.now();
      if(resting){finishEntry(entry);return {title:1,content:1};}
      if(state.finished)return {title:1,content:1};
      const gate=entry.id==='contact'?entry.start+entry.intro*.56:entry.start-innerHeight*.12;
      if(state.start===null&&scrollY>=gate){state.start=now;entry.section.dataset.revealState='playing';}
      if(state.start===null)return {title:0,content:0};
      const elapsed=now-state.start,p=clamp(elapsed/state.duration);paint(entry,p);
      const content=1-Math.pow(1-clamp((elapsed-200)/600),4);
      if(scrollY>entry.start+entry.intro+innerHeight||(p===1&&content===1)){finishEntry(entry);return {title:1,content:1};}
      requestUpdate();return {title:p,content};
    },
    finishEntry
  };
}
