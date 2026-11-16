# 김성원 UX/UI 포트폴리오

현재 작업 기준은 **`redesign/` 하나**입니다. 이전 `portfolio-shell/dist/`는 과거 버전 보관본이며 수정·배포 대상으로 사용하지 않습니다.

## 실행 (항상 최신 작업본)

Node.js 20 이상, 저장소 루트에서 실행합니다.

```sh
npm run dev
```

브라우저: `http://localhost:4175/`

| 화면 | 주소 | 현재 수정 위치 |
| --- | --- | --- |
| 메인 포트폴리오 | `/` | `redesign/index.html`, `redesign/app.js` |
| LG 상세페이지 | `/work/lg/` | `redesign/work/lg/index.html` |
| IVI 상세페이지 | `/work/ivi/` | `redesign/work/ivi/index.html` |
| CAFÉKOK 상세페이지 | `/work/cafekok/` | `redesign/work/cafekok/index.html` |
| OFFER 상세페이지 | `/work/offer/case-study.html` | `redesign/work/offer/case-study.html` |

## 검증

```sh
npm run check
```

## 이전 버전

- `portfolio-shell/dist/`: 2026-10-27 이전 작업본. **읽기 전용 보관**이며 기본 실행 경로에 연결하지 않습니다.
- 이전 구현 브랜치와 백업은 복구 가능성을 위해 삭제하지 않았습니다. 최신 작업은 `fix/research-flow-20261117`에서 진행합니다.
- 과거 버전을 확인할 필요가 있을 때만 별도 보관본을 여세요. 과거 빌드 스크립트로 최신 `redesign/`을 덮어쓰지 마세요.
