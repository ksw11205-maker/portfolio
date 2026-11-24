// The original 1254px artwork stays visible. Only light is drawn over it.
// Coordinates follow the face of the photographed letters, not a substitute mesh.
export const WELD_PATHS=[
  {a:[245,925],b:[300,510],start:.6,duration:1.8},
  {a:[300,510],b:[875,725],start:2.6,duration:1.8},
  {a:[270,780],b:[635,655],start:4.6,duration:.75},
  {a:[710,385],b:[1120,620],start:5.55,duration:1.8}
];
export function weldPoint(time){
  if(time<0)return null;
  const phase=time%11.6;
  const stroke=WELD_PATHS.find(s=>phase>=s.start&&phase<s.start+s.duration);
  if(!stroke)return null;
  const t=(phase-stroke.start)/stroke.duration;
  return stroke.a.map((v,i)=>(v+(stroke.b[i]-v)*t)/1254);
}
export function createWeldOverlay(host){
  const canvas=host.querySelector('canvas'),art=host.querySelector('img');
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return null;
  let width=0,height=0,ratio=1,box={x:0,y:0,w:0,h:0};
  function resize(){
    width=host.clientWidth;height=host.clientHeight;
    ratio=Math.min(globalThis.devicePixelRatio||1,3);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    // object-fit:contain; use layout offsets so ancestor card transforms do not
    // distort the overlay alignment while the deck scrolls or rotates.
    const aw=art.clientWidth,ah=art.clientHeight;
    const scale=Math.min(aw/(art.naturalWidth||1254),ah/(art.naturalHeight||1254));
    const w=(art.naturalWidth||1254)*scale,h=(art.naturalHeight||1254)*scale;
    box={x:art.offsetLeft+(aw-w)/2,y:art.offsetTop+(ah-h)/2,w,h};
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  function glow(point,radius,opacity,core=false){
    const x=box.x+point[0]*box.w,y=box.y+point[1]*box.h;
    const gradient=ctx.createRadialGradient(x,y,0,x,y,radius);
    gradient.addColorStop(0,core?`rgba(255,253,237,${opacity})`:`rgba(255,211,135,${opacity})`);
    gradient.addColorStop(.25,`rgba(255,211,135,${opacity*.5})`);
    gradient.addColorStop(1,'rgba(255,190,100,0)');
    ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
  }
  function update(time,still){
    ctx.clearRect(0,0,width,height);
    if(still||!box.w||!art.complete||!art.naturalWidth)return;
    const point=weldPoint(time);
    // Every frame is rebuilt. There are no particles, dark masks or accumulated
    // trails, so the completed frame is exactly the untouched original image.
    ctx.globalCompositeOperation='lighter';
    const size=Math.max(2,box.w/1254*22);
    for(let j=8;j>0;j--){
      const previous=weldPoint(time-j*.018);
      if(previous)glow(previous,size*.48,.17*(1-j/9));
    }
    if(point){glow(point,size,0.6);glow(point,Math.max(.9,size*.2),1,true);}
    ctx.globalCompositeOperation='source-over';
  }
  const onLoad=()=>{resize();};art.addEventListener('load',onLoad);
  resize();
  return {resize,update,dispose(){art.removeEventListener('load',onLoad);ctx.clearRect(0,0,width,height);}};
}
