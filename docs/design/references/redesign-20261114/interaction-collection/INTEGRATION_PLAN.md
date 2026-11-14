# 현재 포트폴리오 적용 계획

## 목표를 화면 동작으로 바꾸기
디자인은 정보의 위계와 화면 간 일관성으로, 모션은 변화의 이유와 순서를 전달하는 수단으로, 설명력은 주장 옆의 실제 증거로 평가한다. 아래는 코드와 문서 검토에 근거한 적용 제안이며 전체 화면을 브라우저로 평가한 디자인 감사 결과는 아니다.

## 현재 코드에서 확인한 조건
- 빌드 과정 없는 dist 기반 HTML/CSS/JS 사이트다. React 전환 없이 적용할 후보를 우선한다.
- reading-snap.js가 scroll-motion.js를 호출하고, 읽기 위치와 스크롤 종료를 이미 제어한다.
- reading-gate, case-slides, case-steps, 페이지 전환 등 여러 화면 제어 계층이 존재한다.
- IVI results.js는 표의 부담 점수와 만족도 방향을 달리 처리하고 작업 수행도는 같은 방향으로 순위화하지 않는다.
- case-image-preview가 이미 존재한다. PhotoSwipe를 추가하려면 같은 이미지의 기존 이벤트·다이얼로그를 먼저 정리한다.
- vendor/slides-pinning/README.md에는 GreenSock CodePen 출처가 기록되어 있다. 새 스크롤 제어기를 얹기 전에 실제 사용 여부를 확인한다.

## 1. 시각 디자인의 규칙
참고 파일:
- sources/argyleink/open-props/src/props.sizes.css
- sources/argyleink/open-props/src/props.fonts.css
- sources/argyleink/open-props/src/props.easing.css
- sources/argyleink/open-props/src/props.shadows.css

적용 대상: brand-base.css, styles.css, editorial-cases.css 및 프로젝트별 editorial CSS.
실행 방향: 기존 폰트·브랜드 컬러를 유지하면서 제목 단계, 본문 행간, 설명 폭, 섹션 간격, 캡션 위계를 공통 토큰으로 정리한다. Open Props 전체를 전역으로 덮어쓰지 않는다. 개별 폰트 목록은 시각 참고이며 기존 한글 폰트를 바꾸는 지시가 아니다.
완료 기준: 390/768/1280/1440px에서 제목 충돌·본문 가로 넘침 없음, 프로젝트 간 동일 위계가 같은 규칙으로 표시됨.

## 2. 설명과 화면의 대응
참고 파일:
- sources/russellsamora/scrollama/docs/sticky-side/index.html
- sources/russellsamora/scrollama/docs/progress/index.html
- sources/russellsamora/scrollama/src/entry.js

적용 대상: IVI #layouts, #findings, #direction 및 LG editorial 상세.
실행 방향: 큰 화면에서 한쪽은 실제 화면, 한쪽은 하나의 판단을 설명하는 단계로 구성한다. 모바일은 자연스러운 세로 흐름으로 풀어 쓴다. 단계를 넘기기 위해 강제 스크롤을 요구하지 않는다. 기존 reading gate와 상태를 통합하거나 한쪽을 교체한다.
완료 기준: 각 단계가 '근거 1개 + 판단 1개 + 해당 UI'에 연결되고 JS/모션을 꺼도 핵심 내용이 읽힘.

## 3. 결과를 검토할 수 있는 비교
참고 파일:
- sources/sneas/img-comparison-slider/packages/img-comparison-slider/src/index.ts
- sources/sneas/img-comparison-slider/packages/img-comparison-slider/src/styles.scss
- sources/sneas/img-comparison-slider/packages/img-comparison-slider/README.md

적용 대상: 실제 개편 전후 캡처가 있는 섹션.
실행 방향: 동일 과제·상태·화면 비율의 전후 이미지를 사용하고 바로 아래에 변경 이유와 예상 효과를 쓴다. 서로 다른 실험 조건인 IVI A/B/C/D는 자동으로 '개선 전/후'라고 부르지 않는다. 4개 유형 비교와 후속 하이브리드 제안을 분리한다.
완료 기준: 키보드 조작과 터치 사용 가능, 전후 표기가 유지됨, 움직이지 않아도 두 이미지를 따로 확인 가능.

