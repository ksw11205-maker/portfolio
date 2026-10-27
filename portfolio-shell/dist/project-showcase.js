// Opposing cube faces share one scroll position. The original nodes return to
// their articles for document mode, so mobile/reduced motion keep all links.
export function createProjectShowcase({work,stage,projects,covers,infos,coverLink}) {
  const gallery=document.createElement('div');gallery.className='work-gallery';
  const copyViewport=document.createElement('div');copyViewport.className='work-copy-viewport';
  stage.append(gallery,copyViewport);gallery.append(coverLink);
  let pinned=false,lastPosition=NaN,lastEntry=NaN,depth=0;
  const property=(node,key,value)=>{if(node.style.getPropertyValue(key)!==value)node.style.setProperty(key,value);};
  const faceProperties=['--cube-angle','--cube-visible','--cube-shade','--cube-order'];
  const entryProperties=['--work-entry-offset','--work-entry-left','--work-entry-right','--work-entry-label'];
  function clearFace(node){faceProperties.forEach(key=>node.style.removeProperty(key));}
  return {
    gallery,copyViewport,
    setPinned(value,headerBottom){
      work.style.setProperty('--work-stage-top',headerBottom+32+'px');
      if(value===pinned)return;
      pinned=value;lastPosition=NaN;lastEntry=NaN;
      covers.forEach((cover,index)=>{
        if(value){gallery.insertBefore(cover,coverLink);copyViewport.append(infos[index]);}
        else{
          projects[index].prepend(cover);projects[index].append(infos[index]);
          clearFace(cover);clearFace(infos[index]);
        }
      });
      if(!value){entryProperties.forEach(key=>stage.style.removeProperty(key));stage.style.removeProperty('--cube-depth');work.removeAttribute('data-arrival');work.style.removeProperty('--work-progress-y');}
    },
    measure(){
      depth=(stage.clientHeight||innerHeight)/2;
      property(stage,'--cube-depth',depth+'px');
      property(stage,'--cube-perspective',depth*5+'px');
      lastPosition=NaN;lastEntry=NaN;
    },
    renderEntry(progress,offset){
      if(!pinned)return;
      const state=progress.toFixed(5)+':'+offset.toFixed(2);if(state===lastEntry)return;lastEntry=state;
      const p=Math.max(0,Math.min(1,progress)),edge=((1-p)*100).toFixed(4)+'%';
      property(stage,'--work-entry-offset',(-offset).toFixed(3)+'px');
      property(stage,'--work-entry-left',edge);property(stage,'--work-entry-right',edge);
      property(stage,'--work-entry-label',String(Math.max(0,Math.min(1,(p-.48)/.4))));
      work.dataset.arrival=p.toFixed(5);
    },
    render(position,arrival=1){
      if(!pinned)return;
      // A small opening tilt supports the opposing wipe from HOW I WORK.
      const effective=position-(1-arrival)*.2;
      if(effective===lastPosition)return;lastPosition=effective;
      covers.forEach((cover,index)=>{
        const relative=index-effective,visible=Math.abs(relative)<.999999;
        const angle=Math.max(-90,Math.min(90,relative*90));
        for(const [node,direction] of [[cover,1],[infos[index],-1]]){
          property(node,'--cube-angle',(angle*direction).toFixed(5)+'deg');
          property(node,'--cube-visible',visible?'visible':'hidden');
          property(node,'--cube-shade',(Math.abs(angle)/90*.32).toFixed(4));
          property(node,'--cube-order',String(10-Math.round(Math.abs(relative)*4)));
        }
      });
      property(work,'--work-progress-y',(position*100).toFixed(5)+'%');
      work.dataset.position=position.toFixed(5);
    }
  };
}
