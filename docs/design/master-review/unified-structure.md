# 8개 목차 재구성 매핑 · 2026-11-16

## 최신 미감 보강

마지막 적용 파일: `styles/art-directed-sections.css`. 네 표지는 원본 비율 전체를 보여주는 2열 구성으로 바꾸고, 1200px 이상은 왼쪽 고정 목차·왼쪽 하단 프로토타입 진입으로 정리했다. 좁은 화면에서는 읽기 공간 확보를 위해 목차를 본문 앞의 일반 흐름에 둔다.

CONCEPT은 프로젝트별 분위기 키워드 3개와 실제 외부 참고 사진을 조합했다. DESIGN SYSTEM은 서체/타입 스케일/웨이트/강조색/중립색만 남겼다. 기존 흐름 설명은 DIRECTION으로, 원본 UI 조작·제품 고유 색상 설명은 FINAL DESIGN 끝으로 이동해 내용을 보존했다. 연구 수치·표·조건은 유지하며 배경은 비대칭 구성, 요인과 모델은 큰 수치 중심, 컨셉은 사진, 시스템은 표와 색상으로 구성을 구분했다.

1440×900·1366×768·768×1024·390×844에서 네 페이지 전 구간 캡처와 이미지 로딩을 확인했다. 무드 카드의 최소 폭 때문에 발생한 태블릿/모바일 넘침을 수정해 최종 16개 조합 모두 페이지 가로 넘침·누락 이미지·pageerror 0이다. IVI 원본 데이터 표는 내부 가로 스크롤을 유지한다. 사진 원본 URL·사용 조건은 `redesign/assets/moods/CREDITS.md`에 기록했다. 실기기와 외부 Figma 동작 검증의 기존 한계는 동일하다.

편집 전 현재 HTML·프로젝트 문서·실제 자산 경로를 확인했다. 공통 순서: OVERVIEW → BACKGROUND → RESEARCH → DIRECTION → CONCEPT → DESIGN SYSTEM → FINAL DESIGN → RETROSPECTIVE.

| 목차 | LG TV | IVI | CAFÉKOK | OFFER |
| --- | --- | --- | --- | --- |
| OVERVIEW | 기간·역할·프로젝트 요약 | 기간·역할·연구 질문 요약 | 기간·역할·서비스 요약 | 기간·역할·서비스 요약 |
| BACKGROUND | 기존 overview의 TV 맥락 | 기존 overview의 기능 통합 맥락 | premise 문제 가설 | premise 비교 기준 문제 가설 |
| RESEARCH | research·factor·model 실험/수치 | study 유형 분류·findings·click-patterns·voices | 기존 취향 구조·문제 가설, 조사 미실시 명시 | 기존 비교 기준·조건 검토, 조사 미실시 명시 |
| DIRECTION | model의 design connection | direction의 배치 원칙 | 취향/목적 분리 원칙 | 기존 offer-principles |
| CONCEPT | 입력→분석→대안→비교 흐름 | 측면 메뉴+하단 공조의 미검증 결합안 | 기존 cafe-equation·product-flow | 발견→비교→저장/팔로우 흐름 |
| DESIGN SYSTEM | 실제 UI의 위계·중립 표면·공통 조작 | 실제 실험 UI의 공통 조건·강조 규칙 | 기존 cafe-system | 기존 offer-system-line |
| FINAL DESIGN | 실제 API/입력→분석/예측→대안→비교→설정 | 실험 장비→과제→관찰 결과→설계 제안, 실험/제안 구분 | 실제 onboarding→quiz/profile→home/explore→detail→saved→map | home→explore→detail→filtered→saved/favorites/brand→responsive |
| RETROSPECTIVE | reflection | reflection | reflection·후속 검증 질문 | reflection·후속 검증 질문 |

중복 쇼케이스는 FINAL DESIGN에 이미 있는 원본과 겹치므로 통합한다. 의미 있는 연구 표·수치·단위·조건과 회고는 보존한다. 새 통계·새 연구·새 제품 기능은 만들지 않는다. 알림은 구현된 실제 화면이 없어 제공된 순서 중 저장/팔로우만 보여준다. CAFÉKOK 지도는 기존 current/map.png, onboarding은 기존 editorial/onboarding.png를 사용한다.

