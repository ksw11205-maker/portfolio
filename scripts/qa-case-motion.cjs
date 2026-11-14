/* Local-only browser checks for finite case-study motion and research controls. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const origin = 'http://localhost:4175';
const reportPath = path.resolve(__dirname, '../docs/design/qa-visual-20261115/case-motion.json');
const onlyMobile = process.argv.includes('--mobile-only');
const report = onlyMobile
  ? JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  : { checkedAt: new Date().toISOString(), origin, viewport: { width: 1440, height: 700 }, pages: [], errors: [] };
const projects = ['lg', 'ivi', 'cafekok', 'offer'];
const targetSelector = '.case-type,.case-title,.case-hero-description,.case-meta,.prototype-link,.case-heading,.research-ui-region,.ui-focus';

async function localContext(browser, reducedMotion = 'no-preference', options = {}) {
  const context = await browser.newContext({ viewport: report.viewport, reducedMotion, ...options });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === origin || url.protocol === 'data:') return route.continue();
    return route.abort('blockedbyclient');
  });
  await context.addInitScript(() => {
    window.caseMotionCalls = [];
    const nativeAnimate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      window.caseMotionCalls.push({ className: this.className, at: performance.now(), options });
      return nativeAnimate.call(this, frames, options);
    };
  });
  return context;
}

async function ready(page, project) {
  page.on('pageerror', error => report.errors.push({ project, message: error.message }));
  const suffix = project === 'offer' ? 'case-study.html' : '';
  const response = await page.goto(`${origin}/work/${project}/${suffix}`, { waitUntil: 'load' });
  assert.equal(response.status(), 200, `${project} HTTP status`);
  await page.waitForFunction(() => document.body.dataset.caseMotionReady === 'true');
  assert.equal(new URL(page.url()).origin, origin);
}

async function enter(locator) {
  await locator.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
}

async function chartCheck(page) {
  const chart = page.locator('[data-time-chart]');
  await enter(chart);
  await page.waitForFunction(() => [...document.querySelectorAll('.time-track > span')].some(bar => bar.getAnimations().length));
  const activeOnEntry = await chart.evaluate(element => [...element.querySelectorAll('.time-track > span')].reduce((sum, bar) => sum + bar.getAnimations().length, 0));
  await page.locator('[data-research-task="menu"]').click();
  const menu = await page.evaluate(() => ({
    value: document.querySelector('[data-result-value]').textContent,
    pressed: document.querySelector('[data-research-task="menu"]').getAttribute('aria-pressed'),
    values: [...document.querySelectorAll('[data-time-value]')].map(element => element.textContent),
    widths: [...document.querySelectorAll('.time-track > span')].map(element => Number.parseFloat(element.style.getPropertyValue('--value'))),
    activeTransforms: [...document.querySelectorAll('.time-track > span')].flatMap(element => element.getAnimations()).filter(animation => animation.effect.getKeyframes().some(frame => frame.transform)).length,
    announcement: document.querySelector('[data-result-announcement]').textContent
  }));
  assert.equal(menu.value, '19.49');
  assert.equal(menu.pressed, 'true');
  assert.deepEqual(menu.values.map(value => Number.parseFloat(value)), [22.15, 24.74, 28.71, 19.49]);
  menu.widths.forEach((width, index) => assert.ok(Math.abs(width - [22.15, 24.74, 28.71, 19.49][index] / 30 * 100) < .001));
  assert.equal(menu.activeTransforms, 0, 'Chart entry transform cancels on selection');
  assert.ok(menu.announcement.includes('19.49'));
  await page.locator('[data-research-task="phone"]').click();
  assert.equal(await page.locator('[data-result-value]').textContent(), '13.87');
  return { activeOnEntry, menu, phoneValue: '13.87' };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    if (!onlyMobile) {
    const normal = await localContext(browser);
    for (const project of projects) {
      const page = await normal.newPage();
      await ready(page, project);
      const copy = page.locator('.case-hero-copy');
      const heroBeforeEntry = await copy.evaluate(element => ({ top: element.getBoundingClientRect().top, viewport: innerHeight, animations: element.getAnimations({ subtree: true }).length }));
      assert.ok(heroBeforeEntry.top >= heroBeforeEntry.viewport, `${project} text starts below cover`);
      assert.equal(heroBeforeEntry.animations, 0, `${project} text does not animate while offscreen`);
      await enter(copy);
      await page.waitForFunction(() => document.querySelector('.case-title').getAnimations().length > 0);
      const heroActive = await copy.evaluate(element => element.getAnimations({ subtree: true }).length);
      assert.ok(heroActive >= 4);
      await page.waitForFunction(() => document.querySelector('.case-hero-copy').getAnimations({ subtree: true }).length === 0, null, { timeout: 5000 });
      const heroFinished = await copy.evaluate(element => ({ active: element.getAnimations({ subtree: true }).length, opacity: getComputedStyle(element.querySelector('.case-title')).opacity }));
      assert.equal(heroFinished.active, 0);
      assert.equal(heroFinished.opacity, '1');
      const figure = page.locator('figure').filter({ has: page.locator('.research-ui-stage,.ui-annotated') }).filter({ has: page.locator('.research-ui-notes,.screen-notes') }).first();
      const stage = figure.locator('.research-ui-stage,.ui-annotated').first();
      const region = stage.locator('.research-ui-region,.ui-focus').first();
      await enter(stage);
      await page.waitForFunction(() => window.caseMotionCalls.some(call => /research-ui-region|ui-focus/.test(call.className)));
      const regionTransform = await region.evaluate(element => getComputedStyle(element).transform);
      assert.equal(regionTransform, 'none', 'Annotation does not move relative to screenshot');
      const note = figure.locator('.research-ui-notes > :first-child,.screen-notes > :first-child');
      await note.hover();
      assert.equal(await region.evaluate(element => element.classList.contains('is-note-focused')), true);
      await page.mouse.move(1, 1);
      assert.equal(await region.evaluate(element => element.classList.contains('is-note-focused')), false);
      const item = { project, heroBeforeEntry, heroActive, heroFinished, annotation: { entryObserved: true, regionTransform, pointerHighlight: true, pointerLeaveClears: true } };
      if (project === 'ivi') item.research = await chartCheck(page);
      const introCalls = await page.evaluate(() => window.caseMotionCalls.filter(call => /case-title/.test(call.className)).length);
      await enter(copy);
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(() => window.caseMotionCalls.filter(call => /case-title/.test(call.className)).length), introCalls, 'Hero animation runs once');
      item.heroRunsOnce = true;
      report.pages.push(item);
      await page.close();
    }
    await normal.close();
    const reduced = await localContext(browser, 'reduce');
    for (const project of projects) {
      const page = await reduced.newPage();
      await ready(page, project);
      await enter(page.locator('.case-hero-copy'));
      await enter(page.locator('.research-ui-stage,.ui-annotated').first());
      await page.waitForTimeout(100);
      const state = await page.evaluate(selector => ({
        enhanced: document.body.classList.contains('case-motion-enhanced'),
        animateCalls: window.caseMotionCalls.length,
        targetAnimations: [...document.querySelectorAll(selector)].flatMap(element => element.getAnimations()).length,
        titleOpacity: getComputedStyle(document.querySelector('.case-title')).opacity
      }), targetSelector);
      assert.equal(state.enhanced, false);
      assert.equal(state.animateCalls, 0);
      assert.equal(state.targetAnimations, 0);
      assert.equal(state.titleOpacity, '1');
      if (project === 'ivi') {
        await page.locator('[data-research-task="menu"]').click();
        assert.equal(await page.locator('[data-result-value]').textContent(), '19.49');
        state.researchMenuStillWorks = true;
      }
      report.pages.find(item => item.project === project).reducedMotion = state;
      await page.close();
    }
    await reduced.close();
    }
    const mobile = await localContext(browser, 'reduce', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const mobilePage = await mobile.newPage();
    await ready(mobilePage, 'ivi');
    const documentFits = async () => mobilePage.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
    const closed = await documentFits();
    assert.ok(closed.width <= closed.viewport + 1, 'Closed archives do not overflow mobile document');
    const summaryTable = mobilePage.locator('.result-table-wrap .table-scroll');
    const tableMetrics = await summaryTable.evaluate(element => {
      element.scrollLeft = element.scrollWidth - element.clientWidth;
      return { width: element.clientWidth, content: element.scrollWidth, scrollLeft: element.scrollLeft, height: element.clientHeight };
    });
    assert.ok(tableMetrics.content > tableMetrics.width, 'Research table keeps its horizontal content');
    assert.ok(tableMetrics.scrollLeft > 0, 'Research table can scroll horizontally');
    assert.ok(tableMetrics.height > 80, 'Research table remains visible');
    await mobilePage.locator('.subjective-data > summary').click();
    assert.equal(await mobilePage.locator('.subjective-data').getAttribute('open'), '');
    const open = await documentFits();
    assert.ok(open.width <= open.viewport + 1, 'Open subjective archive does not overflow mobile document');
    const archiveTables = await mobilePage.locator('.subjective-data .table-scroll').evaluateAll(elements => elements.map(element => {
      element.scrollLeft = element.scrollWidth - element.clientWidth;
      return { width: element.clientWidth, content: element.scrollWidth, scrollLeft: element.scrollLeft, height: element.clientHeight };
    }));
    assert.ok(archiveTables.length >= 2);
    archiveTables.forEach(table => {
      assert.ok(table.content > table.width);
      assert.ok(table.scrollLeft > 0);
      assert.ok(table.height > 80);
    });
    report.mobileIVI = { checkedAt: new Date().toISOString(), viewport: { width: 390, height: 844 }, closed, open, tableMetrics, archiveTables, passed: true };
    await mobile.close();
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack;
    process.exitCode = 1;
  } finally {
    await browser.close();
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: report.passed, pages: report.pages.length, reportPath, failure: report.failure, errors: report.errors }, null, 2));
  }
})();
