const {chromium} = require('C:/Users/SBS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async()=>{
 const out=path.join(__dirname,'.qa/project-links');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const report=[];
 try {
  for(const width of [1440,768,390,375]){
   const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<600,isMobile:width<600,reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const slug of ['cafekok','offer']){
    await page.goto('http://localhost:4173/#work');
    const card=page.locator('.project-'+slug);
    const expected='/work/'+slug+'/';
    assert.equal(await card.locator('.project-visual').getAttribute('href'),expected);
    assert.equal(await card.locator('.project-info a').getAttribute('href'),expected);
    await card.locator('.project-visual').click();
    await page.waitForURL('**'+expected);
    await page.locator('main h1').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,slug+' overflow '+width);
    if(slug==='cafekok'){
     await page.locator('#design').scrollIntoViewIfNeeded();
     await page.locator('.ck-brand-board img').evaluate(i=>i.decode());
     assert.equal(await page.locator('.ck-icon-grid li').count(),16);
     await page.locator('.ck-brand-system').screenshot({path:path.join(out,slug+'-'+width+'.png')});
     await page.locator('.ck-back').click();
    } else {
     await page.locator('.offer-card').first().waitFor();
     await page.screenshot({path:path.join(out,slug+'-'+width+'.png')});
     await page.locator('.header-nav a[href="explore.html"]').evaluate(a=>a.click());
     await page.waitForURL('**/work/offer/explore.html');
     await page.locator('.offer-card').first().waitFor();
     await page.locator('.card-title a').first().click();
     await page.waitForURL('**/work/offer/offer.html?id=*');
     await page.locator('.detail-save').waitFor();
     await page.locator('.detail-save').click();
     assert.equal(await page.locator('.detail-save').getAttribute('aria-pressed'),'true');
     await page.locator('.footer-links a[href="/#work"]').click();
    }
    await page.waitForURL('http://localhost:4173/#work');
    report.push({width,slug,navigation:'pass',overflow:false});
   }
   assert.deepEqual(errors,[]);await page.close();
  }
  const page=await browser.newPage();
  for(const slug of ['cafekok','offer']){
   const response=await page.request.get('http://localhost:4173/work/'+slug,{maxRedirects:0});
   assert.equal(response.status(),308);assert.equal(response.headers().location,'/work/'+slug+'/');
  }
  await page.goto('http://localhost:4173/work/cafekok/');
  await page.keyboard.press('Tab');await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash,'#background');
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({date:new Date().toISOString(),checks:report,keyboardSkip:'pass',redirects:'pass'},null,2));
  console.log(JSON.stringify(report));
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
