const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),p=await b.newPage(),audit=[];
for(const slug of ['lg','ivi','cafekok','offer']){const file=`redesign/work/${slug}/${slug==='offer'?'case-study.html':'index.html'}`,html=fs.readFileSync(file,'utf8');if(html.includes('data-unified-case'))throw Error('Already restructured: '+slug);
const result=await p.evaluate(({html,slug})=>{
 const d=new DOMParser().parseFromString(html,'text/html'),main=d.querySelector('main'),q=s=>d.querySelector(s),all=s=>[...d.querySelectorAll(s)],originalImages=all('main img').map(i=>i.getAttribute('src')),tables=all('table').map(t=>t.textContent);
 const el=(tag,cls,text)=>{let n=d.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
 const para=t=>el('p','case-lead',t);
 const old=[...main.children],hero=q('.archive-hero'),next=q('.next-projects');
 const chapters=['OVERVIEW','BACKGROUND','RESEARCH','DIRECTION','CONCEPT','DESIGN SYSTEM','FINAL DESIGN','RETROSPECTIVE'];
 const titles={lg:['연구의 근거를, 화면의 판단으로.','멀리서 조작하는 TV, 판단 기준이 필요했습니다.','사용성 요인에서 예측 모델까지.','점수보다, 바꿀 수 있는 요인을.','입력부터 비교까지 하나의 흐름.','연구를 읽기 쉬운 작업 공간으로.','화면을 입력하고, 대안을 비교합니다.','화면의 이유를 설명하는 디자이너로.'],ivi:['기능에 따라 달라지는 화면의 기준.','하나의 화면에 모인 기능, 다른 조작 방식.','네 가지 레이아웃을 같은 기준으로.','탐색은 고정하고, 조절은 바로.','측면 메뉴와 하단 공조의 결합.','같은 조건에서 비교하는 인터페이스.','실험에서 설계 제안까지.','순위보다 기능의 성격을 먼저.'],cafekok:['취향에서 오늘의 공간으로.','좋은 카페보다, 지금 나에게 맞는 카페.','선택의 기준부터 정리했습니다.','평소 취향과 오늘의 목적을 나눕니다.','나를 알고, 오늘의 공간을 찾는 흐름.','공간이 주인공이 되는 따뜻한 프레임.','첫 취향 입력부터 다음 방문까지.','취향을 아는 것에서 선택을 돕는 것으로.'],offer:['흩어진 혜택을 같은 기준으로.','브랜드마다 다른 정보, 비교는 한곳에서.','비교에 필요한 항목을 정리했습니다.','발견·비교·재방문을 연결합니다.','행사 저장과 브랜드 관심을 나눕니다.','브랜드의 개성과 정보의 규칙을 함께.','발견에서 비교, 저장으로.','정보를 모으는 서비스에서 선택을 돕는 구조로.']}[slug];
 const sections=chapters.map((name,i)=>{let s=el('section','case-section unified-chapter');s.id=name.toLowerCase().replaceAll(' ','-');s.dataset.chapter=String(i+1).padStart(2,'0');s.setAttribute('aria-labelledby',s.id+'-title');let h=el('header','chapter-heading');h.append(el('p','section-kicker',String(i+1).padStart(2,'0')+' / '+name));let title=el('h2','case-heading',titles[i]);title.id=s.id+'-title';h.append(title);s.append(h);return s});
 const add=(i,...nodes)=>nodes.filter(Boolean).forEach(n=>sections[i].append(n));
 const note=(i,text)=>sections[i].querySelector('.chapter-heading').append(para(text));
 const move=(selector,i)=>{let n=q(selector);if(n)add(i,n);return n};
 const block=(selector,i)=>{let n=q(selector);if(!n)return;let a=el('article','evidence-block');let h=n.querySelector('h2');if(h){let h3=el('h3','evidence-title',h.textContent);if(h.id)h3.id=h.id;h.replaceWith(h3)}n.querySelectorAll('.section-kicker').forEach(k=>k.remove());while(n.firstChild)a.append(n.firstChild);add(i,a);return a};
 const figures={};all('.annotated-interface').forEach(f=>figures[f.dataset.interface]=f);
 function group(key,label,title,description,target=6){const f=figures[key];if(!f)throw Error('Missing figure '+key);let a=el('article','final-screen-group');a.dataset.screen=key;a.append(el('h3','screen-group-title',title));f.querySelectorAll('.annotation-labels').forEach(n=>n.remove());let stage=f.querySelector('.annotation-stage');const copy=el('div','screen-group-copy');copy.append(el('span','feature-keyword',label),el('p','',description));f.insertBefore(copy,f.querySelector('figcaption'));a.append(f);add(target,a);return a}
 function asset(key,src,label,title,description){let a=el('article','final-screen-group');a.dataset.screen=key;a.append(el('h3','screen-group-title',title));let f=el('figure','annotated-interface is-mobile-ui');f.dataset.interface=key;let stage=el('div','annotation-stage'),device=el('div','interface-device'),content=el('div','interface-content'),img=el('img','interface-image');img.src=src;img.alt=title;img.loading='lazy';content.append(img);device.append(content);stage.append(device);let copy=el('div','screen-group-copy');copy.append(el('span','feature-keyword',label),el('p','',description));f.append(stage,copy);a.append(f);add(6,a)}
 note(0,hero.querySelector('.archive-summary').textContent);const meta=hero.querySelector('.archive-meta').cloneNode(true);meta.className='unified-project-meta';add(0,meta);
 if(slug==='lg'){
  move('.role-note',0);block('#overview',1);block('#research',2);block('.factor-section',2);move('.connection-note',3);block('#model',2);
  note(3,'주요 요인을 확인하고 조정할 수 있어야 연구의 숫자가 실제 디자인 판단으로 이어집니다.');
  note(4,'API 연결 → 화면 입력 → 분석·예측 → 대안 생성 → 비교. 평가와 수정이 끊기지 않도록 작업 순서를 구성했습니다.');move('.tool-flow',4);
  note(5,'원본 화면은 작업 공간의 중심에, 입력값과 권장안은 구분된 패널에 배치했습니다. 아래 규칙은 현재 프로토타입의 표현 기준입니다.');move('.tool-component-details',5);
  note(6,'실제 AI Design Tool 프로토타입의 진입 순서입니다. 예측 점수와 대안값은 데모이며 검증된 개선 성과와 구분합니다.');
  [['api-start','CONNECT','분석 연결을 준비합니다.','키를 입력하고 연결한 뒤 평가를 시작합니다. 실제 키는 캡처에 포함하지 않았습니다.'],['before-upload','TASK INPUT','평가 유형과 화면을 입력합니다.','탐색형과 설정·조작형을 구분하고 원본 TV 화면을 불러옵니다.'],['01-input','FACTOR INPUT','화면의 요인값을 점검합니다.','원본 UI와 입력값을 함께 확인한 뒤 분석을 시작합니다.'],['02-analysis','ANALYSIS / PREDICTION','예측 점수와 영향 요인을 읽습니다.','전체 점수에서 요인별 영향으로 읽는 순서를 잡아 수정할 항목을 판단하게 했습니다.'],['03-alternative','DESIGN ALTERNATIVES','바꿀 요인을 선택해 대안을 만듭니다.','AI 권장안과 사용자의 선택을 구분하고 생성 후 변경값을 확인합니다.'],['04-comparison','COMPARE RESULTS','기존 화면과 대안을 같은 척도로 비교합니다.','53점·61점은 프로토타입 예시값이며 실제 사용자 검증 성과가 아닙니다.'],['workspace','SETTINGS / WORKSPACE','이전 작업과 작업 환경을 확인합니다.','검색·상태 필터로 기록을 찾고 이전 대안으로 이어집니다. API·모델 정보 등 공통 조작은 앞의 디자인 시스템에 정리했습니다.']].forEach(x=>group(...x));
  block('#reflection',7);
 }else if(slug==='ivi'){
  block('#overview',1);block('#study',2);move('.study-setup',6);move('.measure-rail',2);const tasks=q('.task-cards');
  block('#findings',2);block('#click-patterns',2);block('#voices',2);move('.direction-principles',3);
  note(3,'공조의 반복 조절과 메뉴·전화 탐색에서 관찰한 차이를 서로 다른 배치 원칙으로 연결했습니다.');note(4,'측면 고정 메뉴와 하단 공조를 결합하는 후속 설계안입니다. 이 결합안 자체의 사용성은 아직 검증하지 않았습니다.');
  note(5,'네 실험 화면에는 같은 기능을 배치하고 메뉴의 위치와 접근 구조를 달리했습니다. 수행시간·클릭·주관적 부담을 함께 비교했습니다.');move('.version-note',5);
  note(6,'실험 장비 → 터치스크린 과제 → 관찰 결과 → 후속 설계 제안 순서입니다. 현재 지도 갱신 화면과 당시 실험 결과는 버전을 구분합니다.');
  const setup=sections[6].querySelector('.study-setup');if(setup){let h=el('h3','screen-group-title','실험 환경과 참여 조건');setup.before(h)}
  [['climate','EXPERIMENT / CLIMATE','지정한 공조 상태를 맞춥니다.','온도·풍량과 열선·김서림 방지의 켜기·끄기를 설정하는 과제입니다.'],['menu','EXPERIMENT / MENU','앱을 찾고 퀵 버튼 위치를 바꿉니다.','기능을 찾는 탐색 과정과 버튼 조작의 정확도를 함께 살폈습니다.'],['phone','EXPERIMENT / PHONE','연락처 탐색에서 통화 연결까지 봅니다.','지정한 인물을 찾아 전화를 거는 흐름을 측정했습니다. 화면 속 이름은 예시입니다.']].forEach(x=>group(...x));
  let finding=el('article','final-finding');finding.append(el('span','feature-keyword','RESEARCH FINDINGS'),el('h3','','공조는 통합형, 탐색과 전화는 측면형.'),para('평균 수행시간은 각각 15.15초·19.49초·13.87초였습니다. n=15의 실험 결과이며 세부 조건과 유의성은 RESEARCH에 제시했습니다.'));add(6,finding);
  group('concept-clean','PROPOSED / NOT YET VALIDATED','관찰 결과를 하이브리드 UI로 연결합니다.','측면 메뉴는 탐색의 시작점으로, 하단 공조는 반복 조절의 영역으로 제안했습니다. 결합안은 추가 검증 전입니다.');
  block('#reflection',7);
 }else if(slug==='cafekok'){
  move('.cafe-equation',4);move('.metric-strip',2);move('.product-flow',4);move('.cafe-material-board',5);block('#premise',1);
  note(2,'개인 기획 프로젝트로 사용자 조사는 아직 수행하지 않았습니다. 아래는 구현을 위해 정리한 취향·목적의 구조이며 추천 효과를 검증한 수치가 아닙니다.');
  note(3,'오래 유지되는 취향은 설정에서, 오늘의 방문 목적은 홈에서 바꾸도록 나눴습니다. 조건과 추천 이유를 가까이 두어 선택을 설명하게 했습니다.');
  note(4,'취향 입력 → 목적 선택 → 후보 탐색 → 상세 확인 → 저장. 다음 방문에서도 나의 기준을 이어갑니다.');
  note(5,'카페 사진의 개성을 살리고 브라운·밝은 중립색으로 정보의 틀을 유지합니다. 제품 UI의 실제 색상과 포트폴리오의 살구 강조색은 역할을 구분합니다.');
  note(6,'현재 구현된 앱의 첫 진입부터 추천·상세·저장·지도까지 순서대로 보여줍니다.');
  asset('onboarding','/work/cafekok/assets/editorial/onboarding.png','ONBOARDING','나의 취향으로 시작합니다.','시작 화면에서 취향 입력으로 바로 이어집니다.');
  [['quiz','PREFERENCE SETUP','한 번에 하나의 취향을 묻습니다.','6단계 진행 상태를 알리고 이전·다음 행동을 같은 위치에 둡니다.'],['profile','MY PREFERENCES','취향은 요약하고, 바뀐 항목만 고칩니다.','여섯 기준을 다시 확인하고 수정하도록 구성했습니다.'],['home','RECOMMENDATIONS','오늘의 방문 목적을 더합니다.','현재 위치와 평소 취향을 기준으로 공부·데이트·친구·드라이브 목적을 선택합니다.'],['explore','EXPLORE','조건을 조정하며 후보를 좁힙니다.','적용한 조건과 결과 수를 함께 보고 지도·정렬로 읽는 방식을 바꿉니다.'],['detail','CAFÉ DETAILS','추천한 이유를 확인합니다.','일치율을 문장과 태그로 설명하고 지도 보기·저장으로 연결합니다.'],['saved-empty','FIRST SAVE','빈 목록에서도 다음 행동을 안내합니다.','첫 카페를 담는 방법과 탐색 진입을 함께 제공합니다.'],['saved','SAVED CAFÉS','다음 방문을 위해 다시 비교합니다.','저장 상태를 채운 북마크로 알리고 탐색과 같은 정보 순서를 유지합니다.']].forEach(x=>group(...x));
  asset('map','/work/cafekok/assets/current/map.png','MAP VIEW','목록에서 지도로 탐색 방식을 바꿉니다.','같은 조건의 카페를 지도 영역에서 확인합니다. 이 기존 캡처는 위치 미확인 상태의 대체 지도를 보여줍니다.');block('#reflection',7);
 }else{
  move('.offer-principles',3);move('.offer-info-order',2);move('.offer-system-line',5);block('#premise',1);
  note(2,'브랜드·행사명 → 최대 혜택 → 기간 → 상태를 비교의 공통 항목으로 정리했습니다. 사용자 조사 성과가 아닌 기획 가설이며 가상 프로모션을 사용합니다.');
  note(3,'발견할 출발점을 모으고 같은 순서로 비교하며 저장·팔로우로 재방문을 연결합니다.');
  note(4,'개별 행사를 다시 보는 Saved와 브랜드의 다음 혜택을 살피는 Follow를 분리했습니다. 구현된 저장·관심 흐름을 보여주며 알림 기능은 추가하지 않았습니다.');
  note(5,'Pretendard와 중립색 프레임으로 브랜드가 달라도 정보를 같은 순서로 읽게 합니다. 오렌지는 혜택·마감 상태와 주요 조작에 집중합니다.');
  note(6,'홈 → 카테고리 탐색 → 상세 → 필터 → 저장·팔로우 → 반응형 순서입니다. 캡처는 가상 행사와 샘플 저장 상태이며 공식 링크는 브랜드 홈페이지로 연결됩니다.');
  [['home','HOMEPAGE','검색과 브랜드에서 탐색을 시작합니다.','검색어가 있으면 검색부터, 없으면 카테고리와 익숙한 브랜드에서 발견하게 했습니다.'],['explore','CATEGORY EXPLORATION','같은 항목으로 혜택을 비교합니다.','카테고리·브랜드·상태로 후보를 좁히고 혜택과 기간을 같은 위치에서 읽습니다.'],['detail','PROMOTION DETAILS','큰 할인율 다음에 적용 조건을 읽습니다.','최대 할인과 제외 조건·기간을 함께 보여주고 저장과 이용 조건 확인을 구분합니다.'],['filtered','FILTERING','조건과 결과를 함께 확인합니다.','선택 조건을 채움으로 구분하고 결과 수·초기화를 가까이 뒀습니다. 26→13개는 데모 데이터입니다.'],['saved','SAVED ITEMS','저장한 행사를 상태로 다시 찾습니다.','진행 중·예정·종료를 구분하고 직접 해제하기 전까지 목록에 유지합니다.'],['favorites','FOLLOW BRANDS','브랜드에 대한 관심을 이어갑니다.','팔로우 변경과 혜택 보기를 분리해 관심 상태를 유지한 채 탐색합니다.'],['brand','BRAND OFFERS','브랜드의 혜택을 같은 규칙으로 살핍니다.','팔로우 상태와 익숙한 진행 상태 필터를 브랜드 상세에서도 이어갑니다.'],['explore-responsive','DESKTOP / 4 COLUMNS','데스크톱에서는 네 개의 후보를 나란히.','같은 Explore 콘텐츠를 기기 폭에 맞춰 배치합니다.'],['tablet-responsive','TABLET / 2 COLUMNS','태블릿에서는 두 열로 비교합니다.','카드 정보의 순서를 유지하면서 한 번에 보여주는 양을 줄였습니다.'],['mobile-responsive','MOBILE / 1 COLUMN','모바일에서는 한 열로 읽습니다.','좁은 폭에서도 혜택·기간·상태의 비교 기준은 유지합니다.']].forEach(x=>group(...x));block('#reflection',7);
 }
 // Preserve old deep links where content moved; public chapter links use the new eight IDs.
 const aliases={lg:{model:'research',interface:'final-design',reflection:'retrospective'},ivi:{study:'research',method:'final-design',findings:'research','click-patterns':'research',voices:'research',reflection:'retrospective'},cafekok:{premise:'background',taste:'final-design',purpose:'final-design',explore:'final-design',return:'final-design',reflection:'retrospective'},offer:{premise:'background',discover:'final-design',compare:'final-design',decide:'final-design',return:'final-design',responsive:'final-design',reflection:'retrospective'}}[slug];
 Object.entries(aliases).forEach(([id,target])=>{if(!sections.some(s=>s.id===id)){let a=el('span','chapter-alias');a.id=id;sections.find(s=>s.id===target).prepend(a)}});
 // The cover stays visually intact; the eight semantic chapters begin below it.
 const cover=el('div',hero.className);[...hero.attributes].forEach(a=>{if(a.name!=='class')cover.setAttribute(a.name,a.value)});while(hero.firstChild)cover.append(hero.firstChild);
 let toc=el('aside','case-toc'),nav=el('nav','case-nav');toc.setAttribute('aria-label','프로젝트 목차');nav.setAttribute('aria-label','프로젝트 8개 목차');chapters.forEach((t,i)=>{let a=el('a','',String(i+1).padStart(2,'0')+' '+t);a.href='#'+sections[i].id;nav.append(a)});toc.append(nav);
 main.replaceChildren(cover,toc,...sections,next);
 // Old subchapter labels become short evidence headings rather than competing sections.
 main.querySelectorAll('.evidence-block .section-kicker').forEach(e=>e.remove());
 const link=el('link');link.rel='stylesheet';link.href='/styles/unified-cases.css';d.head.append(link);d.body.setAttribute('data-unified-case','');
 const currentImages=[...main.querySelectorAll('img')].map(i=>i.getAttribute('src'));
 const missing=[...new Set(originalImages.filter(src=>!currentImages.includes(src)))];
 // Preserve meaningful authentic assets from legacy overview compositions as a compact evidence gallery.
 if(missing.length){let gallery=el('div','original-evidence-gallery');missing.forEach(src=>{const source=[...new DOMParser().parseFromString(html,'text/html').querySelectorAll('main img')].find(i=>i.getAttribute('src')===src);if(source){let f=el('figure','screen');f.append(d.importNode(source,true));f.append(el('figcaption','screen-caption',source.alt));gallery.append(f)}});add(2,gallery)}
 const lostTables=tables.filter(t=>![...main.querySelectorAll('table')].some(n=>n.textContent===t));if(lostTables.length)throw Error('Research table loss');
 return {html:'<!doctype html>\n'+d.documentElement.outerHTML,originalImages,tableCount:tables.length,finalOrder:[...sections[6].querySelectorAll('[data-screen]')].map(x=>x.dataset.screen)};
},{html,slug});
fs.writeFileSync(file,result.html);audit.push({slug,beforeHash:crypto.createHash('sha256').update(html).digest('hex'),...Object.fromEntries(Object.entries(result).filter(([k])=>k!=='html'))});console.log(slug,result.finalOrder.join(' → '));}
fs.writeFileSync('docs/design/master-review/unified-preservation.json',JSON.stringify(audit,null,2));await b.close()})();
