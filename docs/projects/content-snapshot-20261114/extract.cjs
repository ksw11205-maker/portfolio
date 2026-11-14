// Offline content extraction only. Does not run portfolio scripts or start a server.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '../../../portfolio-shell/dist');
const pages = { home: 'index.html', lg: 'work/lg/index.html', ivi: 'work/ivi/index.html', cafekok: 'work/cafekok/index.html', offer: 'work/offer/case-study.html' };
const entity = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' ', ndash:'–', mdash:'—', hellip:'…', middot:'·', times:'×', copy:'©' };
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all,k) => k[0] === '#' ? String.fromCodePoint(k[1].toLowerCase() === 'x' ? parseInt(k.slice(2),16) : parseInt(k.slice(1),10)) : entity[k] || all);
const clean = s => decode(s).replace(/[\t\r\n ]+/g,' ').trim();
const voids = new Set(['img','br','input','meta','link','hr','source','wbr','area','base','embed','param','track','col']);
function parse(html) {
  html = html.replace(/<!--[^]*?-->/g,'').replace(/<(script|style|svg)\b[^>]*>[^]*?<\/\1\s*>/gi,'');
  const root = {tag:'root',attrs:{},children:[]}, stack=[root];
  for (const m of html.matchAll(/<\/?[a-z][^>]*>|[^<]+/gi)) {
    const token=m[0]; if (!token.startsWith('<')) {stack.at(-1).children.push(token);continue;}
    const tag=token.match(/^<\/?([\w-]+)/)?.[1].toLowerCase();if(!tag)continue;
    if(token.startsWith('</')) {const index=stack.findLastIndex(n=>n.tag===tag);if(index>0)stack.length=index;continue;}
    const attrs={};const body=token.slice(token.indexOf(tag)+tag.length).replace(/\/?\s*>$/,'');
    for (const a of body.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()]=decode(a[2]??a[3]??a[4]??'');
    const parent=stack.at(-1),n={tag,attrs,children:[],parent};parent.children.push(n);
    if(!voids.has(tag)&&!token.endsWith('/>'))stack.push(n);
  } return root;
}
const hidden = n => typeof n !== 'string' && ('hidden' in n.attrs || n.attrs['aria-hidden']==='true');
const text = n => typeof n === 'string' ? n : hidden(n) ? '' : n.tag==='br' ? ' ' : n.children.map(text).join(' ');
function all(n,predicate,out=[]) {if(typeof n==='string'||hidden(n))return out;if(predicate(n))out.push(n);n.children.forEach(c=>all(c,predicate,out));return out;}
function section(n){for(let a=n;a;a=a.parent)if(['section','article'].includes(a.tag)&&a.attrs.id)return a.attrs.id;return null;}
function ancestor(n,tag){for(let a=n.parent;a;a=a.parent)if(a.tag===tag)return a;return null;}
function digest(b){return crypto.createHash('sha256').update(b).digest('hex');}
const summaries=[];
for(const [slug,relative] of Object.entries(pages)) {
  const raw=fs.readFileSync(path.join(root,relative));const doc=parse(raw.toString('utf8'));
  const body=all(doc,n=>n.tag==='body')[0]||doc;const blocks=[];
  const blockTags=new Set(['h1','h2','h3','h4','h5','h6','p','dt','dd','li','figcaption','blockquote']);
  all(body,n=>blockTags.has(n.tag)).forEach((n,i)=>{const value=clean(text(n));if(value)blocks.push({order:i,kind:n.tag,section:section(n),id:n.attrs.id||null,text:value});});
  const images=all(body,n=>n.tag==='img'&&n.attrs.src).map(n=>{const src=n.attrs.src,local=path.resolve(src.startsWith('/')?root:path.dirname(path.join(root,relative)),'.'+(src.startsWith('/')?src:'/'+src));const exists=!/^https?:/.test(src)&&fs.existsSync(local);return {source:src,alt:n.attrs.alt||'',caption:clean(text(ancestor(n,'figure')||{children:[],attrs:{}})),section:section(n),figmaNode:n.attrs['data-figma-node']||null,intrinsicWidth:Number(n.attrs.width)||null,intrinsicHeight:Number(n.attrs.height)||null,localAsset:exists?path.relative(root,local).replaceAll('\\','/'):null,sha256:exists?digest(fs.readFileSync(local)):null};});
  const tables=all(body,n=>n.tag==='table').map(n=>({section:section(n),rows:all(n,x=>x.tag==='tr').map(row=>all(row,x=>x.tag==='th'||x.tag==='td').map(cell=>clean(text(cell))))}));
  const links=all(body,n=>n.tag==='a'&&n.attrs.href&&!n.attrs.href.startsWith('#')).map(n=>({text:clean(text(n))||n.attrs['aria-label']||'',target:n.attrs.href,section:section(n)}));
  const data={slug,sourceFile:relative,sourceSha256:digest(raw),sourceStatus:'Extracted from current page; claims not independently revalidated',title:clean(text(all(doc,n=>n.tag==='title')[0]||{children:[],attrs:{}})),plainText:clean(text(body)),blocks,tables,images,links};
  fs.writeFileSync(path.join(__dirname,slug+'.json'),JSON.stringify(data,null,2));
  let md='# '+data.title+'\n\nSOURCE: '+relative+'\n\n';
  for(const b of blocks) md+=(/^h[1-6]$/.test(b.kind)?'#'.repeat(Math.min(6,Number(b.kind[1])+1))+' ':b.kind==='li'?'- ':b.kind==='figcaption'?'CAPTION: ':'')+b.text+'\n\n';
  for(const t of tables)md+='TABLE / '+(t.section||'')+'\n\n'+t.rows.map(r=>r.join(' | ')).join('\n')+'\n\n';
  fs.writeFileSync(path.join(__dirname,slug+'.md'),md);
  summaries.push({slug,source:relative,blocks:blocks.length,tables:tables.length,images:images.length,missingImages:images.filter(i=>!i.localAsset&&!/^https?:/.test(i.source)).length});
}
// Parse only known static literals, never evaluate original JavaScript.
const dataJs=fs.readFileSync(path.join(root,'data.js'),'utf8');
const getString=(s,key)=>{const m=s.match(new RegExp(key+':\\s*([\x27\x22])([^]*?)\\1'));return m?m[2].replace(/\\n/g,'\n'):null;};
const projects=[...dataJs.matchAll(/\{slug:'([^']+)'([^]*?)\}(?:,|\s*\])/g)].map(m=>{const item=m[0];return {slug:m[1],role:getString(item,'role'),period:getString(item,'period'),summary:getString(item,'summary'),title:getString(item,'title'),category:getString(item,'category'),tools:[...(item.match(/tools:\[([^\]]*)\]/)?.[1]||'').matchAll(/'([^']+)'/g)].map(x=>x[1])};});
const questions=[...dataJs.slice(dataJs.indexOf('export const questions')).matchAll(/\['([^']*)','([^']*)'\]/g)].map(m=>({question:m[1],answer:m[2]}));
const iviJs=fs.readFileSync(path.join(root,'work/ivi/script.js'),'utf8');
const tasks=[...iviJs.matchAll(/(climate|menu|phone):\{([^]*?)\}/g)].map(m=>({key:m[1],label:getString(m[2],'label'),title:getString(m[2],'title'),values:(m[2].match(/values:\[([^\]]+)\]/)?.[1]||'').split(',').map(Number),note:getString(m[2],'note'),stat:getString(m[2],'stat')}));
if(projects.length!==4||questions.length!==5||tasks.length!==3)throw Error('Unexpected source data shape');
fs.writeFileSync(path.join(__dirname,'structured-data.json'),JSON.stringify({sourceFiles:['data.js','work/ivi/script.js'],contactEmail:dataJs.match(/CONTACT_EMAIL\s*=\s*'([^']+)'/)?.[1],projects,questions,ivi:{unit:'seconds',layoutOrder:['통합 메뉴형','더블 탭 메뉴형','상단 메뉴형','측면 메뉴형'],tasks},claimStatus:'Page claims preserved; not new research verification'},null,2));
fs.writeFileSync(path.join(__dirname,'extraction-report.json'),JSON.stringify({pages:summaries,projects:projects.length,questions:questions.length,iviTasks:tasks.length,websiteExecuted:false},null,2));
console.log(JSON.stringify(summaries));
