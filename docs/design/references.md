# 디자인 레퍼런스 출처와 적용 범위

### 커서·스크롤 반응 — 2026-10-07

- [Insplanet](https://www.insplanet.co.kr/)를 실제 Chrome에서 관찰했다. 기본 32px 반전 원형, 링크·메뉴의 약 80px 확대, 프로젝트의 96px 짙은 원과 문구, 지연 추종, 고정 구간의 단계적 진행을 확인했다. 로고·이미지·문구·소스는 가져오지 않았다.
- 적용 범위는 메인 포트폴리오의 커서와 휠 반응이다. 링크 확대는 현재 메뉴 크기에 맞춰 64px로 줄이고 실제 클릭 지점에는 즉시 움직이는 점을 남겼다. 레퍼런스의 구간별 휠 고정은 적용하지 않고 기존 연속 스크롤·sticky 구성을 보존했다. 시간 상수의 수치적 동일성을 주장하지 않는다.
- 스크롤 구현 의존성: [Lenis](https://github.com/darkroomengineering/lenis) 1.3.11, MIT. npm 배포본과 라이선스를 `portfolio-shell/dist/vendor/lenis/`에 보존했다. 런타임 외부 CDN 요청 없이 로컬 모듈 하나만 사용한다.

외부 자료는 판단을 돕는 참고 자료다. 작업 절차는 [AGENTS.md](../../AGENTS.md), 공통 디자인은 [DESIGN.md](../../DESIGN.md), 제품별 적용은 `docs/projects/`가 기준이다.

## 실제 채택한 문서

### 사용자 제공 CAFÉKOK 브랜드 자산 — 2026-09-29

- 출처: 이 작업 대화에 첨부한 `C:/Users/SBS/Downloads/cafekok-logo.png`, `cafekok-icon.png`.
- 원본 보존: `cafekok/cafekok-detail/cafekok/assets/cafekok-logo.png`, `cafekok-icon.png`.
- 사용 범위: 카페콕 로고·아이콘 및 해당 포트폴리오 소개. 사용자 지정 자산으로 적용했으며, 별도 라이선스 문서는 제공되지 않았다. 외부 브랜드 레퍼런스 라이선스를 이 자산에 적용하지 않는다.

### 브랜드 분석 문서

기존 OFFER 디자인 문서와 `css/design-refresh.css`에 채택 근거가 있는 세 문서만 보존했다. 브랜드의 공식 디자인 시스템이 아니라 **VoltAgent의 제3자 웹사이트 분석 문서**다.

원본 저장소: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md).
보존 버전: `f6961238d5cddcf8042a74a70fc400ec67181abb`; 취득일: 2026-09-23. 과거 작업 당시 읽은 버전과 동일하다는 뜻은 아니다.

| 자료·원본 출처 | 로컬 원본 | 채택 원칙과 적용 범위 |
| --- | --- | --- |
| [Airbnb](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/airbnb/DESIGN.md) | [airbnb.md](references/brands/airbnb.md) | OFFER 검색 진입, 사진 중심 카드와 저장 동선 |
| [Apple](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/apple/DESIGN.md) | [apple.md](references/brands/apple.md) | OFFER의 여백·제목 위계·절제된 장식 |
| [Nike](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/nike/DESIGN.md) | [nike.md](references/brands/nike.md) | OFFER 사진 중심 카드, 중립 UI, 혜택에 제한된 강조색 |

- 적용은 [OFFER 문서](../projects/offer.md)에 한정한다. 브랜드 폰트·자산·고유 화면 배치나 원본의 모든 수치를 채택한 것이 아니다.
- 로컬 원본은 수정·번역·요약하지 않은 다운로드 파일이다. 내부 상대 링크와 이미지 경로도 원본 그대로라 로컬에서 열리지 않을 수 있다. 해당 링크는 위 고정 버전의 원본 경로에서 확인한다.
- `brands/.gitattributes`는 원본과 라이선스의 자동 줄바꿈 변환을 막아 운영체제와 관계없이 아래 해시를 유지한다.
- 라이선스: MIT, `Copyright (c) 2026 VoltAgent`. [보존한 LICENSE](references/brands/LICENSE)와 [고정 버전 원본 LICENSE](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/LICENSE)를 함께 유지한다.
- 문서의 라이선스를 브랜드 상표·사진·전용 폰트의 사용 허가로 확대 해석하지 않는다. 기존 제품 자산의 출처 기록은 `OFFER/offer/ASSET-CREDITS.md`에 그대로 둔다.

## 원본 무결성

| 파일 | SHA-256 |
| --- | --- |
| `airbnb.md` | `ADD34130D67209AD105346D60FE2B290728B9711683969DB4B7760E29477A5FE` |
| `apple.md` | `83FBC614443A9B3D7569E9956A43E7B8740F9D0F939F58B8154F7A7CEC3002B2` |
| `nike.md` | `D2A3D363665839E2DDC15C91B8A9F3E92B1962FF55A7CA5D964AB3BB88B8186C` |
| `LICENSE` | `6D4BDC9A9CF30E7BEB593475FDCDBF29F981EA6BD7923F202866145409F87B44` |

## 참고 캡처

- 아래 세 캡처는 사용자가 선택해 제공한 Behance 레퍼런스다. 원본 PNG를 변경 없이 보존했다. 확인일·제공일은 2026-09-28이며 실제 촬영일은 미확인이다.
- 이전 로컬 화면 캡처는 구현 상태 확인용 QA 자료이며 디자인 레퍼런스로 채택하지 않았다.
- 향후 실제 채택하는 캡처만 추가하고 이 문서에 파일명, 원본 URL 또는 제공자, 취득일, 적용 위치·원칙, 라이선스·사용 조건을 함께 기록한다. 모르는 출처와 권한은 미확정으로 표시한다.

| 자료·출처 | 보존한 캡처 | 참고 범위 |
| --- | --- | --- |
| Suneui Moon(문선의), [2026 Portfolio : UXUI Product Design SUNEUI MOON](https://www.behance.net/gallery/238359079/2026-Portfolio-UXUI-Product-Design-SUNEUI-MOON). 사용자 제공 `C:/Users/SBS/Desktop/포폴 래퍼런스1.png` | [suneui-moon-portfolio.png](references/screenshots/suneui-moon-portfolio.png), 1920×53414 | 카페콕 상세의 배경·조사 → 설계 방향 → 기능별 화면 전개, 사용자 이점을 설명하는 제목, 단계별 화면 연결 |
| 유니클로 UI 리디자인 프로젝트 UNIQLO UI Redesign Project. 캡처 표기 팀원: 류아진·김예지·현재은·장시은·김정민. 원본 URL 미확인. 사용자 제공 `C:/Users/SBS/Desktop/포폴 래퍼런스2.png` | [uniqlo-ui-redesign.png](references/screenshots/uniqlo-ui-redesign.png), 1920×24579 | 카페콕 상세의 문제·해결 방향 대응, 분기 있는 사용자 흐름, 전체 UI와 세부 확대·주석의 연결, 검증·회고 마무리 |
| 이해민(LEE HYE MIN), UI/UX 디자인 포트폴리오 Design portfolio, Product, Web designer. 캡처 표기 2024 포트폴리오, 게시일 2024-04-11. 원본 URL 미확인. 사용자 제공 `C:/Users/SBS/Desktop/포폴 래퍼런스3.png` | [lee-hyemin-portfolio.png](references/screenshots/lee-hyemin-portfolio.png), 1920×52417 | 디무브 신규 서비스의 사용자 유형·시나리오·서비스 가치 연결, 무인양품의 테스트 피드백→추가 수정, 공간 사진과 설명의 편집 구성 |

- 세 이미지 모두 전체를 구간별로 열어 주요 제목·설명·화면 구성을 확인했다. 첫 자료의 일부 프로필은 원본에서 흐림 처리되어 있다. 이미지 내부 조사 수치·인용·성과는 작성자의 표기이며 원자료의 정확성까지 검증한 것이 아니다.
- 라이선스·재사용 허가 범위는 미확정이다. 외부 창작물의 참고용 캡처로 관리하며 프로젝트 결과물·앱 에셋으로 재사용하지 않는다. 브랜드 공식 디자인 지침으로 간주하지 않는다.

### 유니클로 레퍼런스 관찰

- 전개: 표지·Overview → Desk Research(리뷰·이탈/유지 관련 차트) → User Survey → 1차 Usability Test → Insight → Competitor Analysis → Redesign Goal → 서비스 소개 → User Flow → Design System → UI Design → 2차 Usability Test → Team Insights.
- 설문은 앱 사용자·비사용자를 나누고, 조사 인원·기간·도구를 별도로 표시한다. 사용성 테스트도 별도 구간으로 구분한다.
- Insight에서는 네 가지 문제와 해결 방향을 행별로 대응한다. 목표는 Who / How / What으로 요약한다.
- 사용자 흐름은 화면 목록을 넘어 구매 경험, 재고, 매장 방문 가능 여부에 따른 분기를 보여준다.
- 홈·카테고리·상품 상세·매장 연계·장바구니를 기능별로 설명한다. 큰 대표 화면 주변에 연결선과 짧은 주석을 두고, 상세 조작은 확대 또는 순서대로 배치한 보조 화면으로 보여준다.
- 마지막에는 2차 테스트 결과와 팀원별 한계·배움을 배치한다. 캡처에 만족도 83%가 제시되지만 산정 문항·방법을 확인하지 않았으므로 검증된 성과 지표의 기준으로 채택하지 않는다.
- 해석: 첫 레퍼런스는 전체 이야기 전개와 기능별 설명, 유니클로는 조사→설계 대응과 UI 세부 설명·검증 마무리에 참고 가치가 있다. 두 자료의 섹션을 모두 합치거나 분량을 그대로 복제하지 않는다.

### 이해민 포트폴리오 레퍼런스 관찰

- 전체 구성: 표지·Prologue·Contents → 무인양품 UX/UI 개선 → 디무브(D-MOVE) 신규 서비스 반응형 웹 기획 → 마샬 인터랙션 웹 리디자인 → 탬버린즈 GUI 리뉴얼 → 마무리·프로토타입 링크. 18개 구간으로 나누어 확인했다. 정적 캡처만 관찰했으며 링크의 동작과 실제 모션은 검증하지 않았다.
- 무인양품: Overview → Desk/User Research → 경쟁 브랜드 분석 → Persona & Journey Map → Project Goal → IA → 콘셉트·디자인 시스템 → 기능별 개선 및 신규 제안 → 사용성 테스트 → 추가 수정 → 회고. 회고에서는 페르소나·여정을 가상으로 설정했다고 설명한다. 조사 결과와 가상 모델을 구분해 읽는다.
- 무인양품의 테스트 이후에는 매장 목록을 지도 옆에 추가하고 매거진 좌우 이동 버튼 위치를 바꾼 화면을 제시한다. 결과 수치만 나열하지 않고 관찰 의견과 실제 변경을 연결하는 표현 방식을 참고한다. 자료에 제시된 10명 평가와 만족도는 원자료를 검증하지 않은 작성자 표기다.
- 무인양품의 밝은 중성색 바탕, 공간·생활 사진, 큰 화면과 짧은 설명의 조합은 카페콕의 공간 맥락 전달에 참고한다. 비대칭·부분 확대를 정보 중요도에 맞춰 활용하는 방식이 대상이며 버건디 색상·아이콘·브랜드 자산을 채택한 것은 아니다.
- 디무브: 서비스·이름 소개 → 시장·사용자 배경 → 인터뷰의 Problem/Needs → 경쟁 서비스 비교 → 취업준비생과 기업 담당자 유형별 페르소나·UX Scenario → 서비스 목표 → 콘셉트·가이드·컴포넌트 → 반응형 및 페이지별 설명 → 회고. 본문 회고에서 신규 서비스라고 명시한다.
- 디무브의 UX Scenario는 Stage / Step / Doing / User Value로 행동과 제공 가치를 대응한다. 신규 서비스가 누구의 어떤 상황을 해결하는지 설명한 뒤 기능으로 연결하는 데 참고한다. 네 페르소나나 양면 플랫폼 구조 자체를 카페콕에 옮기지는 않는다.
- 마샬·탬버린즈는 콘셉트와 브랜드 표현 중심으로 전개하며 앞선 UX 사례와 같은 리서치 분량을 반복하지 않는다. 마샬은 인터랙션·구현 회고, 탬버린즈는 비대칭 이미지 편집과 화면 주석을 다룬다. 모션 설명은 캡처의 주장으로만 확인했다.
- 세 자료의 참고 역할: 문선의는 전체 이야기와 기능별 제목, 유니클로는 문제·해결 대응과 UI 세부 설명, 이해민은 신규 서비스 시나리오와 검증 이후 수정 과정. 각 프로젝트의 목적에 맞게 필요한 구조만 선택한다.

## CAFÉKOK 구현에 사용한 자산

- 사진: 사용자 제공 `C:/Users/SBS/Downloads/rawkkim-wQUD2xYXCqo-unsplash (1).jpg`, 적용일 2026-09-28. 기존 `cafekok/cafekok-detail/cafekok/assets/cafe-cover.jpg`와 SHA-256이 동일하다. JPG 원본을 보존하고 WebP 1600px·800px 파생본을 표지, 메인 CAFÉKOK 대표 이미지, 디자인 방향의 무드보드에 사용했다. 사진 속 카페를 UI의 가상 카페로 표시하지 않았다. 원본 게시 URL·정확한 크레딧·별도 사용 조건은 미확인이다. 파일명의 RAWKKIM·Unsplash 표기만으로 원본 출처 검증을 대신하지 않는다.
- 서체: 기존 `OFFER/offer/assets/fonts/PretendardVariable.woff2`를 복사해 상세페이지에서 로컬 로딩한다. 동봉된 SIL Open Font License와 저작권 표기를 `cafekok/cafekok-detail/cafekok/assets/Pretendard-LICENSE.txt`에 그대로 보존했다. 전용 브랜드 서체는 확보되지 않아 추가하지 않았다.
- 세 Behance 캡처는 분석·편집 구조의 참고 자료로만 사용했다. 캡처 자체나 다른 프로젝트의 앱 화면·문구·조사 수치는 공개 페이지 자산으로 사용하지 않았다.

## 포트폴리오 도구 스트립의 GPT 아이콘

- 2026-10-02: 임시 SVG를 OpenAI 공식 흰색 Blossom SVG로 교체했다. [공식 브랜드 지침 및 사용 조건](https://openai.com/brand/), [공식 배포 ZIP](https://cdn.openai.com/brand/OpenAI-Logos-2025.zip).
- [다운로드 원본 ZIP](references/brands/OpenAI-Logos-2025.zip)을 보존했다. 내부 `OpenAI-logos(new)/SVGs/OpenAI-white-monoblossom.svg`를 수정 없이 `portfolio-shell/dist/assets/gpt.svg`에 적용했다. OpenAI 소유 상표이며 별도 오픈소스 라이선스가 아닌 공식 브랜드 사용 조건을 따른다.

## DOA Process 섹션 — Q&A 카드와 스크롤 참고

- 사용자 지정 출처: [DOA](https://e-doa.co.kr/#process), 확인일 2026-10-02. 데스크톱의 섹션 고정, 세로 스크롤→가로 카드 이동, 교차 기울기와 수평 복원, 세로 카드의 상단 제목·구분선·하단 설명 배치를 관찰했다.
- 적용 범위는 `portfolio-shell/dist/` 메인의 `#qa`뿐이다. 기존 다섯 질문·답변과 포트폴리오 서체·다크 팔레트를 유지하며 직접 구현했다. 작은 화면에서는 읽기 가능한 크기의 가로 스와이프 카드, 동작 축소에서는 정적 카드 목록을 사용한다.
- 원 사이트 이미지·서체·문구·소스 코드는 재사용하지 않았다. 해당 자료의 재사용 라이선스는 미확인이다. 현재 브라우저에서 확인한 화면을 참고했으며 저장된 캡처 파일은 없다.

## Hero 글자 모션 참고

### Hero 배경 — 2026-10-02

- [DOA](https://e-doa.co.kr/)의 Hero에서 검정 배경 위 유리·크롬 곡면과 반사광을 관찰했다. 원본 이미지·영상·코드를 가져오지 않고 내장 이미지 생성 도구로 코발트 블루·은색 배경을 새로 생성했다.
- 적용: 메인 Hero에만 사용. 중앙 문구와 하단 이름의 가독성을 위한 어두운 오버레이, 방향당 10초의 이동·회전·확대, 기존 일시정지 버튼 연동. 사용자 피드백에 따라 이동 폭을 늘렸으며 모바일은 데스크톱보다 작게 움직인다. 동작 축소에서는 배경이 정지한다.
- 자산과 최종 생성 프롬프트: [배경 제작 기록](../../portfolio-shell/dist/assets/hero/README.md). 생성 PNG 원본과 JPEG 품질 90 웹용 사본을 함께 보존했다.

- 사용자 지정 출처: [GreenSock — ContainerAnimation SplitText](https://codepen.io/GreenSock/pen/MYyBrZw), 확인일 2026-10-02. 글자별 세로 이동·회전과 가로 이동 중 기준선으로 복원되는 동작을 브라우저에서 확인했다.
- 적용 범위: 메인 Hero의 기존 `2026 UX/UI DESIGNER PORTFOLIO` 문구. 첫 등장과 반복 흐름에 글자별 정렬을 적용하고 기존 스크롤 가속·일시정지·동작 축소를 유지한다. 기존 한 화면 높이와 자동 흐름에 맞게 직접 구현했다.
- 원본 문구·자산·소스 코드를 복사하지 않았으며 GSAP/SplitText 의존성을 추가하지 않았다. 원본의 재배포 라이선스는 별도로 확인하지 않았다. 비교 캡처는 브라우저 세션에서 확인했으며 파일로 보관하지 않았다.

## Work 표지 스크롤 참고 — 2026-10-02

- 사용자 지정 출처: [CREATZ](https://mycreatz.com/kr/index.php)의 BUSINESS AREA. 브라우저에서 표지 구성과 카드의 sticky 배치를 관찰했다.
- 메인 Work 오른쪽 표지에만 같은 위치에서 다음 카드가 아래에서 올라와 이전 카드를 덮는 방식을 직접 구현했다. 기존 왼쪽 프로젝트 요약·진행 표시와 실제 표지 자산·링크를 유지했다. 사이트의 원본 코드·문구·이미지는 복사하지 않았다.
- 1101px 이상, 높이 650px 이상에서 적용한다. 모바일·태블릿·낮은 화면·동작 축소는 기존 목록과 표지 아래 정보·링크를 사용한다.

## Contact 메탈 명함 참고 — 2026-10-02

- 사용자 지정 움직임 참고: [GreenSock — pointer move](https://codepen.io/GreenSock/pen/qBzaNQy). 영역 중심의 포인터 좌표로 이동과 기울기를 함께 갱신하고 부드럽게 복귀하는 인상을 참고했다. 기존 JavaScript의 단일 프레임 루프로 직접 구현했으며 GSAP을 추가하지 않았다.
- 조명 인상 참고: [GreenSock — image sequence](https://codepen.io/GreenSock/pen/VwgevYW). 이미지 시퀀스의 소재·조명 인상만 참고했다. 원본 시퀀스나 에셋을 가져오지 않고 CSS 금속 결·넓은 반사광·모서리 하이라이트로 구현했다.
- 적용 범위는 메인 Contact 명함이다. Q&A 배경은 기존 카드에 회색빛 CSS 그라디언트와 미세 질감을 직접 추가했다. 외부 코드·이미지·문구는 복제하지 않았다.

## KSW 첫 진입 인트로 — 2026-10-02

- 사용자 지정 참고: [GreenSock — MorphSVG convertToPath](https://codepen.io/GreenSock/pen/gagNeR). 도형에서 문자로 SVG 윤곽을 연속 변형하는 원리만 참고했다. 데모의 ABC, 색상, 반복 재생, 소스·이미지는 복제하지 않았다.
- 메인 첫 탭 세션에만 적용한다. KSW 윤곽은 `portfolio-shell/dist/assets/ksw-intro.svg`에 직접 제작했고, 두 차콜 패널은 왼쪽 위에서 오른쪽 아래로 이어지는 경계를 기준으로 반대 방향으로 열린다.
- [공식 설치 문서](https://gsap.com/docs/v3/Installation/)와 [MorphSVG 문서](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/), [공식 3.13.0 배포](https://github.com/greensock/GSAP/tree/3.13.0)를 확인했다. 공식 npm 3.13.0의 GSAP·MorphSVGPlugin 파일을 로컬 `dist/vendor/gsap/`에 원본 그대로 보관했다. 기존 GSAP 전역 객체가 있으면 재사용하며 인트로 생략 시 의존성을 로드하지 않는다.
- 파일 헤더의 저작권·[GSAP Standard License](https://gsap.com/standard-license/) 고지를 보존하고 배포 경로를 vendor README에 기록했다. 이 라이선스를 MIT로 표시하지 않는다. CodePen 전용 체험 배포는 사용하지 않았다.

## Tools 구성과 자체 제작 선화 — 2026-10-02

- [DOA](https://e-doa.co.kr/)의 AI SOLUTION에서 작은 라벨, 중앙 비주얼, 아래 역량 문장으로 이어지는 구성을 참고했다. 웹 문서와 브라우저 DOM으로 구성은 확인했으나 해당 레퍼런스 화면 캡처는 시간 초과로 확보하지 못했다.
- 적용 범위는 메인 기존 Tools 영역이다. 세 리본은 `portfolio-shell/dist/assets/method-ribbon.svg`에 직접 제작하고 CSS 입체 배치와 회전으로 구성했다. 원본 그래픽·색상·문구·코드를 복제하지 않았으며 라이브러리를 추가하지 않았다. 툴 로고는 기존 로컬 자산을 재사용한다.
- About의 `ergonomic-proportions.svg`는 인체 비례와 두 가지 도달 범위를 직접 구성한 선화다. 특정 학회 로고나 기존 로고를 복제하지 않았다. 원·사각형과 인체 비례라는 개념을 활용하며 외부 이미지 자산을 사용하지 않는다.

### Tools 그래픽 교체 — 2026-10-06

- 사용자 요청에 따라 기존 세 리본 대신 표지 배경의 코발트 블루·크롬·유리 재질을 이어받은 단일 조형을 적용했다. 내장 image_gen으로 생성한 [투명 PNG](../../portfolio-shell/dist/assets/tools-chrome.png)를 그대로 사용하며, [최종 생성 프롬프트](../../portfolio-shell/dist/assets/tools-chrome.prompt.txt)를 함께 보존한다. 외부 원본 자산을 사용하지 않았다.
- CSS의 느린 이동·기울기 모션을 사용한다. 화면 밖·탭 비활성·모션 일시정지 시 멈추고, 동작 축소 설정에서는 정적으로 표시한다. 이전 SVG 파일은 보존하되 현재 화면에서는 사용하지 않는다.

### Tools 뫼비우스 모션과 메뉴 묶음 — 2026-10-06

- 후속 요청의 VS Code 로고처럼 접히는 띠라는 방향을 바탕으로, 반 바퀴 비틀려 닫히는 뫼비우스 곡면을 `portfolio-shell/dist/mobius.js`에서 직접 계산한다. 공식 로고 자산을 사용하지 않았다. 앞서 생성한 PNG는 보존하지만 현재 표시하지 않는다.
- 블루·크롬 반사는 기존 표지 배경과 코드로 정의한 조명을 사용한다. 실제 곡면의 회전을 WebGL로 렌더링하며 새 외부 라이브러리는 없다. 화면 밖·탭 비활성·일시정지·동작 축소 시 반복 렌더링을 멈춘다.
- 정적 대체 이미지 `dist/assets/tools-mobius.svg`는 같은 곡면을 투영한 자체 제작 자산이다. `node portfolio-shell/render-mobius-poster.cjs`로 다시 생성한다. JavaScript/WebGL을 쓸 수 없을 때도 띠 형태를 제공한다.
- 헤더 ABOUT은 `/#tools`로 이동해 작업 방식부터 프로필까지 이어진다. 기존 `/#about` 프로필 직접 링크도 유지하며 두 구간 모두 ABOUT 선택 상태를 표시한다.

### 교차형 띠와 제목 등장 순서 — 2026-10-06

- 원처럼 보인다는 후속 피드백에 따라 띠의 중심 경로를 네 직선과 둥근 접힘으로 재구성했다. 대각선 두 면이 다른 깊이에서 교차하며, 측면으로 완전히 돌아가는 회전 대신 작은 기울기 변화로 교차 실루엣을 유지한다. 기존 블루·크롬 재질과 자체 곡면 기반 정적 대체 이미지를 유지한다.
- `section-flow.js`는 메인 HOW I WORK·About·Work·Q&A·Contact의 제목을 먼저 타이핑한 뒤 본문을 순차 등장시킨다. 원래 제목 레이아웃과 접근 가능한 전체 이름을 유지하고, 한 번 읽은 내용은 다시 숨기지 않는다. 빠른 스크롤·포커스 이동·동작 축소 설정에서는 대기 없이 내용을 노출한다.

## 갱신 방법

- 원본 업데이트는 버전·출처·라이선스·해시를 함께 갱신한다. 원본 파일에 프로젝트 지침을 삽입하지 않는다.
- 프로젝트 해석과 예외는 `docs/projects/`에 기록한다. 새로운 레퍼런스가 공통 기준을 자동으로 변경하지 않는다.

## INSPLANET ? main portfolio transitions (2026-10-06)

- User-selected reference: [INSPLANET](https://www.insplanet.co.kr/). The live page and desktop scroll states were inspected in Chrome. Observational captures are retained in ../../portfolio-shell/.qa/transitions-reference/.
- Applied only to the main portfolio shell: small lower-right scroll track, dot/ring cursor, large title settling into its content position, and alternating ordinary scrolling with short sticky passages. Implementation uses the existing portfolio palette, native scroll and original local code; no source code, imagery, copy or branding was copied from the reference.
- The final flow is Hero -> About -> How I Work -> Work -> Q&A -> Contact. This replaces the earlier Tools-first menu arrangement and title typing. ABOUT now targets /#about; /#tools remains available. Updated material and interaction checks are in ../../portfolio-shell/QA.md. Common DESIGN.md rules are unchanged.

### Native project-page transitions ? implementation reference (2026-10-06)

- [Chrome's cross-document View Transitions documentation](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) informed the same-origin CSS opt-in and the parser-blocking pagereveal listener. Shared files are local original code; no demo visuals or code bundle were copied. Normal links/history remain the navigation mechanism, and unsupported browsers retain ordinary navigation.
- Scope: the portfolio shell and its generated project entries via portfolio-shell/build.cjs. This does not change the standalone CAF?KOK or OFFER design/source. The user's clarified request covers both section scrolling and actual project-page changes.

## Local typography and project stage — 2026-10-07

- Anton 400 uses the unmodified [official Google Fonts distribution](https://github.com/google/fonts/tree/main/ofl/anton) with SIL OFL 1.1. Pretendard Variable and its original OFL notice are reused from the existing OFFER assets. Files, hashes and upstream links: [local font provenance](../../portfolio-shell/dist/assets/fonts/README.md).
- Applied only to portfolio headings, descriptions and navigation. Product UI fonts and text inside supplied images remain unchanged. Inter Tight, Noto Serif KR and remote Pretendard requests were removed from the shell.
- User reference: [INSPLANET Our Projects](https://www.insplanet.co.kr/). The current public page content was fetched, but its live project motion was not observed in this revision. Implementation therefore follows the user's explicit specification: one sticky stage, left description, fixed right window, covers rising on native scroll and copy changing at half coverage. No source code or assets were copied.
- This supersedes the earlier separate Work title entrance and sticky summary rail. One progress range handles title settling and LG → IVI → CAFÉKOK → OFFER. Mobile, low-height, reduced-motion and no-JS layouts expose all four projects vertically. Current browser evidence is in `portfolio-shell/.qa/type-stage/`; common DESIGN.md is unchanged.


## User-supplied asymmetric cobalt/chrome ribbon — 2026-10-07

- Unmodified user-supplied reference copy: [asymmetric-cobalt-ribbon.png](references/screenshots/asymmetric-cobalt-ribbon.png). SHA-256: `fe4e3bc72ff842d8025af11efc081b2723c439b14805bc89cf9013dce9ec2b2d`. Separate publication/license terms were not supplied.
- Scope: How I Work geometry and cobalt/chrome material only. The PNG is not shipped as a moving image or sampled as a deformed full-image layer. Local WebGL code reconstructs a closed folded belt with stationary camera/light and 14-second longitudinal material transport. Hero environment imagery remains a separate stationary reflection source. No fonts, project layouts, cursor effects or capability text were changed. The sculpture entry translation/scale was removed to keep its geometry fixed.
