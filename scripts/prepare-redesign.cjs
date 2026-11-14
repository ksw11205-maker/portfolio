// Prepare isolated static files. This never starts a server or executes site JS.
const fs=require('fs'),p=require('path');
const repo=p.resolve(__dirname,'..'),source=p.join(repo,'portfolio-shell/dist'),out=p.join(repo,'redesign');
function copy(from,to){if(!fs.existsSync(from))throw Error('Missing asset '+from);fs.mkdirSync(p.dirname(to),{recursive:true});fs.cpSync(from,to,{recursive:true});}
copy(p.join(source,'assets'),p.join(out,'assets'));
copy(p.join(source,'vendor/three'),p.join(out,'vendor/three'));
copy(p.join(source,'brand-shape.js'),p.join(out,'scripts/brand-shape.js'));
// Preserve the original prototype dependencies without rewriting their source.
for(const filename of ['page-transitions.css','page-transitions.js'])copy(p.join(source,filename),p.join(out,filename));
copy(p.join(source,'work/lg/tool-guide'),p.join(out,'work/lg/tool-guide'));
for(const slug of ['lg','ivi','cafekok']){copy(p.join(source,'work',slug,'assets'),p.join(out,'work',slug,'assets'));const prototype=p.join(source,'work',slug,'prototype');if(fs.existsSync(prototype))copy(prototype,p.join(out,'work',slug,'prototype'));}
const offer=p.join(source,'work/offer');for(const entry of fs.readdirSync(offer)){if(['case-study.html','case-study.css','case-study.js','case-motion.css','case-motion.js','responsive-evidence.css'].includes(entry))continue;copy(p.join(offer,entry),p.join(out,'work/offer',entry));}
const refs=p.join(repo,'docs/design/references/redesign-20261114');
copy(p.join(refs,'fonts/SUIT-Variable.woff2'),p.join(out,'assets/fonts/SUIT-Variable.woff2'));
copy(p.join(refs,'sun-typeface/SUIT/LICENSE'),p.join(out,'assets/fonts/SUIT-LICENSE.txt'));
copy(p.join(refs,'fonts/SourceSerif4Variable-Roman.woff2'),p.join(out,'assets/fonts/SourceSerif4Variable-Roman.woff2'));
copy(p.join(refs,'fonts/SourceSerif4Variable-Italic.woff2'),p.join(out,'assets/fonts/SourceSerif4Variable-Italic.woff2'));
copy(p.join(refs,'adobe-fonts/source-serif/LICENSE.md'),p.join(out,'assets/fonts/SourceSerif-LICENSE.md'));
copy(p.join(refs,'lucide-icons/lucide/icons'),p.join(out,'assets/icons'));
copy(p.join(refs,'lucide-icons/lucide/LICENSE'),p.join(out,'assets/icons/LICENSE'));
console.log('Isolated assets prepared: '+out);
// Keep native 4x IVI exports after the original dist asset copy.
const nativeIvi=p.join(repo,'docs/design/references/ivi-native-20261115');
for(const filename of ['unified.png','double.png','top.png','side.png','climate.png','menu.png','phone.png','source.json'])copy(p.join(nativeIvi,filename),p.join(out,'work/ivi/assets/latest',filename));
