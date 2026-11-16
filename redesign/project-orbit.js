// A vertical rotating wheel, shared with the existing scroll clock and sticky stage.
export function createProjectOrbit({work,stage,projects,covers,infos,coverLink}){
  const gallery=document.createElement('div');gallery.className='work-gallery';
  stage.append(gallery);gallery.append(coverLink);
  let pinned=false,width=0,step=0,radiusY=0,radiusX=0,lastPosition=NaN;
  const anglePerProject=.82;
  const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>n*n*(3-2*n);
  const property=(node,key,value)=>{if(node.style.getPropertyValue(key)!==value)node.style.setProperty(key,value);};
  const paint=(node,d,scale)=>{
    const angle=d*anglePerProject;
    property(node,'--orbit-x',(radiusX*(1-Math.cos(angle))).toFixed(3)+'px');
    property(node,'--orbit-y',(radiusY*Math.sin(angle)).toFixed(3)+'px');
    property(node,'--orbit-angle',(-angle*180/Math.PI*.3).toFixed(3)+'deg');
    property(node,'--orbit-scale',scale.toFixed(5));
  };
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
          ['--orbit-x','--orbit-y','--orbit-angle','--orbit-scale','--orbit-opacity','--orbit-blur','--orbit-order'].forEach(key=>cover.style.removeProperty(key));
          infos[index].style.removeProperty('--info-opacity');
        }
      });
    },
    measure(){
      if(!pinned)return;
      // Size reads occur only on layout changes, never in render().
      width=gallery.clientWidth;
      const coverWidth=width*.96,coverHeight=coverWidth/1.5;
      step=coverHeight*1.02;radiusY=step/Math.sin(anglePerProject);radiusX=width*.67;
      property(gallery,'--orbit-width',coverWidth.toFixed(3)+'px');
      property(gallery,'--orbit-center-x',(width/2).toFixed(3)+'px');
      property(work,'--work-info-top',((stage.querySelector('.work-heading')?.offsetHeight||140)+40)+'px');
      lastPosition=NaN;
      work.dataset.galleryStep=step.toFixed(3);work.dataset.galleryBend=radiusX.toFixed(3);
    },
    render(position){
      if(!pinned||position===lastPosition)return;
      lastPosition=position;const current=Math.round(position);
      covers.forEach((cover,index)=>{
        const d=index-position,distance=Math.abs(d),scale=Math.exp(-.43*d*d);
        const opacity=Math.exp(-.87*d*d)*(1-smooth(clamp((distance-1.2)/.6)));
        paint(cover,d,scale);
        property(cover,'--orbit-opacity',opacity.toFixed(5));
        property(cover,'--orbit-blur',(1.8*(1-Math.exp(-1.7*d*d))).toFixed(3)+'px');
        property(cover,'--orbit-order',String(10-Math.round(distance*3)));
        property(infos[index],'--info-opacity',smooth(clamp((.5-distance)/.22)).toFixed(5));
      });
      const d=current-position;paint(coverLink,d,Math.exp(-.43*d*d));
      work.dataset.position=position.toFixed(5);
    }
  };
}
