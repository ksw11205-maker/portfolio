const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.CAFEKOK_PLAYWRIGHT || 'playwright');

const origin = process.env.CAFEKOK_ORIGIN || 'http://127.0.0.1:4173';
const route = '/work/cafekok/prototype/';
const assets = path.resolve(__dirname, '../../dist/work/cafekok/assets/prototype-captures');
const viewport = { width: 390, height: 844 };
const manifest = {};
const captureStyle = '* { scrollbar-width: none !important; }';
const samplesOnly = process.argv.includes('--samples-only');
const isolateSample = `
  html, body { background: transparent !important; }
  body, body * { visibility: hidden !important; }
  [data-capture-sample], [data-capture-sample] * { visibility: visible !important; }
`;

async function main() {
  await fs.mkdir(assets, { recursive: true });
  const browser = await chromium.launch({
    ...(process.env.CAFEKOK_CHROMIUM ? { executablePath: process.env.CAFEKOK_CHROMIUM } : {}),
  });
  try {
    const page = await browser.newPage({
      viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
    });
    if (process.env.CAFEKOK_PHOTO_CACHE) {
      // Replay the exact CDN files requested by the prototype when Chromium lacks network access.
      await page.route('https://images.unsplash.com/**', async route => {
        const file = path.basename(new URL(route.request().url()).pathname) + '.jpg';
        await route.fulfill({ path: path.join(process.env.CAFEKOK_PHOTO_CACHE, file), contentType: 'image/jpeg' });
      });
    }
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + route);
    const button = (name, parent = page) => parent.getByRole('button', { name, exact: typeof name === 'string' });
    const nav = name => button(name, page.locator('.bottom-nav'));

    async function ready() {
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const image of document.images) image.loading = 'eager';
      });
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.getByText('사진을 불러오지 못했어요', { exact: true }).count(), 0, 'Cafe photo unavailable');
    }

    async function save(name, target, anchors = {}) {
      const sample = name.startsWith('component-') || name === 'explore-filter-panel';
      if (samplesOnly && !sample) return;
      await ready();
      const hideNavigation = target && name !== 'component-navigation';
      const options = {
        path: path.join(assets, name + '.png'),
        animations: 'disabled',
        style: captureStyle + (hideNavigation ? '.bottom-nav { visibility: hidden !important; }' : ''),
      };
      if (sample) {
        await target.evaluate(el => el.setAttribute('data-capture-sample', ''));
        options.style += isolateSample;
        options.omitBackground = true;
      }
      let image;
      try {
        image = target ? await target.screenshot(options) : await page.screenshot(options);
      } finally {
        if (sample) await target.evaluate(el => el.removeAttribute('data-capture-sample'));
      }
      manifest[name] = {
        width: image.readUInt32BE(16), height: image.readUInt32BE(20),
        ...(Object.keys(anchors).length && {
          anchors: await page.evaluate(selectors => Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
            const rect = document.querySelector(selector).getBoundingClientRect();
            return [key, { left: Math.round(rect.left), right: Math.round(rect.right), top: Math.round(rect.top), height: Math.round(rect.height) }];
          })), anchors),
        }),
      };
    }

    async function long(name, anchors, hideNav = true) {
      if (samplesOnly) return;
      await ready();
      await page.evaluate(() => scrollTo(0, 0));
      const geometry = await page.evaluate(selectors => ({
        pageHeight: document.scrollingElement.scrollHeight,
        anchors: Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
          const rect = document.querySelector(selector).getBoundingClientRect();
          return [key, { left: Math.round(rect.left), right: Math.round(rect.right), top: Math.round(rect.top + scrollY), height: Math.round(rect.height) }];
        })),
      }), anchors);
      const image = await page.screenshot({
        fullPage: true, animations: 'disabled', path: path.join(assets, name + '.png'),
        style: captureStyle + (hideNav ? '.bottom-nav { visibility: hidden !important; }' : ''),
      });
      manifest[name] = { width: image.readUInt32BE(16), height: image.readUInt32BE(20), ...geometry };
    }

    await button('내 취향으로 시작하기').waitFor();
    await save('onboarding-start', null, { start: '.onboard-action button' });
    await save('component-logo', page.locator('.onboard-logo .cafekok-logo'));
    await save('component-primary', button('내 취향으로 시작하기'));
    await button('내 취향으로 시작하기').click();
    await page.locator('.choice-option').first().click();
    await save('onboarding-quiz', null, { choice: '.choice-option[aria-pressed="true"]' });
    await save('component-quiz-choice', page.locator('.choice-option[aria-pressed="true"]'));
    await save('flow-preferences');
    for (let step = 0; step < 6; step++) {
      if (step > 0) await (step >= 4 ? page.locator('.choice-option').last() : page.locator('.choice-option').first()).click();
      if (step === 1) await save('component-secondary', button('이전'));
      await button(step === 5 ? '내 취향 보기' : '다음').click();
    }
    await save('my-taste', null, { board: '.profile-summary', edit: '.taste-field span[aria-hidden]' });
    await page.locator('.taste-field').first().click();
    await save('my-taste-edit', null, { modal: '.modal-panel' });
    await save('component-taste-modal', page.getByRole('dialog'));
    await page.keyboard.press('Escape');
    await nav('홈').click();
    await page.evaluate(() => scrollTo(0, 0));
    await save('flow-purpose');
    await button(/공부·작업/, page.locator('.purpose-section')).click();
    await page.evaluate(() => scrollTo(0, 0));
    await save('home-viewport');
    await long('home-full', {
      purpose: '.purpose-option', recommendation: '.picks-section .cafe-card',
      contrast: '.discoveries-section', popularity: '.community-button',
    });
    await save('component-purpose', page.locator('.purpose-option[aria-pressed="true"]'));
    await save('component-recommendation', page.locator('.picks-section .cafe-card').first());
    await save('component-match', page.locator('.picks-section .match-badge').first());
    await page.locator('.picks-section').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 35));
    await save('flow-recommendation');
    await save('home-contrast', page.locator('.discoveries-section'));
    await save('component-popular', button('인기순'));
    await save('component-navigation', page.locator('.bottom-nav'));
    await nav('저장').click();
    await save('saved-empty');
    await nav('탐색').click();
    const filter = button('카페 필터');
    const mapButton = button('지도');
    await page.evaluate(() => scrollTo(0, 0));
    await save('explore-viewport');
    await long('explore-full', {
      search: '.search-field', filter: '[aria-label="카페 필터"]', map: '.explore-control-actions button', list: '.explore-screen .cafe-card',
    });
    await save('component-search', page.locator('.search-field'));
    await filter.click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('.filter-chips button').first().click();
    await save('explore-filter');
    await save('explore-filter-panel', dialog);
    await save('component-filter-selected', dialog.locator('.filter-chips button[aria-pressed="true"]'));
    await save('component-filter-idle', dialog.locator('.filter-chips button[aria-pressed="false"]').first());
    await button('추가 필터 초기화', dialog).click();
    await button('필터 닫기').click();
    await mapButton.click();
    await page.locator('.explore-screen .sample-map-image').waitFor();
    await page.evaluate(() => scrollTo(0, 0));
    await save('explore-map');
    await long('explore-map-full', { map: '.explore-screen .sample-map', results: '.map-results' });
    await button('목록').click();
    await nav('내 취향').click();
    for (const [index, choice] of [[0, '적당히 활기찬'], [1, '균형 있는'], [2, '둘이 앉는 자리']]) {
      await page.locator('.taste-field').nth(index).click();
      await button(new RegExp(choice), page.getByRole('dialog')).click();
    }
    await nav('탐색').click();
    await button('데이트', page.locator('.purpose-strip')).click();
    const search = page.getByRole('textbox', { name: '카페 이름 검색' });
    await search.fill('모서리 서재');
    await button('모서리 서재 상세 보기').click();
    await page.locator('.detail-screen').waitFor();
    assert.equal(await page.locator('.detail-screen h1').innerText(), '모서리 서재');
    assert.ok(await page.locator('.detail-reason .detail-tags span').count() > 0);
    await long('detail-full', {
      reason: '.detail-reason', interior: '.detail-interior-photo',
      menu: '.detail-menu-list', location: '.detail-map',
    });
    await save('detail-reason', page.locator('.detail-reason'));
    await save('detail-interior', page.locator('.detail-interior-photo'));
    await save('detail-menu', page.locator('.detail-menu-section'));
    await save('detail-map', page.locator('.detail-map'));
    await button('뒤로 가기').click();
    await button('검색어 지우기').count().then(async count => { if (count) await button('검색어 지우기').click(); });
    const bookmarks = page.locator('.explore-screen .save-button');
    assert.ok(await bookmarks.count() >= 4);
    await save('component-bookmark-idle', bookmarks.first());
    for (let index = 0; index < 4; index++) {
      await bookmarks.nth(index).click();
      assert.equal(await bookmarks.nth(index).getAttribute('aria-pressed'), 'true');
    }
    await page.getByRole('status').filter({ hasText: /저장/ }).first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await save('component-bookmark-saved', bookmarks.first());
    await nav('저장').click();
    assert.equal(await page.locator('.saved-screen .cafe-card').count(), 4);
    await save('saved-four');
    await long('saved-four-full', {
      list: '.saved-screen .cafe-card',
      bookmark: '.saved-screen .cafe-card:nth-child(2) .save-button',
    });
    assert.deepEqual(errors, []);
    const manifestPath = path.join(assets, 'manifest.json');
    const previous = samplesOnly ? JSON.parse(await fs.readFile(manifestPath, 'utf8')).assets : {};
    await fs.writeFile(manifestPath, JSON.stringify({ route, viewport, deviceScaleFactor: 2, assets: { ...previous, ...manifest } }, null, 2) + '\n');
    console.log(Object.keys(manifest).length + ' captures');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
