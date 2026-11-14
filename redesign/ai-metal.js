// Machined silver letters, traced in four physical strokes. All motion uses the
// existing Q&A clock; no independent RAF or timers are introduced.
export const WELD_STROKES=[
  {a:[-1.10,-.66],b:[-.61,.67],start:.6,duration:1.8},
  {a:[-.61,.67],b:[-.055,-.66],start:2.6,duration:1.8},
  {a:[-.88,-.19],b:[-.34,-.19],start:4.6,duration:.75},
  {a:[.64,-.67],b:[.64,.67],start:5.55,duration:1.8}
];
const CYCLE=11.6;
export function weldState(time,still=false){
  const phase=still?9:(time>=0?time%CYCLE:(time%CYCLE+CYCLE)%CYCLE);
  const stroke=WELD_STROKES.find(s=>phase>=s.start&&phase<=s.start+s.duration);
  const amount=stroke?(phase-stroke.start)/stroke.duration:0;
  return {phase,active:!still&&!!stroke,point:stroke?stroke.a.map((v,i)=>v+(stroke.b[i]-v)*amount):[0,0]};
}
function roundedPolygon(T,points,radius){
  const shape=new T.Shape();
  const joints=points.map((p,i)=>{
    const previous=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];
    const a=new T.Vector2(previous[0]-p[0],previous[1]-p[1]),b=new T.Vector2(next[0]-p[0],next[1]-p[1]);
    const cut=Math.min(radius,a.length()*.22,b.length()*.22);a.setLength(cut);b.setLength(cut);
    return {point:p,entry:[p[0]+a.x,p[1]+a.y],exit:[p[0]+b.x,p[1]+b.y]};
  });
  shape.moveTo(...joints[0].entry);
  joints.forEach(j=>{shape.lineTo(...j.entry);shape.quadraticCurveTo(...j.point,...j.exit);});shape.closePath();return shape;
}
export function aiLetterGeometry(T){
  const a=roundedPolygon(T,[[-1.35,-.74],[-.86,.78],[-.36,.78],[.17,-.74],[-.27,-.74],[-.40,-.35],[-.81,-.35],[-.94,-.74]],.065);
  const hole=roundedPolygon(T,[[-.765,-.025],[-.44,-.025],[-.61,.43]],.025);a.holes.push(new T.Path(hole.getPoints(20).reverse()));
  const i=roundedPolygon(T,[[.415,-.74],[.865,-.74],[.865,.78],[.415,.78]],.06);
  const geometry=new T.ExtrudeGeometry([a,i],{depth:.30,steps:1,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:5,curveSegments:16});geometry.translate(.20,0,-.15);
  return geometry;
}
export const metalVertex=`
 varying vec3 vMetalPoint;
 varying vec3 vMetalNormal;
 void main(){vMetalPoint=position;vMetalNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export const metalFragment=`
 precision highp float;
 uniform mat3 uMetalToWorld;
 uniform mat3 uWorldToMetal;
 uniform float uPhase;
 uniform vec3 uHot;
 uniform float uArc;
 varying vec3 vMetalPoint;
 varying vec3 vMetalNormal;
 float band(float x,float center,float width){return exp(-pow((x-center)/width,2.));}
 vec3 studio(vec3 r){
   r=normalize(r);
   float broad=band(r.y,.69,.21)*(.55+.45*band(r.x,-.28,.8));
   float strip=band(r.x,-.49,.09)*band(r.y,.62,.45);
   float cool=band(r.x,.72,.09)*band(r.y,.12,.75);
   float lower=band(r.y,-.65,.11);
   return vec3(.075,.09,.115)+vec3(1.2,1.28,1.4)*broad+vec3(2.8,2.85,2.9)*strip+vec3(.8,1.05,1.5)*cool+vec3(.8,.85,.94)*lower;
 }
 void assignStroke(vec2 point,vec2 a,vec2 b,float start,float duration,inout float nearest,inout float arrival){
   vec2 ab=b-a;float f=clamp(dot(point-a,ab)/dot(ab,ab),0.,1.);
   float d=length(point-a-f*ab);
   if(d<nearest){nearest=d;arrival=start+f*duration;}
 }
 void main(){
   vec3 p=vMetalPoint;vec3 original=normalize(vMetalNormal);
   float face=smoothstep(.85,.995,abs(original.z));
   vec3 n=normalize(original+face*vec3(.17*sin(p.x*2.1+p.y*.4),.18*sin(p.y*2.4-p.x*.5),0.));
   vec3 eye=normalize(uWorldToMetal*vec3(0.,0.,1.));
   vec3 reflected=uMetalToWorld*reflect(-eye,n);
   float grain=(sin(p.y*1450.+sin(p.x*15.)*.3)+.5*sin(p.y*721.+p.x*6.))/(1.+fwidth(p.y)*850.);
   vec3 silver=studio(reflected)*vec3(.91,.94,.98)*(1.+grain*.05);
   // Bevel and side reflections stay crisp; broad face reflections are satin.
   silver=mix(silver*.84,silver,face);
   float nearest=1000.,arrival=0.;vec2 tracePoint=p.xy-vec2(.20,0.);
   assignStroke(tracePoint,vec2(-1.10,-.66),vec2(-.61,.67),.6,1.8,nearest,arrival);
   assignStroke(tracePoint,vec2(-.61,.67),vec2(-.055,-.66),2.6,1.8,nearest,arrival);
   assignStroke(tracePoint,vec2(-.88,-.19),vec2(-.34,-.19),4.6,.75,nearest,arrival);
   assignStroke(tracePoint,vec2(.64,-.67),vec2(.64,.67),5.55,1.8,nearest,arrival);
   float age=uPhase-arrival;
   float formed=smoothstep(-.10,.14,age);
   float reset=1.-smoothstep(10.5,11.6,uPhase);formed*=reset;
   vec3 darkSteel=silver*.13+vec3(.012,.017,.026);
   vec3 color=mix(darkSteel,silver,formed);
   float trail=exp(-nearest*nearest/0.003)*exp(-max(0.,age)*5.)*step(0.,age)*reset;
   float pool=exp(-dot(p.xy-uHot.xy,p.xy-uHot.xy)/.007)*uArc;
   color+=vec3(2.5,.65,.12)*trail*face;
   color+=vec3(3.5,1.8,.65)*pool*(.2+.8*face);
   gl_FragColor=vec4(color,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
 }
`;
export function createAIMetal(T){
  const group=new T.Group();group.rotation.set(-.59,-.26,-.22);
  const uniforms={uMetalToWorld:{value:new T.Matrix3()},uWorldToMetal:{value:new T.Matrix3()},uPhase:{value:9},uHot:{value:new T.Vector3()},uArc:{value:0}};
  const material=new T.ShaderMaterial({uniforms,vertexShader:metalVertex,fragmentShader:metalFragment,toneMapped:true});
  const letters=new T.Mesh(aiLetterGeometry(T),material);group.add(letters);
  // Smooth optical halo around the white-hot welding point, not a large star.
  const size=64,pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const r=Math.hypot((x+.5-size/2)/(size/2),(y+.5-size/2)/(size/2));
    const k=(y*size+x)*4;pixels[k]=255;pixels[k+1]=235;pixels[k+2]=198;pixels[k+3]=Math.round(255*Math.exp(-r*r*7)*Math.max(0,1-r));
  }
  const texture=new T.DataTexture(pixels,size,size,T.RGBAFormat);texture.needsUpdate=true;
  const halo=new T.Sprite(new T.SpriteMaterial({map:texture,color:0xffc47b,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));halo.scale.setScalar(.30);group.add(halo);
  const core=new T.Mesh(new T.SphereGeometry(.018,12,8),new T.MeshBasicMaterial({color:0xfff5df,toneMapped:false}));group.add(core);
  const count=24,positions=new Float32Array(count*6),colors=new Float32Array(count*6),geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('color',new T.BufferAttribute(colors,3));
  const sparks=new T.LineSegments(geometry,new T.LineBasicMaterial({vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));sparks.frustumCulled=false;group.add(sparks);
  return {group,span:2.85,update(t,still){
    const state=weldState(t,still);uniforms.uPhase.value=state.phase;
    const flicker=.86+.14*Math.sin(t*61)*Math.sin(t*37);
    const tip=new T.Vector3(state.point[0]+.20,state.point[1],.194);
    uniforms.uHot.value.copy(tip);uniforms.uArc.value=state.active?flicker:0;
    core.visible=halo.visible=state.active;core.position.copy(tip);halo.position.copy(tip);halo.material.opacity=.76*flicker;
    for(let j=0;j<count;j++){
      const seed=(j*.61803398875)%1,life=.28+seed*.24,age=((t+seed*life)%life+life)%life;
      const born=t-age,emitter=weldState(born,still),fade=emitter.active&&!still?Math.pow(1-age/life,1.7):0;
      const angle=j*2.39996,vx=Math.cos(angle)*(.35+seed*.8),vy=Math.sin(angle)*(.3+seed*.9),vz=.25+seed*.38;
      for(let end=0;end<2;end++){
        const a=Math.max(0,age-(end?0:.028)),k=j*6+end*3;
        positions[k]=emitter.point[0]+.20+vx*a;positions[k+1]=emitter.point[1]+vy*a-1.1*a*a;positions[k+2]=.196+vz*a;
        const brightness=fade*(end?1:.35);colors[k]=brightness;colors[k+1]=brightness*(.48+seed*.25);colors[k+2]=brightness*.16;
      }
    }
    sparks.visible=!still;geometry.attributes.position.needsUpdate=true;geometry.attributes.color.needsUpdate=true;
    group.updateMatrixWorld(true);uniforms.uMetalToWorld.value.setFromMatrix4(letters.matrixWorld);uniforms.uWorldToMetal.value.copy(uniforms.uMetalToWorld.value).invert();
  }};
}
