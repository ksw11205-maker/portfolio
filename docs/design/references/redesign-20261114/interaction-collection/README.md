# UI/UX 포트폴리오 GitHub 코드 수집
수집일: 2026-11-14

목적: 국내 대기업 UI/UX 지원용 포트폴리오의 시각적 완성도, 모션의 일관성, 설계 판단을 설명하는 힘을 높일 코드와 예제를 선별한다. 특정 기업의 합격 기준을 검증한 자료는 아니다.

현재 검토한 프로젝트: KSW Cycle65 정적 HTML/CSS/JS 포트폴리오.
결과: 8개 저장소의 선택 소스·예제·문서·라이선스 48개 파일. 전체 저장소 또는 설치된 패키지가 아닌 참고용 발췌 스냅샷이다. 예제의 import 경로와 빌드 산출물이 모두 포함되지는 않아 각 예제가 독립 실행되는 것은 아니다.
라이브 사이트와 dist는 이 수집 작업에서 수정하지 않았다.

## 먼저 볼 자료
| 우선순위 | 자료 | 얻을 것 | 현재 포트폴리오 적용 위치 | 판단 |
|---|---|---|---|---|
| 1 | [Open Props](https://github.com/argyleink/open-props) | 간격·폰트 스케일·easing 토큰 | 공통 타이포, 본문 폭, 섹션 간격, 버튼 전환 | CSS 변수만 선별해 기존 브랜드 토큰에 연결 |
| 1 | [Scrollama](https://github.com/russellsamora/scrollama) | 고정 비주얼 옆에서 단계별 설명 | IVI 연구→설계 판단, LG 작업 흐름 | 설명 구조 참고. 현재 reading gate와 중복 관찰자 방지 |
| 1 | [img-comparison-slider](https://github.com/sneas/img-comparison-slider) | 같은 화면의 전후 비교 | UI 개편·정보 위계 변경의 근거 제시 | 전후 이미지가 실제로 준비된 섹션에만 사용 |
| 2 | [PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe) | 확대·줌·갤러리 구조 | IVI 4개 레이아웃, CAFEKOK 및 OFFER 화면 | 현재 확대 기능을 대체할 필요가 있을 때 도입 |
| 2 | [Motion](https://github.com/motiondivision/motion) | 타임라인·순차 등장·스크롤 진행 | 제목→핵심 주장→증거의 등장 순서 | JS API/예제 참고. 기존 WAAPI로 충분하면 의존성 추가 생략 |
| 2 | [D3 Shape](https://github.com/d3/d3-shape) | SVG 선·면적 생성과 데이터 기반 표현 | IVI 지표의 추세·비교 보조 | 통계 분석 도구가 아님. 기존 막대/표에는 필요성부터 판단 |
| 참고 | [Codrops Layout Animations](https://github.com/codrops/ScrollBasedLayoutAnimations) | 이미지 레이아웃 변화와 편집적 화면 연출 | 메인 프로젝트 소개 또는 짧은 도입부 | GSAP Flip/ScrollTrigger·Lenis 의존. 본문 전체에 복제하지 않음 |
| 보류 | [Lenis](https://github.com/darkroomengineering/lenis) | 스크롤 상태와 프레임 관리 | 현재 scroll-motion/reading-snap 교체 평가 | 기존 스크롤 제어와 동시에 실행하지 않음 |

## 폴더
- sources/: upstream 저장소 이름과 경로를 보존한 선택 파일
- SOURCES.json: 저장소, 고정 커밋, 라이선스, 원본 URL
- INTEGRATION_PLAN.md: 현재 파일과 연결한 적용 계획, 충돌 가능성, 완료 기준
- CASE_STUDY_STRUCTURE.md: 설명력 개선에 필요한 콘텐츠 구조
- FILE_INTEGRITY.json: 저장 파일의 크기·SHA-256 및 라이선스 존재 확인

## 읽는 순서
1. CASE_STUDY_STRUCTURE.md로 주장과 증거의 대응부터 정리한다.
2. Open Props로 공통 규칙을 정하고 Scrollama 예제로 설명 흐름을 설계한다.
3. 실제 변경 전후 화면에 비교 기능을 붙이는 방법을 검토한다.
4. 확대/모션은 기존 기능의 유지·개선·교체 중 하나를 선택한다.

## 출처와 사용 범위
각 저장소의 LICENSE 또는 LICENSE.md를 함께 저장했다. D3 Shape는 ISC, 나머지는 GitHub 메타데이터와 수집한 라이선스 기준 MIT다. 재사용 시 해당 저작권 및 라이선스 고지를 보존한다.
Codrops 저장소의 제3자 GSAP/Lenis 번들, 사진, 이미지, 폰트는 수집하지 않았다. Codrops 코드의 MIT를 의존 라이브러리·미디어 전체에 적용되는 허가로 해석하지 않는다.
배포용 버전은 별도 선택해야 한다. 저장된 소스는 특정 커밋에 고정한 참고 자료로, 최신 안정 릴리스나 보안 검증을 의미하지 않는다.
