const {chromium}=require('C:/Users/SBS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.route('https://cdn.jsdelivr.net/**',r=>r.abort());
 await page.goto('http://127.0.0.1:4173/#qa',{waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(300);
 await page.evaluate(async()=>{const img=document.querySelector('.qa-card--diamond img');img.loading='eager';await img.decode();});
 await page.keyboard.press('Shift');
 await page.locator('.qa-card--diamond').focus();
 await page.waitForTimeout(600);
 console.log(await page.evaluate(()=>{const q=document.querySelector('#qa'),c=q.querySelector('.qa-card--diamond');return {scrollY,data:{...q.dataset},card:c.getBoundingClientRect().toJSON(),stageOpacity:getComputedStyle(q.querySelector('.qa-deck')).opacity,content:getComputedStyle(q).getPropertyValue('--section-content'),image:c.querySelector('img').naturalWidth};}));
 await page.screenshot({path:path.join(__dirname,'qa-card-flow','1440-diamond-page-final.png')});
 await page.locator('.qa-card--diamond').screenshot({path:path.join(__dirname,'qa-card-flow','1440-diamond-final.png')});
 for(const [width,height] of [[1280,700],[375,812]]){
  await page.setViewportSize({width,height});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(250);
  await page.locator('.qa-card--diamond').scrollIntoViewIfNeeded();
  console.log('diamond',width,await page.locator('.qa-card--diamond img').evaluate(img=>({width:img.offsetWidth,height:img.offsetHeight,fit:getComputedStyle(img).objectFit})));
  await page.locator('.qa-card--diamond').screenshot({path:path.join(__dirname,'qa-card-flow',width+'-diamond-final.png')});
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
