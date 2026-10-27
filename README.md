# 김성원 UX/UI 포트폴리오

현재 공개 작업본의 실행 기준은 `portfolio-shell/dist/`입니다. 2026-10-27까지의 메인 쉘, LG·IVI·CAFÉKOK·OFFER 상세페이지, 공통 헤더·푸터·커서·스크롤 정렬 및 실행 버튼을 포함합니다.

## 실행

Node.js 20 이상에서 저장소 루트에서 실행합니다. 메인 포트폴리오는 별도의 의존성 설치나 빌드가 필요 없습니다.

```sh
npm run dev
```

브라우저에서 `http://localhost:4173/`를 엽니다. 파일을 수정한 뒤 새로고침하면 반영됩니다.

| 화면 | 주소 | 수정 위치 |
| --- | --- | --- |
| 메인 포트폴리오 | `/` | `portfolio-shell/dist/` |
| LG 상세페이지 | `/work/lg/` | `portfolio-shell/dist/work/lg/` |
| IVI 상세페이지 | `/work/ivi/` | `portfolio-shell/dist/work/ivi/` |
| CAFÉKOK 상세페이지 | `/work/cafekok/` | `portfolio-shell/dist/work/cafekok/` |
| OFFER 상세페이지 | `/work/offer/case-study.html` | `portfolio-shell/dist/work/offer/case-study.*` |
| LG 실행 화면 | `/work/lg/prototype/` | `portfolio-shell/dist/work/lg/prototype/` |
| CAFÉKOK 실행 화면 | `/work/cafekok/prototype/` | 아래 React 소스 참고 |
| OFFER 실행 사이트 | `/work/offer/` | `portfolio-shell/dist/work/offer/` |

## Codex에서 이어서 수정

1. 이 저장소를 로컬로 복제하고 Codex에서 해당 폴더를 엽니다.
2. `AGENTS.md`와 `DESIGN.md`를 읽은 다음 위 명령으로 실행합니다.
3. 내장 브라우저에서 로컬 페이지를 열고 Annotate로 요소나 영역을 선택해 수정 의견을 남깁니다.
4. 현재 작업 대상은 `portfolio-shell/dist/`입니다. 기존 `OFFER/`, `cafekok/` 폴더를 일괄 복사하는 예전 `portfolio-shell/build.cjs`는 최신 상세페이지를 덮어쓸 수 있으므로 실행하지 않습니다.

메인 정적 HTML과 `app.js`의 렌더링 내용이 함께 있는 경우 변경 후 양쪽을 일치시킵니다. 공통 상세페이지 스타일·동작은 `case-navigation.*`, `case-cursor.*`, `reading-snap.js`에서 관리합니다. OFFER 제품 UI와 케이스 스터디를 구분해 수정합니다.

CAFÉKOK 프로토타입의 React 소스는 `portfolio-shell/prototypes/cafekok/`에 있습니다. 그 폴더에서 `npm ci`와 `npm run build`를 실행하고, 생성된 `dist/`의 내용만 `portfolio-shell/dist/work/cafekok/prototype/`로 반영합니다.

## 검증 범위와 남은 이슈

프로토타입 빌드, 파일 경로, 스크립트 문법과 공통 제어 로직을 검사했습니다. 브라우저 실화면 검증은 이전 작업 환경의 제한으로 완료하지 못했습니다. 새로고침·로고 클릭 시 히어로 3D 로고가 들어오는 잔상은 사용자 보고 기준 미해결 상태이며 추가 확인이 필요합니다.

GitHub에서 코드를 변경한 뒤 현재 호스팅 주소에 반영하려면 별도의 배포가 필요합니다.
