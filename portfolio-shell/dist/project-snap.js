// One deliberate wheel gesture advances one cover and lands on its exact center.
// Motion still uses the existing Lenis instance and section scroll coordinates.
export function createProjectSnap({entry,work,count,scrollMotion,resting}){
  let lastWheel=0,lastDirection=0,busyUntil=0,targetIndex=null,ownAnimation=false,settleTimer=0,lastY=NaN,releasing=0;
  const enabled=()=>work.classList.contains('is-pinned')&&!resting()&&Number.isFinite(entry.start);
  const first=()=>entry.start+entry.intro+entry.hold;
  const last=()=>first()+entry.slot*(count-1);
  const destination=index=>first()+entry.slot*index;
  function cancel(){clearTimeout(settleTimer);ownAnimation=false;targetIndex=null;lastWheel=0;lastDirection=0;busyUntil=0;releasing=0;delete work.dataset.snapTarget;}
  addEventListener('pointerdown',cancel,{passive:true});addEventListener('pagehide',cancel);
  addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Tab'].includes(event.key))cancel();});
  function go(index){
    clearTimeout(settleTimer);targetIndex=index;ownAnimation=true;busyUntil=performance.now()+600;releasing=0;
    work.dataset.snapTarget=String(index);
    scrollMotion.scrollTo(destination(index),{duration:.55,easing:p=>1-Math.pow(1-p,4),onComplete:()=>{
      ownAnimation=false;targetIndex=null;delete work.dataset.snapTarget;scrollMotion.requestUpdate();
    }});
  }
  return {
    handleWheel({deltaY,event}){
      if(!enabled()||!deltaY||event.defaultPrevented||event.target.closest?.('input,textarea,select,[data-lenis-prevent]'))return false;
      const y=scrollY,direction=Math.sign(deltaY),now=performance.now(),quiet=now-lastWheel>180;
      const crossesIntro=direction>0&&y<first()&&y+deltaY>=first();
      if(y<entry.start||y>entry.start+entry.run+2||y<entry.start+entry.intro*.8&&!crossesIntro)return false;
      const position=(y-first())/entry.slot;
      if(releasing===direction&&(position<=.002&&direction<0||position>=count-1-.002&&direction>0))return false;
      const continuing=direction===lastDirection&&(!quiet||now<busyUntil);
      lastWheel=now;lastDirection=direction;
      if(continuing){event.preventDefault();return true;}
      if(!ownAnimation&&(position<=.002&&direction<0||position>=count-1-.002&&direction>0)){releasing=direction;return false;}
      event.preventDefault();
      const index=ownAnimation&&targetIndex!==null?targetIndex+direction:
        position<0?0:direction>0?Math.floor(position+.002)+1:Math.ceil(position-.002)-1;
      go(Math.max(0,Math.min(count-1,index)));return true;
    },
    observe(y){
      if(y===lastY)return;lastY=y;clearTimeout(settleTimer);
      if(!enabled()||y<entry.start||y>entry.start+entry.run+2){cancel();return;}
      if(!enabled()||ownAnimation||y<first()-2||y>last()+2)return;
      settleTimer=setTimeout(()=>{
        if(!enabled()||ownAnimation)return;
        const p=(scrollY-first())/entry.slot,index=Math.max(0,Math.min(count-1,Math.round(p)));
        if(Math.abs(scrollY-destination(index))>1)go(index);
      },160);
    },
    cancel
  };
}
