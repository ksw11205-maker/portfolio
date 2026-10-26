/* Search, category, brand, status and sort compose into a shareable URL. */
offerReady.then(({brands,promotions})=>{
const U=OFFER;
let category='all',q='',sort='popular',brand='all',status='all';
function readURL(){const p=new URLSearchParams(location.search);category=['fashion','beauty','food','lifestyle'].includes(p.get('category'))?p.get('category'):'all';q=p.get('q')||'';sort=['popular','new','ending','discount'].includes(p.get('sort'))?p.get('sort'):'popular';brand=brands.some(b=>b.id===p.get('brand'))?p.get('brand'):'all';status=['active','ending','upcoming','ended'].includes(p.get('status'))?p.get('status'):'all';}
readURL();
document.getElementById('main').innerHTML='<div class="container page-content"><div class="page-intro explore-intro"><p class="eyebrow">FIND SOMETHING WORTH KEEPING</p><h1>Explore OFFERs<span class="heading-dot">.</span></h1><p>브랜드부터 기간까지, 원하는 조건으로 발견하세요.</p></div><div class="explore-search">'+U.searchForm(q,'explore-search')+'</div><div class="discovery-controls">'+U.filters(category)+'<div class="refine-row"><div class="refine-fields"><label>브랜드<select id="brand-filter" class="sort-select"><option value="all">모든 브랜드</option>'+brands.map(b=>'<option value="'+b.id+'">'+U.escape(b.name)+'</option>').join('')+'</select></label><label>진행 상태<select id="status-filter" class="sort-select"><option value="all">전체 상태</option><option value="active">진행 중</option><option value="ending">3일 내 마감</option><option value="upcoming">오픈 예정</option><option value="ended">종료</option></select></label></div><label class="sort-label">정렬<select class="sort-select" id="sort"><option value="popular">추천순</option><option value="new">최신 등록순</option><option value="ending">마감 임박순</option><option value="discount">최대 할인율순</option></select></label></div></div><div class="results-line"><p id="result-count" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" class="reset-filters" id="reset-filters" hidden>조건 초기화 ↺</button></div><div id="explore-results"></div></div>';
function render(update=true){
 const needle=q.trim().toLocaleLowerCase();let items=promotions.filter(p=>(category==='all'||p.category===category)&&(brand==='all'||p.brandId===brand)&&U.matchesState(p,status)&&[p.title,p.brandName,brands.find(b=>b.id===p.brandId)?.koreanName,...p.tags].join(' ').toLocaleLowerCase().includes(needle));
 const endRank=p=>U.state(p)==='ended'?1e6:U.state(p)==='upcoming'?1e5+U.remaining(p):U.remaining(p);
 items.sort(sort==='new'?(a,b)=>b.createdAt.localeCompare(a.createdAt):sort==='discount'?(a,b)=>b.discount.max-a.discount.max:sort==='ending'?(a,b)=>endRank(a)-endRank(b):(a,b)=>b.popularity-a.popularity);
 document.getElementById('result-count').textContent=items.length+'개의 OFFER'+(q?' · “'+q+'” 검색 결과':'');
 document.getElementById('explore-results').innerHTML=items.length?U.grid(items):'<div class="empty-state"><div><p class="eyebrow">NO MATCH YET</p><h3>이 조건에 맞는 OFFER가 없어요.</h3><p>브랜드나 진행 상태를 바꾸거나, 조건을 초기화해 다시 찾아보세요.</p></div><button type="button" class="button button-primary" data-reset>전체 OFFER 보기 '+U.icon('arrow')+'</button></div>';
 document.querySelectorAll('[data-category]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.category===category));
 document.getElementById('brand-filter').value=brand;document.getElementById('status-filter').value=status;document.getElementById('sort').value=sort;
 document.getElementById('reset-filters').hidden=category==='all'&&brand==='all'&&status==='all'&&!q&&sort==='popular';
 if(update){const next=new URLSearchParams();if(q)next.set('q',q);if(category!=='all')next.set('category',category);if(brand!=='all')next.set('brand',brand);if(status!=='all')next.set('status',status);if(sort!=='popular')next.set('sort',sort);history.replaceState(null,'','explore.html'+(next.size?'?'+next:''));}
}
function reset(){q='';category=brand=status='all';sort='popular';document.getElementById('explore-search').value='';render();document.getElementById('explore-search').focus();}
document.querySelector('.search-form').addEventListener('submit',e=>{e.preventDefault();q=document.getElementById('explore-search').value;render();});
document.getElementById('explore-search').addEventListener('input',e=>{q=e.target.value;render();});
document.querySelectorAll('[data-category]').forEach(el=>el.addEventListener('click',()=>{category=el.dataset.category;render();}));
document.getElementById('brand-filter').addEventListener('change',e=>{brand=e.target.value;render();});
document.getElementById('status-filter').addEventListener('change',e=>{status=e.target.value;render();});
document.getElementById('sort').addEventListener('change',e=>{sort=e.target.value;render();});
document.getElementById('reset-filters').addEventListener('click',reset);
document.getElementById('explore-results').addEventListener('click',e=>{if(e.target.closest('[data-reset]'))reset();});
window.addEventListener('popstate',()=>{readURL();document.getElementById('explore-search').value=q;render(false);});
render(false);if(new URLSearchParams(location.search).get('focus')==='search')document.getElementById('explore-search').focus();
});
