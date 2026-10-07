// Keep one editable CAFÉKOK source and copy it into the existing static output.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
// Add the shared navigation skin to generated pages, keeping product sources portable.
function withPageTransitions(html) {
  if (html.includes('src="/page-transitions.js"')) return html;
  return html.replace('</head>', '<link rel="stylesheet" href="/page-transitions.css"><script src="/page-transitions.js"></script></head>');
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
  let html = fs.readFileSync(target, 'utf8');
  if (!html.includes('<!--static-home:start-->')) {
    html = html.replace('<div id="app"></div>', '<div id="app"><!--static-home:start--><!--static-home:end--></div>')
      .replace(/<noscript>[\s\S]*?<\/noscript>/, '');
  }
  html = html.replace(/<!--static-home:start-->[\s\S]*?<!--static-home:end-->/,
    ()=>'<!--static-home:start-->'+markup+'<!--static-home:end-->');
  html = html.replace('<div id="app">', '<div id="app" class="static-home">');
  fs.writeFileSync(target, withPageTransitions(html));
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
  for (const directory of [output, offerOutput]) {
    for (const name of fs.readdirSync(directory).filter(name=>name.endsWith('.html'))) {
      const target=path.join(directory,name);
      fs.writeFileSync(target,withPageTransitions(fs.readFileSync(target,'utf8')));
    }
  }
  return {cafekok: output, offer: offerOutput};
}
module.exports = buildCaseStudy;
if (require.main === module) console.log('Built projects:', buildCaseStudy());
