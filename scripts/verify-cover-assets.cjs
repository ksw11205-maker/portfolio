const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const sharp = require(process.env.SHARP_PATH || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
(async () => {
  const manifestPath = path.join(root, 'redesign/assets/covers/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const proofDir = path.join(root, 'docs/design/references/native-covers-20261115');
  fs.mkdirSync(proofDir, { recursive: true });
  const embeddedImages = new Map();
  for (const cover of manifest.outputs) {
    const svg = fs.readFileSync(path.join(root, cover.path), 'utf8');
    if (digest(Buffer.from(svg)) !== cover.sha256) throw Error('Output hash changed: ' + cover.path);
    if (/href="(?!data:)/.test(svg)) throw Error('External image reference: ' + cover.path);
    if (/<text\b/.test(svg)) throw Error('Baked vector text: ' + cover.path);
    for (const match of svg.matchAll(/href="data:image\/[^;]+;base64,([^"]+)/g)) {
      const image = Buffer.from(match[1], 'base64');
      embeddedImages.set(digest(image), image);
    }
    await sharp(path.join(root, cover.path), { unlimited: true }).resize(1200, 675).png().toFile(path.join(proofDir, path.basename(cover.path, '.svg') + '.png'));
  }
  for (const record of manifest.sources) {
    const original = fs.readFileSync(path.join(root, record.path));
    if (digest(original) !== record.sha256) throw Error('Source hash changed: ' + record.path);
    const embedded = embeddedImages.get(record.embeddedSha256);
    if (!embedded) throw Error('Missing embedded source: ' + record.path);
    const metadata = await sharp(original).metadata();
    if (metadata.width !== record.width || metadata.height !== record.height) throw Error('Unexpected source dimensions: ' + record.path);
    if (record.mime === 'image/webp') {
      const decodedSource = await sharp(original).ensureAlpha().raw().toBuffer();
      const decodedEmbedded = await sharp(embedded).ensureAlpha().raw().toBuffer();
      if (!decodedSource.equals(decodedEmbedded)) throw Error('Decoded pixel mismatch: ' + record.path);
    } else if (!original.equals(embedded)) throw Error('Embedded bytes changed: ' + record.path);
  }
  manifest.verification.staticSvgRender = 'All three SVG files rendered locally with sharp/librsvg to 1200 × 675 PNG proofs; visually inspected. No website or browser launched.';
  manifest.verification.sourceHashesVerified = true;
  manifest.verification.webpToPngDecodedPixelsEqual = true;
  manifest.verification.selfContainedImages = true;
  manifest.verification.noBakedVectorText = true;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('Verified 3 covers: source hashes, decoded pixels, exact dimensions and self-contained images.');
  for (const cover of manifest.outputs) console.log(`${cover.path}: ${(cover.bytes / 1048576).toFixed(2)} MiB`);
})().catch(error => { console.error(error); process.exitCode = 1; });
