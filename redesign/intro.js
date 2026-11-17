import {brandShape} from './brand-shape.js';
import {prepareHeroReadiness} from './intro-readiness.js';
import {prepareHeroLogoReveal} from './hero-logo-reveal.js';
let active=null,heroLogoReveal=null;
export function preparePortfolioIntro({app,reduced,force=false}){
  const state={blocksHero:false};
  const reveal=()=>document.documentElement.classList.remove('intro-pending');
  if(!document.querySelector('.hero')||location.pathname.startsWith('/work/')){reveal();return state;}
  if(active){if(!force)return active.state;active.finish();}
  heroLogoReveal?.cancel();heroLogoReveal=null;
  const navigation=performance.getEntriesByType('navigation')[0]?.type;
  const deep=location.hash&&!['#home','#main'].includes(location.hash);
  if(reduced.matches||(!force&&(navigation==='back_forward'||(deep&&navigation!=='reload')))){reveal();return state;}
  if(navigation==='reload'||force){
    history.replaceState(history.state,'',location.pathname+location.search+'#home');
    window.scrollTo({top:0,behavior:'instant'});
  }
  state.blocksHero=true;
  const overlay=document.createElement('div');overlay.className='portfolio-intro';overlay.setAttribute('aria-hidden','true');
  const d=brandShape.commands.map(c=>c.join(' ')).join(' ');
  const stage=document.querySelector('.hero-brand .brand-stage');
  const box=stage.getBoundingClientRect();
  const logoWidth=box.height * brandShape.width * .007 / 5.7;
  const logoHeight=logoWidth * brandShape.height / brandShape.width;
  const centerX=box.left+box.width/2,centerY=box.top+box.height/2;
  // Start inside an oversized symbol, then pull it into the real model's position.
  overlay.classList.add('portfolio-intro--depth');
  overlay.innerHTML=`<div class="intro-depth-backdrop"></div><div class="intro-depth-mark" style="left:${centerX}px;top:${centerY}px;width:${logoWidth}px;height:${logoHeight}px"><svg viewBox="0 0 ${brandShape.width} ${brandShape.height}" focusable="false"><path fill="${brandShape.blue}" d="${d}"/><path fill="${brandShape.silver}" d="${d}" transform="rotate(180 ${brandShape.width/2} ${brandShape.height/2})"/></svg></div>`;
  const roots=[app,document.querySelector('.skip')].filter(Boolean),inert=roots.map(r=>r.inert);
  const previousOverflow=document.documentElement.style.overflow,previousBody=document.body.style.overflow;
  const animations=[];let finished=false,openTimer,watchdog,preparation;
  const logoReveal=prepareHeroLogoReveal(document.querySelector('.hero-brand'),{reduced});heroLogoReveal=logoReveal;
  const finish=(showLogo=false)=>{
    if(finished)return;finished=true;clearTimeout(openTimer);clearTimeout(watchdog);
    preparation?.cancel();animations.forEach(a=>a.cancel());overlay.remove();reveal();state.blocksHero=false;
    roots.forEach((r,i)=>r.inert=inert[i]);document.documentElement.style.overflow=previousOverflow;document.body.style.overflow=previousBody;
    document.body.classList.remove('intro-active','intro-closed');active=null;
    if(showLogo===true)logoReveal.open();else logoReveal.cancel();
    reduced.removeEventListener('change',finish);removeEventListener('pagehide',finish);removeEventListener('keydown',skip);
    dispatchEvent(new Event('portfolio:intro-complete'));dispatchEvent(new Event('resize'));
  };
  const skip=e=>{if(e.key==='Escape')finish();};active={state,finish};
  roots.forEach(r=>r.inert=true);document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  document.body.classList.add('intro-active','intro-closed');document.body.append(overlay);reveal();
  dispatchEvent(new Event('portfolio:intro-prepare'));
  const mark=overlay.querySelector('.intro-depth-mark');
  const startScale=Math.max(innerWidth/logoWidth,innerHeight/logoHeight)*1.7;
  const startTransform=`translate(-50%,-50%) scale(${startScale})`;
  mark.style.transform=startTransform;
  preparation=prepareHeroReadiness(document.querySelector('.hero'),{timeout:1200});
  openTimer=setTimeout(async()=>{
    await preparation.ready;if(finished)return;
    const travel=mark.animate([
      {transform:startTransform,filter:'blur(4px)'},
      {transform:'translate(-50%,-50%) scale(1)',filter:'blur(0px)'}
    ],{duration:1450,easing:'cubic-bezier(.16,.7,.22,1)',fill:'forwards'});
    animations.push(travel);
    animations.push(overlay.querySelector('.intro-depth-backdrop').animate([
      {opacity:1},{opacity:0}
    ],{duration:850,delay:500,easing:'ease-in-out',fill:'forwards'}));
    state.blocksHero=false;document.body.classList.remove('intro-closed');
    [document.querySelector('.header'),document.querySelector('.hero-bottom')].filter(Boolean).forEach(node=>{
      animations.push(node.animate([{opacity:0},{opacity:1}],{duration:600,delay:700,easing:'ease-out',fill:'both'}));
    });
    // Both surfaces share a contour and a centre. The flat mark dissolves as
    // the actual bevelled mesh gains depth and turns into the studio light.
    openTimer=setTimeout(()=>{
      if(finished)return;
      logoReveal.open().then(()=>{
      if(finished)return;
      const dissolve=mark.animate([{opacity:1},{opacity:0}],{duration:500,fill:'forwards'});
      animations.push(dissolve);
      dissolve.finished.then(()=>finish(true)).catch(()=>{});
      });
    },1150);
  },180);
  watchdog=setTimeout(()=>finish(true),3500);
  addEventListener('keydown',skip);addEventListener('pagehide',finish,{once:true});reduced.addEventListener('change',finish,{once:true});
  return state;
}
