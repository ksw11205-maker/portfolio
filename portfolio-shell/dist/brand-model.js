import {brandShape} from './brand-shape.js';

// The symbol is a real, bevelled mesh. SVG and WebGL share the exact contour.
export function initBrandModel({host,reduced}) {
  if(!host || host.dataset.initialized)return;
  host.dataset.initialized='true';
  const trigger=host.querySelector('.brand-trigger'),panel=host.querySelector('.brand-description');
  const stage=host.querySelector('.brand-stage'),canvas=host.querySelector('canvas');
  const panelHome=panel.parentElement;
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  let visible=false,hovered=false,focused=false,pinned=false,dismissed=false,opened=false;
  let renderer,scene,camera,group,meshes=[],environment,pmrem,resizeObserver;
  let running=0,previous=0,phase=0,assembly=0,mix=0,gap=.08,loading=false,failed=false,destroyed=false;
  let pointerX=0,pointerY=0,pointerKnown=false;
  panel.dataset.initialized='true';
  const animationsAllowed=()=>!reduced.matches&&!document.hidden&&!document.body.classList.contains('motion-paused');
  function placePanel(){
    if(!fine.matches||!opened)return;
    const anchor=trigger.getBoundingClientRect();
    const x=hovered&&pointerKnown?pointerX:anchor.left+anchor.width*.65;
    const y=hovered&&pointerKnown?pointerY:anchor.top+anchor.height*.55;
    const width=panel.offsetWidth,height=panel.offsetHeight,pad=16;
    const left=x+24+width>innerWidth-pad?x-width-24:x+24;
    const top=y+24+height>innerHeight-pad?y-height-24:y+24;
    panel.style.left=Math.max(pad,Math.min(innerWidth-width-pad,left))+'px';
    panel.style.top=Math.max(pad,Math.min(innerHeight-height-pad,top))+'px';
  }
  function syncPanel(){
    panel.classList.toggle('is-floating',fine.matches);
    (fine.matches?document.body:panelHome).append(panel);
    if(!fine.matches){panel.style.left='';panel.style.top='';}
    placePanel();
  }
  function updateDisclosure(){
    const show=!fine.matches||((hovered||focused||pinned)&&!dismissed);
    panel.setAttribute('aria-hidden',String(!show));
    if(show===opened)return;opened=show;
    host.classList.toggle('is-explaining',show);trigger.setAttribute('aria-expanded',String(show));
    panel.classList.toggle('is-open',show);placePanel();wake();
  }
  trigger.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){pointerX=e.clientX;pointerY=e.clientY;pointerKnown=true;hovered=true;dismissed=false;updateDisclosure();}});
  trigger.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'){pointerX=e.clientX;pointerY=e.clientY;pointerKnown=true;placePanel();}});
  trigger.addEventListener('pointerleave',()=>{hovered=false;dismissed=false;updateDisclosure();});
  host.addEventListener('focusin',()=>{focused=true;dismissed=false;updateDisclosure();});
  host.addEventListener('focusout',e=>{if(!host.contains(e.relatedTarget)){focused=false;pinned=false;dismissed=false;updateDisclosure();}});
  trigger.addEventListener('click',()=>{pinned=!pinned;dismissed=!pinned;updateDisclosure();});
  host.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;dismissed=true;updateDisclosure();}});
  fine.addEventListener('change',()=>{syncPanel();updateDisclosure();});
  addEventListener('resize',placePanel);
  addEventListener('scroll',()=>{if(hovered){hovered=false;pinned=false;updateDisclosure();}else placePanel();},{passive:true});
  function frame(now){
    running=0;if(!renderer||!visible||document.hidden||destroyed)return;
    const dt=Math.min(previous?(now-previous)/1000:1/60,.04);previous=now;
    const animate=animationsAllowed();
    if(animate){phase+=dt;assembly=Math.min(1,assembly+dt);}
    else assembly=1;
    mix+=(Number(opened)-mix)*(1-Math.exp(-9*dt));
    const assembled=1-Math.pow(1-assembly,4),idle=animate?1-mix:0;
    const engaged=opened&&fine.matches;
    const targetGap=engaged?.004:animate?.045+.15*(.5-.5*Math.cos(phase*Math.PI*2/6)):.045;
    gap=animate?gap+(targetGap-gap)*(1-Math.exp(-(engaged?16:3.2)*dt)):targetGap;
    group.rotation.set(.045+Math.sin(phase*Math.PI*2/9)*.025*idle,.32+Math.sin(phase*Math.PI*2/10)*.035*idle,0);
    meshes.forEach((mesh,i)=>{
      const direction=i===0?-1:1;
      const distance=.3*(1-assembled)+gap;
      mesh.position.set(direction*distance,-direction*distance*.68,0);
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
      renderer.toneMapping=T.NeutralToneMapping;renderer.toneMappingExposure=.85;
      scene=new T.Scene();camera=new T.OrthographicCamera(-3,3,3,-3,.1,30);camera.position.set(0,0,10);
      group=new T.Group();scene.add(group);
      const sizeX=1024,sizeY=512,data=new Float32Array(sizeX*sizeY*4);
      const panel=(u,v,cx,cy,sx,sy)=>Math.exp(-Math.pow(Math.abs(u-cx)/sx,4)-Math.pow(Math.abs(v-cy)/sy,4));
      for(let y=0;y<sizeY;y++)for(let x=0;x<sizeX;x++){
        const u=x/sizeX,v=y/sizeY,j=(y*sizeX+x)*4;
        const broad=panel(u,v,.27,.35,.10,.2)*1.2+panel(u,v,.72,.48,.085,.19)*.9;
        const strip=panel(u,v,.66,.43,.023,.25)*3.6+panel(u,v,.04,.38,.018,.3)*2.4;
        const ceiling=panel(u,v,.5,.08,.5,.075)*1.1;
        const cool=panel(u,v,.6,.67,.09,.13)*.6;
        const light=.045+broad+strip+ceiling;
        data[j]=light*.91;data[j+1]=light*.95+cool*.16;data[j+2]=light+cool;data[j+3]=1;
      }
      const studio=new T.DataTexture(data,sizeX,sizeY,T.RGBAFormat,T.FloatType);
      studio.mapping=T.EquirectangularReflectionMapping;studio.needsUpdate=true;
      pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromEquirectangular(studio);studio.dispose();
      scene.environment=environment.texture;
      const key=new T.DirectionalLight(0xf1f6ff,2.1);key.position.set(-3,4,6);scene.add(key);
      const edge=new T.DirectionalLight(0x8eafff,1.4);edge.position.set(4,-1,2);scene.add(edge);
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
        const geometry=new T.ExtrudeGeometry(shape,{depth:.52,bevelEnabled:true,bevelSegments:12,steps:1,bevelSize:.06,bevelThickness:.075,curveSegments:40});
        geometry.translate(0,0,-.26);
        const cap=new T.MeshPhysicalMaterial({color:i?0xc6cbd3:0x003cf0,metalness:1,roughness:i?.2:.18,clearcoat:i?.25:.45,clearcoatRoughness:.1,envMapIntensity:.95});
        const rim=cap.clone();rim.color.multiplyScalar(.68);rim.roughness=.1;rim.envMapIntensity=1.6;
        // A shallow, polished camber changes reflected light across the broad faces.
        // It does not inflate or distort the silhouette or the interlocking gaps.
        cap.onBeforeCompile=shader=>{
          const varyings='varying vec3 vBrandPoint; varying vec3 vBrandX; varying vec3 vBrandY;';
          shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\n'+varyings)
            .replace('#include <begin_vertex>','#include <begin_vertex>\nvBrandPoint=position; vBrandX=normalMatrix*vec3(1.,0.,0.); vBrandY=normalMatrix*vec3(0.,1.,0.);');
          shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\n'+varyings)
            .replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
              float faceMask=smoothstep(.145,.165,vBrandPoint.z);
              vec2 slope=vec2(.14*sin(vBrandPoint.x*.9+vBrandPoint.y*.45),.10*sin(vBrandPoint.y*1.3-vBrandPoint.x*.35));
              normal=normalize(normal+faceMask*(normalize(vBrandX)*slope.x+normalize(vBrandY)*slope.y));
              nonPerturbedNormal=normal;
            `);
        };
        cap.customProgramCacheKey=()=> 'ksw-polished-face-v1';
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
    visible=entry.isIntersecting;if(visible){init();wake();}else {hovered=false;pinned=false;focused=false;updateDisclosure();sleep();}
  },{rootMargin:'120px'});observer.observe(host);
  const sync=()=>{if(document.hidden||!visible)sleep();else wake();};
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  const mutations=new MutationObserver(sync);mutations.observe(document.body,{attributes:true,attributeFilter:['class']});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();sleep();host.dataset.renderState='fallback';});
  canvas.addEventListener('webglcontextrestored',()=>{size();wake();});
  addEventListener('pagehide',e=>{
    sleep();if(e.persisted)return;destroyed=true;observer.disconnect();mutations.disconnect();resizeObserver?.disconnect();
    meshes.forEach(m=>{m.geometry.dispose();m.material.forEach(material=>material.dispose());});
    if(panel.classList.contains('is-floating'))panel.remove();
    environment?.dispose();pmrem?.dispose();renderer?.dispose();
  });
  addEventListener('pageshow',sync);
  syncPanel();updateDisclosure();
}
