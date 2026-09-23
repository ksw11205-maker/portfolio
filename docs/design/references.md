# 디자인 레퍼런스 출처와 적용 범위

외부 자료는 판단을 돕는 참고 자료다. 작업 절차는 [AGENTS.md](../../AGENTS.md), 공통 디자인은 [DESIGN.md](../../DESIGN.md), 제품별 적용은 `docs/projects/`가 기준이다.

## 실제 채택한 문서

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

- `references/screenshots/`에는 현재 채택한 참고 캡처가 없다. Git 경로 유지를 위한 `.gitkeep`만 둔다.
- 이전 로컬 화면 캡처는 구현 상태 확인용 QA 자료이며 디자인 레퍼런스로 채택하지 않았다.
- 향후 실제 채택하는 캡처만 추가하고 이 문서에 파일명, 원본 URL 또는 제공자, 취득일, 적용 위치·원칙, 라이선스·사용 조건을 함께 기록한다. 모르는 출처와 권한은 미확정으로 표시한다.

## 갱신 방법

- 원본 업데이트는 버전·출처·라이선스·해시를 함께 갱신한다. 원본 파일에 프로젝트 지침을 삽입하지 않는다.
- 프로젝트 해석과 예외는 `docs/projects/`에 기록한다. 새로운 레퍼런스가 공통 기준을 자동으로 변경하지 않는다.