## 4. 모션의 역할
참고 파일:
- sources/motiondivision/motion/packages/framer-motion/src/animation/animate/sequence.ts
- sources/motiondivision/motion/packages/framer-motion/src/render/dom/scroll/index.ts
- sources/motiondivision/motion/dev/html/public/playwright/scroll/scroll-callback-progress.html
- sources/codrops/ScrollBasedLayoutAnimations/js/index.js

적용 대상: text-reveal.js, shell-motion.js, 프로젝트 모션 파일.
실행 방향: 도입부에서는 화면의 인상을 만들고 본문에서는 주장→증거→해석의 순서를 보조한다. 짧은 제목 등장, 선택 상태 전환, 화면 간 연결에 한정해 먼저 적용한다. 읽는 문장을 계속 흐리게 하거나 움직이지 않는다. hover 전용 정보는 포커스/터치에서도 제공한다.
제안 기준값(외부 채용 기준이 아님): 컨트롤 반응 120–180ms, 패널 전환 200–320ms, 섹션 등장 400–600ms에서 시작해 실제 장치에서 조절.
완료 기준: reduced-motion에서 내용이 즉시 보임, 뒤로 가기/페이지 이탈 시 listener와 observer 정리, 동일 요소를 두 엔진이 동시에 제어하지 않음.

## 5. 화면 증거 확대
참고 파일:
- sources/dimsemenov/PhotoSwipe/docs/getting-started.md
- sources/dimsemenov/PhotoSwipe/src/js/lightbox/lightbox.js
- sources/dimsemenov/PhotoSwipe/src/photoswipe.css

적용 대상: case-image-preview.js/CSS와 IVI prototype-original 화면.
실행 방향: 모바일 확대가 필요할 때 기존 기능을 대체하며 실제 이미지 크기를 제공하고 요청 시 로드한다. 썸네일을 확대해 원본처럼 제시하지 않는다. 15개 차량 리서치 이미지는 과거 원본 해상도 한계를 유지한다.
완료 기준: 열기/닫기/Escape, 포커스 복귀, 터치 줌, 이미지 오류 안내, 기본 이미지 링크 동작을 확인.

## 6. 데이터 전달
참고 파일:
- sources/d3/d3-shape/src/line.js
- sources/d3/d3-shape/src/area.js
- sources/d3/d3-shape/src/curve/linear.js

적용 대상: IVI script.js와 results.js의 실제 데이터 표현.
실행 방향: 현재 표/막대의 읽기 어려운 점이 확인될 때 개선한다. 선·면적은 순서가 있는 데이터에만 사용하고 유형 비교에 의미 없는 추세선을 만들지 않는다. 축·단위·표본·오차/제외 조건을 표시하며 원문 표를 유지한다. 통계적 유의성은 분석 근거가 있을 때만 기술한다.
완료 기준: 차트의 숫자·레이블이 데이터 표와 일치, 색 외에도 항목 구분 가능, 선택된 조건과 근거가 연결됨.

## 7. 스크롤 엔진 교체는 별도 판단
참고: sources/darkroomengineering/lenis/packages/core/src/lenis.ts.
현재 동작이 충분하면 도입하지 않는다. 교체 시 scroll-motion/reading-snap의 역할을 먼저 정리하고 단일 스크롤 소유자로 통합한다.
완료 기준: wheel/touch/키보드/앵커/중첩 패널/다이얼로그/뒤로 가기/탭 복귀에서 읽기 위치가 예측 가능.

## 실행 순서
설명 구조와 자료 확인 → 타이포·간격 규칙 → 한 프로젝트 상세의 완성된 샘플 → 화면 비교·확대 → 모션 조율 → 네 프로젝트로 확장.
진행 예산을 먼저 화면 연출에 모두 쓰기보다 대표 프로젝트 하나에서 서사와 화면을 함께 완성한다.
