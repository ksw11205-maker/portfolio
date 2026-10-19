import {brandShape} from './brand-shape.js';
let active=null;
export function preparePortfolioIntro({app,reduced,force=false}){
  const state={blocksHero:false};
  const reveal=()=>document.documentElement.classList.remove('intro-pending');
  if(!document.querySelector('.hero')||location.pathname.startsWith('/work/')){reveal();return state;}
  if(active){if(!force)return active.state;active.finish();}
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
  overlay.innerHTML=`<div class="intro-panel intro-panel-lower"></div><div class="intro-panel intro-panel-upper"></div><div class="intro-logo"><svg viewBox="0 0 ${brandShape.width} ${brandShape.height}" focusable="false"><g class="intro-piece"><path fill="${brandShape.blue}" d="${d}"/></g><g class="intro-piece"><path fill="${brandShape.silver}" d="${d}" transform="rotate(180 ${brandShape.width/2} ${brandShape.height/2})"/></g></svg></div>`;
  const roots=[app,document.querySelector('.skip')].filter(Boolean),inert=roots.map(r=>r.inert);
  const previousOverflow=document.documentElement.style.overflow,previousBody=document.body.style.overflow;
  const animations=[];let finished=false,openTimer,watchdog;
  const finish=()=>{
    if(finished)return;finished=true;clearTimeout(openTimer);clearTimeout(watchdog);
    animations.forEach(a=>a.cancel());overlay.remove();reveal();state.blocksHero=false;
    roots.forEach((r,i)=>r.inert=inert[i]);document.documentElement.style.overflow=previousOverflow;document.body.style.overflow=previousBody;
    document.body.classList.remove('intro-active','intro-closed');active=null;
    reduced.removeEventListener('change',finish);removeEventListener('pagehide',finish);removeEventListener('keydown',skip);
    dispatchEvent(new Event('portfolio:intro-complete'));dispatchEvent(new Event('resize'));
  };
  const skip=e=>{if(e.key==='Escape')finish();};active={state,finish};
  roots.forEach(r=>r.inert=true);document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  document.body.classList.add('intro-active','intro-closed');document.body.append(overlay);reveal();
  overlay.querySelectorAll('.intro-piece').forEach((piece,i)=>animations.push(piece.animate([
    {transform:`translate(${i?22:-22}px,${i?-22:22}px)`,opacity:0},{transform:'translate(0,0)',opacity:1}
  ],{duration:780,delay:80+i*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'})));
  openTimer=setTimeout(()=>{
    state.blocksHero=false;document.body.classList.remove('intro-closed');overlay.classList.add('is-opening');
    animations.push(overlay.querySelector('.intro-logo').animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'}));
    const panels=[...overlay.querySelectorAll('.intro-panel')];
    panels.forEach((panel,i)=>animations.push(panel.animate([{transform:'translate(0,0)'},{transform:`translate(${i?'102vw':'-102vw'},${i?'-102vh':'102vh'})`}],{duration:820,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'})));
    animations.at(-1).finished.then(finish).catch(()=>{});
  },1050);
  watchdog=setTimeout(finish,2600);
  addEventListener('keydown',skip);addEventListener('pagehide',finish,{once:true});reduced.addEventListener('change',finish,{once:true});
  return state;
}
