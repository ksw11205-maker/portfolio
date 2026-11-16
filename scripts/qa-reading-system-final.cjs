const fs=require('fs'),path=require('path'),dep=path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'),{chromium}=require(path.join(dep,'playwright'));
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),out='docs/design/reading-system-qa/final',report=[];fs.mkdirSync(out,{recursive:true});
for(const slug of ['lg','ivi','cafekok','offer'])for(const width of [1920,1440,1280,1024,768,430,390,320]){
 const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto('http://localhost:4175/work/'+slug+(slug==='offer'?'/case-study.html':'/'),{waitUntil:'networkidle'});await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch{}}))});await p.waitForTimeout(200);
 const selectors=['.archive-hero','.case-section','.annotated-interface',({lg:'.model-section',ivi:'#click-patterns',cafekok:'#purpose',offer:'.offer-compare'})[slug]];
 for(const [i,s]of selectors.entries()){const el=p.locator(s).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(80);await el.screenshot({path:out+'/'+slug+'-'+width+'-'+i+'.png'});}
 await p.locator('.case-section').first().evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-110));await p.waitForTimeout(120);await p.screenshot({path:out+'/'+slug+'-'+width+'-reading.png'});
 const state=await p.evaluate(()=>{
 const overlap=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
 const small=[...document.querySelectorAll('main *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<16&&e.getBoundingClientRect().height>0&&!e.closest('svg,.sr-only')).map(e=>[e.tagName,e.className,e.textContent.slice(0,25),getComputedStyle(e).fontSize]);
 const boards=[...document.querySelectorAll('.annotated-interface')].map(f=>{const d=f.querySelector('.interface-device').getBoundingClientRect(),ls=[...f.querySelectorAll('.feature-label')].map(l=>l.getBoundingClientRect());return {id:f.dataset.interface,deviceCollisions:ls.filter(l=>overlap(l,d)).length,labelCollisions:ls.flatMap((l,i)=>ls.slice(i+1).filter(m=>overlap(l,m))).length}});
 const hero=document.querySelector('.archive-hero-art img'),r=hero.getBoundingClientRect();
 return {overflow:document.documentElement.scrollWidth>innerWidth+1,small,boards,heroRatioError:Math.abs(r.width/r.height-hero.naturalWidth/hero.naturalHeight),active:[...document.querySelectorAll('.case-nav a[aria-current=location]')].map(e=>e.hash),tooltip:!!document.querySelector('.case-image-tooltip')};
 });report.push({slug,width,errors,...state});await p.close();
}
await b.close();fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.filter(r=>r.overflow||r.errors.length||r.small.length||r.boards.some(b=>b.deviceCollisions||b.labelCollisions)||r.heroRatioError>.02),null,2));})();
