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
  const width=window.innerWidth||1440,height=window.innerHeight||900;
  const logoWidth=Math.min(180,Math.max(100,width*.13)),unit=logoWidth/brandShape.width;
  const holeWidth=220*unit,holeHeight=180*unit;
  // The backdrop and mark share one camera. Its central aperture reveals the real
  // hero underneath; scaling the camera carries both logo edges out of view.
  overlay.innerHTML=`<div class="intro-camera"><svg class="intro-scene" viewBox="${-width/2} ${-height/2} ${width} ${height}" preserveAspectRatio="none" focusable="false"><defs><mask id="intro-portal" maskUnits="userSpaceOnUse" x="${-width/2}" y="${-height/2}" width="${width}" height="${height}"><rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" fill="white"/><rect class="intro-aperture" x="${-holeWidth/2}" y="${-holeHeight/2}" width="${holeWidth}" height="${holeHeight}" rx="${8*unit}" fill="black"/></mask></defs><rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" fill="#0b0c0e" mask="url(#intro-portal)"/><svg x="${-logoWidth/2}" y="${-brandShape.height*unit/2}" width="${logoWidth}" height="${brandShape.height*unit}" viewBox="0 0 ${brandShape.width} ${brandShape.height}" overflow="visible"><g class="intro-piece"><path fill="${brandShape.blue}" d="${d}"/></g><g class="intro-piece"><path fill="${brandShape.silver}" d="${d}" transform="rotate(180 ${brandShape.width/2} ${brandShape.height/2})"/></g></svg></svg></div>`;
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
  overlay.querySelectorAll('.intro-piece').forEach((piece,i)=>animations.push(piece.animate([
    {transform:`translate(${i?22:-22}px,${i?-22:22}px)`,opacity:0},{transform:'translate(0,0)',opacity:1}
  ],{duration:780,delay:80+i*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})));
  preparation=prepareHeroReadiness(document.querySelector('.hero'));
  openTimer=setTimeout(async()=>{
    await preparation.ready;if(finished)return;
    // Reveal the hero background first. The real logo stays hidden throughout
    // the zoom, then fades in at its final position after the portal is removed.
    [document.querySelector('.header'),document.querySelector('.hero-bottom')].filter(Boolean).forEach((node,i)=>{
      animations.push(node.animate([{opacity:0},{opacity:1}],{duration:600,delay:420+i*60,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
    });
    state.blocksHero=false;document.body.classList.remove('intro-closed');overlay.classList.add('is-opening');
    animations.push(overlay.querySelector('.intro-aperture').animate([
      {transform:'scale(0)'},{transform:'scale(1)'}
    ],{duration:280,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}));
    const zoom=Math.max(width/holeWidth,height/holeHeight)*1.25;
    animations.push(overlay.querySelector('.intro-camera').animate([
      {transform:'scale(1)'},{transform:`scale(${zoom})`}
    ],{duration:1250,easing:'cubic-bezier(.72,0,.22,1)',fill:'forwards'}));
    animations.at(-1).finished.then(()=>finish(true)).catch(()=>{});
  },1050);
  watchdog=setTimeout(()=>finish(true),3100);
  addEventListener('keydown',skip);addEventListener('pagehide',finish,{once:true});reduced.addEventListener('change',finish,{once:true});
  return state;
}
