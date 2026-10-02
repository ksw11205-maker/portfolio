# CAFÉKOK 상세페이지

편집 원본은 이 폴더의 index.html, styles.css, script.js와 assets/입니다.
정적 HTML/CSS/JavaScript이며 다른 프레임워크나 패키지 설치가 필요하지 않습니다.

저장소 루트에서:
```powershell
node portfolio-shell/server.cjs
```
http://localhost:4173/work/cafekok/ 에서 확인합니다.
메인 포트폴리오의 CAFÉKOK 카드와 서로 연결됩니다.

배포 파일만 갱신:
```powershell
node portfolio-shell/build.cjs
```
portfolio-shell/dist/work/cafekok/는 이 원본을 복사한 빌드 결과입니다.
원본 수정 후 빌드를 다시 실행하거나 서버를 재시작하세요.
기존 폴더의 Live Server 단독 실행에서도 본문은 열리지만 포트폴리오 복귀 링크는 통합 서버를 기준으로 합니다.

내용·자료 상태·제안 정책은 저장소 docs/projects/cafekok.md에서 관리합니다.
UI는 새로 제작한 정적 콘셉트이며 실제 제품·추천 데이터·사용성 테스트 결과가 아닙니다.
사진 원본 JPG와 로컬 Pretendard, 해당 라이선스는 assets/에 보존합니다.
