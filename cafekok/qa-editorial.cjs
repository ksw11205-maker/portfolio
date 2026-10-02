const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/SBS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const source=path.join(__dirname,'cafekok-detail/cafekok');
// Build only the requested case study, leaving the shell and other projects untouched.
const output=path.join(__dirname,'../portfolio-shell/dist/work/cafekok');
for(const name of ['index.html','styles.css','script.js'])fs.copyFileSync(path.join(source,name),path.join(output,name));
const out=path.join(__dirname,'.qa/editorial');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const report={date:new Date().toISOString(),viewports:[]};
 try{
  for(const width of [1440,390,768,375]){
   const context=await browser.newContext({viewport:{width,height:1000},isMobile:width<600,hasTouch:width<600});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   const response=await page.goto('http://localhost:4173/work/cafekok/',{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>{i.loading='eager';return i.decode()})));
   const metrics=await page.evaluate(()=>({
    sections:[...document.querySelectorAll('main>section')].map(e=>e.dataset.section),
    overflow:document.documentElement.scrollWidth>innerWidth,
    badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash),
    brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),
    font:document.fonts.check('16px Pretendard'),
    clipped:[...document.querySelectorAll('h2,h3,p,td,th')].filter(e=>{const s=getComputedStyle(e);return s.overflow==='hidden'&&e.scrollHeight>e.clientHeight+1}).map(e=>e.textContent),
    headings:[...document.querySelectorAll('h2')].map(e=>({text:e.textContent,size:getComputedStyle(e).fontSize}))
   }));
   assert.deepEqual(metrics.sections,['01','02','03','04','05','06','07','08','09','10']);assert.equal(metrics.overflow,false,width+' overflow');
   assert.deepEqual(metrics.badAnchors,[]);assert.deepEqual(metrics.brokenImages,[]);assert.deepEqual(metrics.clipped,[]);assert.equal(metrics.font,true);
   if([1440,390].includes(width)){
    await page.screenshot({path:path.join(out,width+'-cover.png')});
    for(const id of ['background','problem','users','strategy','structure','design','experience','validation','reflection']){
     await page.locator('#'+id).scrollIntoViewIfNeeded();
     await page.locator('#'+id).screenshot({path:path.join(out,width+'-'+id+'.png'),style:'.ck-chapters,.ck-reading-progress,.ck-skip{visibility:hidden!important}'});
    }
   }
   await page.goto('http://localhost:4173/work/cafekok/');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'ck-skip');
   await page.keyboard.press('Enter');assert((await page.locator('#background').boundingBox()).y>=60);
   await page.emulateMedia({reducedMotion:'reduce'});
   for(const id of ['users','strategy','experience','reflection']){
    if(width<600)await page.locator('.ck-chapters a[href="#'+id+'"]').tap();else await page.locator('.ck-chapters a[href="#'+id+'"]').click();
    await page.waitForTimeout(80);assert((await page.locator('#'+id).boundingBox()).y>=60,id+' obscured');
    assert.equal(await page.locator('.ck-chapters a[aria-current]').getAttribute('href'),'#'+id);
   }
   const summary=page.locator('summary').nth(1);await summary.focus();await page.keyboard.press('Enter');assert(await summary.evaluate(e=>e.parentElement.open));
   assert.equal(await summary.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');await page.keyboard.press('Enter');assert.equal(await summary.evaluate(e=>e.parentElement.open),false);
   for(const percent of [0,50,100]){await page.evaluate(p=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*p/100),percent);await page.waitForTimeout(80);assert.equal(await page.locator('.ck-reading-progress').getAttribute('aria-valuenow'),String(percent));}
   assert.equal(await page.locator('.ck-prototype-link').getAttribute('href'),null);
   assert.deepEqual(errors,[]);report.viewports.push({width,...metrics,errors,anchors:true,keyboard:true,touch:width<600,reducedMotion:true,progress:true});await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();
  await page.goto('http://localhost:4173/work/cafekok/');assert.equal(await page.locator('main>section').count(),10);await page.locator('.ck-chapters a[href="#users"]').click();assert.equal(new URL(page.url()).hash,'#users');
  await page.locator('summary').nth(2).click();assert(await page.locator('details').nth(2).evaluate(e=>e.open));report.noJavaScript=true;
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
