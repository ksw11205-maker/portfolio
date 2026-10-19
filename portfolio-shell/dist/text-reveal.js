// A single finite clock drives exactly two overlapping groups per section.
// Existing title settling is group one; whole content blocks form group two.
export function createTextReveal(entries,{requestUpdate=()=>{}}={}){
  const states=new Map(entries.map(entry=>[entry,{start:null,finished:false}]));
  const duration=650,delay=180,clamp=n=>Math.max(0,Math.min(1,n));
  function finishEntry(entry){const state=states.get(entry);state.finished=true;entry.section.dataset.revealState='shown';requestUpdate();}
  return {
    measure(){
      entries.forEach(entry=>{
        entry.content.forEach(node=>node.classList.remove('entry-content'));
        const blocks=entry.content.filter(node=>getComputedStyle(node).display!=='contents');
        blocks.filter(node=>!blocks.some(parent=>parent!==node&&parent.contains(node))).forEach(node=>node.classList.add('entry-content'));
        entry.heading.querySelectorAll('.eyebrow,.qa-scroll-hint').forEach(node=>node.classList.add('entry-label'));
      });
    },
    renderEntry(entry,progress,resting){
      const state=states.get(entry),now=performance.now();
      if(resting){if(!state.finished)finishEntry(entry);return {title:1,content:1};}
      if(state.finished)return {title:1,content:1};
      const gate=entry.id==='contact'?entry.start+entry.intro*.56:entry.start-innerHeight*.12;
      if(state.start===null&&scrollY>=gate){state.start=now;entry.section.dataset.revealState='playing';}
      if(state.start===null)return {title:0,content:0};
      const elapsed=now-state.start;
      if(scrollY>entry.start+entry.intro+innerHeight||elapsed>=duration+delay){finishEntry(entry);return {title:1,content:1};}
      requestUpdate();
      return {title:clamp(elapsed/duration),content:1-Math.pow(1-clamp((elapsed-delay)/duration),4)};
    },
    finishEntry
  };
}
