// Keep one editable CAFÉKOK source and copy it into the existing static output.
const fs = require('node:fs');
const path = require('node:path');
function buildCaseStudy() {
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
  return {cafekok: output, offer: offerOutput};
}
module.exports = buildCaseStudy;
if (require.main === module) console.log('Built projects:', buildCaseStudy());
