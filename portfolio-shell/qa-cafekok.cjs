const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/SBS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = path.join(__dirname, '.qa/cafekok');
const base = 'http://localhost:4173';
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const report = {date: new Date().toISOString(), viewports:[], checks:[]};
  try {
    for (const width of [1440,1920,390,768,375]) {
      const context = await browser.newContext({viewport:{width,height:1000}, deviceScaleFactor:1, isMobile:width<600, hasTouch:width<600});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e=>errors.push(e.message));
      page.on('console', m=>{if(m.type()==='error') errors.push(m.text())});
      const response = await page.goto(base+'/work/cafekok/', {waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>{image.loading='eager';return image.decode()})));
      assert.equal(response.status(),200);
      const metrics = await page.evaluate(()=>({
        overflow: document.documentElement.scrollWidth>innerWidth,
        sections:[...document.querySelectorAll('main>section')].map(e=>e.dataset.section),
        brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
        font:document.fonts.check('16px Pretendard'),
        badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash),
        oversized:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&!e.matches('.ck-skip')}).map(e=>e.className)
      }));
      assert.equal(metrics.overflow,false, width+': horizontal overflow '+JSON.stringify(metrics.oversized));
      assert.deepEqual(metrics.sections,['01','02','03','04','05','06','07','08','09','10']);
      assert.deepEqual(metrics.brokenImages,[]);
      assert.deepEqual(metrics.badAnchors,[]);
      assert.equal(metrics.font,true);
      assert.deepEqual(errors,[]);
      const contrast = await page.evaluate(() => {
        const rgb = value => value.match(/[\d.]+/g).slice(0,3).map(Number);
        const luminance = c => c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
        let minimum=21;
        const failures=[];
        for(const el of document.querySelectorAll('body *')) {
          // Photo and gradient-backed hero text is reviewed in rendered screenshots.
          if(el.closest('.ck-hero-scene')) continue;
          if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()) || !el.getClientRects().length || ['SCRIPT','STYLE'].includes(el.tagName)) continue;
          const style=getComputedStyle(el);
          let ancestor=el, background='rgb(243, 240, 233)';
          while(ancestor) {const bg=getComputedStyle(ancestor).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent'){background=bg;break}ancestor=ancestor.parentElement}
          const a=luminance(rgb(style.color)),b=luminance(rgb(background));
          const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          minimum=Math.min(minimum,ratio);
          const large=parseFloat(style.fontSize)>=24||(parseFloat(style.fontSize)>=18.66&&Number(style.fontWeight)>=700);
          if(ratio<(large?3:4.5)) failures.push({text:el.textContent.trim().slice(0,50),ratio});
        }
        return {minimum:Number(minimum.toFixed(2)),failures,photoHero:'visually reviewed separately'};
      });
      assert.deepEqual(contrast.failures,[], 'Text contrast at '+width);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.className),'ck-skip');
      await page.keyboard.press('Enter');
      assert((await page.locator('#background').boundingBox()).y>=60);
      await page.locator('.ck-wordmark').click();
      await page.evaluate(()=>scrollTo(0,0));
      await page.waitForTimeout(60);
      assert.equal(await page.locator('.ck-reading-progress').getAttribute('aria-valuenow'),'0');
      await page.evaluate(()=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)/2));
      await page.waitForTimeout(60);
      assert.equal(await page.locator('.ck-reading-progress').getAttribute('aria-valuenow'),'50');
      await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
      await page.waitForTimeout(60);
      assert.equal(await page.locator('.ck-reading-progress').getAttribute('aria-valuenow'),'100');
      await page.evaluate(()=>scrollTo(0,0));
      await page.waitForTimeout(60);
      assert.equal(await page.locator('.ck-prototype-link').getAttribute('aria-disabled'),'true');
      assert.equal(await page.locator('.ck-prototype-link').getAttribute('href'),null);
      await page.screenshot({path:path.join(out,width+'-cover.png')});
      if([1440,390].includes(width)) {
        await page.screenshot({path:path.join(out,width+'-full.png'),fullPage:true});
        for(const [name, selector] of [['situations','.ck-situations'],['users','#users'],['structure','#structure'],['design','#design'],['quiz','.ck-screen-pair'],['recommendation','.ck-focus-layout'],['detail','.ck-detail-layout']]) {
          await page.locator(selector).scrollIntoViewIfNeeded();
          await page.screenshot({path:path.join(out,width+'-'+name+'.png')});
        }
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.locator('.ck-chapters a[href="#experience"]').click();
      await page.waitForTimeout(80);
      const anchor = await page.locator('#experience').evaluate(e=>e.getBoundingClientRect().top);
      assert(anchor>=60 && anchor<160, 'Anchor obscured at '+width+': '+anchor);
      const current = await page.locator('.ck-chapters a[aria-current="location"]').getAttribute('href');
      assert.equal(current,'#experience');
      const summary=page.locator('summary').nth(1);
      await summary.focus();
      await page.keyboard.press('Enter');
      assert(await summary.evaluate(e=>e.parentElement.open));
      const focus=await summary.evaluate(e=>({outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth}));
      assert.equal(focus.outline,'solid');
      await page.keyboard.press('Enter');
      assert.equal(await summary.evaluate(e=>e.parentElement.open),false);
      const reduced = await page.evaluate(()=>({behavior:getComputedStyle(document.documentElement).scrollBehavior,transition:getComputedStyle(document.querySelector('.ck-back')).transitionDuration}));
      assert.equal(reduced.behavior,'auto');
      assert.equal(reduced.transition,'0s');
      if(width<600) {
        await page.locator('.ck-chapters a[href="#reflection"]').tap();
        assert((await page.locator('#reflection').boundingBox()).y>=60);
      }
      report.viewports.push({width,height:1000,...metrics,errors,contrast,anchorTop:anchor,keyboardDetails:true,keyboardSkip:true,reducedMotion:true,touch:width<600,readingProgress:[0,50,100],prototype:'unavailable, no fake link'});
      await context.close();
    }
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const page=await nojs.newPage();
    await page.goto(base+'/work/cafekok/',{waitUntil:'networkidle'});
    assert.equal(await page.locator('main>section').count(),10);
    await page.locator('.ck-chapters a[href="#users"]').click();
    await page.waitForTimeout(400);
    assert(await page.locator('#users').isVisible());
    await page.locator('summary').nth(2).click();
    assert(await page.locator('details').nth(2).evaluate(e=>e.open));
    report.checks.push('JavaScript disabled: ten sections, native anchor, native details');
    await nojs.close();
    const home=await browser.newPage({viewport:{width:1440,height:1000}});
    await home.goto(base+'/',{waitUntil:'networkidle'});
    const cafe=home.locator('.project-cafekok');
    await cafe.scrollIntoViewIfNeeded();
    await home.waitForTimeout(800);
    assert.equal(await cafe.locator('img').evaluate(e=>e.naturalWidth>0),true);
    await cafe.screenshot({path:path.join(out,'main-cafekok.png')});
    await cafe.locator('.project-visual').click();
    await home.waitForURL('**/work/cafekok/');
    assert.equal(await home.locator('main>section').count(),10);
    await home.locator('.ck-back').click();
    await home.waitForURL('**/#work');
    assert.equal(await home.locator('.project').count(),4);
    report.checks.push('Main thumbnail image and case-study link; back link; four projects retained');
    for (const slug of ['lg','ivi','offer']) {
      const r=await home.goto(base+'/work/'+slug);
      assert.equal(r.status(),200);
      assert.equal(await home.locator('.placeholder h1').count(),1);
    }
    report.checks.push('Other existing project routes remain available');
    const r=await home.goto(base+'/work/cafekok');
    assert.equal(r.status(),200);
    assert.equal(new URL(home.url()).pathname,'/work/cafekok/');
    report.checks.push('Canonical route redirect');
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
