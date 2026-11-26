import {createArtworkMotion} from './artwork-motion.js';
import {createDiamond} from './diamond-model.js';
// Original live geometry for the shared prism and four Q&A illustrations.
// One scheduler; only intersecting canvases draw, at a maximum of 30 fps.
const TAU=Math.PI*2;
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n);};

function rectangle(T,w,h,r=.12){
  const s=new T.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
function solid(T,shape,depth=.2,bevel=.045){
  const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:4,curveSegments:20,steps:1});
  g.translate(0,0,-depth/2);return g;
}
function metal(T,color=0xc9d3e3,roughness=.19){return new T.MeshPhysicalMaterial({color,metalness:1,roughness,clearcoat:.45,clearcoatRoughness:.16,envMapIntensity:1.15});}
function polish(material){
  material.onBeforeCompile=shader=>{
    const varying='varying vec3 vPolishPoint; varying vec3 vPolishX; varying vec3 vPolishY; varying float vPolishFace;';
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\n'+varying).replace('#include <begin_vertex>','#include <begin_vertex>\nvPolishPoint=position;vPolishX=normalMatrix*vec3(1.,0.,0.);vPolishY=normalMatrix*vec3(0.,1.,0.);vPolishFace=abs(normal.z);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\n'+varying).replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
      float face=smoothstep(.8,.99,vPolishFace);
      vec2 slope=vec2(.15*sin(vPolishPoint.x*1.8+vPolishPoint.y*.7),.12*sin(vPolishPoint.y*2.1-vPolishPoint.x*.8));
      normal=normalize(normal+face*(normalize(vPolishX)*slope.x+normalize(vPolishY)*slope.y));nonPerturbedNormal=normal;
    `);
  };material.customProgramCacheKey=()=> 'ksw-soft-polished-surface';return material;
}
function glass(T,color=0x81bcff){return polish(new T.MeshPhysicalMaterial({color,metalness:.07,roughness:.065,transmission:.7,thickness:.65,ior:1.48,clearcoat:1,envMapIntensity:1.8,transparent:true,opacity:.98}));}
function environment(T,renderer){
  const w=512,h=256,data=new Float32Array(w*h*4);
  const box=(u,v,x,y,sx,sy)=>Math.exp(-Math.pow(Math.abs(u-x)/sx,4)-Math.pow(Math.abs(v-y)/sy,4));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const u=x/w,v=y/h,i=(y*w+x)*4;
    const broad=box(u,v,.25,.32,.11,.2)*2.4+box(u,v,.77,.45,.065,.24)*1.6;
    const strips=box(u,v,.64,.4,.018,.26)*4+box(u,v,.03,.42,.018,.25)*2;
    const blue=box(u,v,.48,.69,.11,.13)*.5,ceiling=box(u,v,.5,.07,.5,.13)*1.25;
    data[i]=.08+broad*.92+strips+ceiling;data[i+1]=.1+broad*.97+strips+blue*.25+ceiling;data[i+2]=.14+broad+strips+blue+ceiling;data[i+3]=1;
  }
  const map=new T.DataTexture(data,w,h,T.RGBAFormat,T.FloatType);map.mapping=T.EquirectangularReflectionMapping;map.needsUpdate=true;
  const pmrem=new T.PMREMGenerator(renderer),target=pmrem.fromEquirectangular(map);map.dispose();pmrem.dispose();return target;
}
function prism(T){
  const group=new T.Group();
  const frameShape=rectangle(T,2.05,2.3,.26),hole=rectangle(T,1.59,1.84,.19);
  frameShape.holes.push(new T.Path(hole.getPoints(40).reverse()));
  const rimGeo=solid(T,frameShape,.18,.065),silver=metal(T,0xc2cfdf,.16),blue=metal(T,0x0759ed,.16);
  [-.44,.44].forEach((z,i)=>{const m=new T.Mesh(rimGeo,i?silver:blue);m.position.z=z;group.add(m);});
  const core=new T.Mesh(solid(T,rectangle(T,1.67,1.92,.21),.55,.09),glass(T,0x498fff));group.add(core);
  const heart=new T.Mesh(solid(T,rectangle(T,.78,.94,.12),.12,.04),metal(T,0x206cff,.14));heart.position.z=.08;group.add(heart);
  // Four machined spacers connect the layers into a single physical object.
  const pinGeo=new T.CylinderGeometry(.055,.055,.87,16);
  [[-.85,-.97],[.85,-.97],[-.85,.97],[.85,.97]].forEach(([x,y])=>{const pin=new T.Mesh(pinGeo,silver);pin.rotation.x=Math.PI/2;pin.position.set(x,y,0);group.add(pin);});
  return {group,span:4.0,update(t){group.rotation.set(-.18+Math.sin(t*.16)*.06,.5+t*TAU/36,-.12);}};
}
function structure(T){
  const group=new T.Group(),tiles=[],rods=[],blue=metal(T,0x0754eb,.16),silver=polish(metal(T,0xc4d0df,.24));silver.metalness=.78;
  const tileShape=rectangle(T,.65,.65,.055),tileGeo=solid(T,tileShape,.085,.02),capGeo=solid(T,rectangle(T,.61,.61,.04),.015,.008);
  for(let z=0;z<3;z++)for(let x=0;x<3;x++){
    const tile=new T.Group();tile.position.set((x-1)*.92,0,(z-1)*.92);
    const base=new T.Mesh(tileGeo,blue);base.rotation.x=-Math.PI/2;tile.add(base);
    const cap=new T.Mesh(capGeo,silver);cap.rotation.x=-Math.PI/2;cap.position.y=.065;tile.add(cap);group.add(tile);tiles.push(tile);
  }
  const rodGeo=new T.CylinderGeometry(.023,.023,1,10);
  for(let z=0;z<3;z++)for(let x=0;x<3;x++){
    const i=z*3+x;
    for(const j of [x<2?i+1:-1,z<2?i+3:-1])if(j>=0){const mesh=new T.Mesh(rodGeo,blue);group.add(mesh);rods.push({mesh,a:tiles[i],b:tiles[j]});}
  }
  const axis=new T.Vector3(0,1,0),direction=new T.Vector3();
  group.rotation.set(.52,-.65,-.06);
  let cycle=-1,moving=[];
  function chooseThree(){
    const pool=tiles.map((_,i)=>i);
    for(let i=0;i<3;i++){const j=i+Math.floor(Math.random()*(pool.length-i));[pool[i],pool[j]]=[pool[j],pool[i]];}
    moving=pool.slice(0,3);
  }
  return {group,span:3.65,update(t,still){
    const nextCycle=Math.floor(t/5.4);
    if(nextCycle!==cycle){cycle=nextCycle;chooseThree();}
    // All tiles rest at each boundary; only three get a local lift per cycle.
    const lift=still?0:Math.pow(Math.sin(Math.PI*clamp(((t%5.4)-.4)/4.0)),2);
    tiles.forEach((tile,i)=>{const rank=moving.indexOf(i);tile.position.y=rank<0?0:Math.pow(lift,1+rank*.2)*(.16+rank*.025);});
    rods.forEach(({mesh,a,b})=>{direction.subVectors(b.position,a.position);mesh.scale.y=direction.length();mesh.position.copy(a.position).add(b.position).multiplyScalar(.5);mesh.position.y-=.04;mesh.quaternion.setFromUnitVectors(axis,direction.normalize());});
  }};
}


function puzzle(T){
  const group=new T.Group(),pieces=[],size=1.15;
  const specs=[[0,1,-1,0],[0,0,1,-1],[1,-1,0,0],[-1,0,0,1]];
  function piece(tabs){
    const s=new T.Shape(),corners=[[-size/2,size/2],[size/2,size/2],[size/2,-size/2],[-size/2,-size/2]];
    s.moveTo(...corners[0]);
    corners.forEach(([x,y],edge)=>{
      const [xx,yy]=corners[(edge+1)%4],dx=xx-x,dy=yy-y,nx=-dy/size,ny=dx/size,tab=tabs[edge]*.24;
      const p=(f,n=0)=>[x+dx*f+nx*n,y+dy*f+ny*n];
      if(tab){s.lineTo(...p(.34));s.bezierCurveTo(...p(.42,tab*.1),...p(.26,tab),...p(.5,tab));s.bezierCurveTo(...p(.74,tab),...p(.58,tab*.1),...p(.66));}
      s.lineTo(xx,yy);
    });s.closePath();return s;
  }
  const colors=[0x8dc7ed,0xf0c4aa,0x93cdc4,0xc2cbd9];
  specs.forEach((tabs,index)=>{const mat=glass(T,colors[index]);mat.transmission=.78;mat.roughness=.06;const m=new T.Mesh(solid(T,piece(tabs),.26,.045),mat);m.position.set(index%2?size/2:-size/2,index<2?size/2:-size/2,0);pieces.push(m);group.add(m);});
  group.rotation.set(-.45,-.2,-.18);
  return {group,span:3.55,update(t,still){
    const cycle=t%7.2;
    const gap=still?0:cycle<1.7?1:cycle<3.2?1-ease((cycle-1.7)/1.5):cycle<5?0:ease((cycle-5)/2.2);
    pieces[3].position.set(size/2+gap*.65,-size/2-gap*.35,gap*.32);pieces[3].rotation.z=-gap*.12;
  }};
}

export function initObjectMotion({reduced}){
  const hosts=[...document.querySelectorAll('[data-motion-object]')];if(!hosts.length)return;
  const builders={prism,structure,diamond:createDiamond},items=new Map();let frame=0,last=0,clock=0,disposed=false;
  const paused=()=>document.body.classList.contains('motion-paused');
  const resting=()=>reduced.matches||paused();
  function size(item){
    if(item.overlay){item.overlay.resize();wake();return;}
    if(item.kind==='bulb'){
      const image=item.host.querySelector('img');
      const artSize=Math.min(image.clientWidth,image.clientHeight);
      item.host.style.setProperty('--bulb-art-size',artSize+'px');
    }
    if(!item.renderer)return;
    const w=item.host.clientWidth,h=item.host.clientHeight;if(!w||!h)return;
    item.renderer.setPixelRatio(Math.min(devicePixelRatio||1,item.kind==='diamond'?1.25:1.5));item.renderer.setSize(w,h,false);
    const span=item.model.span,aspect=w/h;
    const vertical=Math.max(span,span/Math.max(aspect,.4));
    Object.assign(item.camera,{left:-vertical*aspect/2,right:vertical*aspect/2,top:vertical/2,bottom:-vertical/2});item.camera.updateProjectionMatrix();wake();
  }
  async function load(item){
    if(item.kind==='ai'||item.kind==='puzzle'){
      if(!item.overlay){item.overlay=createArtworkMotion(item.host);item.motionStart=clock;}
      wake();return;
    }
    if(item.loading||item.renderer||item.failed||!builders[item.kind])return;item.loading=true;
    try{
      const T=await import('./vendor/three/three.module.min.js');if(disposed)return;
      item.renderer=new T.WebGLRenderer({canvas:item.canvas,alpha:true,antialias:true,powerPreference:'low-power'});
      item.renderer.setClearColor(0,0);item.renderer.outputColorSpace=T.SRGBColorSpace;item.renderer.toneMapping=T.NeutralToneMapping;item.renderer.toneMappingExposure=.85;
      item.scene=new T.Scene();item.camera=new T.OrthographicCamera(-2,2,2,-2,.1,30);item.camera.position.set(0,0,10);
      item.environment=environment(T,item.renderer);item.scene.environment=item.environment.texture;
      const light=new T.DirectionalLight(0xe6efff,2.4);light.position.set(-3,4,6);item.scene.add(light);
      const fill=new T.DirectionalLight(0x7fafff,1.1);fill.position.set(3,-1,3);item.scene.add(fill);
      item.model=builders[item.kind](T);item.scene.add(item.model.group);size(item);wake();
    }catch(error){item.failed=true;item.renderer?.dispose();item.renderer=null;item.host.dataset.renderState='fallback';console.warn('Static illustration retained:',item.kind,error.message);}
    finally{item.loading=false;}
  }
  function paint(now){
    frame=0;if(disposed||document.hidden)return;
    const dt=last?Math.min((now-last)/1000,.06):1/30;
    if(last&&now-last<1000/30-1){frame=requestAnimationFrame(paint);return;}
    last=now;if(!resting())clock+=dt;
    let active=false;
    items.forEach(item=>{
      if(!item.visible||item.lost)return;
      if(item.overlay){active=true;item.overlay.update(clock-item.motionStart,reduced.matches);return;}
      if(!item.renderer)return;active=true;
      item.model.update(clock,reduced.matches);item.renderer.render(item.scene,item.camera);item.host.dataset.renderState='ready';
    });
    if(active&&!resting())frame=requestAnimationFrame(paint);else last=0;
  }
  function wake(){if(!frame&&!document.hidden&&!disposed){last=0;frame=requestAnimationFrame(paint);}}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const item=items.get(entry.target);item.visible=entry.isIntersecting;
      item.host.classList.toggle('is-motion-visible',item.visible&&!document.hidden&&!resting());
      if(item.visible){load(item);wake();}
    });
  },{rootMargin:'0px',threshold:0});
  const resize=new ResizeObserver(entries=>entries.forEach(e=>size(items.get(e.target))));
  hosts.forEach(host=>{
    const item={host,canvas:host.querySelector('canvas'),kind:host.dataset.motionObject,visible:false};items.set(host,item);observer.observe(host);resize.observe(host);
    item.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();item.lost=true;host.dataset.renderState='fallback';});
    item.canvas.addEventListener('webglcontextrestored',()=>{item.lost=false;size(item);wake();});
  });
  function sync(){
    items.forEach(item=>item.host.classList.toggle('is-motion-visible',item.visible&&!document.hidden&&!resting()));
    if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else wake();
  }
  const mutations=new MutationObserver(sync);mutations.observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  addEventListener('pageshow',sync);
  addEventListener('pagehide',e=>{
    cancelAnimationFrame(frame);frame=0;last=0;if(e.persisted)return;disposed=true;observer.disconnect();resize.disconnect();mutations.disconnect();
    items.forEach(item=>{item.overlay?.dispose();item.scene?.traverse(node=>{node.geometry?.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(m=>{m?.map?.dispose();m?.dispose();});});item.environment?.dispose();item.renderer?.dispose();});
  });
}
