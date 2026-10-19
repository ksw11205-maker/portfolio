// Each chapter is independently editable; keep original study data separate from presentation.
const tasks={
 climate:{label:'공조 조절',title:'통합형에서<br>더 빠르게 조절했습니다.',values:[15.15,19.14,22.32,17.96],best:0,note:'상단형 22.32초 대비 평균 7.17초 짧음',stat:'통합형 ↔ 상단형: Tukey HSD 사후검정에서 차이 확인'},
 menu:{label:'메뉴 탐색',title:'측면형에서<br>더 빠르게 찾았습니다.',values:[22.15,24.74,28.71,19.49],best:3,note:'상단형 28.71초 대비 평균 9.22초 짧음',stat:'측면형 ↔ 상단형: Tukey HSD 사후검정에서 차이 확인'},
 phone:{label:'전화 걸기',title:'측면형에서<br>더 빠르게 접근했습니다.',values:[15.35,20.14,16.05,13.87],best:3,note:'더블 탭형 20.14초 대비 평균 6.27초 짧음',stat:'측면형 ↔ 더블 탭형: Tukey HSD 사후검정에서 차이 확인'}
};
const names=['통합 메뉴형','더블 탭 메뉴형','상단 메뉴형','측면 메뉴형'];
function renderTask(key){
 const t=tasks[key];
 document.querySelectorAll('[data-task]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.task===key)));
 document.getElementById('result-category').textContent=t.label;
 document.getElementById('result-title').innerHTML=t.title;
 document.getElementById('result-value').textContent=t.values[t.best].toFixed(2);
 document.getElementById('result-note').textContent=t.note;
 document.getElementById('stat-note').textContent=t.stat;
 document.getElementById('time-chart').innerHTML=t.values.map((v,i)=>`<div class="bar-row ${i===t.best?'best':''}"><div class="bar-label"><span>${names[i]}${i===t.best?' · 최단':''}</span><b>${v.toFixed(2)}초</b></div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--bar:${v/30*100}%"></div></div></div>`).join('');
}
document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>renderTask(b.dataset.task)));
renderTask('climate');
