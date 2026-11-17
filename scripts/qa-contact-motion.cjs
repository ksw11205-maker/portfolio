// Isolated Chromium functional QA, localhost only. Never uses the user's profile.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..');
const out=path.join(root,'docs/design/qa-visual-20261115');
const report={testedAt:new Date().toISOString(),target:'http://localhost:4175/',browser:'Isolated headless Chromium',checks:[],consoleErrors:[],pageErrors:[],blockedExternal:[]};
const assert=(name,value,detail)=>{report.checks.push({name,passed:!!value,detail});if(!value)throw Error(name);};
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run']});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'no-preference'});
    await context.route('**/*',route=>{
      const url=route.request().url();
      if(url.startsWith('http://localhost:4175/')||url.startsWith('data:')||url.startsWith('blob:'))return route.continue();
      report.blockedExternal.push(url);return route.abort();
    });
    const page=await context.newPage();
    page.on('pageerror',error=>report.pageErrors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
    await page.goto(report.target,{waitUntil:'networkidle'});
    await page.waitForSelector('#contact .contact-atmosphere__field');
    await page.waitForTimeout(3000);
    const goContact=async()=>{
      await page.locator('.header a[data-nav="contact"]').click();
      await page.waitForFunction(()=>document.getElementById('contact').dataset.waveProgress==='1.0000',null,{timeout:10000});
      await page.waitForTimeout(550);
    };
    const snapshot=()=>page.evaluate(()=>{
      const el=document.getElementById('contact'),r=el.getBoundingClientRect();
      return {active:el.dataset.atmosphereActive,visible:r.bottom>0&&r.top<innerHeight,waveProgress:el.dataset.waveProgress,fields:[...el.querySelectorAll('.contact-atmosphere__field')].map(x=>({name:x.className,transform:getComputedStyle(x).transform,playState:getComputedStyle(x).animationPlayState,animation:getComputedStyle(x).animationName})),wave:!!el.querySelector('.contact-wave'),clip:!!el.querySelector('#contact-gradient-clip'),wavePaths:el.querySelectorAll('.contact-wave > path').length,card:!!el.querySelector('.contact-card'),backgroundClip:getComputedStyle(el.querySelector('.contact-background')).clipPath};
    });
    await goContact();
    await page.waitForFunction(()=>document.getElementById('contact').dataset.atmosphereActive==='true',{timeout:10000});
    const before=await snapshot();await page.waitForTimeout(1200);const after=await snapshot();
    assert('Five visible colour fields after completed wave',before.visible&&before.fields.length===5&&before.waveProgress==='1.0000',before);
    assert('All field transforms change over 1.2 seconds',before.fields.every((x,i)=>x.transform!==after.fields[i].transform),{before:before.fields,after:after.fields});
    assert('Original wave and metal card retained',after.wave&&after.clip&&after.wavePaths===3&&after.card,{wavePaths:after.wavePaths,clip:after.backgroundClip,card:after.card});
    await page.screenshot({path:path.join(out,'contact-motion-desktop.png')});

    // Use the owner's actual continuous-motion toggle, then return to Contact.
    await page.locator('.motion-toggle').click();
    await goContact();
    await page.waitForFunction(()=>document.body.classList.contains('motion-paused'));
    const pausedBefore=await snapshot();await page.waitForTimeout(1200);const pausedAfter=await snapshot();
    assert('Motion toggle freezes visible fields',pausedBefore.active==='false'&&pausedBefore.visible&&pausedBefore.fields.every((x,i)=>x.transform===pausedAfter.fields[i].transform&&x.playState==='paused'),{before:pausedBefore,after:pausedAfter});

    await page.locator('.motion-toggle').click();await goContact();
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(350);
    const reducedBefore=await snapshot();await page.waitForTimeout(1200);const reducedAfter=await snapshot();
    assert('Reduced motion freezes fields',reducedBefore.active==='false'&&reducedBefore.fields.every((x,i)=>x.transform===reducedAfter.fields[i].transform&&x.animation==='none'),{before:reducedBefore,after:reducedAfter});
    assert('No application JavaScript errors',report.pageErrors.length===0,report.pageErrors);
    report.passed=report.checks.every(x=>x.passed);
    await context.close();
  }catch(error){report.passed=false;report.failure=error.stack;process.exitCode=1;}
  finally{await browser.close();fs.writeFileSync(path.join(out,'contact-motion.json'),JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify({passed:report.passed,checks:report.checks.map(x=>({name:x.name,passed:x.passed})),pageErrors:report.pageErrors,failure:report.failure},null,2));
})();
