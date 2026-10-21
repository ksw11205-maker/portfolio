# 김성원 포트폴리오

2026-10-21 강사 피드백 반영본. 지정한 10월 8일 Netlify 배포를 복구한 뒤, 새 브랜드 심볼과 모션·반응형 수정사항을 적용했다. 현재 화면 규칙은 이 문서와 루트 `DESIGN.md`, 작업 상태는 루트 `PROGRESS.md`를 먼저 읽는다. 예전 QA 기록은 당시 버전에만 해당한다.

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
| Hero 3D 로고·포인터 틸트·설명 패널 | `dist/brand-model.js` |
| 공통 프리즘·Q&A 라이브 모델 / Hero 곡면 | `dist/object-motion.js` / `dist/hero-waves.js` |
| 강사 피드백 레이아웃·반응형 | `dist/feedback.css` |
| 첫 진입·F5·로고 클릭 로딩 | `dist/intro-boot.js`, `dist/intro.js` |
| 스크롤·섹션 고정·커서 | `dist/scroll-motion.js`, `dist/section-flow.js` |
| 제목 내부 효과 / 프로젝트 분할 전환 | `dist/text-reveal.js` / `dist/project-showcase.js` |
| Contact 전환 | `dist/contact-wave.js` |
| CAFÉKOK 원본 | `../cafekok/cafekok-detail/cafekok/` |
| OFFER 제품 원본 | `../OFFER/offer/` |

`dist/index.html`, `dist/assets/brand/*.svg`, `dist/work/cafekok/`, `dist/work/offer/`는 빌드로 갱신한다. 그 외 메인 `dist/` 파일은 이 저장소의 실제 소스다. 일반적인 프로젝트처럼 dist 전체를 지우면 안 된다.

## 10/21 현재 기준

- 3D 브랜드 로고는 Hero, 프리즘은 HOW I WORK에 있다. PROJECT의 프리즘은 제거했다. HOW I WORK 재구성은 후속 작업이다.
- PROJECT 1단계: 데스크톱 전체 화면을 왼쪽 표지 50% / 오른쪽 진행 표시·번호·하단 설명 50%로 사용한다. 제목은 왼쪽 상단 고정. 스크롤 시 항목을 즉시 교체하며 역방향 큐브 전환은 다음 단계다. 모바일·태블릿은 문서형 목록이다.
- Q&A의 다섯 이미지에는 각 의미에 맞는 동작이 있다. 전역 정지·동작 축소·화면 밖 정지를 지원하며 원래 이미지가 실패 시 대체된다.
- MENU 글자 없이 햄버거만 표시하며 1100px까지 접힌 헤더를 사용한다. hover와 키보드 focus에는 같은 블루 채움 효과가 있다.
- 명함 연락처는 소유자가 지정한 `ksw11205@gmail.com`이다.

## 이전 버전에서 이어받은 화면과 동작

- 순서: Hero → Who I Am → How I Work → Things I’ve Designed → How I Think → Contact. 제목은 로컬 Anton, 본문·한글은 로컬 Pretendard.
- 헤더·파비콘·케이스 스터디 복귀 링크에는 2D 심볼을 사용한다. Hero에는 같은 윤곽을 돌출한 블루/실버 메탈 3D 로고를 배치한다. 두꺼운 돌출과 베벨, 앞면 반사 변화, 두 조각의 6초 간격 모션을 사용한다. 호버하면 빠르게 모이고 포인터 방향으로 기울어진다. WebGL을 사용할 수 없으면 같은 형태의 SVG 포스터가 남는다.
- 로고에 호버·키보드 포커스를 주면 커서 옆 설명 박스가 펼쳐진다. 클릭으로 유지하거나 Escape로 닫을 수 있다. 터치 환경에서는 탭으로 설명을 연다. HOW I WORK의 툴 아이콘은 공통 프리즘 뒤에서 역방향으로 흐르며 호버로 멈추지 않는다. 화면 밖·탭 비활성·일시정지·동작 축소에서는 장식을 정지한다.
- 일반 홈 진입과 F5는 새 심볼 로딩을 재생한다. 헤더 로고 클릭도 재생한다. 깊은 앵커로 처음 진입하거나 뒤로 돌아온 경우는 기존 탐색 위치를 지키며, 동작 축소에서는 생략한다. Escape와 2.6초 안전 해제로 스크롤 잠금이 남지 않게 한다.
- WHO I AM / HOW I WORK는 짧은 글자 스크램블, Q&A는 글자 회전 등장이다. 이들 제목은 중앙→제자리 이동 뒤 내용을 한 그룹으로 표시한다. PROJECT만 제목 중앙 등장과 내용 대기를 제거했다.
- PROJECT의 오른쪽에는 현재 프로젝트 번호, 설명, 역할·기간·확인된 툴 아이콘을 표시한다. View Case Study/Project는 마우스 커서에만 표시하며 표지 이미지는 1.04배 확대한다. 현재 링크와 진행 표시도 같은 항목을 가리킨다.
- Q&A 카드는 약한 블루 테두리·표면 변화를 사용한다. Contact는 메탈 각인 명함과 밝은 파스텔 배경을 유지하며 전환을 완료한 뒤에는 역스크롤에도 배경을 되감지 않는다.

## 화면별 기준

| 조건 | 적용 |
| --- | --- |
| 1101px 이상, 높이 700px 이상 | 프로젝트 한 개의 sticky 무대 |
| 901px 이상, 높이 700px 이상, 정밀 포인터 | Q&A 고정 가로 이동 |
| 601–1100px | 이력 두 열+수상 하단, 역량 두 열, 명함 두 열; 1100px 이하 메뉴 접기 |
| 600px 이하 또는 낮은 화면 | 긴 섹션 진입 고정 해제, 프로젝트 세로 목록, Q&A 터치 가로 읽기 |
| 터치·동작 축소·JS 없음 | 커서 장식 없이 링크 사용; 동작 축소는 정적 카드와 최종 내용 표시 |

## 미확정 콘텐츠

LG 기간은 사용자의 기존 기록(2025.03–2025.09), CAFÉKOK 기간·역할은 기존 표지의 설명을 옮겼다. LG·IVI·CAFÉKOK의 프로젝트별 사용 툴, IVI·OFFER 기간은 확인되지 않아 빈 필드로 남겼다. OFFER 툴은 저장소에서 확인되는 HTML/CSS/JavaScript다. 일반적인 툴 활용 능력을 각 프로젝트의 사용 이력으로 추정하지 않는다.

`CONTACT_EMAIL`은 10/20 사용자 확인에 따라 `ksw11205@gmail.com`으로 변경했다. LG·IVI 상세는 기존 준비 화면이며, OFFER 표지는 최종 목업으로 교체할 대상이다. 없는 연구 결과나 상세 화면을 임의로 채우지 않았다.

## 검증

```sh
npm ci --prefix portfolio-shell/qa
npm test --prefix portfolio-shell/qa
```

10개 빌드·리소스·DOM·스크롤 수명주기 검사다. 이 자동 검사는 실제 브라우저 레이아웃과 WebGL 렌더링을 검사하지 않는다. 별도로 연결된 Chrome에서 데스크톱 1440×1000, 태블릿 834×1194, 모바일 390×844 화면과 GPU 렌더링을 확인했다. 확인 범위와 남은 수동 검사는 `QA.md`에 기록했다.
