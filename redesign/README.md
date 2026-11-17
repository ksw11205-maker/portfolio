# 김성원 UX/UI 포트폴리오 — 새 구현

2026-11-15 별도 리디자인. `index.html`과 LG·IVI·카페콕·OFFER 상세 4개, 실제 제품 프로토타입 및 자산을 포함한다. 기존 버전과 분리된 정적 웹 루트이며 배포하지 않았다.

최신 수정: 기존 포폴 쉘과 커서를 복원하고, 새 상세의 설명에 화면별 번호 주석과 회고 Q&A를 추가했다. 하단은 다음 프로젝트 하나다. 사용자가 로컬 실행을 승인했으며 `http://localhost:4175/`에서 확인한다.

공통 스타일과 기본 인터랙션은 `styles/`, `scripts/`에 있다. 폰트·아이콘·THREE.js와 라이선스는 로컬로 포함했다. 프로젝트 캡처의 원본 출처와 합성 방식은 `assets/covers/manifest.json`에 있다.

절대경로(`/assets/`, `/work/`)를 사용하므로 파일을 더블클릭하는 대신 이 폴더를 HTTP 루트로 서빙해야 한다. `npm.cmd run dev:redesign`으로 실행하고, `npm.cmd run check:redesign`으로 정적 검사한다. 현재 검증 한계는 상위 `docs/design/redesign-handoff.md`를 참고한다.
