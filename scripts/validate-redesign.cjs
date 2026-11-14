/* Static checks only: never launches the website, server, prototype or browser. */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'redesign');
const REPORT = path.join(ROOT, 'docs/design/redesign-static-check-20261115.json');
const PORTFOLIO_PAGES = new Set(['index.html', 'work/lg/index.html', 'work/ivi/index.html', 'work/cafekok/index.html', 'work/offer/case-study.html']);
const issues = [];
const externals = [];
const ctaChecks = [];
const checkedReferences = new Set();
const counts = { portfolioHtml: 0, prototypeHtml: 0, css: 0, svg: 0, jsSyntax: 0, inlineJsSyntax: 0, localReferences: 0, anchors: 0 };
const slash = p => p.split(path.sep).join('/');
const rel = p => slash(path.relative(SITE, p));
const line = (text, index) => text.slice(0, index).split('\n').length;
const decode = value => value.replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const scope = file => {
  const p = rel(file);
  if (PORTFOLIO_PAGES.has(p) || /^(?:scripts|styles|assets|vendor)\//.test(p)) return 'portfolio';
  if (/^work\/[^/]+\/assets\//.test(p) || /^work\/offer\/case-study-assets\//.test(p)) return 'original-assets';
  return 'prototype';
};
function issue(file, code, detail, index = 0, source = '') {
  const area = scope(file);
  issues.push({ severity: area === 'portfolio' ? 'error' : 'source-note', scope: area, file: rel(file), line: source ? line(source, index) : undefined, code, detail });
}
function walk(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const full = path.join(folder, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function read(file) {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(file)); }
  catch (error) { issue(file, 'invalid-utf8', error.message); return fs.readFileSync(file, 'utf8'); }
}
function attrs(raw) {
  const result = {};
  for (const m of raw.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) result[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return result;
}
function tags(source) {
  const cleaned = source.replace(/<!--[\s\S]*?-->/g, match => ' '.repeat(match.length)).replace(/(<script\b[^>]*>)[\s\S]*?(<\/script\s*>)/gi, (match, a, b) => a + ' '.repeat(match.length - a.length - b.length) + b).replace(/(<style\b[^>]*>)[\s\S]*?(<\/style\s*>)/gi, (match, a, b) => a + ' '.repeat(match.length - a.length - b.length) + b);
  return [...cleaned.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(m => ({ name: m[1].toLowerCase(), attrs: attrs(m[2]), index: m.index, raw: m[0] }));
}
const files = walk(SITE);
const documents = new Map();
for (const file of files.filter(file => /\.html?$/i.test(file))) {
  const text = read(file);
  const nodes = tags(text);
  const ids = new Map();
  for (const node of nodes) if (node.attrs.id) {
    if (ids.has(node.attrs.id)) issue(file, 'duplicate-id', `Duplicate id "${node.attrs.id}"; first occurrence line ${line(text, ids.get(node.attrs.id))}.`, node.index, text);
    else ids.set(node.attrs.id, node.index);
  }
  documents.set(file, { text, nodes, ids });
}
function localTarget(file, reference) {
  const url = new URL(decode(reference), 'https://portfolio.local/' + rel(file));
  if (url.hostname !== 'portfolio.local') return { external: url.href };
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { pathname = url.pathname; }
  let target = path.resolve(SITE, '.' + pathname.replaceAll('/', path.sep));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  return { target, hash: url.hash ? decodeURIComponent(url.hash.slice(1)) : '', href: url.href };
}
function checkRef(file, value, context, index = 0, source = '', checkHash = true) {
  value = decode(value).trim();
  if (!value || /^(?:data:|blob:|mailto:|tel:|javascript:|about:)/i.test(value) || /\$\{|{{|<%/.test(value)) return;
  const key = [file, value, context, checkHash].join('\0');
  if (checkedReferences.has(key)) return;
  checkedReferences.add(key);
  let resolved;
  try { resolved = localTarget(file, value); }
  catch (error) { issue(file, 'invalid-url', `${context}: ${value} (${error.message})`, index, source); return; }
  if (resolved.external) {
    externals.push({ scope: scope(file), file: rel(file), context, url: resolved.external, verification: 'Not fetched; external dependency reported separately.' });
    return;
  }
  counts.localReferences++;
  if (!resolved.target.startsWith(SITE + path.sep) && resolved.target !== SITE) { issue(file, 'outside-site', `${context}: ${value}`, index, source); return; }
  if (!fs.existsSync(resolved.target) || !fs.statSync(resolved.target).isFile()) { issue(file, 'missing-local-reference', `${context}: ${value} → ${rel(resolved.target)}`, index, source); return; }
  if (checkHash && resolved.hash && documents.has(resolved.target)) {
    counts.anchors++;
    if (!documents.get(resolved.target).ids.has(resolved.hash)) issue(file, 'missing-anchor', `${context}: ${value} has no id "${resolved.hash}" in ${rel(resolved.target)}.`, index, source);
  }
}
function cssRefs(file, text, context = 'CSS', offset = 0, source = text) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length));
  for (const m of clean.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) checkRef(file, m[1] ?? m[2] ?? m[3], context + ' url()', offset + m.index, source, false);
  for (const m of clean.matchAll(/@import\s+["']([^"']+)["']/gi)) checkRef(file, m[1], context + ' @import', offset + m.index, source, false);
}
function textIntegrity(file, text) {
  if (text.includes('\uFFFD')) issue(file, 'replacement-character', 'Contains Unicode replacement character U+FFFD.', text.indexOf('\uFFFD'), text);
  const visible = text.replace(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '').replace(/<[^>]*>/g, ' ');
  for (const pattern of [/\bLorem\s+ipsum\b/i, /\b(?:TODO|FIXME|TBD|PLACEHOLDER)\b/i, /(?:추후\s*(?:추가|입력|작성)|임시\s*(?:문구|텍스트|이미지)|(?:내용|텍스트|제목)을\s*입력|여기에\s*(?:텍스트|내용))/i, /(?:example\.com|yourname@|\?\?\?)/i, /(?:占쏙옙|ì‚¬|ìš©|í•˜|ë‹¤|Ã©|â€™|â€”)/]) {
    const m = visible.match(pattern);
    if (m) issue(file, 'placeholder-or-mojibake', `Review visible text: ${m[0]}`, text.indexOf(m[0]), text);
  }
}
function syntax(file, code, module, inline = false) {
  const args = module ? ['--input-type=module', '--check'] : ['--check'];
  const result = spawnSync(process.execPath, args, { input: code, encoding: 'utf8', maxBuffer: 1024 * 1024 });
  if (result.status !== 0) issue(file, 'javascript-syntax', (inline ? 'Inline script: ' : '') + (result.stderr || result.error?.message || 'Syntax check failed').trim());
  if (inline) counts.inlineJsSyntax++; else counts.jsSyntax++;
}
function jsRefs(file, text) {
  const patterns = [/\bimport\s*(?:[^;'"()]*?\bfrom\s*)?["']([^"']+)["']/g, /\bexport\s*(?:\*|\{[^}]*\})\s*from\s*["']([^"']+)["']/g, /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g];
  for (const pattern of patterns) for (const m of text.matchAll(pattern)) {
    if (/^(?:[./]|https?:|\/\/)/.test(m[1])) checkRef(file, m[1], 'JavaScript module import', m.index, text, false);
    else issue(file, 'bare-module-import', `Bare module "${m[1]}" requires an import map or bundler.`, m.index, text);
  }
  for (const m of text.matchAll(/new\s+URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url/g)) checkRef(file, m[1], 'new URL() asset', m.index, text, false);
}
for (const [file, doc] of documents) {
  if (PORTFOLIO_PAGES.has(rel(file))) counts.portfolioHtml++; else counts.prototypeHtml++;
  textIntegrity(file, doc.text);
  for (const node of doc.nodes) {
    for (const attribute of ['src', 'href', 'xlink:href', 'poster']) if (node.attrs[attribute] !== undefined) checkRef(file, node.attrs[attribute], `${node.name}[${attribute}]`, node.index, doc.text, attribute === 'href' || attribute === 'xlink:href');
    if (node.attrs.srcset && !node.attrs.srcset.startsWith('data:')) for (const item of node.attrs.srcset.split(',')) checkRef(file, item.trim().split(/\s+/)[0], `${node.name}[srcset]`, node.index, doc.text, false);
    if (node.attrs.style) cssRefs(file, node.attrs.style, 'Inline style', node.index, doc.text);
    for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls']) if (node.attrs[attribute]) for (const id of node.attrs[attribute].split(/\s+/)) if (!doc.ids.has(id)) issue(file, 'missing-aria-target', `${attribute} points to absent id "${id}".`, node.index, doc.text);
    if (node.name === 'img' && node.attrs.alt === undefined) issue(file, 'missing-image-alt', 'Image has no alt attribute.', node.index, doc.text);
  }
  for (const m of doc.text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) cssRefs(file, m[1], 'Embedded CSS', m.index, doc.text);
  for (const m of doc.text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const a = attrs(m[1]);
    if (a.src || !m[2].trim()) continue;
    if (/^(?:application\/ld\+json|application\/json|importmap)$/i.test(a.type || '')) {
      try { JSON.parse(m[2]); } catch (error) { issue(file, 'inline-json-syntax', error.message, m.index, doc.text); }
    } else { syntax(file, m[2], a.type === 'module', true); jsRefs(file, m[2]); }
  }
  if (PORTFOLIO_PAGES.has(rel(file)) && /\bdata-page=["']case["']/.test(doc.text)) {
    const covers = doc.nodes.filter(node => node.name === 'a' && Object.hasOwn(node.attrs, 'data-prototype-cover'));
    const floats = doc.nodes.filter(node => node.name === 'a' && Object.hasOwn(node.attrs, 'data-prototype-float'));
    const result = { file: rel(file), coverCount: covers.length, floatCount: floats.length, sameDestination: false, floatingInitiallyHidden: false };
    if (covers.length !== 1 || floats.length !== 1) issue(file, 'prototype-cta-count', 'Case must have exactly one cover CTA and one floating prototype CTA.');
    else {
      result.sameDestination = new URL(covers[0].attrs.href, 'https://portfolio.local/' + rel(file)).href === new URL(floats[0].attrs.href, 'https://portfolio.local/' + rel(file)).href;
      result.floatingInitiallyHidden = Object.hasOwn(floats[0].attrs, 'hidden');
      result.destination = covers[0].attrs.href;
      if (!result.sameDestination) issue(file, 'prototype-cta-mismatch', 'Cover and floating CTA destinations differ.');
      if (!result.floatingInitiallyHidden) issue(file, 'prototype-float-initial-state', 'Floating CTA must begin hidden and be revealed after the hero leaves the viewport.');
      for (const cta of [covers[0], floats[0]]) if (cta.attrs.target === '_blank' && !/\bnoopener\b/.test(cta.attrs.rel || '')) issue(file, 'prototype-cta-rel', 'New-tab prototype CTA is missing rel=noopener.', cta.index, doc.text);
      const target = new URL(covers[0].attrs.href, 'https://portfolio.local/' + rel(file)).href;
      const additional = doc.nodes.filter(node => node.name === 'a' && node.attrs.href && node !== covers[0] && node !== floats[0] && new URL(node.attrs.href, 'https://portfolio.local/' + rel(file)).href === target);
      if (additional.length) issue(file, 'additional-prototype-cta', `${additional.length} additional link(s) repeat the prototype destination outside the authorized two CTAs.`);
    }
    ctaChecks.push(result);
  }
}
for (const file of files) {
  if (/\.css$/i.test(file)) { counts.css++; cssRefs(file, read(file)); }
  else if (/\.(?:js|mjs|cjs)$/i.test(file)) { const text = read(file); syntax(file, text, !/\.cjs$/i.test(file)); jsRefs(file, text); }
  else if (/\.svg$/i.test(file)) {
    counts.svg++;
    const text = read(file);
    for (const node of tags(text)) for (const attribute of ['href', 'xlink:href']) if (node.attrs[attribute] && !node.attrs[attribute].startsWith('#')) checkRef(file, node.attrs[attribute], `svg ${node.name}[${attribute}]`, node.index, text, false);
    cssRefs(file, text, 'SVG CSS');
  }
}
for (const page of PORTFOLIO_PAGES) if (!documents.has(path.join(SITE, page))) issue(path.join(SITE, page), 'missing-portfolio-page', 'Required portfolio page is missing.');
const errors = issues.filter(item => item.severity === 'error');
const sourceNotes = issues.filter(item => item.severity === 'source-note');
const uniqueExternals = [...new Map(externals.map(item => [[item.file, item.context, item.url].join('\0'), item])).values()];
const report = {
  generatedAt: new Date().toISOString(), siteRoot: 'redesign', mode: 'Static source inspection only', status: errors.length ? 'failed' : 'passed',
  execution: { websiteStarted: false, serverStarted: false, browserStarted: false, prototypeExecuted: false, deployed: false, javascriptParsedWithNodeCheckOnly: true },
  counts, portfolioErrors: errors, prototypeAndOriginalAssetNotes: sourceNotes, prototypeCtaChecks: ctaChecks,
  externalReferences: { portfolio: uniqueExternals.filter(item => item.scope === 'portfolio'), prototypesAndOriginalAssets: uniqueExternals.filter(item => item.scope !== 'portfolio') },
  limitations: ['Static inspection cannot establish responsive layout quality, animation behavior, interaction correctness, focus order or rendered image fidelity.', 'External websites, Figma prototype targets, CDN dependencies and original prototype API behavior were not fetched or executed.', 'Original prototypes and original source assets are reported separately and do not fail the newly built portfolio checks.']
};
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(`Static redesign ${report.status}: ${errors.length} portfolio errors; ${sourceNotes.length} original-source notes; ${uniqueExternals.length} external references.`);
console.log(`Checked ${counts.portfolioHtml} portfolio pages, ${counts.prototypeHtml} original prototype pages, ${counts.localReferences} local references, ${counts.anchors} anchors and ${counts.jsSyntax + counts.inlineJsSyntax} JavaScript syntax units.`);
for (const error of errors) console.log(`${error.file}${error.line ? ':' + error.line : ''} [${error.code}] ${error.detail}`);
console.log('Report: ' + slash(path.relative(ROOT, REPORT)));
process.exitCode = errors.length ? 1 : 0;
