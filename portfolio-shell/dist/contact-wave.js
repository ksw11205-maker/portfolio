// Motion reference: https://codepen.io/GreenSock/pen/qBedXpg (SVG Shape Overlays).
// Original scroll-driven implementation: deterministic stagger, local palette,
// no click overlay or additional animation ticker.
export function createContactWave(contact){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','contact-wave');svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  svg.innerHTML='<defs><clipPath id="contact-gradient-clip" clipPathUnits="objectBoundingBox"><path transform="scale(.01)"></path></clipPath><linearGradient id="contact-wave-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#146bff"></stop><stop offset=".55" stop-color="#527ab2"></stop><stop offset="1" stop-color="#b8c1cc"></stop></linearGradient><linearGradient id="contact-wave-gray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3cbd5"></stop><stop offset="1" stop-color="#e5e8ed"></stop></linearGradient></defs><path fill="url(#contact-wave-blue)"></path><path fill="url(#contact-wave-gray)"></path><path fill="#DCEEF3"></path>';
  contact.prepend(svg);
  const background=document.createElement('div');background.className='contact-background';background.setAttribute('aria-hidden','true');svg.after(background);
  const gradientClip=svg.querySelector('clipPath path');
  const paths=[...svg.querySelectorAll(':scope > path')],delays=[.04,.12,.21,.09,0,.16,.24,.1,.19,.06];
  let completed=false,enabled=false,lastProgress=-1,lightPoints=delays.map(()=>100);
  const clamp=n=>Math.max(0,Math.min(1,n));
  const ease=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;
  function render(progress){
    const phase=completed?1:clamp(progress/.72);if(phase===lastProgress)return;lastProgress=phase;
    if(phase===1){completed=true;contact.classList.add('wave-complete');}
    paths.forEach((path,layer)=>{
      const lag=[0,.1,.22][layer];
      const points=delays.map(delay=>100*(1-ease(clamp((phase-delay-lag)/(1-.24-lag)))));
      let d=`M 0 ${points[0].toFixed(3)}`;
      for(let i=1;i<points.length;i++){
        const x=i*100/(points.length-1),mid=x-50/(points.length-1);
        d+=` C ${mid.toFixed(3)} ${points[i-1].toFixed(3)} ${mid.toFixed(3)} ${points[i].toFixed(3)} ${x.toFixed(3)} ${points[i].toFixed(3)}`;
      }
      path.setAttribute('d',d+' V 100 H 0 Z');
      if(layer===2)gradientClip.setAttribute('d',d+' V 100 H 0 Z');
      if(layer===1)lightPoints=points;
    });
    contact.dataset.waveProgress=phase.toFixed(4);
  }
  return {
    setEnabled(value){enabled=value;contact.classList.toggle('has-wave-transition',value);if(!value)render(1);},
    render,
    isLightAt(x,y){
      const box=contact.getBoundingClientRect();
      if(y<box.top||y>box.bottom)return false;
      if(!enabled)return true;
      const point=clamp((x-box.left)/box.width)*(lightPoints.length-1),i=Math.min(Math.floor(point),lightPoints.length-2);
      // Solve the cubic's horizontal position before sampling its vertical curve.
      const local=point-i;let low=0,high=1;
      for(let j=0;j<10;j++){const t=(low+high)/2,u=1-t,at=1.5*u*u*t+1.5*u*t*t+t*t*t;if(at<local)low=t;else high=t;}
      const t=(low+high)/2,mix=t*t*(3-2*t),edge=lightPoints[i]+(lightPoints[i+1]-lightPoints[i])*mix;
      return (y-box.top)/box.height*100>=edge;
    }
  };
}
