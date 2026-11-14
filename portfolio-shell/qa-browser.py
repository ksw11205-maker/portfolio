#!/usr/bin/env python3
"""KSW local HTTP browser QA. Run: pip install playwright && python -m playwright install chromium && python qa-browser.py"""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
import asyncio, json, threading, os
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent / 'dist'
OUT = Path(__file__).resolve().parent / 'qa-browser-results'
PAGES = {'lg':'/work/lg/', 'ivi':'/work/ivi/', 'cafekok':'/work/cafekok/', 'offer':'/work/offer/case-study.html'}
WIDTHS = (1440, 1280, 768, 390)

async def main():
    OUT.mkdir(exist_ok=True)
    server = ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    results=[]
    try:
        async with async_playwright() as p:
            browser=await p.chromium.launch(headless=True, executable_path=os.environ.get("KSW_CHROMIUM") or None)
            for project,path in PAGES.items():
                for width in WIDTHS:
                    page=await browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
                    errors=[]
                    page.on('pageerror',lambda e: errors.append(str(e)))
                    entry={'project':project,'width':width,'url':base+path}
                    try:
                        response=await page.goto(base+path,wait_until='domcontentloaded',timeout=20000)
                        await page.locator('body').wait_for(timeout=10000)
                        await page.screenshot(path=str(OUT/f'{project}-{width}-cover.png'),full_page=False)
                        entry.update(await page.evaluate('''() => ({
                          overflow: document.documentElement.scrollWidth > innerWidth + 1,
                          documentWidth: document.documentElement.scrollWidth,
                          missingImages: [...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc),
                          coverCTA: document.querySelectorAll('.case-cover-action').length,
                          floatingCTA: document.querySelectorAll('.case-float-action').length,
                          topButton: document.querySelectorAll('.case-top').length,
                          coverHref: document.querySelector('.case-cover-action')?.href,
                          floatHref: document.querySelector('.case-float-action')?.href,
                          initialTopHidden: document.querySelector('.case-top')?.hidden,
                          initialFloatHidden: document.querySelector('.case-float-action')?.hidden
                        })'''))
                        entry['status']=response.status if response else None
                        entry['sameTarget']=entry['coverHref']==entry['floatHref']
                        await page.evaluate('window.scrollTo(0, Math.min(document.documentElement.scrollHeight - innerHeight, innerHeight*1.5))')
                        await page.wait_for_timeout(250)
                        entry['afterScroll']=await page.evaluate('''() => ({topHidden:document.querySelector('.case-top')?.hidden, floatHidden:document.querySelector('.case-float-action')?.hidden})''')
                        entry['errors']=errors
                    except Exception as exc:
                        entry['error']=str(exc)
                    results.append(entry)
                    await page.close()
            await browser.close()
    finally:
        server.shutdown()
    (OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    failures=[r for r in results if r.get('error') or r.get('status')!=200 or r.get('overflow') or r.get('missingImages') or r.get('coverCTA')!=1 or not r.get('sameTarget') or r.get('errors')]
    print(f'{len(results)} viewport checks; {len(failures)} flagged. See {OUT / "results.json"}')
    for r in failures:print(r['project'],r['width'],r.get('error') or {k:r.get(k) for k in ('status','overflow','missingImages','coverCTA','sameTarget','errors')})
    return bool(failures)

if __name__=='__main__':
    raise SystemExit(asyncio.run(main()))
