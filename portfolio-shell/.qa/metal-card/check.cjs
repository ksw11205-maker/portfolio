const {chromium}=require('C:/Users/SBS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
  await page.locator('.contact-card').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  await page.screenshot({path:'portfolio-shell/.qa/metal-card/'+width+'.png'});
  assert.equal(await page.locator('.contact-card').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}),true);
  const link=page.locator('.contact-card-link');
  assert((await link.getAttribute('href')).startsWith('mailto:'));
  await link.focus();
  assert.equal(await link.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.contact-card').evaluate(e=>getComputedStyle(e).transform),'none');
  assert.deepEqual(errors,[]);
  console.log(width+': layout, contact link, focus, reduced motion passed');
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
