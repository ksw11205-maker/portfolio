#!/usr/bin/env python3
"""Read-only KSW offline integrity audit; requires beautifulsoup4."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from bs4 import BeautifulSoup
import json, re
ROOT = Path(__file__).resolve().parent / 'dist'
PAGES = {'LG':'work/lg/index.html','IVI':'work/ivi/index.html','CAFEKOK':'work/cafekok/index.html','OFFER':'work/offer/case-study.html'}

def local_target(source, raw):
    url = urlsplit(raw)
    if url.scheme or url.netloc or raw.startswith(('data:', '#', '//')):
        return None
    path = unquote(url.path)
    if not path: return None
    return (ROOT / path.lstrip('/')) if path.startswith('/') else (source.parent / path)

def check_css(path, issues, seen):
    path = path.resolve()
    if path in seen or not path.is_file(): return
    seen.add(path)
    css = path.read_text(encoding='utf-8', errors='replace')
    for match in re.finditer(r'url\(\s*[\'\"]?([^\)\'\"]+)', css):
        raw = match.group(1).strip()
        target = local_target(path, raw)
        if target is not None and not target.exists():
            issues.append({'type':'missing_css_asset','file':str(path.relative_to(ROOT)),'path':raw})
    for match in re.finditer(r'@import\s+(?:url\()?\s*[\'\"]([^\'\"]+)', css):
        target = local_target(path, match.group(1))
        if target is not None:
            if not target.exists():issues.append({'type':'missing_css_import','path':match.group(1)})
            elif target.suffix == '.css':check_css(target, issues, seen)

results=[]
for project, relative in PAGES.items():
    file = ROOT / relative
    soup = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
    issues=[]; seen=set()
    for tag, attr in [('img','src'),('script','src'),('link','href'),('source','src')]:
        for el in soup.select(f'{tag}[{attr}]'):
            raw=el.get(attr,''); target=local_target(file,raw)
            if target is not None and not target.exists():
                issues.append({'type':'missing_asset','tag':tag,'path':raw})
            if tag=='link' and el.get('rel') and 'stylesheet' in el.get('rel') and target is not None and target.exists():
                check_css(target,issues,seen)
    for el in soup.select('[srcset]'):
        for candidate in el.get('srcset','').split(','):
            raw=candidate.strip().split(' ')[0]
            target=local_target(file,raw)
            if target is not None and not target.exists():issues.append({'type':'missing_srcset_asset','path':raw})
    for a in soup.select('a[href]'):
        raw=a['href']; url=urlsplit(raw)
        if raw.startswith('#') or (not url.path and url.fragment):
            fragment=unquote(url.fragment)
            if fragment and soup.find(id=fragment) is None:
                issues.append({'type':'missing_inpage_anchor','href':raw})
        elif not url.scheme and not url.netloc:
            target=local_target(file,raw)
            if target is not None:
                if target.is_dir():target=target/'index.html'
                if not target.exists():issues.append({'type':'missing_local_link','href':raw})
        if a.get('target')=='_blank' and 'noopener' not in a.get('rel',[]):
            issues.append({'type':'new_tab_missing_noopener','href':raw})
    cover=soup.select('.case-cover-action'); floating=soup.select('.case-float-action')
    if len(cover)!=1:issues.append({'type':'cover_cta_count','count':len(cover)})
    if len(floating)!=1:issues.append({'type':'floating_cta_count','count':len(floating)})
    if cover and floating and cover[0].get('href')!=floating[0].get('href'):issues.append({'type':'cta_url_mismatch'})
    if len(soup.select('h1'))!=1:issues.append({'type':'h1_count','count':len(soup.select('h1'))})
    for img in soup.select('img:not([alt])'):issues.append({'type':'image_missing_alt','src':img.get('src')})
    results.append({'project':project,'file':relative,'images':len(soup.select('img')),'css_files_checked':len(seen),'issues':issues})
out=Path(__file__).resolve().parent/'qa-static-results.json'
out.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))
