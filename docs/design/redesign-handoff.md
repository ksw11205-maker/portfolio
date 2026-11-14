# 리디자인 구현 인계

## 최신 사용자 수정 · 표지와 모션 · 2026-11-15

작업 루트는 `redesign/`, 로컬 주소는 `http://localhost:4175/`, 브랜치는 `redesign/implementation-20261115`다. 원본 `portfolio-shell/dist/`는 수정하지 않았다.

- LG 표지는 플루트 벽·마젠타 조명·바이올렛 아치·층을 나눈 받침을 추가했다. OFFER는 창빛·석재 테이블·아카이브 벽 선반으로 깊이를 만들었다. 카페콕은 기존 사진을 유지하고 폰 폭을 약 22% 줄여 기울기를 0도로 맞췄다. 실제 홈의 네 목적 버튼까지 보인다. IVI 콘셉트 표지는 유지했다.
- LS Graphics와 Mockup Maison은 장면 구성 참고 자료로 사용했다. 유료 PSD를 사용하지 않았으며 배경은 직접 작성한 SVG다. Devices.css MIT 프레임과 원본 프로젝트 UI를 유지했다. 출처·증명 이미지는 `references/mockup-scene-20261115/`에 있다.
- 네 상세 표지는 메인의 이미지·제목·소개·역할·기간·도구를 그대로 사용한다. 전체 이미지 아래에 메타데이터를 배치하고 본문과 같은 SUIT 글꼴로 통일했다. `scripts/sync-case-covers.cjs`로 동기화한다.
- `case-motion.js/css`는 표지 문구·섹션 제목·UI 번호 주석·연구 차트·회고의 짧은 진입 모션과 주석 호버 강조를 담당한다. 본문을 상시 숨기지 않으며 움직임 축소와 모션 정지를 지원한다.
- Contact는 기존 파도 안에서 다섯 색상 레이어가 서로 다른 경로로 흐른다. 화면 밖·숨긴 탭·모션 정지·움직임 축소 상태에서는 정지한다. WHO I AM의 문장·교육기관·과정·수상 날짜는 의미 단위로 줄을 나눴다.
- 모바일의 다음 프로젝트 카드와 IVI 표가 페이지 전체를 가로로 밀던 문제를 수정했다. 표와 넓은 UI만 해당 영역 안에서 좌우 스크롤된다.

### 검증

격리된 headless Chromium으로 로컬 포트폴리오 5개 페이지를 데스크톱 1440px·모바일 390px에서 렌더링했다. 실제 사용자 브라우저·프로필은 사용하지 않았다. 프로필 줄바꿈, 표지, 본문 도입, Contact의 화면을 확인했다. 상세와 Contact 모션은 일반 모션과 움직임 축소 상태로 기능 검사했다. 증거와 재현 명령은 `qa-visual-20261115/{report,case-motion,contact-motion}.json`, `scripts/qa-{visual-local,case-motion,contact-motion}.cjs`에 있다. 원본 제품의 전체 사용자 흐름, 실제 모바일 기기의 성능, 배포는 이번 검수 범위가 아니다.

정적 검사는 `npm run check:redesign`으로 실행한다. 5개 포트폴리오 페이지·9개 원본 데모 페이지의 파일 경로, 앵커, CTA, 자바스크립트 구문과 목업의 원본 이미지 해시·픽셀·크기를 검사한다. 목업을 다시 생성하면 `node docs/design/references/mockup-scene-20261115/check-covers.cjs`로 장면 검증 기록을 갱신한다.

`scripts/build-redesign-home.cjs`는 기존 쉘 복원과 상세 표지 동기화를 함께 실행한다. 새 Contact 파일은 복원 스크립트가 덮어쓰지 않는다. 네 상세 HTML의 본문과 프로젝트별 CSS는 직접 관리한다.

아래는 이전 단계의 기록이다. 실행 여부·스타일·검증 범위는 위 최신 상태를 따른다.

## 이전 단계 · 쉘 복원

로컬 실행 승인 후 사용자 피드백을 반영했다. 기존 `portfolio-shell/dist`의 쉘과 커서를 `redesign/`에 복원하고 최신 프로필·SBS 교육 경험·Q&A·Contact 문구를 유지했다. `scripts/restore-shell.cjs`가 복원 빌드의 원본이며 `build-redesign-home.cjs`는 이 스크립트로 위임한다. 기존 원본은 변경하지 않는다.

상세는 쉬운 설명을 유지하고 실제 UI 영역에 번호 마커·해당 번호의 세부 설계 판단을 추가했다. 회고 Q&A를 복원하고 다음 프로젝트 하나로 순환한다(LG→IVI→CAFEKOK→OFFER→LG). 스타일은 LG 다크 테크·마젠타/바이올렛, IVI 차콜·시안, 카페콕 크림·브라운·살구, OFFER 웜그레이·블랙·오렌지다. 목업은 MIT Devices.css 공식 기기 프레임 소스를 참고·이식한 SVG에 실제 UI를 합성한다. 출처와 라이선스는 `docs/design/references/mockup-refresh-20261115/`에 보관한다.

현재 로컬 서버는 4175번 포트로 동작한다. HTTP와 소스 검사를 수행했다. Windows Computer Use로 기존 화면을 확인한 뒤 새로고침을 시도했으나, 도구가 현재 URL을 안전하게 판별하지 못해 자동조작을 중단했다. 따라서 수정 이후 실제 화면·모바일·모션 검수는 완료하지 못했다. 이후 기록은 최초 구현 당시의 상태다.

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
