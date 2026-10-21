// Phase one: a full-bleed split layout with discrete project selection.
// Cube rotation is deliberately reserved for the next implementation stage.
export function createProjectShowcase({work,stage,projects,covers,infos,coverLink}) {
  const gallery=document.createElement('div');gallery.className='work-gallery';
  stage.append(gallery);gallery.append(coverLink);
  let pinned=false,lastPosition=NaN;
  const property=(node,key,value)=>{if(node.style.getPropertyValue(key)!==value)node.style.setProperty(key,value);};
  const properties=['--showcase-y','--showcase-opacity','--showcase-scale','--showcase-order'];
  return {
    gallery,
    setPinned(value,headerBottom){
      work.style.setProperty('--work-stage-top',headerBottom+32+'px');
      if(value===pinned)return;
      pinned=value;lastPosition=NaN;
      covers.forEach((cover,index)=>{
        if(value)gallery.insertBefore(cover,coverLink);
        else{
          projects[index].prepend(cover);
          properties.forEach(key=>cover.style.removeProperty(key));
          ['--info-opacity','--info-y'].forEach(key=>infos[index].style.removeProperty(key));
        }
      });
    },
    measure(){lastPosition=NaN;},
    render(position){
      if(!pinned||position===lastPosition)return;
      lastPosition=position;
      const current=Math.round(position);
      covers.forEach((cover,index)=>{
        property(cover,'--showcase-opacity',index===current?'1':'0');
        property(cover,'--showcase-order',index===current?'2':'1');
        property(infos[index],'--info-opacity',index===current?'1':'0');
      });
      work.dataset.position=position.toFixed(5);
    }
  };
}
