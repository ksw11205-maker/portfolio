# KSW — 기존 쉘 보존 + Run 9 호환 수정 검수 (2026-11-12)

## 1. 이번 회차 실제 열어 확인한 국내 디자이너 / 스튜디오 자료

1. [IPARTNERS — 현대자동차그룹 UX STUDIO 웹사이트 (2024.12–2025.05)](https://www.ipartners.co.kr/work/case-study/ux-studio-build)
   - **확인**: 문제 정의 → 서비스 역할 → Implementation → Impact → Lesson Learned로 구성. 동일한 흐름을 PC·모바일에 유지한 이유와 구체적 기능을 설명.
   - **적용**: IVI에서 실험 화면(4종)과 후속 하이브리드 설계안의 성격을 분명히 밝힘.
   - **배제**: 예약 서비스의 UI와 브랜드 자산은 IVI에 이식하지 않음.
2. [Hajeong Hwang — DailyMove 디자인 시스템 (2025)](https://www.hajeonghwang.design/work/routine-out-loud)
   - **확인**: 역할·기간·팀 구성 → 문제 → 디자인 토큰·상태별 컴포넌트 → 접근성 원칙으로 분리. 인터랙션은 기능적으로 설명.
   - **적용**: CAFEKOK와 OFFER 화면 확대 기능은 별도 컴포넌트로 구현하고 버튼 상태, 이미지 오류, 키보드 포커스를 고려.
   - **배제**: DailyMove의 구체 색상·컴포넌트 스타일은 가져오지 않음.
3. [Portfoli-oh! — 인터랙티브 포트폴리오 케이스 스터디 (2025)](https://portfoli-oh.oosu.dev/projectdetail/portfoliOh.html)
   - **확인**: 실제 사례 설명에 인터랙션, 반응형 목업, 코드 아키텍처, 사용성 강조; 다만 일부 이미지가 placeholder이고 브라우저 상 동작은 별도 검증하지 못함.
   - **적용**: 화면을 직접 확대해서 확인하는 인터랙션만 가볍게 제공.
   - **배제**: 추가 3D·무거운 모션·다국어 전환 등 현재 문제와 관련 없는 기능은 제외.
4. Behance의 2026년 UI 설계 사례는 직접 열기에서 403 차단돼 분석에서 제외함.

보조 공식 기준: [W3C WCAG 2.2 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html).

자료의 실제 페이지 본문과 텍스트/이미지 설명을 확인한 것이며, 인터랙션 실연이나 픽셀 단위 원근·광원 비교는 검증하지 못함.

## 2. 문제 원인

- `KSW_V4_1_Run9_Integrated_Patch_20261112.zip`은 **8개의 HTML/CSS/JS 패치 파일**만 가진 후보 패키지로, 실행 가능한 전체 사이트가 아니다.
- 해당 패치의 HTML은 `/ksw-2026.css`, `/ksw-2026.js`, `/ksw-v3-artdirection.css`, `/ksw-v3-interactions.js`, `/ksw-v4-case-artdirection.css`, `/ksw-v4-case-interactions.js` 등 현재 `portfolio-vscode.zip`에 없는 공통 파일을 참조한다.
- 패치 파일을 기존 상세페이지에 통째로 덮어쓰면 원래 shell이 사용하는 `case-navigation`, `page-transitions`, 관련 자산·애니메이션 의존성이 사라질 수 있다.
- 따라서 Run 9 전체 HTML을 복사하지 않았다. 반대로 **원래 화면에 필요한 기능과 설명을 이식**했다.

## 3. 이번 작업에서 실제 수정한 파일

기준 파일: `portfolio-vscode.zip` 압축의 `portfolio-vscode/dist/`.

- `dist/work/ivi/index.html`: 4개 실험 레이아웃과 후속 하이브리드 설계 제안을 구분한 캡션으로 교체.
- `dist/work/cafekok/index.html`: 공용 확대 CSS/JS 참조만 추가. 기존 HTML/화면 유지.
- `dist/work/offer/case-study.html`: 공용 확대 CSS/JS 참조만 추가. 기존 반응형 3기기 UI 그대로 유지.
- `dist/case-image-preview.css` (신규): 기존 화면에 어울리는 확대 버튼과 반응형 다이얼로그, 포커스 스타일, reduced-motion 처리.
- `dist/case-image-preview.js` (신규): CAFEKOK 7개 실제 앱 스크린샷과 OFFER 3개 반응형 스크린샷에 확대 버튼을 점진적으로 생성. 이미지 오류 상태, 닫기, Escape, 버튼으로 포커스 복귀 로직 포함.

기존 `dist/index.html` 쉘, `dist/work/lg/index.html`, 원본 JS/CSS, 이미지 및 기능 구현 파일은 **변경 없음**.

## 4. 검증한 사실

- 로컬 Python 서버의 HTTP 응답: `/` 200 OK.
- HTML 상의 내부 src/href 파일 및 페이지 연결 6곳 검사: 누락 참조 0개.
- 검사 대상: `/`, `/work/lg/`, `/work/ivi/`, `/work/cafekok/`, `/work/offer/case-study.html`, `/work/offer/`.
- 전체 비벤더 JS 파일 62개에 대해 `node --check` 실행: 문법 오류 0개.
- 4개 프로젝트 링크가 쉘에 존재함.
- CAFEKOK 앱 이미지 7개, OFFER 반응형 화면 이미지 3개에 확대 컨트롤이 붙도록 선택자 확인.
- 기존 파일과 해시 비교: 원래 HTML 3개만 수정하고 공용 새 파일 2개만 추가함.

## 5. 아직 검증하지 못한 항목

- Chromium Playwright에서 localhost, file://, data: URL 모두 `ERR_BLOCKED_BY_ADMINISTRATOR`로 차단. 따라서 390px 화면, 실제 클릭·Esc·포커스 및 스크롤 오버플로 **브라우저 E2E 통과 여부를 확인하지 못함**.
- 기존 원본 페이지에 포함된 실험 수치 원자료 대조, 실제 네트워크에서 외부 리소스 다운로드 상태 및 실제 성능 점수는 확인하지 못함.
- GitHub 저장소 원본 또는 현재 배포본은 변경/업로드/커밋하지 않았음. 제공한 ZIP은 로컬 **검수용 개선 실행본**으로만 사용 가능.

## 6. 실행 방법

`portfolio-vscode` 폴더에서:

```powershell
py -m http.server 5500 --directory dist
```

브라우저: `http://localhost:5500/`

이전 서버를 켜 놓았다면 해당 터미널에서 Ctrl+C로 종료한 뒤 실행할 것. Run 9의 `portfolio/work/...` HTML을 이 결과물에 다시 덮어쓰지 말 것.
