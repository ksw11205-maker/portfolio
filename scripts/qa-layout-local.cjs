const path=require('node:path');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.route('**/*',route=>new URL(route.request().url()).hostname==='localhost'||route.request().url().startsWith('data:')?route.continue():route.abort());
 for(const slug of ['ivi','cafekok','offer']){
  await page.goto('http://localhost:4175/work/'+slug+(slug==='offer'?'/case-study.html':'/'),{waitUntil:'networkidle'});
  console.log(JSON.stringify({slug,...await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0}).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right,text:e.textContent.slice(0,40),parents:[e.parentElement,e.parentElement?.parentElement].filter(Boolean).map(p=>({cls:p.className,width:p.clientWidth,scroll:p.scrollWidth,overflow:getComputedStyle(p).overflow,contain:getComputedStyle(p).contain}))})).slice(0,8)}))}));
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
