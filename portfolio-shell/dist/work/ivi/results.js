/* Animate real values only. Performance has no good/bad ranking. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const tables=[...document.querySelectorAll('#findings .subjective-table')];
 tables.forEach((section,index)=>{
  section.querySelectorAll('tbody tr').forEach(row=>{const label=row.querySelector('th')?.textContent||'';if(label.includes('작업 수행도')){row.dataset.scoreNeutral='true';row.querySelectorAll('td').forEach(td=>{td.classList.remove('best-score','high-burden');td.title='작업 수행도 · 부담 항목과 같은 방향으로 순위화하지 않음'});return}const cells=[...row.querySelectorAll('td')],values=cells.map(td=>Number(td.textContent)),min=Math.min(...values),max=Math.max(...values);cells.forEach((td,i)=>{const good=index===0?values[i]===min:values[i]===max,bad=index===0?values[i]===max:values[i]===min;td.classList.toggle('best-score',good);td.classList.toggle('high-burden',bad);td.title=good?(index===0?'이 항목에서 가장 낮은 평균 부담':'이 항목에서 가장 높은 평균 만족'):bad?(index===0?'이 항목에서 가장 높은 평균 부담':'이 항목에서 가장 낮은 평균 만족'):'평균값';})});
  const legend=document.createElement('div');legend.className='ivi-score-legend';legend.innerHTML=index===0?'<span><i></i>낮은 평균 부담</span><span><i></i>높은 평균 부담</span>':'<span><i></i>높은 평균 만족</span><span><i></i>낮은 평균 만족</span>';section.querySelector('h3')?.after(legend);
 });
 const sheenStates=new WeakMap();
 let gateFrame=0;
 function drawTables(){gateFrame=0;for(const table of tables){const scene=table.closest('.chapter-step-layer')||table;const state=window.PortfolioReadingGate?.state(table,{scene});const started=reduced.matches||!!state?.started;table.classList.toggle('results-table-visible',started);table.dataset.readingGate=started?'started':'waiting'}
  const chart=document.getElementById('time-chart');if(chart){const scene=chart.closest('.chapter-step-layer')||chart.closest('.result-panel');const state=window.PortfolioReadingGate?.state(chart,{scene});const started=reduced.matches||!!state?.started;
   for(const animation of chart.getAnimations({subtree:true})){if(animation.animationName!=='ivi-result-sheen')continue;if(!started){animation.pause();animation.currentTime=0;sheenStates.set(animation,false)}else if(sheenStates.get(animation)!==true){if(!reduced.matches)animation.play();else animation.finish();sheenStates.set(animation,true)}}
  }
 }
 function scheduleTables(){if(!gateFrame)gateFrame=requestAnimationFrame(drawTables)}
 addEventListener('scroll',scheduleTables,{passive:true});addEventListener('resize',scheduleTables);addEventListener('pageshow',scheduleTables);reduced.addEventListener('change',scheduleTables);drawTables();
 addEventListener('pagehide',e=>{if(!e.persisted){cancelAnimationFrame(gateFrame);removeEventListener('scroll',scheduleTables);removeEventListener('resize',scheduleTables);reduced.removeEventListener('change',scheduleTables)}});
 const chart=document.getElementById('time-chart');if(chart){let last='';const observer=new MutationObserver(()=>{const key=chart.textContent;if(key===last)return;last=key;scheduleTables();if(reduced.matches)return;chart.animate([{opacity:.65,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'});document.querySelector('.result-message')?.animate([{opacity:.7},{opacity:1}],{duration:350});});observer.observe(chart,{childList:true});addEventListener('pagehide',e=>{if(!e.persisted)observer.disconnect()})}
})();
