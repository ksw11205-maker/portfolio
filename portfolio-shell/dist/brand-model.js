import {brandShape} from './brand-shape.js';

// The symbol is a real, bevelled mesh. SVG and WebGL share the exact contour.
export function initBrandModel({host,reduced}) {
  if(!host || host.dataset.initialized)return;
  host.dataset.initialized='true';
  const trigger=host.querySelector('.brand-trigger'),panel=host.querySelector('.brand-description');
  const stage=host.querySelector('.brand-stage'),canvas=host.querySelector('canvas');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  let visible=false,hovered=false,focused=false,pinned=false,dismissed=false,opened=false;
  let renderer,scene,camera,group,meshes=[],environment,pmrem,resizeObserver;
  let running=0,previous=0,phase=0,assembly=0,mix=0,loading=false,failed=false,destroyed=false;
  const animationsAllowed=()=>!reduced.matches&&!document.hidden&&!document.body.classList.contains('motion-paused');
  function updateDisclosure(){
    const show=!fine.matches||((hovered||focused||pinned)&&!dismissed);
    panel.setAttribute('aria-hidden',String(!show));
    if(show===opened)return;opened=show;
    host.classList.toggle('is-explaining',show);trigger.setAttribute('aria-expanded',String(show));
    panel.setAttribute('aria-hidden',String(!show));wake();
  }
  host.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovered=true;dismissed=false;updateDisclosure();}});
  host.addEventListener('pointerleave',()=>{hovered=false;dismissed=false;updateDisclosure();});
  host.addEventListener('focusin',()=>{focused=true;dismissed=false;updateDisclosure();});
  host.addEventListener('focusout',e=>{if(!host.contains(e.relatedTarget)){focused=false;pinned=false;dismissed=false;updateDisclosure();}});
  trigger.addEventListener('click',()=>{pinned=!pinned;dismissed=!pinned;updateDisclosure();});
  host.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;dismissed=true;updateDisclosure();}});
  fine.addEventListener('change',updateDisclosure);
  function frame(now){
    running=0;if(!renderer||!visible||document.hidden||destroyed)return;
    const dt=Math.min(previous?(now-previous)/1000:1/60,.04);previous=now;
    const animate=animationsAllowed();
    if(animate){phase+=dt;assembly=Math.min(1,assembly+dt);}
    else assembly=1;
    mix+=(Number(opened)-mix)*(1-Math.exp(-9*dt));
    const assembled=1-Math.pow(1-assembly,4),idle=animate?1-mix:0;
    group.rotation.set(-.035+Math.sin(phase*Math.PI*2/9)*.07*idle,-.12+Math.sin(phase*Math.PI*2/10)*.14*idle,0);
    meshes.forEach((mesh,i)=>{
      const direction=i===0?-1:1;
      mesh.position.set(direction*.34*(1-assembled),-direction*.22*(1-assembled),0);
    });
    // Broad reflected softboxes move slowly without changing the symbol's shape.
    scene.environmentRotation.set(0,.1+(animate?Math.sin(phase*.22)*.12:0),0);
    renderer.render(scene,camera);
    host.dataset.renderState='ready';
    if(animate||Math.abs(Number(opened)-mix)>.001)running=requestAnimationFrame(frame);
    else previous=0;
  }
  function wake(){
    if(!renderer||!visible||document.hidden||running||destroyed)return;
    previous=0;running=requestAnimationFrame(frame);
  }
  function sleep(){cancelAnimationFrame(running);running=0;previous=0;}
  function size(){
    if(!renderer)return;
    const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height)return;
    const aspect=width/height,span=5.7;
    camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.top=span/2;camera.bottom=-span/2;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.setSize(width,height,false);wake();
  }
  async function init(){
    if(loading||renderer||failed||destroyed)return;loading=true;
    try{
      const T=await import('./vendor/three/three.module.min.js');
      if(destroyed)return;
      renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;
      renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
      scene=new T.Scene();camera=new T.OrthographicCamera(-3,3,3,-3,.1,30);camera.position.set(0,0,10);
      group=new T.Group();scene.add(group);
      const sizeX=1024,sizeY=512,data=new Float32Array(sizeX*sizeY*4);
      const panel=(u,v,cx,cy,sx,sy)=>Math.exp(-Math.pow(Math.abs(u-cx)/sx,4)-Math.pow(Math.abs(v-cy)/sy,4));
      for(let y=0;y<sizeY;y++)for(let x=0;x<sizeX;x++){
        const u=x/sizeX,v=y/sizeY,j=(y*sizeX+x)*4;
        const broad=panel(u,v,.27,.35,.15,.2)*2.4+panel(u,v,.76,.48,.13,.24)*2.1;
        const strip=panel(u,v,.5,.3,.022,.29)*4.7+panel(u,v,.04,.38,.018,.3)*3.1;
        const ceiling=panel(u,v,.5,.08,.5,.075)*1.9;
        const cool=panel(u,v,.6,.67,.09,.13)*.6;
        const light=.16+broad+strip+ceiling;
        data[j]=light*.91;data[j+1]=light*.95+cool*.16;data[j+2]=light+cool;data[j+3]=1;
      }
      const studio=new T.DataTexture(data,sizeX,sizeY,T.RGBAFormat,T.FloatType);
      studio.mapping=T.EquirectangularReflectionMapping;studio.needsUpdate=true;
      pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromEquirectangular(studio);studio.dispose();
      scene.environment=environment.texture;
      const key=new T.DirectionalLight(0xe5efff,3.5);key.position.set(-3,4,6);scene.add(key);
      const edge=new T.DirectionalLight(0x8eafff,2);edge.position.set(4,-1,2);scene.add(edge);
      const scale=.007;
      for(let i=0;i<2;i++){
        const shape=new T.Shape();
        const point=(x,y)=>[(i?brandShape.width-x:x)-brandShape.width/2,brandShape.height/2-(i?brandShape.height-y:y)].map(n=>n*scale);
        brandShape.commands.forEach(([type,...args])=>{
          if(type==='M')shape.moveTo(...point(...args));
          else if(type==='L')shape.lineTo(...point(...args));
          else if(type==='C')shape.bezierCurveTo(...point(...args.slice(0,2)),...point(...args.slice(2,4)),...point(...args.slice(4,6)));
          else shape.closePath();
        });
        const geometry=new T.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:true,bevelSegments:8,steps:1,bevelSize:.04,bevelThickness:.045,curveSegments:32});
        geometry.translate(0,0,-.125);
        const cap=new T.MeshPhysicalMaterial({color:i?0xbac5d3:0x1551ee,metalness:i?1:.92,roughness:i?.27:.23,clearcoat:i?.22:.6,clearcoatRoughness:.16,envMapIntensity:1.15});
        const rim=cap.clone();rim.roughness=.14;rim.envMapIntensity=1.45;
        const mesh=new T.Mesh(geometry,[cap,rim]);meshes.push(mesh);group.add(mesh);
      }
      resizeObserver=new ResizeObserver(size);resizeObserver.observe(stage);size();wake();
    }catch(error){
      failed=true;host.dataset.renderState='fallback';renderer?.dispose();renderer=null;
      // The matching vector poster and explanation remain usable if WebGL fails.
      console.warn('Brand model unavailable; static symbol retained.',error.message);
    }finally{loading=false;}
  }
  const observer=new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;if(visible){init();wake();}else sleep();
  },{rootMargin:'120px'});observer.observe(host);
  const sync=()=>{if(document.hidden||!visible)sleep();else wake();};
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  const mutations=new MutationObserver(sync);mutations.observe(document.body,{attributes:true,attributeFilter:['class']});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();sleep();host.dataset.renderState='fallback';});
  canvas.addEventListener('webglcontextrestored',()=>{size();wake();});
  addEventListener('pagehide',e=>{
    sleep();if(e.persisted)return;destroyed=true;observer.disconnect();mutations.disconnect();resizeObserver?.disconnect();
    meshes.forEach(m=>{m.geometry.dispose();m.material.forEach(material=>material.dispose());});
    environment?.dispose();pmrem?.dispose();renderer?.dispose();
  });
  addEventListener('pageshow',sync);
  updateDisclosure();
}
