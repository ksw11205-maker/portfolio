// A stationary, solid chrome ribbon swept around a smooth asymmetric infinity.
// Only longitudinal material coordinates advance; mesh, camera and lights are fixed.
const TAU=Math.PI*2,segments=512,halfWidth=.155,thickness=.0093,bevel=.003,crown=.016;
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalize=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
const sub=(a,b)=>a.map((x,k)=>x-b[k]);
// Analytic C-infinity centerline: neither straight plates nor corner fillets.
// Extent ratio (1+.13)/(1-.13) is 1.30, with 0.84 depth between crossings.
function center(u){
  const asym=1+.13*Math.cos(u);
  const d=1+.38*Math.sin(u)**2;
  return [1.18*Math.cos(u)*asym/d,.64*Math.sin(2*u)*asym/d,.42*Math.sin(u)];
}
const arcTable=[0],arcSteps=16384;
let previousCenter=center(0);
for(let i=1;i<=arcSteps;i++){
  const p=center(i/arcSteps*TAU);arcTable.push(arcTable[i-1]+Math.hypot(...sub(p,previousCenter)));previousCenter=p;
}
function arcCenter(u){
  const distance=(((u/TAU)%1+1)%1)*arcTable[arcSteps];let lo=0,hi=arcSteps;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(arcTable[mid]<distance)lo=mid;else hi=mid;}
  return center((lo+(distance-arcTable[lo])/(arcTable[hi]-arcTable[lo]))/arcSteps*TAU);
}
function frameAt(u){
  const p=arcCenter(u),t=normalize(sub(arcCenter(u+.0001),arcCenter(u-.0001)));
  const flat=normalize([-t[1],t[0],0]),up=normalize(cross(t,flat));
  const roll=.20+.72*Math.sin(u)+.18*Math.cos(2*u);
  const across=flat.map((x,k)=>x*Math.cos(roll)+up[k]*Math.sin(roll));
  return {p,across,normal:normalize(cross(t,across))};
}
function geometry(){
  // A rounded rectangular cross-section: broad front/back, real thin sidewalls,
  // and quarter-circle bevels. The thickness is exactly 3% of the ribbon width.
  const profile=[];
  function line(a,b,count){for(let j=0;j<count;j++){const t=j/count;profile.push(a.map((x,k)=>x+(b[k]-x)*t));}}
  const w=halfWidth,h=thickness/2,r=bevel;
  line([-w+r,h],[w-r,h],20);
  for(let i=0;i<=5;i++){const a=Math.PI/2-i*Math.PI/10;profile.push([w-r+r*Math.cos(a),h-r+r*Math.sin(a)]);}
  line([w,h-r],[w,-h+r],2);
  for(let i=0;i<=5;i++){const a=-i*Math.PI/10;profile.push([w-r+r*Math.cos(a),-h+r+r*Math.sin(a)]);}
  line([w-r,-h],[-w+r,-h],20);
  for(let i=0;i<=5;i++){const a=-Math.PI/2-i*Math.PI/10;profile.push([-w+r+r*Math.cos(a),-h+r+r*Math.sin(a)]);}
  line([-w,-h+r],[-w,h-r],2);
  for(let i=0;i<=5;i++){const a=Math.PI-i*Math.PI/10;profile.push([-w+r+r*Math.cos(a),h-r+r*Math.sin(a)]);}
  // Remove shared segment endpoints; weld the final profile/longitudinal seams.
  const section=profile.filter((q,i)=>!i||Math.hypot(...sub(q,profile[i-1]))>1e-9);
  if(Math.hypot(...sub(section[0],section.at(-1)))<1e-9)section.pop();
  const count=section.length,positions=[],normals=[],vertices=[],indices=[];
  for(let i=0;i<segments;i++){
    const f=frameAt(i/segments*TAU);
    positions.push(section.map(([x,z])=>f.p.map((v,k)=>v+f.across[k]*x+f.normal[k]*(z+crown*(1-x*x/(w*w))))));
  }
  // Normals derive from the actual solid surface, including bevel curvature.
  for(let i=0;i<segments;i++)normals.push(section.map((_,j)=>normalize(cross(
    sub(positions[(i+1)%segments][j],positions[(i+segments-1)%segments][j]),
    sub(positions[i][(j+1)%count],positions[i][(j+count-1)%count])))));
  const lengths=section.map(()=>[0]);
  for(let j=0;j<count;j++)for(let i=1;i<=segments;i++)lengths[j].push(lengths[j][i-1]+Math.hypot(...sub(positions[i%segments][j],positions[i-1][j])));
  for(let i=0;i<=segments;i++)for(let j=0;j<=count;j++){
    const k=j%count;vertices.push(...positions[i%segments][k],...normals[i%segments][k],lengths[k][i]/lengths[k][segments],section[k][0]/(2*w)+.5);
  }
  for(let i=0;i<segments;i++)for(let j=0;j<count;j++){const a=i*(count+1)+j,b=a+count+1;indices.push(a,b,a+1,b,b+1,a+1);}
  return {vertices:new Float32Array(vertices),indices:new Uint16Array(indices)};
}
const vertexSource=`
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUV;
uniform float uAspect;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
void main(){
  mat3 camera=rz(-.025)*rx(.18)*ry(-.22);
  vec3 p=camera*(aPosition-vec3(.1534,0.,0.));
  vPosition=p;vNormal=camera*aNormal;vUV=aUV;
  // Width-based orthographic framing: the non-square canvas removes empty
  // vertical space without changing the object's proportions or cutting its ends.
  gl_Position=vec4(p.x*.62,p.y*.62*uAspect,-p.z*.2,1.);
}`;
const fragmentSource=`
precision highp float;
uniform sampler2D uEnvironment;
uniform float uHasEnvironment;
uniform float uFlow;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
float panel(vec3 r,vec3 direction,float roughness){return exp((dot(r,normalize(direction))-1.)/roughness);}
float strip(vec3 r,vec3 axis,float offset,float width){
  float d=(dot(r,normalize(axis))-offset)/width;
  return exp(-d*d);
}
void main(){
  vec3 n=normalize(vNormal),eye=vec3(0.,0.,1.);
  if(dot(n,eye)<0.)n=-n;
  vec3 r=reflect(-eye,n);
  // Fixed studio environment, shaped after the Hero's black/silver/cobalt folds.
  // Long softboxes plus their narrow luminous edges bend with reflected normals.
  float key=strip(r,vec3(.24,1.,.15),.42,.058);
  float keyEdge=strip(r,vec3(.24,1.,.15),.46,.009);
  float returnLight=strip(r,vec3(-.55,.26,1.),.62,.038);
  float returnEdge=strip(r,vec3(-.55,.26,1.),.65,.008);
  float cobalt=strip(r,vec3(.8,.3,.28),-.26,.19);
  float blueEdge=strip(r,vec3(.8,.3,.28),-.04,.024);
  vec2 envUV=vec2(.5+atan(r.z,r.x)/6.283185,.5-asin(clamp(r.y,-1.,1.))/3.141593);
  vec3 env=pow(texture2D(uEnvironment,envUV).rgb,vec3(2.2));
  vec3 studio=vec3(.002,.004,.012)+env*uHasEnvironment*.16;
  studio+=vec3(.38,.45,.56)*key+vec3(.80,.88,1.)*keyEdge;
  studio+=vec3(.19,.25,.37)*returnLight+vec3(.68,.78,.96)*returnEdge;
  studio+=vec3(.003,.025,.48)*cobalt+vec3(.012,.10,.80)*blueEdge;
  studio+=vec3(.01,.019,.052)*panel(r,vec3(-.3,-.85,.4),.12);
  // A low-amplitude pigment/grain field travels along physical arc length.
  // It neither rotates the reflection environment nor advects white highlights.
  float a=(vUV.x-uFlow)*6.283185;
  float field=.5+.5*cos(a+.18*sin(2.*a));
  vec3 tint=mix(vec3(.67,.79,1.),vec3(.86,.91,1.),field);
  float grain=1.+.012*sin(vUV.y*180.+a*2.);
  vec3 color=studio*tint*grain;
  // Soft local occlusion below the foreground S curve, not an outline overlay.
  float back=1.-smoothstep(-.14,.28,vPosition.z);
  float proximity=exp(-dot(vPosition.xy*vec2(2.5,3.3),vPosition.xy*vec2(2.5,3.3)));
  color*=1.-.58*back*proximity;
  float fresnel=pow(1.-max(dot(n,eye),0.),4.);
  color+=vec3(.003,.008,.02)*fresnel;
  // Contrast-preserving shoulder: keep unlit chrome deep, with unclipped silver.
  color=pow(color/(vec3(.55)+color),vec3(.7));
  gl_FragColor=vec4(color,1.);
}`;

