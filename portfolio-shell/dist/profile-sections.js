// Text stays in the document; the three decorative strokes only add emphasis.
const keyword=text=>`<em class="statement-keyword">${text}<svg class="statement-underline" viewBox="0 0 320 18" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M2 11 Q46 9 90 10"/><path pathLength="1" d="M90 10 Q139 11 188 10"/><path pathLength="1" d="M188 10 Q254 8 318 10"/></svg></em>`;

export function aboutSection(){return `<section id="about" class="about container section" aria-labelledby="about-title">
  <div class="section-heading reveal"><p class="eyebrow">01 / PROFILE</p><h2 id="about-title">Who I Am</h2></div>
  <div class="about-intro reveal" data-statement>
    <p class="about-statement" lang="ko"><span class="statement-opening">사람을 이해하고,</span>
      <span class="statement-main">${keyword('명확한 경험')}을 설계합니다.</span></p>
    <p class="statement-context" lang="ko">인간공학을 바탕으로, 사용자의 행동과 맥락을 이해합니다.</p>
  </div>
  <div class="about-grid profile-details">
    <div class="reveal"><p class="eyebrow"><span class="profile-number">01</span> — EXPERIENCE</p><h3>동의대학교 UXU LAB</h3><p class="profile-role">학부 연구생</p><p class="profile-date">2024.03–2025.12</p><p class="profile-description" lang="ko">스마트 TV와 차량 IVI의 사용성을 연구하며, 사용자 행동 분석과 인터페이스 개선을 수행했습니다.</p></div>
    <div class="reveal"><p class="eyebrow"><span class="profile-number">02</span> — BACKGROUND</p><ul class="profile-list"><li><h3>동의대학교 인간공학과 졸업</h3><p class="profile-date">2026.02</p></li><li><h3>인간공학기사</h3><p class="profile-date">2024.11</p></li><li class="profile-training"><h3>SBS 아카데미 UX/UI 디자인 교육과정</h3><p class="profile-date">수강 중 · 2026.07–12</p></li></ul></div>
    <div class="reveal"><p class="eyebrow"><span class="profile-number">03</span> — AWARDS</p><ul class="profile-list"><li><h3>장려상</h3><p class="award-event">대한인간공학회 캡스톤 디자인 경진대회</p><p class="profile-date">2025</p></li><li><h3>혁신상</h3><p class="award-event">BDIA 해커톤</p><p class="profile-date">2024</p></li><li><h3>장려상</h3><p class="award-event">대한인간공학회 캡스톤 디자인 경진대회</p><p class="profile-date">2024</p></li></ul></div>
  </div>
</section>`;}

export function toolsSection(toolLogos){
  const principles=[
    {label:'AI 활용',opening:'아이디어를',main:`${keyword('빠르게 검증')}합니다.`,detail:'GPT와 Codex를 활용해 시안을 탐색하고 프로토타입을 구현합니다.'},
    {label:'인간공학',opening:'사용자 행동에서',main:`${keyword('판단의 근거')}를 찾습니다.`,detail:'이용 맥락과 인지부하를 살피고 사용성 평가로 설계를 점검합니다.'},
    {label:'UX/UI',opening:'복잡한 정보를',main:`${keyword('명확한 경험')}으로 만듭니다.`,detail:'정보 구조부터 화면과 인터랙션까지 일관된 흐름으로 연결합니다.'}
  ];
  return `<section class="tools" id="tools" aria-labelledby="tools-title"><div class="container">
    <div class="tools-heading"><p class="eyebrow">WORKING PRINCIPLES</p><h2 id="tools-title">How I Work</h2></div>
    <p class="tools-accessible">사용하는 도구: ${toolLogos.map(tool=>tool.name).join(', ')}.</p>
    <div class="tools-composition"><div class="tools-visual"><div class="tool-marquee" aria-hidden="true"><div class="tool-marquee-track">${[0,1].map(copy=>`<div class="tool-logos" data-copy="${copy}">${toolLogos.map(tool=>`<span class="tool-logo"><img src="${tool.src}" alt="" width="40" height="40" loading="lazy" draggable="false"></span>`).join('')}</div>`).join('')}</div></div></div>
      <div class="tools-capabilities" lang="ko">${principles.map((p,i)=>`<article data-statement><h3><span class="capability-number">0${i+1} /</span> ${p.label}</h3><p class="capability-lead"><span class="capability-opening">${p.opening}</span>
        <span class="capability-main">${p.main}</span></p><p class="capability-detail">${p.detail}</p></article>`).join('')}
      </div>
    </div>
  </div></section>`;
}
