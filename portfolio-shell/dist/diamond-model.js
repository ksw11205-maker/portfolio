// Closed convex brilliant cut, with fixed-world studio reflections and internal
// ray bounces. Kept independent from the materials of the other Q&A cards.
const TAU=Math.PI*2;
export function buildBrilliantCut(T){
  const points=[];
  const ring=(count,r,y,offset=0)=>{for(let i=0;i<count;i++){const a=i*TAU/count+offset;points.push(new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r));}};
  ring(8,.51,.42);ring(8,.77,.235,Math.PI/8);
  ring(16,1,.025);ring(16,.995,-.025);
  ring(8,.53,-.49,Math.PI/8);points.push(new T.Vector3(0,-.96,0));
  const facets=new Map(),eps=1e-5;
  for(let a=0;a<points.length-2;a++)for(let b=a+1;b<points.length-1;b++)for(let c=b+1;c<points.length;c++){
    const normal=new T.Vector3().subVectors(points[b],points[a]).cross(new T.Vector3().subVectors(points[c],points[a]));
    if(normal.lengthSq()<1e-12)continue;normal.normalize();let d=normal.dot(points[a]);
    if(d<0){normal.negate();d=-d;}
    if(points.some(p=>normal.dot(p)-d>eps))continue;
    const key=[normal.x,normal.y,normal.z,d].map(v=>v.toFixed(5)).join(',');
    if(!facets.has(key))facets.set(key,{normal,d,vertices:points.filter(p=>Math.abs(normal.dot(p)-d)<eps)});
  }
  const positions=[],normals=[],planes=[];
  for(const {normal,d,vertices} of facets.values()){
    const center=vertices.reduce((sum,p)=>sum.add(p),new T.Vector3()).multiplyScalar(1/vertices.length);
    const u=vertices[0].clone().sub(center).normalize(),v=new T.Vector3().crossVectors(normal,u);
    vertices.sort((a,b)=>Math.atan2(v.dot(a.clone().sub(center)),u.dot(a.clone().sub(center)))-Math.atan2(v.dot(b.clone().sub(center)),u.dot(b.clone().sub(center))));
    for(let i=1;i<vertices.length-1;i++)for(const p of [vertices[0],vertices[i],vertices[i+1]]){positions.push(p.x,p.y,p.z);normals.push(normal.x,normal.y,normal.z);}
    planes.push(new T.Vector4(normal.x,normal.y,normal.z,d));
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.computeBoundingSphere();
  return {geometry,planes};
}
export const diamondVertex=`
 varying vec3 vGemPoint;
 varying vec3 vGemNormal;
 void main(){vGemPoint=position;vGemNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
export function diamondFragment(count){return `
 precision highp float;
 uniform vec4 uPlanes[${count}];
 uniform mat3 uGemToWorld;
 uniform mat3 uWorldToGem;
 varying vec3 vGemPoint;
 varying vec3 vGemNormal;
 float softbox(vec3 ray,vec3 axis,vec3 up,vec2 extent){
   axis=normalize(axis);vec3 right=normalize(cross(up,axis));up=cross(axis,right);
   float forward=dot(ray,axis);vec2 p=abs(vec2(dot(ray,right),dot(ray,up))/max(.001,forward));
   vec2 edge=1.-smoothstep(extent*.82,extent*1.12,p);
   return edge.x*edge.y*step(.001,forward);
 }
 vec3 studio(vec3 ray){
   ray=normalize(ray);
   vec3 light=vec3(.095,.105,.145)+vec3(.10,.11,.15)*max(0.,ray.y);
   light+=vec3(2.9,2.95,3.1)*softbox(ray,vec3(-.75,.9,.7),vec3(0.,1.,0.),vec2(.28,.62));
   light+=vec3(1.9,2.15,2.8)*softbox(ray,vec3(.95,.2,.3),vec3(0.,1.,0.),vec2(.065,.78));
   light+=vec3(1.6,1.3,1.95)*softbox(ray,vec3(-.4,.15,-1.),vec3(0.,1.,0.),vec2(.2,.45));
   light+=vec3(.75,.88,1.15)*softbox(ray,vec3(.35,-.85,-.45),vec3(0.,0.,1.),vec2(.6,.18));
   light+=vec3(.62,.65,.78)*softbox(ray,vec3(.1,.55,1.),vec3(0.,1.,0.),vec2(.85,.65));
   float wrap=pow(max(0.,dot(ray,normalize(vec3(-.6,-.35,.8)))),4.)+.6*pow(max(0.,dot(ray,normalize(vec3(.8,.45,-.2)))),6.);
   light+=vec3(.9,.78,1.12)*wrap;
   return light;
 }
 float fresnel(float cosine){return .172+(1.-.172)*pow(1.-clamp(cosine,0.,1.),5.);}
 vec3 exitLight(vec3 incoming,vec3 outward){
   // Small spectral split at the exit, rather than rainbow painted onto faces.
   vec3 r=refract(incoming,-outward,2.413);
   vec3 g=refract(incoming,-outward,2.417);
   vec3 b=refract(incoming,-outward,2.421);
   return vec3(dot(r,r)>.01?studio(uGemToWorld*r).r:0.,dot(g,g)>.01?studio(uGemToWorld*g).g:0.,dot(b,b)>.01?studio(uGemToWorld*b).b:0.);
 }
 void main(){
   vec3 normal=normalize(vGemNormal),incoming=normalize(uWorldToGem*vec3(0.,0.,-1.));
   float entry=fresnel(dot(-incoming,normal));
   vec3 color=studio(uGemToWorld*reflect(incoming,normal))*entry;
   vec3 ray=refract(incoming,normal,1./2.417),origin=vGemPoint+ray*.0003;
   vec3 energy=vec3(1.-entry);
   for(int bounce=0;bounce<6;bounce++){
     float nearest=1000.;vec3 hitNormal=vec3(0.,1.,0.);
     for(int face=0;face<${count};face++){
       vec3 n=uPlanes[face].xyz;float denominator=dot(n,ray);
       float distance=(uPlanes[face].w-dot(n,origin))/max(.000001,denominator);
       if(denominator>.000001&&distance>.00001&&distance<nearest){nearest=distance;hitNormal=n;}
     }
     if(nearest>999.)break;
     vec3 hit=origin+ray*nearest;
     vec3 exiting=refract(ray,-hitNormal,2.417);
     float internal=length(exiting)<.01?1.:fresnel(dot(ray,hitNormal));
     if(internal<.999)color+=energy*(1.-internal)*exitLight(ray,hitNormal);
     energy*=internal*vec3(.991,.984,.998);
     ray=reflect(ray,hitNormal);origin=hit+ray*.0003;
   }
   // Remaining energy samples the reflected studio, retaining deep facet contrast.
   color+=energy*studio(uGemToWorld*ray)*.3;
   gl_FragColor=vec4(color,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
 }
`;}
export function createDiamond(T){
  const group=new T.Group(),cut=buildBrilliantCut(T);
  const uniforms={uPlanes:{value:cut.planes},uGemToWorld:{value:new T.Matrix3()},uWorldToGem:{value:new T.Matrix3()}};
  const material=new T.ShaderMaterial({uniforms,vertexShader:diamondVertex,fragmentShader:diamondFragment(cut.planes.length),toneMapped:true});
  const gem=new T.Mesh(cut.geometry,material);group.add(gem);
  // Tilt the whole display, then turn the cut around its own axis.
  group.rotation.set(.28,0,-.56);group.position.y=.12;
  return {group,span:2.9,update(t,still){
    gem.rotation.y=-.35+(still?0:t*TAU/24);
    group.updateMatrixWorld(true);
    uniforms.uGemToWorld.value.setFromMatrix4(gem.matrixWorld);
    uniforms.uWorldToGem.value.copy(uniforms.uGemToWorld.value).invert();
  }};
}