const instances=new WeakMap();
export function initMobius({host,section,reduced,flowSeconds=14}) {
  if(!host)return;
  if(instances.has(host))return instances.get(host);
  const canvas=host.querySelector('canvas');
  if(!canvas)return;
  let gl;
  try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});}catch{return;}
  if(!gl)return;
  let program,buffer,indexBuffer,texture,frame=0,time=0,last=0,visible=false,lost=false,disposed=false;
  const shaders=[];
  function compile(type,source){
    const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Mobius shader unavailable');return shader;
  }
  try{
    program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Mobius renderer unavailable');
  }catch{
    shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program);return;
  }
  shaders.forEach(s=>gl.deleteShader(s));
  gl.useProgram(program);
  const mesh=geometry();
  buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);
  indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
  [['aPosition',3,0],['aNormal',3,12],['aUV',2,24]].forEach(([name,size,offset])=>{
    const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,32,offset);
  });
  const flow=gl.getUniformLocation(program,'uFlow'),aspect=gl.getUniformLocation(program,'uAspect');
  const hasEnvironment=gl.getUniformLocation(program,'uHasEnvironment');
  texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([8,12,26,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  const paused=()=>reduced.matches||document.hidden||!visible||document.body.classList.contains('motion-paused')||lost;
  function draw(){
    if(lost||document.hidden||!visible)return;
    const dpr=Math.min(Math.max(devicePixelRatio||1,1.5),2);
    const width=Math.max(1,Math.round(host.clientWidth*dpr)),height=Math.max(1,Math.round(host.clientHeight*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
    gl.uniform1f(flow,(time%flowSeconds)/flowSeconds);gl.uniform1f(aspect,width/height);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_SHORT,0);
    host.classList.add('is-webgl');
  }
  function tick(now){
    frame=0;if(paused()){last=0;return;}
    // Time-based 14-second material lap. Geometry and lighting remain stationary.
    // sync() resets last on every pause/visibility change, so resuming never jumps.
    if(last)time+=(now-last)/1000;last=now;draw();frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(paused()){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!document.hidden)draw();}
    else if(!frame){draw();frame=requestAnimationFrame(tick);}
  }
  const environment=new Image();
  environment.onload=()=>{
    if(lost||disposed)return;
    // The actual Hero contributes stationary reflected color/detail, sampled by
    // reflection direction, never stretched along the ribbon's material UVs.
    try{
      const mip=document.createElement('canvas');mip.width=1024;mip.height=512;
      const context=mip.getContext('2d');context.filter='blur(1.25px)';
      context.drawImage(environment,0,0,1024,512);
      gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,mip);
      gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
      gl.uniform1f(hasEnvironment,1);draw();
    }catch{draw();} // The analytic silver/blue material needs no image or CDN.
  };
  environment.src='/assets/hero/blue-chrome.jpg';
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  intersection.observe(host);
  const resize=new ResizeObserver(()=>{if(visible)draw();});resize.observe(host);
  const bodyState=new MutationObserver(sync);bodyState.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  const onLost=event=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;host.classList.remove('is-webgl');};
  const onRestored=()=>{dispose();initMobius({host,section,reduced,flowSeconds});};
  canvas.addEventListener('webglcontextlost',onLost);
  canvas.addEventListener('webglcontextrestored',onRestored);
  function dispose(){
    disposed=true;instances.delete(host);environment.onload=null;
    cancelAnimationFrame(frame);intersection.disconnect();resize.disconnect();bodyState.disconnect();
    document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);
    canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored);
    gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteBuffer(indexBuffer);gl.deleteProgram(program);
  }
  instances.set(host,dispose);
  draw();
  return dispose;
}
