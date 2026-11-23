# CAFÉKOK 프로토타입 캡처

이 디렉터리의 PNG는 로컬 `/work/cafekok/prototype/`을 Chromium에서 390×844 CSS 픽셀과 DPR 2로 실행해 캡처한 결과다. `manifest.json`에 파일별 픽셀 크기와 긴 화면의 주요 UI 위치를 기록했다.

- `onboarding-*`, `my-taste*`, `home-*`, `detail-*`, `explore-*`, `saved-*`는 화면이나 실제 기능 영역을 캡처한 파일이다.
- `component-*`는 실제 UI 요소의 경계를 기준으로 캡처했다. 시스템 아이콘은 프로토타입의 `prototype/icons/`에 있는 SVG를 사용한다.
- 홈은 공부·작업 목적을 선택한 상태다. 모서리 서재 상세 캡처 전에는 취향 수정 모달에서 세 항목을 바꾸고 데이트 목적을 선택했다. 매칭률과 이유는 앱이 표시한 값이다. 저장 완료 화면은 실제 북마크 버튼으로 네 카페를 저장한 상태다.
- 촬영 중 프로토타입이 요청한 Unsplash 이미지를 원래 URL에 대응시켜 로드했다. 상세의 지도는 프로토타입에 포함된 네이버 지도 캡처다.
- 긴 화면의 PNG는 위아래가 이어지는 한 장이다. 해당 캡처와 요소 캡처에서는 고정 메뉴가 콘텐츠를 덮지 않도록 캡처 옵션을 사용했다. 하단 메뉴 자체는 별도 요소 이미지에 포함했다.
- OVERVIEW의 `../overview-handheld-frame.png`는 제공된 핸드헬드 목업에서 화면 부분을 비운 기기·손 레이어다. 실제 홈 캡처는 HTML과 CSS로 이 레이어에 합성한다.

재현 스크립트는 `portfolio-shell/.qa/cafekok/capture-case.cjs`에 있다. 포트폴리오 로컬 서버를 켠 상태에서 Playwright와 Chromium이 설치된 환경으로 실행한다. 기본 주소는 `http://127.0.0.1:4173`이며 필요하면 `CAFEKOK_ORIGIN`, `CAFEKOK_PLAYWRIGHT`, `CAFEKOK_CHROMIUM`, `CAFEKOK_PHOTO_CACHE`를 지정할 수 있다.
