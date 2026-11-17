# KSW 58차 — IVI 키보드 탐색 좌표 보정

- 기준: 57차 누적 ZIP. 기존 14~57차 내용과 원본 에셋 보존.
- 수정: `dist/work/ivi/editorial.js` 한 파일. 갤러리 항목의 `offsetLeft - gallery.offsetLeft` 계산은 서로 다른 offsetParent에 따라 오차가 날 수 있으므로 `getBoundingClientRect()` 기반 좌표로 교체. ArrowLeft/ArrowRight에 Home/End 탐색 추가. reduced-motion에서는 즉시 이동. 터치 스와이프 유지.
- 고정 시각 레퍼런스: 기존 목록 유지. 이번 회차 URL/저자 검증 미실시, 신규 확정 없음. GitHub 라이브러리 신규 도입 없음.
- 검증: `node --check` 통과. ZIP 무결성 검사 통과. 실제 동작 미검증.
- 브라우저: 시스템 Chromium + Playwright 실행은 성공했지만 `http://127.0.0.1:8765/work/ivi/` 접근 시 `net::ERR_BLOCKED_BY_ADMINISTRATOR`. 1440/1280/768/390 화면 검증 불가. **Before/After 비교 이미지 미생성**. 가상 이미지 생성하지 않음.
- GitHub main/Netlify: 변경하지 않음. 원격과 최신 diff 미확인.
- 미완료: 실브라우저 키보드 탐색/접근성 QA, 원본 IVI 이미지 저해상도 문제, LG 및 IVI 상세 페이지 전체 디자인 QA.
- 다음: 브라우저 접근 가능한 환경에서 390px 갤러리 키보드 탐색 실측, 1440/390 Before/After 촬영, 이후 IVI 전체 에디토리얼 구조 점검.
