// Deform the existing hero artwork continuously; preserve its chrome material.
// The lower-left fold samples a larger area, while the title band stays quiet.
export async function initHeroWaves({hero,reduced}) {
  const canvas=hero?.querySelector('.hero-wave-canvas');if(!canvas)return;
  let renderer,scene,camera,material,texture,observer,resize,mutations,frame=0,last=0,time=0,visible=true,lost=false,disposed=false;
  const allowed=()=>visible&&!document.hidden&&!reduced.matches&&!document.body.classList.contains('motion-paused')&&!document.body.classList.contains('intro-closed');
  function paint(now){
    frame=0;if(!renderer||!visible||document.hidden||lost||disposed)return;
    if(last&&now-last<1000/30-1){frame=requestAnimationFrame(paint);return;}
    const dt=last?Math.min((now-last)/1000,.06):1/30;last=now;
    if(allowed())time+=dt;material.uniforms.uTime.value=time;renderer.render(scene,camera);hero.dataset.waves='ready';
    if(allowed())frame=requestAnimationFrame(paint);else last=0;
  }
  function wake(){if(renderer&&visible&&!document.hidden&&!frame&&!disposed){last=0;frame=requestAnimationFrame(paint);}}
  function size(){if(!renderer)return;const w=hero.clientWidth,h=hero.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.3));renderer.setSize(w,h,false);material.uniforms.uAspect.value=w/h;wake();}
  function sync(){hero.classList.toggle('is-sleeping',!visible||document.hidden);if(!visible||document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else wake();}
  try{
    const T=await import('./vendor/three/three.module.min.js');
    texture=await new T.TextureLoader().loadAsync('/assets/hero/blue-chrome.jpg');if(disposed)return;
    renderer=new T.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'low-power'});
    renderer.setClearColor(0x08090b,1);scene=new T.Scene();camera=new T.OrthographicCamera(-1,1,1,-1,0,2);camera.position.z=1;
    material=new T.ShaderMaterial({uniforms:{uImage:{value:texture},uTime:{value:0},uAspect:{value:1.6},uImageAspect:{value:texture.image.width/texture.image.height}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader:`precision highp float;
        varying vec2 vUv; uniform sampler2D uImage; uniform float uTime,uAspect,uImageAspect;
        void main(){
          vec2 crop=vec2(min(1.,uAspect/uImageAspect),min(1.,uImageAspect/uAspect));
          vec2 uv=(vUv-.5)*crop+.5;
          float lower=(1.-smoothstep(.28,.69,uv.x))*(1.-smoothstep(.18,.54,uv.y));
          float upper=smoothstep(.3,.72,uv.x)*smoothstep(.27,.68,uv.y);
          uv=mix(uv,vec2(.02,.03)+(uv-vec2(.02,.03))/1.32,lower*.94);
          uv.x+=upper*(.027*sin(uv.y*8.+uTime*.57)+.013*sin(uv.y*17.-uTime*.39));
          uv.y+=upper*(.029*sin(uv.x*7.-uTime*.48)+.011*cos(uv.x*14.+uTime*.6));
          uv.x+=lower*(.032*sin(uv.y*10.-uTime*.62));
          uv.y+=lower*(.042*sin(uv.x*8.+uTime*.58)+.016*cos(uv.x*15.-uTime*.4));
          gl_FragColor=vec4(texture2D(uImage,clamp(uv,.001,.999)).rgb,1.);
        }`});
    scene.add(new T.Mesh(new T.PlaneGeometry(2,2),material));
    observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(hero);
    resize=new ResizeObserver(size);resize.observe(hero);size();
    mutations=new MutationObserver(sync);mutations.observe(document.body,{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;delete hero.dataset.waves;cancelAnimationFrame(frame);frame=0;});
    canvas.addEventListener('webglcontextrestored',()=>{lost=false;size();wake();});
    addEventListener('pageshow',sync);
  }catch(error){delete hero.dataset.waves;renderer?.dispose();renderer=null;console.warn('Static hero artwork retained:',error.message);}
  addEventListener('pagehide',e=>{cancelAnimationFrame(frame);frame=0;last=0;if(e.persisted)return;disposed=true;observer?.disconnect();resize?.disconnect();mutations?.disconnect();texture?.dispose();scene?.traverse(n=>n.geometry?.dispose());material?.dispose();renderer?.dispose();});
}
