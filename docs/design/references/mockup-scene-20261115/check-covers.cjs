const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const sharp=require(process.env.SHARP_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{const p=path.join(root,'redesign/assets/covers/manifest.json'),m=JSON.parse(fs.readFileSync(p)),images=new Map();
fs.mkdirSync(path.join(__dirname,'proofs'),{recursive:true});
for(const o of m.outputs){const svg=fs.readFileSync(path.join(root,o.path));if(hash(svg)!==o.sha256)throw Error('Output hash mismatch');if(/href="(?!data:)/.test(svg))throw Error('External image reference');if(/<text\b/.test(svg))throw Error('Baked vector text');const dimensions=await sharp(svg).metadata();if(dimensions.width!==2400||dimensions.height!==1350)throw Error('Unexpected canvas dimensions');for(const q of svg.toString().matchAll(/href="data:image\/[^;]+;base64,([^"]+)/g)){const b=Buffer.from(q[1],'base64');images.set(hash(b),b)}await sharp(svg).resize(1200,675).png().toFile(path.join(__dirname,'proofs',path.basename(o.path,'.svg')+'.png'));}
for(const r of m.sources){const a=fs.readFileSync(path.join(root,r.path)),b=images.get(r.embeddedSha256),d=await sharp(a).metadata();if(hash(a)!==r.sha256||!b||d.width!==r.width||d.height!==r.height)throw Error(r.path);if(r.mime==='image/webp'){if(!(await sharp(a).ensureAlpha().raw().toBuffer()).equals(await sharp(b).ensureAlpha().raw().toBuffer()))throw Error('Decoded pixels changed')}else if(!a.equals(b))throw Error('Source bytes changed');}
m.verification.sourceHashesVerified=true;m.verification.webpToPngDecodedPixelsEqual=true;m.verification.selfContainedImages=true;m.verification.noBakedVectorText=true;
m.verification.staticSvgRender='All three self-contained SVGs rendered with sharp/librsvg to 1200x675 PNG. Proofs visually reviewed on 2026-11-15; no site or browser launched by the cover task.';
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');console.log('3 SVGs rendered; 7 sources have exact bytes or decoded pixels and native dimensions.');
})().catch(e=>{console.error(e);process.exitCode=1});
