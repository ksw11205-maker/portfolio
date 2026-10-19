// State/DOM tests only. They do not replace browser, WebGL or layout verification.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {parseHTML}=require('linkedom');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
let passed=0;
function check(name,fn){fn();passed++;console.log('PASS '+name);}
function env(html='<div id="app"><section class="hero"></section></div>'){
  const {document,window}=parseHTML('<!doctype html><html><body>'+html+'</body></html>');
  const events=new EventTarget(),frames=new Map(),timers=new Map(),mutations=[];
  const reduced=new EventTarget();reduced.matches=false;
  const fine=new EventTarget();fine.matches=true;
  let now=0,id=0;
  const context={document,console,Event,innerHeight:1000,scrollY:0,
    location:{pathname:'/',search:'',hash:''},history:{state:null,replaceState(){}},
    performance:{now:()=>now,getEntriesByType:()=>[{type:'navigate'}]},
    getComputedStyle:()=>({display:'block',width:'12px'}),
    matchMedia:query=>query.includes('reduced')?reduced:fine,
    addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events),
    requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:key=>frames.delete(key),
    setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:key=>timers.delete(key),
    MutationObserver:class{constructor(fn){mutations.push(fn);}observe(){}},ResizeObserver:class{observe(){}},
  };
  context.window={scrollTo:({top})=>context.scrollY=top};
  Object.defineProperty(document,'hidden',{value:false,writable:true});
  window.Element.prototype.animate=()=>({finished:new Promise(()=>{}),cancel(){}});
  vm.createContext(context);
  return {context,document,reduced,fine,events,timers,frames,mutations,
    time:t=>now=t,
    frame(t){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(t));},
    load(file,expression){const source=fs.readFileSync(path.join(dist,file),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');return vm.runInContext(source+'\n'+expression,context);}
  };
}
check('production JavaScript parses',()=>{
  for(const name of fs.readdirSync(dist).filter(n=>n.endsWith('.js')))execFileSync(process.execPath,['--check',path.join(dist,name)],{stdio:'pipe'});
});
check('build is deterministic and preserves product sources',()=>{
  const source=path.resolve(root,'../cafekok/cafekok-detail/cafekok/index.html'),before=fs.readFileSync(source,'utf8');
  execFileSync(process.execPath,[path.join(root,'build.cjs')],{stdio:'pipe'});
  const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');
  execFileSync(process.execPath,[path.join(root,'build.cjs')],{stdio:'pipe'});
  assert.equal(fs.readFileSync(path.join(dist,'index.html'),'utf8'),home);
  assert.equal(fs.readFileSync(source,'utf8'),before);
  const {document}=parseHTML(home);
  assert.equal(document.querySelectorAll('.project').length,4);
  assert.equal(document.querySelectorAll('.project-info .liquid').length,0);
  assert.equal(document.querySelectorAll('.qa-card').length,5);
  assert.equal(document.querySelectorAll('link[rel="icon"]').length,1);
  assert.equal(document.querySelectorAll('script[src="/intro-boot.js"]').length,1);
  assert.ok(document.querySelector('.brand-poster'));
  assert.ok(!document.querySelector('.cursor-dot'));
  assert.equal(document.querySelector('.site-footer').querySelectorAll('a').length,0);
});
check('home assets, local imports and CSS resources resolve',()=>{
  const html=fs.readFileSync(path.join(dist,'index.html'),'utf8'),{document}=parseHTML(html);
  const verify=(reference,parent)=>{
    if(!reference||/^(data:|https?:|#)/.test(reference)||reference.includes('${'))return;
    const clean=reference.split(/[?#]/)[0];
    assert.ok(fs.existsSync(path.resolve(reference.startsWith('/')?dist:path.dirname(parent),clean.replace(/^\//,''))),reference+' from '+parent);
  };
  for(const node of document.querySelectorAll('img,script,link')){
    verify(node.getAttribute('src')||node.getAttribute('href'),path.join(dist,'index.html'));
    for(const candidate of (node.getAttribute('srcset')||'').split(','))verify(candidate.trim().split(/\s/)[0],path.join(dist,'index.html'));
  }
  for(const name of fs.readdirSync(dist).filter(n=>/\.(js|css)$/.test(n))){
    const file=path.join(dist,name),text=fs.readFileSync(file,'utf8');
    if(name.endsWith('.js'))for(const match of text.matchAll(/(?:from\s*|import\s*\()(['"])([^'"]+)\1/g))verify(match[2],file);
    else for(const match of text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g))verify(match[1],file);
  }
});
check('reload intro unlocks content on Escape and watchdog; reduced motion skips',()=>{
  const e=env();e.context.brandShape=e.load('brand-shape.js','brandShape');
  const prepare=e.load('intro.js','preparePortfolioIntro'),app=e.document.querySelector('#app');
  app.inert=false;e.document.documentElement.style.overflow='auto';
  e.context.performance.getEntriesByType=()=>[{type:'reload'}];e.context.scrollY=1200;
  const state=prepare({app,reduced:e.reduced});
  assert.ok(e.document.querySelector('.portfolio-intro'));assert.equal(app.inert,true);assert.equal(e.context.scrollY,0);
  const esc=new Event('keydown');esc.key='Escape';e.events.dispatchEvent(esc);
  assert.equal(e.document.querySelector('.portfolio-intro'),null);assert.equal(app.inert,false);assert.equal(state.blocksHero,false);
  assert.equal(e.document.documentElement.style.overflow,'auto');
  prepare({app,reduced:e.reduced});[...e.timers.values()].find(t=>t.ms===2600).fn();
  assert.equal(app.inert,false);assert.equal(e.document.querySelector('.portfolio-intro'),null);
  e.reduced.matches=true;prepare({app,reduced:e.reduced});assert.equal(e.document.querySelector('.portfolio-intro'),null);
});
check('Contact completion remains light after reverse scroll and mode changes',()=>{
  const e=env('<section id="contact"></section>'),contact=e.document.querySelector('#contact');
  contact.getBoundingClientRect=()=>({top:0,bottom:1000,left:0,width:1000,height:1000});
  const wave=e.load('contact-wave.js','createContactWave')(contact);
  wave.setEnabled(true);wave.render(.4);assert.ok(!contact.classList.contains('wave-complete'));
  wave.render(1);const final=contact.querySelector('svg').innerHTML;
  wave.render(0);wave.setEnabled(false);wave.setEnabled(true);wave.render(.1);
  assert.ok(contact.classList.contains('wave-complete'));assert.equal(contact.querySelector('svg').innerHTML,final);
  assert.equal(wave.isLightAt(500,100),true);assert.equal(wave.isLightAt(500,-100),false);
});
check('title and content finish as two groups and never restart on reverse scroll',()=>{
  const e=env('<section><div class="heading"><h2>Who I Am</h2></div><div class="content"><p>첫 문장</p><p>둘째 문장</p></div></section>');
  const section=e.document.querySelector('section'),title=section.querySelector('h2');
  const entry={id:'about',section,title,heading:section.querySelector('.heading'),content:[section.querySelector('.content')],start:100,intro:700};
  const reveal=e.load('text-reveal.js','createTextReveal')([entry]);reveal.measure();
  e.context.scrollY=100;e.time(0);assert.equal(reveal.renderEntry(entry,0,false).title,0);
  e.time(450);const middle=reveal.renderEntry(entry,.5,false);assert.ok(middle.title>0&&middle.title<1&&middle.content>0);
  e.time(1000);assert.equal(reveal.renderEntry(entry,1,false).content,1);
  e.context.scrollY=0;assert.equal(reveal.renderEntry(entry,0,false).title,1);
  assert.equal(title.textContent.replace(/\u00a0/g,' '),'Who I Am');
  assert.equal(section.querySelectorAll('.entry-content').length,1);
  assert.equal(section.querySelectorAll('.content p[style]').length,0);
});
check('scroll clock excludes idle time and destroys the smoother on pause/touch',()=>{
  const e=env(),instances=[];
  e.context.Lenis=class{
    constructor(options){this.options=options;this.calls=[];this.isScrolling=false;this.actualScroll=0;this.animatedScroll=0;this.targetScroll=0;instances.push(this);}
    raf(t){this.calls.push(t);}resize(){}scrollTo(top){this.actualScroll=top;this.isScrolling=false;}destroy(){this.destroyed=true;}
  };
  const motion=e.load('scroll-motion.js','initScrollMotion')({reduced:e.reduced});
  e.frame(100);motion.requestUpdate();e.frame(10100);
  assert.ok(Math.abs(instances[0].calls[1]-instances[0].calls[0]-1000/60)<.001);
  instances[0].isScrolling='smooth';motion.requestUpdate();e.frame(10117);e.frame(11117);
  assert.ok(instances[0].calls.at(-1)-instances[0].calls.at(-2)<=50);
  e.document.body.classList.add('motion-paused');e.mutations.forEach(fn=>fn());assert.ok(instances[0].destroyed);
  e.document.body.classList.remove('motion-paused');e.mutations.forEach(fn=>fn());assert.equal(instances.length,2);
  e.fine.matches=false;e.fine.dispatchEvent(new Event('change'));assert.ok(instances[1].destroyed);
  e.fine.dispatchEvent(new Event('change'));assert.equal(instances.length,2);
});
console.log(`${passed} checks passed. Browser layout and WebGL appearance are not covered.`);