쉘은 프로젝트 표지의 호버 확대만 공통화한다. 기존 라우트·CTA·제품 앱 코드는 유지한다.

## 구현 결과

- 네 상세 HTML을 실제 8개 최상위 section으로 재구성했다. 표지는 기존 외형을 유지하는 별도 div, 뒤에는 8개 목차와 다음 프로젝트·공통 푸터를 둔다. 반복 쇼케이스·기능 설명은 통합했다.
- `styles/unified-cases.css`: 최대 1400px, 공통 제목·간격·선·반응형, 화면 → 키워드 → 설명 순서. CAFÉKOK은 관련 모바일 UI 쌍, LG는 작업 단계, IVI는 실험/제안, OFFER는 탐색과 기기별 비교로 구분했다.
- `styles/shell-cover-hover.css`와 `index.html`: 기존 스타일의 transform 강제값을 덮어써 LG·IVI·CAFEKOK에도 OFFER와 같은 1.04 확대가 적용된다. 모션 축소·터치에서는 확대를 끈다.
- 연구 표의 텍스트 보존을 편집 스크립트에서 대조했다. 원본 UI·자산 파일·프로토타입 앱·URL은 변경하지 않았다. LG의 원본 settings-latest/model.png, CAFÉKOK의 기존 온보딩·지도 캡처를 추가 연결했다. 지도는 위치 미확인 대체 지도 상태임을 설명했다.

## 실제 검증

- Chrome Playwright에서 네 상세 × 1440×900 / 1366×768 / 768×1024 / 390×844를 헤더부터 푸터까지 스크롤·캡처하고 직접 확인했다. 16개 조합 모두 가로 넘침·누락 이미지·pageerror 0. 전체 캡처는 이 폴더의 프로젝트별 JPG와 JSON에 저장했다.
- 32개 목차 링크를 실제 클릭해 목적지 존재·스크롤 위치를 확인했다. 중복 ID 0, Tab → 본문 바로가기·Enter 동작 확인. 공통 다음 프로젝트 링크 4개가 순환 이동했다.
- LG·CAFEKOK·OFFER 표지 CTA 새 탭의 로컬 목적지 정상. IVI 기존 외부 Figma 프로토타입은 Chrome 오류 페이지로 진입해 내용 동작 미확인. URL은 보존했다. 상세 내부 프로토타입 앱 전체 기능 테스트는 이번 범위 밖이다.
- 쉘 네 표지 모두 데스크톱 고정 갤러리에서 1.04 확대를 확인했다. 문서형 390px 뷰포트에 마우스를 연결한 조건에서 네 표지 모두 1.04, reduced-motion에서 모두 none을 확인했다. 마지막 OFFER는 실제 휠 스크롤로 진입해 검증했고, 기존 강한 transform 규칙의 간섭도 수정했다. 표지 확대 외 쉘 스크롤 코드는 변경하지 않았다.
- 정적 검사: 포트폴리오 오류 0, 로컬 참조 510개·앵커 75개·JS 65개 검사 통과(추가된 실제 설정 화면 포함). 실기기·Safari·Firefox·스크린리더는 미검증이다.

## 수정 파일

화면: `redesign/index.html`, `redesign/work/{lg,ivi,cafekok}/index.html`, `redesign/work/offer/case-study.html`.
스타일: `redesign/styles/unified-cases.css`, `redesign/styles/shell-cover-hover.css`.
매핑·검증: 본 문서와 `unified-preservation.json`, `unified-controls.json`, `shell-document-hover.json`, 각 해상도 캡처 및 검증 스크립트. 공통 문서는 DESIGN.md와 redesign-handoff.md를 갱신했다.

Git은 작업 폴더에 .git이 없고 상위 경로 접근 오류를 반환해 상태·브랜치·remote 확인이 불가했다. 커밋·push·배포는 수행하지 않았다.
