// One restrained accent per statement, coordinated with the existing content
// reveal. Intersection alone is insufficient: pinned content can still be hidden.
export function createStatementMotion(entries,{requestUpdate=()=>{}}={}){
  let disposed=false;
  const states=new Map(),targets=new Map();
  entries.forEach(entry=>{
    const items=[...entry.section.querySelectorAll('[data-statement]')].map((node,index)=>{
      const state={node,index,paths:[...node.querySelectorAll('.statement-underline path')],visible:false,started:false,animations:[]};
      node.dataset.lineState='waiting';targets.set(node,state);return state;
    });
    if(items.length)states.set(entry,items);
  });
  const observer=new IntersectionObserver(changes=>{
    changes.forEach(change=>{const state=targets.get(change.target);if(state)state.visible=change.isIntersecting&&change.intersectionRatio>=.25;});
    requestUpdate();
  },{threshold:[0,.25],rootMargin:'0px 0px -6% 0px'});
  targets.forEach((_,node)=>observer.observe(node));
  function finish(state){
    state.started=true;state.node.dataset.lineState='shown';
    state.animations.forEach(animation=>animation.cancel());state.animations=[];
    observer.unobserve(state.node);
  }
  function draw(state){
    state.started=true;
    state.animations=state.paths.map((path,i)=>path.animate([
      {opacity:0,strokeDashoffset:'1',transform:`translate(${[-10,2,10][i]}px,${[5,-5,4][i]}px) rotate(${[-3,2,-2][i]}deg)`,offset:0},
      {opacity:1,strokeDashoffset:'.9',transform:'translate(0,0) rotate(0deg)',offset:.28},
      {opacity:1,strokeDashoffset:'0',transform:'translate(0,0) rotate(0deg)',offset:1}
    ],{duration:850,delay:state.index*90+i*110,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
    state.node.dataset.lineState='drawing';
    Promise.all(state.animations.map(animation=>animation.finished)).then(()=>{if(!disposed)finish(state);}).catch(()=>{});
  }
  function dispose(){
    if(disposed)return;disposed=true;states.forEach(items=>items.forEach(finish));observer.disconnect();
  }
  addEventListener('pagehide',dispose,{once:true});
  return {
    renderEntry(entry,content,resting){
      if(disposed)return;
      states.get(entry)?.forEach(state=>{
        if(resting){if(state.node.dataset.lineState!=='shown')finish(state);return;}
        if(!state.started&&state.visible&&content>=.9)draw(state);
      });
    },
    dispose
  };
}
