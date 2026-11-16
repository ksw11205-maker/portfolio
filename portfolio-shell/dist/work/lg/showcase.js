// Short descriptions stay beside the actual interface. The shared fixed action opens the tool.
(()=>{
 const specs={
 'actual-upload.png':[['화면 이미지 올리기','분석할 TV UI를 올리고 평가 준비를 시작합니다.']],
 '01-input.webp':[['평가 유형','화면에 맞는 탐색형 또는 설정·조작형을 선택합니다.'],['요인값 확인','인식한 화면 요소와 분석에 사용할 값을 확인하고 조정합니다.']],
 '02-analysis.webp':[['점수와 등급','현재 화면의 사용성 점수와 등급을 확인합니다.'],['개선할 요인','영향도와 개선 권고를 읽고 우선 검토할 항목을 정합니다.']],
 '03-alternative.webp':[['개선 조건 선택','변경할 요인을 선택하고 대안 생성을 준비합니다.'],['제안 검토','AI가 제안한 변경 내용을 읽고 비교할 대안을 고릅니다.']],
 '04-comparison.webp':[['나란히 비교','원본과 대안의 화면, 요인값과 점수 변화를 함께 확인합니다.']]
 };
 for(const figure of document.querySelectorAll('#tool-flow .capture')){
  const img=figure.querySelector('img');if(!img)continue;const notes=specs[img.getAttribute('src').split('/').pop()];if(!notes)continue;
  let box=img.parentElement;if(box===figure){box=document.createElement('div');img.before(box);box.append(img)}box.classList.add('tool-capture-image');
  const aside=document.createElement('aside');aside.className='tool-role-notes';aside.setAttribute('aria-label','화면 설명');
  for(const [title,description] of notes){const note=document.createElement('div');const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=description;note.append(h,p);aside.append(note)}
  const layout=document.createElement('div');layout.className='tool-capture-layout';box.before(layout);layout.append(box,aside);figure.classList.add('tool-annotated-capture');
 }
})();
