// A single scroll-driven stage. Cover and copy change; the middle object persists.
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
      covers.forEach((cover,index)=>{
        const d=index-position,distance=Math.abs(d);
        property(cover,'--showcase-y',(d*105).toFixed(3)+'%');
        property(cover,'--showcase-opacity',String(Math.max(0,1-distance*.22)));
        property(cover,'--showcase-scale',String(1-Math.min(1,distance)*.045));
        property(cover,'--showcase-order',String(10-index));
        const opacity=Math.max(0,1-distance*2);
        property(infos[index],'--info-opacity',opacity.toFixed(4));
        property(infos[index],'--info-y',(d*48).toFixed(3)+'px');
      });
      work.dataset.position=position.toFixed(5);
    }
  };
}
