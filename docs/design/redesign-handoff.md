# 리디자인 구현 인계

2026-11-15: 사용자가 Sol Ultra로 새 포트폴리오 구현 시작을 지시했다. 새 구현은 `redesign/`, 브랜치는 `redesign/implementation-20261115`다. 기존 완성본은 `archive/pre-redesign-20261114`, 직전 준비 자료는 `redesign/preparation-20261114`에 보존한다. 기존 dist와 사용자 다운로드 원본을 변경하지 않았다.

## 현재 결과

- 메인: 입체 심볼 히어로 → 프로필·이력 → HOW I WORK → 네 프로젝트 → 다섯 Q&A → 파도 전환 → 밝은 Contact.
- 폰트: 로컬 SUIT Variable, Source Serif 4 Roman·정식 Variable Italic. 라이선스는 `redesign/assets/fonts/`에 포함했다.
- 히어로: 기존 심볼과 동일한 마스터 좌표를 THREE.js로 돌출하고 코발트·실버 스튜디오 재질을 적용했다. SVG 포스터 대체 화면, 화면 밖 렌더 중단, 모션 정지, 운영체제 움직임 축소 설정을 지원한다.
- 표지: LG·카페콕·OFFER는 실제 제품 캡처를 내장한 SVG와 벡터 기기 프레임. IVI는 사용자가 지정한 기존 콘셉트 표지를 메인과 상세에 같이 사용했다. 원본 SHA256·크롭·한계는 `redesign/assets/covers/manifest.json`에 기록했다.
- 상세: LG는 플럼·그래파이트의 도구 편집, IVI는 웜화이트·그린의 연구 편집, 카페콕은 카페 공간·큰 모바일 화면, OFFER는 타이포·그리드·반응형 비교로 구분했다.
- 링크: 본문 안에 별도 확대·프로토타입 버튼을 넣지 않았다. 표지 CTA와 오른쪽 아래 플로팅 CTA가 같은 목적지로 이어지고 동시에 보이지 않도록 처리했다. 페이지 끝의 다음·이전 표지에서는 플로팅을 숨긴다.
- 스크롤: 브라우저 기본 스크롤과 Q&A의 가로 스냅을 사용한다. 표지 확대 진입은 지원 브라우저의 View Transition으로 향상되며 기본 링크도 동작한다.
- 프로필: 이력서의 검증된 사실을 선별했다. SBS 수강은 교육 경험으로 명시했으며 전화·주소·생년월일을 공개하지 않았다.

## 파일과 출처

메인 `redesign/index.html`은 `scripts/build-redesign-home.cjs`가 프로필·Q&A JSON으로 생성한다. 상세 HTML과 프로젝트별 CSS는 직접 편집하는 원본이다. 공통은 `redesign/styles/{system,home,cases}.css`와 `redesign/scripts/{site,hero}.js`다.

`scripts/prepare-redesign.cjs`는 기존 자산·제품 데모·전환 의존성·LG 가이드·폰트·아이콘을 새 루트로 복사한 뒤 IVI 정식 고해상도 렌더를 덮어 적용한다. `scripts/create-cover-assets.cjs`는 기존 제품 이미지를 손상 없이 목업에 합성하며 sharp가 필요하다. `scripts/finalize-redesign.cjs`는 네 상세의 공통 헤더와 표지 크기 표기를 맞춘다. 원본 제품 인터페이스를 실행하는 스크립트는 아니다.

IVI 최신 화면 7장은 Figma 원본에서 4×, 2616×1600 PNG로 다시 내보냈다. 보관본과 노드·해시 기록은 `docs/design/references/ivi-native-20261115/`, 사용본은 `redesign/work/ivi/assets/latest/`다. 기존 654px 표시 폭을 유지하여 고밀도 화면의 선명도를 높인다. 원래 디자인 내부 래스터 자산의 해상도까지 새로 만들어 내지는 않는다.

내용 출처: `docs/projects/content-snapshot-20261114/`, 각 `docs/projects/*.md`, `docs/projects/profile-content-20261115.json`, `docs/design/qa-content-20261115.json`. 메인 추출 범위는 `redesign/content-provenance.json`에도 기록한다. LG 연구의 모델 설명력을 개선율로 바꾸거나 IVI 실험·콘셉트·최신 지도 상태를 같은 검증 결과로 섞지 않았다. 카페콕과 OFFER의 가상 데이터·데모·후속 검증은 사실과 구분했다.

## 검증 상태

수행: HTML의 실제 파일 경로·섹션 앵커·ARIA 대상·중복 ID·이미지 속성, CSS/폰트/모듈 경로, JavaScript 구문, CTA 목적지 일치, 원본 제품 의존 파일, SVG 내장 픽셀·종횡비 검증. 커버는 sharp로 정적인 PNG proof를 만들고 확인했다.

수행하지 않음: 웹 서버 시작, 웹사이트 또는 프로토타입 실행, 브라우저 화면·키보드·터치 검수, WebGL 재질의 실제 렌더 확인, 기기별 성능 측정, 배포. 정적 검사 통과는 이 항목들의 통과를 의미하지 않는다. 사용자의 이전 실행 보류를 유지했다.

검사 명령: `npm run check:redesign`. 결과는 `docs/design/redesign-static-check-20261115.json`에 저장한다. 사이트 실행 승인이 오면 `npm run dev:redesign`으로 이 구현만 로컬 4175번 포트에 띄울 수 있다. 해당 명령은 아직 실행하지 않았다. 데스크톱·태블릿·모바일과 움직임 축소 상태를 먼저 확인하고, 확인된 문제에만 Astra를 사용하는 것이 사용자의 모델 선택 방향이다.
