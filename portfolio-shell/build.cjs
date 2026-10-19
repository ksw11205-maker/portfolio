// Keep one editable CAFÉKOK source and copy it into the existing static output.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
require('./build-brand.cjs');
// Add the shared navigation skin to generated pages, keeping product sources portable.
function withPageTransitions(html) {
  if (!html.includes('src="/page-transitions.js"')) html=html.replace('</head>', '<link rel="stylesheet" href="/page-transitions.css"><script src="/page-transitions.js"></script></head>');
  return html;
}
function withPortfolioBrand(html, shell=false) {
  html=html.replace(/[ \t]*<link[^>]*rel="icon"[^>]*>[ \t]*(?:\r?\n)?/g,'');
  const css=shell?'brand.css':'brand-base.css';
  if(!html.includes('href="/'+css+'"'))html=html.replace('</head>','<link rel="stylesheet" href="/'+css+'"></head>');
  html=html.replace('</head>','<link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg"></head>');
  // Only the portfolio return link is branded. Product logos remain untouched.
  html=html.replace(/(<a[^>]*class="back"[^>]*>)(← 포트폴리오)(<\/a>)/, '$1<img class="brand-mark" src="/assets/brand/symbol.svg" width="28" height="28" alt="">$2$3');
  html=html.replace(/(<a[^>]*href="\/#work"[^>]*>)(← Portfolio)(<\/a>)/g, '$1<img class="brand-mark" src="/assets/brand/symbol.svg" width="28" height="28" alt="">$2$3');
  html=html.replace(/(<a[^>]*class="wordmark"[^>]*href="\/#home"[^>]*>)KS<span>\.<\/span>(<\/a>)/, '$1<img class="brand-mark" src="/assets/brand/symbol.svg" width="28" height="28" alt="">$2');
  html=html.replace(/(<a class="back" href="\/#work">)(<span aria-hidden="true">←<\/span>)/, '$1<img class="brand-mark brand-on-dark" src="/assets/brand/symbol.svg" width="28" height="28" alt="">$2');
  return html;
}
// Bake the same home markup into HTML so content never depends on motion JS.
function buildStaticHome() {
  const output = path.join(__dirname, 'dist');
  const data = fs.readFileSync(path.join(output, 'data.js'), 'utf8').replace(/^export /gm, '');
  const template = fs.readFileSync(path.join(output, 'app.js'), 'utf8').split('const slug=')[0]
    .replace(/^import .*;\r?\n/gm, '')
    .replace(/^const (app|reduced|fine)=.*;\r?\n/gm, '');
  const markup = vm.runInNewContext(data + '\n' + template + '\nhome()', {}, {timeout:1000});
  const target = path.join(output, 'index.html');
  let html = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  if (!html.includes('<!--static-home:start-->')) {
    html = html.replace('<div id="app"></div>', '<div id="app"><!--static-home:start--><!--static-home:end--></div>')
      .replace(/<noscript>[\s\S]*?<\/noscript>/, '');
  }
  html = html.replace(/<!--static-home:start-->[\s\S]*?<!--static-home:end-->/,
    ()=>'<!--static-home:start-->'+markup+'<!--static-home:end-->');
  html = html.replace('<div id="app">', '<div id="app" class="static-home">');
  if(!html.includes('src="/intro-boot.js"'))html=html.replace('</head>','<script src="/intro-boot.js"></script></head>');
  fs.writeFileSync(target, withPortfolioBrand(withPageTransitions(html),true));
}
function buildCaseStudy() {
  buildStaticHome();
  const source = path.resolve(__dirname, '../cafekok/cafekok-detail/cafekok');
  const output = path.join(__dirname, 'dist/work/cafekok');
  fs.mkdirSync(output, {recursive: true});
  for (const name of ['index.html', 'styles.css', 'script.js']) {
    fs.copyFileSync(path.join(source, name), path.join(output, name));
  }
  fs.cpSync(path.join(source, 'assets'), path.join(output, 'assets'), {recursive: true});
  const offerSource = path.resolve(__dirname, '../OFFER/offer');
  const offerOutput = path.join(__dirname, 'dist/work/offer');
  fs.mkdirSync(offerOutput, {recursive: true});
  for (const name of ['index.html', 'explore.html', 'brand.html', 'offer.html', 'saved.html', 'favorites.html', 'css', 'js', 'data', 'assets']) {
    fs.cpSync(path.join(offerSource, name), path.join(offerOutput, name), {recursive: true});
  }
  // OFFER case-study source is separate from the unchanged product application.
  for (const name of ['case-study.html', 'case-study.css', 'case-study.js']) {
    fs.copyFileSync(path.resolve(__dirname, '../OFFER/case-study', name), path.join(offerOutput, name));
  }
  for (const directory of [output, offerOutput]) {
    for (const name of fs.readdirSync(directory).filter(name=>name.endsWith('.html'))) {
      const target=path.join(directory,name);
      const html=withPageTransitions(fs.readFileSync(target,'utf8'));
      fs.writeFileSync(target,directory===output||name==='case-study.html'?withPortfolioBrand(html):html);
    }
  }
  for(const slug of ['lg','ivi']){
    const target=path.join(__dirname,'dist/work',slug,'index.html');
    fs.writeFileSync(target,withPortfolioBrand(withPageTransitions(fs.readFileSync(target,'utf8'))));
  }
  return {cafekok: output, offer: offerOutput};
}
module.exports = buildCaseStudy;
if (require.main === module) console.log('Built projects:', buildCaseStudy());
