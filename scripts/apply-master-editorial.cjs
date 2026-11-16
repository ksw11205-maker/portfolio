const fs=require('fs');
const slug=process.argv[2];
if(!['lg','ivi','cafekok','offer'].includes(slug))throw Error('Project required');
const file=`redesign/work/${slug}/${slug==='offer'?'case-study.html':'index.html'}`;
let html=fs.readFileSync(file,'utf8');
// Remove the obsolete coordinate renderer, preserving every explanatory sentence.
html=html.replace('<script type="module" src="/scripts/annotated-interface.js"></script>','');
html=html.replace(/<svg class="annotation-wires" aria-hidden="true"><\/svg>/g,'');
if(!html.includes('/styles/master-editorial.css'))html=html.replace('</head>','<link rel="stylesheet" href="/styles/master-editorial.css"></head>');
// Move labels before the image in source order as well as visual order.
html=html.replace(/(<div class="annotation-stage">)(<div class="interface-device">[\s\S]*?<\/div><\/div>)(<div class="annotation-labels">[\s\S]*?<\/div><\/div>)(<\/div><figcaption)/g,'$1$3$2$4');
fs.writeFileSync(file,html);
console.log(slug,'editorial presentation applied');
