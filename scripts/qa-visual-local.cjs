// Isolated, headless local-app review. No user browser profile or external navigation.
const path=require('node:path'),fs=require('node:fs');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/design/qa-visual-20261115');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='localhost'||route.request().url().startsWith('data:')?route.continue():route.abort());
 const page=await context.newPage(),errors=[],report=[];page.on('pageerror',e=>errors.push(String(e)));
 const atTop=()=>page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0)});
 const view=async(selector,file)=>{await page.locator(selector).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(250);await page.evaluate(()=>Promise.all([...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).map(i=>i.decode().catch(()=>{}))));await page.screenshot({path:path.join(out,file)});};
 for(const [name,url] of [['home','/'],['lg','/work/lg/'],['ivi','/work/ivi/'],['cafekok','/work/cafekok/'],['offer','/work/offer/case-study.html']]){
  await page.goto('http://localhost:4175'+url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await atTop();
  await page.screenshot({path:path.join(out,name+'-desktop.png')});
  report.push(await page.evaluate(name=>({name,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,missingImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),heading:document.querySelector('h1')?.textContent.trim()}),name));
  if(name==='home'){await view('#about','profile-desktop.png');await page.locator('#about').screenshot({path:path.join(out,'profile-full.png')});await view('#contact','contact-desktop.png');}
  else{await view('.case-hero-copy',name+'-identity.png');}
  await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await atTop();
  await page.screenshot({path:path.join(out,name+'-mobile.png')});
  report.push(await page.evaluate(name=>({name:name+'-mobile',width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,heading:document.querySelector('h1')?.textContent.trim()}),name));
  if(name==='home'){await view('#about','profile-mobile.png');await page.locator('#about').screenshot({path:path.join(out,'profile-mobile-full.png')});}
  await page.setViewportSize({width:1440,height:1000});
 }
 await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({mode:'Isolated local Chromium, desktop and mobile, reduced motion',errors,pages:report},null,2));console.log(JSON.stringify({errors,pages:report}));
})().catch(e=>{console.error(e);process.exitCode=1;});
