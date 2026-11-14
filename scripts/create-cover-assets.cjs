/* Deterministic native SVG hardware compositions. Original UI pixels stay intact. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'redesign/assets/covers');
const SOURCE = 'portfolio-shell/dist/';
const sourceRecords = new Map();
fs.mkdirSync(OUT, { recursive: true });
async function source(relative, mime, width, height) {
  const filename = SOURCE + relative;
  const bytes = fs.readFileSync(path.join(ROOT, filename));
  let embedded = bytes;
  let embeddedMime = mime;
  if (mime === 'image/webp') {
    // PNG preserves decoded source pixels and works in native SVG rasterizers too.
    const sharpPath = process.env.SHARP_PATH || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
    embedded = await require(sharpPath)(bytes).png().toBuffer();
    embeddedMime = 'image/png';
  }
  sourceRecords.set(relative, { path: filename.replaceAll('\\', '/'), mime, width, height, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), embeddedMime, embeddedBytes: embedded.length, embeddedSha256: crypto.createHash('sha256').update(embedded).digest('hex'), pixelTreatment: mime === 'image/webp' ? 'Lossless PNG encoding of decoded source pixels; no resize, crop or retouch in the embedded source.' : 'Original source bytes unchanged.' });
  return `data:${embeddedMime};base64,${embedded.toString('base64')}`;
}
(async () => {
const ui = {
  lg: await source('work/lg/assets/02-analysis.webp', 'image/webp', 1600, 1535),
  tv: await source('work/lg/assets/tv-sports.webp', 'image/webp', 776, 653),
  cafe: await source('work/cafekok/assets/cafe-cover.jpg', 'image/jpeg', 1920, 1280),
  cafeHome: await source('work/cafekok/assets/latest/home.png', 'image/png', 780, 1688),
  offerDesktop: await source('work/offer/case-study-assets/editorial/explore.jpg', 'image/jpeg', 1440, 1100),
  offerTablet: await source('work/offer/case-study-assets/editorial/tablet.jpg', 'image/jpeg', 768, 1024),
  offerMobile: await source('work/offer/case-study-assets/editorial/mobile.jpg', 'image/jpeg', 390, 844),
};
const head = (name, desc) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2400" height="1350" viewBox="0 0 2400 1350" role="img" aria-labelledby="title desc"><title id="title">${name}</title><desc id="desc">${desc}</desc>`;
const common = `<filter id="blur"><feGaussianBlur stdDeviation="65"/></filter>
<filter id="contact"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="deviceShadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="40" stdDeviation="32" flood-color="#000" flood-opacity=".38"/></filter>
<linearGradient id="silver" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#e9ebee"/><stop offset=".12" stop-color="#a9acb3"/><stop offset=".42" stop-color="#e8e9ec"/><stop offset=".73" stop-color="#7b7e86"/><stop offset="1" stop-color="#d6d7dc"/></linearGradient>
<linearGradient id="darkMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6a6970"/><stop offset=".15" stop-color="#242428"/><stop offset=".65" stop-color="#101114"/><stop offset="1" stop-color="#63616a"/></linearGradient>
<linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dfe1e5"/><stop offset=".2" stop-color="#fafafa"/><stop offset=".3" stop-color="#a7aab1"/><stop offset="1" stop-color="#565963"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff" stop-opacity=".05"/><stop offset=".45" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>`;

const lg = head('LG TV UX research and evaluation tool', 'Original LG evaluation interface in a laptop, with the original sports interface on a television behind it. Hardware and studio are native vector artwork.') + `<defs>${common}
<linearGradient id="room" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#15151d"/><stop offset=".48" stop-color="#2c2331"/><stop offset="1" stop-color="#63505d"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="#42343e"/><stop offset="1" stop-color="#1c1c24"/></linearGradient>
<radialGradient id="glow"><stop stop-color="#d89bbb" stop-opacity=".33"/><stop offset="1" stop-color="#d89bbb" stop-opacity="0"/></radialGradient>
<linearGradient id="sofa" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#51424b"/><stop offset="1" stop-color="#27242c"/></linearGradient>
<clipPath id="tvScreen"><rect x="1248" y="179" width="994" height="559" rx="3"/></clipPath>
<clipPath id="laptopScreen"><rect x="219" y="589" width="1322" height="688" rx="11"/></clipPath>
</defs>
<rect width="2400" height="1350" fill="url(#room)"/>
<ellipse cx="1660" cy="420" rx="900" ry="760" fill="url(#glow)"/>
<path d="M0 1000H2400V1350H0Z" fill="url(#floor)"/>
<path d="M0 1000H2400" stroke="#dcc5d5" stroke-opacity=".08"/>
<path d="M0 0H725V1000" fill="none" stroke="#ffffff" stroke-opacity=".025" stroke-width="2"/>
<path d="M60 1000V808Q60 756 112 756H1170Q1230 756 1230 816V1000Z" fill="url(#sofa)"/>
<path d="M90 975V844Q90 811 123 811H1130Q1167 811 1167 850V975" fill="none" stroke="#b69aa9" stroke-opacity=".1" stroke-width="3"/>
<ellipse cx="1660" cy="1025" rx="520" ry="50" fill="#090910" opacity=".48" filter="url(#contact)"/>
<g filter="url(#deviceShadow)">
 <path d="M1687 741H1797L1834 1000H1646Z" fill="url(#darkMetal)"/>
 <path d="M1689 750H1716L1683 995H1656Z" fill="#a5a2ab" opacity=".15"/>
 <path d="M1530 992H1942L2010 1012H1464Z" fill="url(#darkMetal)"/>
 <rect x="1227" y="157" width="1036" height="603" rx="14" fill="url(#darkMetal)"/>
 <rect x="1232" y="162" width="1026" height="592" rx="10" fill="#08090b"/>
 <image x="1248" y="179" width="994" height="836.43" preserveAspectRatio="xMidYMin meet" clip-path="url(#tvScreen)" href="${ui.tv}"/>
 <rect x="1248" y="179" width="994" height="559" rx="3" fill="none" stroke="#ffffff" stroke-opacity=".1"/>
 <path d="M1241 163H2249" stroke="url(#edge)" stroke-width="2"/>
 <circle cx="1745" cy="748" r="2" fill="#b5c0c1" opacity=".6"/>
</g>
<ellipse cx="920" cy="1324" rx="830" ry="73" fill="#090910" opacity=".65" filter="url(#contact)"/>
<g filter="url(#deviceShadow)">
 <rect x="190" y="557" width="1380" height="749" rx="29" fill="url(#silver)"/>
 <rect x="197" y="564" width="1366" height="738" rx="24" fill="#121316"/>
 <image x="219" y="589" width="1322" height="1268.29" preserveAspectRatio="xMidYMin meet" clip-path="url(#laptopScreen)" href="${ui.lg}"/>
 <rect x="219" y="589" width="1322" height="688" rx="11" fill="none" stroke="#fff" stroke-opacity=".22"/>
 <circle cx="880" cy="576" r="3.5" fill="#3b3e45"/>
 <path d="M201 569H1557" stroke="url(#edge)" stroke-width="2"/>
 <path d="M190 1293H1570L1740 1320Q1750 1322 1748 1328L1742 1340H20L12 1328Q10 1322 23 1319Z" fill="url(#base)"/>
 <path d="M22 1321H1740" stroke="#ffffff" stroke-opacity=".55" stroke-width="2"/>
 <path d="M734 1295H1026L1014 1307Q1009 1311 1001 1311H758Q748 1311 744 1306Z" fill="#858992"/>
 <path d="M45 1340H1717" stroke="#202229" stroke-opacity=".8" stroke-width="3"/>
</g></svg>`;

const cafe = head('CAFÉ KOK', 'The original cafe facade photograph and the original CAFÉ KOK home screen in an oversized mobile device. The lower portion of the device continues below the cover.') + `<defs>${common}
<linearGradient id="photoTone" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#211a14" stop-opacity=".65"/><stop offset=".48" stop-color="#211a14" stop-opacity=".12"/><stop offset="1" stop-color="#f5e8cd" stop-opacity=".03"/></linearGradient>
<linearGradient id="photoDepth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#1c1913" stop-opacity=".07"/><stop offset=".6" stop-color="#1c1913" stop-opacity="0"/><stop offset="1" stop-color="#1c1913" stop-opacity=".46"/></linearGradient>
<linearGradient id="titanium" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#6b655b"/><stop offset=".035" stop-color="#d0c6b3"/><stop offset=".13" stop-color="#f2eadb"/><stop offset=".47" stop-color="#c4b9a6"/><stop offset=".89" stop-color="#70695e"/><stop offset="1" stop-color="#e8dcc8"/></linearGradient>
<clipPath id="phoneScreen"><rect x="1477" y="218" width="722" height="1562.5" rx="70"/></clipPath>
<filter id="phoneShadow" x="-100%" y="-40%" width="300%" height="200%"><feDropShadow dx="-45" dy="52" stdDeviation="38" flood-color="#21190d" flood-opacity=".5"/></filter>
</defs>
<image width="2400" height="1600" y="-125" preserveAspectRatio="xMidYMid meet" href="${ui.cafe}"/>
<rect width="2400" height="1350" fill="url(#photoTone)"/>
<rect width="2400" height="1350" fill="url(#photoDepth)"/>
<ellipse cx="1835" cy="1330" rx="490" ry="160" fill="#24180e" opacity=".33" filter="url(#blur)"/>
<g filter="url(#phoneShadow)">
 <rect x="1451" y="185" width="774" height="1631" rx="98" fill="url(#titanium)"/>
 <rect x="1457" y="191" width="762" height="1619" rx="93" fill="#292821"/>
 <rect x="1468" y="206" width="740" height="1587" rx="80" fill="#090a08"/>
 <image x="1477" y="218" width="722" height="1562.5" preserveAspectRatio="xMidYMin meet" clip-path="url(#phoneScreen)" href="${ui.cafeHome}"/>
 <rect x="1477" y="218" width="722" height="1562.5" rx="70" fill="none" stroke="#fff" stroke-opacity=".16"/>
 <path d="M1534 192H2144" stroke="#fffae8" stroke-opacity=".55" stroke-width="2"/>
 <rect x="1813" y="202" width="50" height="4" rx="2" fill="#615c52"/>
 <path d="M1451 375V474M1451 507V605" stroke="#d5c9b2" stroke-width="7" stroke-linecap="round"/>
 <path d="M2225 438V594" stroke="#b4a88f" stroke-width="7" stroke-linecap="round"/>
</g></svg>`;

const offer = head('OFFER responsive web', 'Original Explore page captures in desktop, tablet and mobile device frames: four, two and one content columns. Desktop remains centered with the smaller devices overlapping at either side.') + `<defs>${common}
<linearGradient id="studio" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#f6f5f0"/><stop offset=".5" stop-color="#eeece5"/><stop offset="1" stop-color="#ead6c9"/></linearGradient>
<radialGradient id="orangeGlow"><stop stop-color="#ff7d36" stop-opacity=".23"/><stop offset="1" stop-color="#ff7d36" stop-opacity="0"/></radialGradient>
<linearGradient id="offerFloor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e7d2c3"/><stop offset="1" stop-color="#dcb89f"/></linearGradient>
<linearGradient id="monitorStand" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8d8b87"/><stop offset=".25" stop-color="#d9d6d0"/><stop offset=".6" stop-color="#aaa8a1"/><stop offset="1" stop-color="#7b7872"/></linearGradient>
<clipPath id="desktopScreen"><rect x="566" y="209" width="1317" height="754" rx="5"/></clipPath>
<clipPath id="tabletScreen"><rect x="195" y="572" width="608" height="810.67" rx="18"/></clipPath>
<clipPath id="offerPhoneScreen"><rect x="1902" y="658" width="321" height="694.68" rx="31"/></clipPath>
</defs>
<rect width="2400" height="1350" fill="url(#studio)"/>
<ellipse cx="1830" cy="370" rx="880" ry="800" fill="url(#orangeGlow)"/>
<path d="M0 1100H2400V1350H0Z" fill="url(#offerFloor)"/>
<path d="M0 1100H2400" stroke="#b8a595" stroke-opacity=".16"/>
<ellipse cx="1240" cy="1233" rx="850" ry="91" fill="#735442" opacity=".22" filter="url(#contact)"/>
<g filter="url(#deviceShadow)">
 <path d="M1153 965H1301L1325 1143H1128Z" fill="url(#monitorStand)"/>
 <path d="M1176 981H1195L1176 1140H1159Z" fill="#fff" opacity=".24"/>
 <path d="M1042 1139H1409L1480 1174Q1489 1180 1476 1185H975Q963 1180 971 1174Z" fill="url(#silver)"/>
 <path d="M976 1185H1475" stroke="#7c7973" stroke-width="3"/>
 <rect x="541" y="183" width="1367" height="819" rx="27" fill="url(#silver)"/>
 <rect x="548" y="190" width="1353" height="805" rx="23" fill="#181a1b"/>
 <image x="566" y="209" width="1317" height="1006.04" preserveAspectRatio="xMidYMin meet" clip-path="url(#desktopScreen)" href="${ui.offerDesktop}"/>
 <rect x="566" y="209" width="1317" height="754" rx="5" fill="none" stroke="#000" stroke-opacity=".25"/>
 <circle cx="1224" cy="199" r="3" fill="#45484a"/>
 <path d="M571 189H1878" stroke="url(#edge)" stroke-width="2"/>
 <path d="M565 979H1880" stroke="#6f7274" stroke-opacity=".25"/>
</g>
<ellipse cx="510" cy="1338" rx="450" ry="76" fill="#70523e" opacity=".25" filter="url(#contact)"/>
<g filter="url(#deviceShadow)">
 <rect x="166" y="542" width="666" height="871" rx="39" fill="url(#darkMetal)"/>
 <rect x="172" y="548" width="654" height="859" rx="34" fill="#111212"/>
 <image x="195" y="572" width="608" height="810.67" preserveAspectRatio="xMidYMin meet" clip-path="url(#tabletScreen)" href="${ui.offerTablet}"/>
 <rect x="195" y="572" width="608" height="810.67" rx="18" fill="none" stroke="#fff" stroke-opacity=".2"/>
 <circle cx="499" cy="559" r="3.5" fill="#3c4042"/>
 <path d="M208 548H789" stroke="#c4c3bf" stroke-opacity=".5" stroke-width="1.5"/>
</g>
<ellipse cx="2070" cy="1340" rx="260" ry="56" fill="#73513d" opacity=".3" filter="url(#contact)"/>
<g filter="url(#deviceShadow)">
 <rect x="1884" y="633" width="357" height="750" rx="51" fill="url(#silver)"/>
 <rect x="1889" y="638" width="347" height="740" rx="47" fill="#151617"/>
 <image x="1902" y="658" width="321" height="694.68" preserveAspectRatio="xMidYMin meet" clip-path="url(#offerPhoneScreen)" href="${ui.offerMobile}"/>
 <rect x="1902" y="658" width="321" height="694.68" rx="31" fill="none" stroke="#fff" stroke-opacity=".2"/>
 <rect x="2044" y="646" width="37" height="3" rx="1.5" fill="#727579"/>
 <path d="M2241 791V881" stroke="#83858a" stroke-width="4" stroke-linecap="round"/>
 <path d="M1884 767V827M1884 847V904" stroke="#e2e1dc" stroke-width="4" stroke-linecap="round"/>
</g></svg>`;

const covers = { lg, cafekok: cafe, offer };
const outputs = [];
for (const [name, svg] of Object.entries(covers)) {
  const bytes = Buffer.from(svg + '\n');
  fs.writeFileSync(path.join(OUT, name + '.svg'), bytes);
  outputs.push({ path: `redesign/assets/covers/${name}.svg`, width: 2400, height: 1350, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}
const manifest = {
  created: '2026-11-15', generator: 'scripts/create-cover-assets.cjs', outputType: 'Self-contained SVG. Original UI pixels remain intact; WebP inputs use lossless PNG encoding for portable SVG support. Other image bytes are embedded unchanged. Hardware, gradients and shadows are native vectors.',
  sources: [...sourceRecords.values()], outputs,
  compositions: {
    lg: { sources: ['work/lg/assets/02-analysis.webp','work/lg/assets/tv-sports.webp'], treatment: 'Original full-width screenshots, uniformly scaled and top-cropped inside widescreen device viewports. Native laptop foreground and TV background.', limitations: 'TV source is 776 × 653. It is intentionally secondary; at a 1200px-wide cover its visible screen is 497px wide. No detail enhancement or text regeneration. Desktop source is tall, so only its upper analysis section is shown.' },
    cafekok: { sources: ['work/cafekok/assets/cafe-cover.jpg','work/cafekok/assets/latest/home.png'], treatment: 'Original facade photograph, centered vertical crop; warm translucent overlay. Exact home screenshot in a large, upright phone continuing beneath the cover canvas.', limitations: 'The canvas shows the upper home screen through the purpose controls. The lower recommendation region with its pre-existing loading placeholder remains below the canvas. No UI patching, reconstruction or text invention.' },
    offer: { sources: ['work/offer/case-study-assets/editorial/explore.jpg','work/offer/case-study-assets/editorial/tablet.jpg','work/offer/case-study-assets/editorial/mobile.jpg'], treatment: 'Same Explore page at 4 / 2 / 1 columns. Desktop centered, tablet overlaps left foreground, mobile overlaps right foreground. Desktop top-cropped uniformly in monitor; full aspect ratios preserved on smaller devices, with the lower device edges slightly outside the canvas.', limitations: 'These are existing editorial captures, not evidence that a live responsive implementation was tested in this session.' },
    ivi: { unchanged: true, path: 'portfolio-shell/dist/assets/projects/ivi-cover-clean-1920.jpg', treatment: 'Reuse original concept cover unchanged. No derivative output generated.' }
  },
  verification: { originalUiPixelsIntact: true, nonWebpBytesUnchanged: true, imageAspectRatiosPreserved: true, websiteStarted: false, browserStarted: false, deployed: false, staticSvgRender: 'Pending static raster inspection.' }
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Created ${outputs.length} native SVG covers with ${sourceRecords.size} original source images.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
