# 김성원 포트폴리오

2026-10-19 메인 쉘 수정본. 지정한 10월 8일 Netlify 배포를 복구한 뒤, 새 브랜드 심볼과 모션·반응형 수정사항을 적용했다. 현재 화면 규칙은 이 문서와 루트 `DESIGN.md`, 작업 상태는 루트 `PROGRESS.md`를 먼저 읽는다. 예전 QA 기록은 당시 버전에만 해당한다.

## 실행

```sh
node portfolio-shell/build.cjs
node portfolio-shell/server.cjs
```

저장소 루트에서 실행하고 `http://localhost:4173`을 연다. 실행·빌드에는 Node.js만 필요하다. Three.js, Lenis, 서체와 툴 아이콘은 로컬 파일이다. 검사용 의존성은 `qa/`에만 분리했다.

## 버전 기준

- 작업 브랜치: `codex/portfolio-brand-refinement-20261019`.
- 복구 커밋: `7253845ef75a72b1a13bb806a1e348f9b367bb20`.
- 복구 원본: [고정 Netlify 배포](https://6ac7a6bdac067a8f6e08b3cd--lighthearted-entremet-c64305.netlify.app/), 관리자 화면의 Oct 8 at 11:20 PM 지정 버전.
- 파일별 출처·해시: `deploy-baseline.json`. 메인 쉘만 복구했으며, 최신 `cafekok/CAFEKOK` 프로토타입과 제품 원본은 유지했다.
- 운영 배포 및 main 병합은 수행하지 않았다. GitHub의 작업 브랜치를 기준으로 이어서 작업한다.

## 수정 위치

| 범위 | 편집할 파일 |
| --- | --- |
| 메인 마크업·이력·섹션 순서 | `dist/app.js` |
| 프로젝트 요약·역할·기간·툴·Q&A·연락처 | `dist/data.js` |
| 기본 스타일 / 이번 브랜드·반응형 보완 | `dist/styles.css` / `dist/brand.css` |
| 2D·3D 공통 심볼 윤곽 | `dist/brand-shape.js` |
| SVG·파비콘·정적 포스터 생성 | `build-brand.cjs` |
| 실제 3D 메쉬·재질·조명·설명 패널 | `dist/brand-model.js` |
| 첫 진입·F5·로고 클릭 로딩 | `dist/intro-boot.js`, `dist/intro.js` |
| 스크롤·섹션 고정·커서 | `dist/scroll-motion.js`, `dist/section-flow.js` |
| 제목 내부 효과 / 프로젝트 곡선 배치 | `dist/text-reveal.js` / `dist/project-orbit.js` |
| Contact 전환 | `dist/contact-wave.js` |
| CAFÉKOK 원본 | `../cafekok/cafekok-detail/cafekok/` |
| OFFER 제품 원본 | `../OFFER/offer/` |

`dist/index.html`, `dist/assets/brand/*.svg`, `dist/work/cafekok/`, `dist/work/offer/`는 빌드로 갱신한다. 그 외 메인 `dist/` 파일은 이 저장소의 실제 소스다. 일반적인 프로젝트처럼 dist 전체를 지우면 안 된다.

## 현재 화면과 동작

- 순서: Hero → Who I Am → How I Work → Things I’ve Designed → How I Think → Contact. 제목은 로컬 Anton, 본문·한글은 로컬 Pretendard.
- 헤더·파비콘·케이스 스터디 복귀 링크에는 2D 심볼을 사용한다. HOW I WORK는 같은 윤곽을 실제로 돌출한 블루/실버 메탈 3D 모델이다. 두꺼운 돌출과 베벨, 앞면 반사 변화, 두 조각의 6초 간격 모션을 사용한다. 호버하면 빠르게 모인다. WebGL을 사용할 수 없으면 같은 형태의 SVG 포스터가 남는다.
- 로고에 호버·키보드 포커스를 주면 커서 옆 설명 박스가 펼쳐진다. 클릭으로 유지하거나 Escape로 닫을 수 있다. 터치 환경에서는 설명을 상시 표시한다. 툴 아이콘은 뒤에서 역방향으로 흐르며 호버로 멈추지 않는다. 화면 밖·탭 비활성·일시정지·동작 축소에서는 장식을 정지한다.
- 일반 홈 진입과 F5는 새 심볼 로딩을 재생한다. 헤더 로고 클릭도 재생한다. 깊은 앵커로 처음 진입하거나 뒤로 돌아온 경우는 기존 탐색 위치를 지키며, 동작 축소에서는 생략한다. Escape와 2.6초 안전 해제로 스크롤 잠금이 남지 않게 한다.
- WHO I AM / HOW I WORK는 짧은 글자 스크램블, Projects는 두 줄 마스크 상승, Q&A는 글자 회전 등장이다. 제목 전체의 중앙→제자리 이동은 스크롤에 연결한다. 제목이 정착하기 전에는 작은 라벨과 내용을 숨기고, 정착한 뒤 620ms 동안 한 그룹으로 나타낸다.
- Projects는 넓은 화면에서 왼쪽 정보를 고정하고 오른쪽 표지가 곡선을 따라 이동한다. 중앙 표지에는 수평으로 머무는 구간을 둔다. 왼쪽 중복 버튼은 역할·기간·툴 아이콘으로 대체하고 View Case Study/Project는 마우스 커서에만 표시하며 표지 이미지는 1.04배 확대한다.
- Q&A 카드는 약한 블루 테두리·표면 변화를 사용한다. Contact는 메탈 각인 명함과 밝은 파스텔 배경을 유지하며 전환을 완료한 뒤에는 역스크롤에도 배경을 되감지 않는다.

## 화면별 기준

| 조건 | 적용 |
| --- | --- |
| 901px 이상, 높이 700px 이상 | 프로젝트 한 개의 sticky 무대; Q&A 고정 가로 이동은 마우스 환경에만 적용 |
| 601–1100px | 이력 두 열+수상 하단, 역량 두 열, 명함 두 열; 900px 이하 메뉴 접기 |
| 600px 이하 또는 낮은 화면 | 긴 섹션 진입 고정 해제, 프로젝트 세로 목록, Q&A 터치 가로 읽기 |
| 터치·동작 축소·JS 없음 | 커서 장식 없이 링크 사용; 동작 축소는 정적 카드와 최종 내용 표시 |

## 미확정 콘텐츠

LG 기간은 사용자의 기존 기록(2025.03–2025.09), CAFÉKOK 기간·역할은 기존 표지의 설명을 옮겼다. LG·IVI·CAFÉKOK의 프로젝트별 사용 툴, IVI·OFFER 기간은 확인되지 않아 빈 필드로 남겼다. OFFER 툴은 저장소에서 확인되는 HTML/CSS/JavaScript다. 일반적인 툴 활용 능력을 각 프로젝트의 사용 이력으로 추정하지 않는다.

`CONTACT_EMAIL`은 기존 `hello@example.com`을 유지했다. 새 개인정보 공개는 이번 저장에 포함하지 않았다. LG·IVI 상세는 기존 준비 화면이며, OFFER 표지는 최종 목업으로 교체할 대상이다. 없는 연구 결과나 상세 화면을 임의로 채우지 않았다.

## 검증

```sh
npm ci --prefix portfolio-shell/qa
npm test --prefix portfolio-shell/qa
```

7개 빌드·리소스·DOM·스크롤 수명주기 검사다. 실제 브라우저 레이아웃과 WebGL 렌더링은 검사하지 않는다. 현재 환경의 미리보기 권한 오류와 수동 확인 항목은 `QA.md`에 기록했다.
