const {chromium}=require('C:/Users/SBS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..'),out=path.join(__dirname,'qa-card-flow');fs.mkdirSync(out,{recursive:true});
vm.runInNewContext(fs.readFileSync(path.join(dir,'build.cjs'),'utf8').split('function buildCaseStudy()')[0]+'\nbuildStaticHome();',{require,__dirname:dir});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report={cards:[],snap:[],hierarchy:[]};try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('https://cdn.jsdelivr.net/**',r=>r.abort());
 const go=async hash=>{await p.goto('http://127.0.0.1:4173/'+hash,{waitUntil:'domcontentloaded'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(120);await p.keyboard.press('Shift');};
 await go('#about');await p.evaluate(()=>{const s=document.querySelector('#about');scrollTo({top:+s.dataset.entryStart+(+s.dataset.entryDistance),behavior:'instant'});});await p.waitForTimeout(120);
 assert(await p.locator('#about h2 .text-line').evaluateAll(lines=>lines.some(el=>+getComputedStyle(el).opacity<1)));
 assert(await p.locator('.about-intro .text-line').evaluateAll(lines=>lines.every(el=>+getComputedStyle(el).opacity===0)));
 await p.waitForFunction(()=>[...document.querySelectorAll('#about h2 .masked-text,#about h2.masked-text')].every(el=>el.dataset.revealState==='shown'));
 await p.waitForTimeout(100);assert(await p.locator('.about-intro .text-line').evaluateAll(lines=>lines.some(el=>+getComputedStyle(el).opacity>0)));assert(await p.locator('.profile-date .text-line').evaluateAll(lines=>lines.every(el=>+getComputedStyle(el).opacity===0)));report.hierarchy.push({section:'about',titleFirst:true,metadataDelayed:true});
 await go('#work');await p.evaluate(()=>{const w=document.querySelector('#work');scrollTo({top:+w.dataset.entryStart+(+w.dataset.intro)+(+w.dataset.hold),behavior:'instant'});});await p.waitForTimeout(900);
 assert.equal(await p.locator('.hero .masked-text').count(),0);
 for(const target of [1,2,3]){
  await p.mouse.wheel(0,70);await p.waitForTimeout(30);await p.mouse.wheel(0,700);await p.waitForTimeout(30);await p.mouse.wheel(0,300);await p.waitForTimeout(750);
  const s=await p.evaluate(()=>{const w=document.querySelector('#work'),i=+w.dataset.current,cover=w.querySelectorAll('.work-gallery .project-visual')[i],r=cover.getBoundingClientRect();return {position:+w.dataset.position,current:i,centerY:r.top+r.height/2,angle:getComputedStyle(cover).getPropertyValue('--orbit-angle'),blur:getComputedStyle(cover).filter};});
  assert.equal(s.position,target);assert.equal(s.current,target);assert(Math.abs(s.centerY-500)<.1);assert.equal(s.angle,'0.000deg');assert.equal(s.blur,'blur(0px)');report.snap.push(s);
 }
 await p.mouse.wheel(0,-70);await p.waitForTimeout(750);assert.equal(+(await p.locator('#work').getAttribute('data-position')),2);report.snap.push({reverse:true,position:2});
 await p.waitForFunction(()=>document.querySelector('.project-cafekok .project-info h3').dataset.revealState==='shown');
 await p.waitForTimeout(150);const summary=await p.locator('.project-cafekok .project-summary .text-line').evaluateAll(lines=>lines.map(el=>+getComputedStyle(el).opacity));assert(summary.some(opacity=>opacity===0));report.hierarchy.push({section:'project',nameBeforeSummary:true});
 for(const [width,height] of [[1440,1000],[1920,1080],[1101,760],[1280,700],[768,900],[390,844],[375,812]]){
  await p.setViewportSize({width,height});await p.emulateMedia({reducedMotion:'reduce'});await go('#qa');
  await p.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.qa-card-image img')].map(img=>{img.loading='eager';return img.decode();}));});await p.waitForTimeout(150);
  const cards=await p.evaluate(async()=>{
   const {questions}=await import('/data.js');
   return [...document.querySelectorAll('.qa-card')].map((card,i)=>{const question=card.querySelector('h3'),answer=card.querySelector('.qa-card-answer'),figure=card.querySelector('figure'),img=figure.querySelector('img'),css=getComputedStyle(card);return {i,question:question.textContent,answer:answer.textContent,expected:questions[i],height:card.offsetHeight,questionTop:question.offsetTop,answerTop:answer.offsetTop,questionBottom:question.offsetTop+question.offsetHeight,imageTop:figure.offsetTop,imageBottom:figure.offsetTop+figure.offsetHeight,answerBottom:answer.offsetTop+answer.offsetHeight,contentBottom:card.clientHeight-parseFloat(css.paddingBottom),lineCount:question.querySelectorAll('.text-line').length,img:{src:img.getAttribute('src'),naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,fit:getComputedStyle(img).objectFit,opacity:getComputedStyle(img).opacity,filter:getComputedStyle(img).filter},fonts:{question:getComputedStyle(question).fontFamily,answer:getComputedStyle(answer).fontFamily,size:parseFloat(getComputedStyle(answer).fontSize)}};});
  });
  for(const c of cards){assert.equal(c.question,c.expected[0]);assert.equal(c.answer,c.expected[1]);assert(c.lineCount>=2&&c.lineCount<=3);assert(c.imageTop-c.questionBottom>=23);assert(c.answerTop-c.imageBottom>=23);assert(c.answerBottom<=c.contentBottom+1);assert.equal(c.img.src,'/assets/qa/'+(c.i+1)+'.png');assert.equal(c.img.naturalWidth,1254);assert.equal(c.img.fit,'contain');assert.equal(c.img.opacity,'1');assert.equal(c.img.filter,'none');assert(c.fonts.question.includes('Anton'));assert(c.fonts.answer.includes('Pretendard'));assert(c.fonts.size>=16);assert(Math.abs(c.questionTop-cards[0].questionTop)<1);assert(Math.abs(c.answerTop-cards[0].answerTop)<1);}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
  for(let i=0;i<5;i++){
   if(width<=800)await p.evaluate(i=>{const d=document.querySelector('.qa-deck'),c=d.children[i];d.scrollLeft=c.offsetLeft-4;},i);
   await p.locator('.qa-card').nth(i).scrollIntoViewIfNeeded();await p.locator('.qa-card').nth(i).screenshot({path:path.join(out,width+'-'+i+'.png')});
  }
  report.cards.push({width,height,layout:cards.map(({i,height,questionTop,answerTop,lineCount})=>({i,height,questionTop,answerTop,lineCount})),answersComplete:true,imagesVerified:true});
 }
 for(const [width,height] of [[1440,1000],[1920,1080],[1101,760],[1280,700]]){
  await p.setViewportSize({width,height});await p.emulateMedia({reducedMotion:'no-preference'});await go('#qa');
  await p.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.qa-card-image img')].map(img=>{img.loading='eager';return img.decode();}));});
  for(let i=0;i<5;i++){
   await p.locator('.qa-card').nth(i).focus();await p.waitForTimeout(160);
   const c=await p.locator('.qa-card').nth(i).evaluate(card=>{const answer=card.querySelector('.qa-card-answer'),question=card.querySelector('h3'),image=card.querySelector('figure'),css=getComputedStyle(card);return {height:card.offsetHeight,width:card.offsetWidth,questionTop:question.offsetTop,answerTop:answer.offsetTop,answerBottom:answer.offsetTop+answer.offsetHeight,contentBottom:card.clientHeight-parseFloat(css.paddingBottom),gap:answer.offsetTop-image.offsetTop-image.offsetHeight,lines:question.querySelectorAll('.text-line').length};});
   assert(c.answerBottom<=c.contentBottom+1);assert(c.gap>=23);assert(c.lines>=2&&c.lines<=3);await p.locator('.qa-card').nth(i).screenshot({path:path.join(out,width+'-motion-'+i+'.png')});
   report.cards.push({width,height,motion:true,i,layout:c});
  }
 }
 await p.setViewportSize({width:1440,height:1000});await p.emulateMedia({reducedMotion:'no-preference'});await go('#qa');
 await p.evaluate(()=>{const q=document.querySelector('#qa');scrollTo({top:+q.dataset.entryStart+(+q.dataset.intro)+(+q.dataset.run),behavior:'instant'});});await p.waitForTimeout(150);
 await p.locator('.qa-card').nth(4).focus();await p.waitForTimeout(150);const last=await p.locator('.qa-card').nth(4).boundingBox();assert(last.x>=0&&last.x+last.width<=1440-90);assert(last.y>=0&&last.y+last.height<=1000);await p.screenshot({path:path.join(out,'1440-last-card-motion.png')});report.lastCardMotion=true;
 assert.deepEqual(errors,[]);report.errors=errors;console.log('PASS',JSON.stringify(report));
 }finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
