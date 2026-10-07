# Verification

- Browser widths: 375, 390, 1440, 1920. No document horizontal overflow.
- Exactly four project entries. All four links resolve to titled placeholders. Browser Back restores the portfolio.
- Fixed header, mobile menu opens and closes on section navigation.
- Q&A opens one item at a time; Korean answer displayed without clipping.
- Email href uses the placeholder constant. Mobile business card fits.
- Browser console: no captured errors or warnings. JavaScript syntax check passed.
- Desktop cursor visually observed. Reduced motion CSS/JS reviewed; OS preference emulation was unavailable.
- External fonts need internet; system fallbacks are configured.
- Thumbnails and email remain editable placeholders.
- Hosting incomplete: Sites plugin files disappeared during the session. Local preview remains available.

## About revision
- Replaced generic values/process blocks with experience, background and awards.
- JavaScript syntax check passed.
- Added scoped responsive styling: three desktop columns, one column at 800px and below.
- Browser verification of this revision was unavailable because the Chromium executable is not installed. Earlier browser checks above apply to the original shell.

## Spacing and introduction revision
- Introduction condensed to one sentence.
- Removed decorative body background grid; section and content borders retained.
- Gutters: 32px on mobile, 8vw clamped to 32–160px on desktop; content capped at 1440px on wide screens.
- JavaScript syntax and ZIP integrity checked; browser rendering remains unverified in this environment.

## Hero and tool strip revision
- Kept the animated portfolio title; placed role and name beneath it.
- Removed duplicate hero metadata and English slogan. Scroll link targets About.
- Nine tool icons with accessible names and focus/hover tooltips. External icon availability is unverified; network access timed out.
- Reference URL could not be retrieved. Layout follows the explicit user instructions.
- JavaScript syntax check passed; browser visual checks unavailable.

## Reverse marquee and frame revision
- Tool groups duplicated for a rightward seamless CSS loop; title remains leftward.
- Duplicate group hidden from assistive technology and inert.
- Hover/focus and existing motion toggle pause the strip; reduced motion displays a static wrapped group.
- Outer rails sit 16px beyond content; section corners use 5px square marks.
- Browser visual verification remains unavailable.

## Broken GPT icon and duplicate frame fix
- GPT replaced with bundled knot-style SVG; no external request. This is a drawn replacement, not a verified official brand asset.
- Removed original section bottom borders and two-sided frame decoration. Each shared boundary is now drawn once by the preceding section.
- Square markers centered on each outer rail at the boundary.
- Syntax and SVG parsing checked; browser render unavailable.

## Project rail, footer and contact finale
- Project descriptions stored in data.js; sticky crossfade selects the latest project above the reading line. Mobile shows inline summaries.
- Automated selection checks passed for forward scrolling, backward scrolling and large jumps.
- Generated HTML checked for four rail panels, four inline summaries, one contact email CTA and no footer navigation.
- Contact redesigned with large typography, blue business card, bounded pointer tilt and light response. Touch/reduced-motion fallback retained.
- JavaScript syntax passed. Browser rendering could not be verified: no installed browser executable.
- Contact email is still the original placeholder; replace before publishing.

## 2026-10-02 — Q&A Process cards

Scope: only the main portfolio's Questions, answered section. Earlier QA entries above describe past work and are not this verification.

Source visual truth: https://e-doa.co.kr/#process, captured and opened in Chrome through the browser connector. Implementation: http://localhost:4173/#qa, likewise captured and opened. Source and implementation screenshots were presented together in one comparison call at 1440×900 CSS viewport, at their entry states. Browser screenshot output was used directly; screenshot files were not exported to disk. Pixel-density/physical screen normalization was not measured, so this is an interaction and layout adaptation review rather than a pixel-perfect clone claim.

Full-view comparison: a large stationary title on the left, a portrait card starting on the right, an alternating tilt, rounded corners, a title separator and a bottom-aligned description. Native vertical scroll pins the section and moves the cards horizontally. Focused comparison: first/second cards, tilt during travel, last card and visible keyboard focus. Deliberate adaptations: existing Inter Tight/Pretendard/Georgia typography, charcoal/navy surfaces, existing five questions and answers, no borrowed background imagery or source text.

Typography/content: existing questions and answers are preserved; answers remain visible without an accordion. English headings use 26–40px desktop and 30px mobile; Korean body uses 17px/1.8 desktop and 16px/1.8 mobile. Layout/tokens: 24px desktop corners, 20px mobile corners, existing blue focus outline. Asset quality: this change adds no image assets.

Browser checks: 1440×900 desktop start/middle/end states, section sticky top 0 while moving, Tab/Shift+Tab bringing the corresponding card into view, Contact anchor, 390×844 mobile horizontal scrolling with snap alignment, 375px card width/body overflow measurements, and 768×900 tablet rendering. At 390px, native horizontal scroll settled at 331px and displayed the complete second question. All five mobile cards had matching clientHeight/scrollHeight. Q&A browser console error log was empty.

Comparison history:
- P2 mobile card cropped at the right edge: card width had used viewport width without accounting for scrollbar/parent width. Changed to a percentage of the deck's available width. Recaptured at 390px and confirmed full card borders, then confirmed 375px card width 296px.
- Last-card rotation could persist at the end: multiplied remaining tilt by remaining overall progress. Recaptured at 1920×953, where the last-card rotation was below 0.0001 degrees and its complete answer was visible.
- Existing outer frame lines crossed the moving cards: placed the pinned stage above the page frame on its own opaque background. Recaptured the 1920×953 start state and confirmed no frame lines cross the cards.

Remaining verification gaps: actual touch hardware, 200% browser zoom, and OS reduced-motion setting. Reduced-motion static grid and disabling of pinned mode were reviewed in CSS and JavaScript, not rendered under an emulated setting. Existing page-wide frame/overflow behavior outside Q&A was not changed or certified by this scoped review.

No remaining known P0/P1/P2 issue in the scoped card layout or tested navigation. Keep the existing single QA document rather than duplicating its role in another report file.

final result: passed

## 2026-10-02 — Hero letter motion

### Generated blue chrome background verification

2026-10-02: created an original background with the built-in image generation tool after inspecting the DOA hero. The PNG original is preserved in dist/assets/hero; the served JPEG is 157,571 bytes. The final prompt is recorded in that folder's README.md.

Actual Chrome screenshots: 1920px startup state, 1440x900 settled marquee, and 390x844 mobile. Reflective forms remain behind the text; mobile crops to the blue arc, with the name and controls on a dark lower area. Clicking the existing pause control set the background's computed animationPlayState to paused; resuming restored running. Background layers have pointer-events:none, and local console error logs were empty. Viewport override reset after verification. Reduced-motion CSS was reviewed, not rendered with an OS setting. Physical touch, 200% zoom and GPU performance remain untested. This adds slow movement of a generated still image, not a deforming 3D/video material.

Scope: main Hero decorative marquee only. Source: https://codepen.io/GreenSock/pen/MYyBrZw (ContainerAnimation SplitText), viewed in the CodePen preview. Source and local screenshots were compared together in the browser session. This adapts its per-letter vertical displacement, rotation and baseline settling to the existing continuous title; no source text/assets, GSAP dependency or long pinned section was added.

Actual Chrome checks: desktop 1920 and 1440x900, mobile 390x844, tablet 768x900 screenshots; 375x844 name/hero bounds measured. Startup scatter and continuing right-edge letter settling were visible. Name and controls stayed inside the Hero at the measured widths. Click pause froze the track at exactly the same inline transform across separate observations; Enter resumed it with visible keyboard focus. Local console error log was empty. JavaScript syntax check passed.

Reduced-motion CSS and JS remove track and character transforms; reviewed in code, not rendered under an OS reduced-motion setting. Physical touch, 200% zoom, frame-rate performance and a precisely timed full-loop seam measurement were not tested. Existing page-wide horizontal frame/overflow behavior remains outside this change.

### Hero background motion strength revision
2026-10-02: shortened each directional pass from 24s to 10s. Desktop now travels ±3% horizontally / ±2% vertically, rotates ±2.5 degrees and zooms from 1.02 to 1.16. Mobile uses a smaller ±2% / ±1.5%, ±2-degree, 1.02–1.12 range. Background overscan increased to 10% to cover the transformed edges. Existing dark overlay, pause and reduced-motion rules remain.

## 2026-10-02 — Section typing and content entrances

Scope: About, Projects, Q&A and Contact main headings. Existing text, emphasis and line breaks remain; individual inline letters reveal at 32ms intervals while reserving the full layout. Accessible heading labels preserve complete text rather than exposing partial letter readings. The section's content entrance waits for title completion plus a short beat, then uses opacity and upward movement. Each observed element plays once. Q&A reveals content inside cards without changing the deck transforms. Keyboard focus immediately reveals a focused content block and Q&A card content.

Actual Chrome verification: all four desktop section anchors and completed headings; About content opacity reached 1, Q&A first/second card content appeared and later offscreen cards remained pending, and Contact retained its emphasized second line. At 390x844, reload at About captured the partial title “Abo” with hidden body, followed by the complete heading and visible Korean introduction; measured all title letter opacities and introduction opacity at 1. Console errors were empty. Temporary viewport restored. Syntax and scoped diff whitespace checks passed.

Reduced-motion CSS shows all letters and content immediately; JS skips content waiting and clears pending timers when that setting changes. This fallback and keyboard bypass were reviewed in code; OS reduced-motion rendering, screen-reader hardware and physical touch were not tested.

## 2026-10-02 — Work cover stacking

Scope: desktop Work gallery. Inspected CREATZ BUSINESS AREA in the browser, including its sticky card positions. Implemented native CSS sticky cover stacking: each cover has the same viewport-relative height and top 130px; subsequent covers slide upward over prior covers. Existing left summary rail remains top 160px and selects the incoming project at the reading line. Desktop metadata below covers is hidden in stacking mode; image links still lead to the same project routes. At <=1100px, <650px height or reduced motion, the existing list is retained. No wheel interception or library was added.

Actual Chrome checks at 1920x897: LG fixed at top 130px, incoming IVI at 401.8px, and rail maintained at 160px while its text changed from LG to IVI. Captured the overlapping LG/IVI transition, full CAFEKOK cover and final OFFER cover. Tab brought the CAFEKOK and OFFER image links to the front and updated the rail; Shift+Tab was exercised. Keyboard focus handler scrolls to each article's normal flow position so covered links remain usable. At 390x844, confirmed static project position, visible flex metadata/CTA and unchanged mobile layout. Console error log was empty. Syntax and scoped whitespace checks passed. Temporary viewport override reset.

Reduced-motion and low-height fallbacks were reviewed in CSS/JS, not rendered with an OS setting. 1440px rendering, physical touch, 200% zoom and screen-reader hardware were not tested for this revision. Existing placeholder LG/IVI detail routes and OFFER placeholder cover are preserved.

## 2026-10-02 — Contact metal card and Q&A surfaces

Stage 1 was checked before implementing stage 2. Contact now uses one demand-driven requestAnimationFrame loop for bounded translation (12px), tilt (6 degrees) and broad metallic reflection. Coordinates come from the fixed interaction region; exponentially smoothed coordinates drive all three effects. Pointer leave returns to zero. No library or image sequence was added. Contact layout gives the card the larger column; brushed grain, reflection and edge highlights are separate CSS layers.

Actual Chrome checks: 1440x900 pointer response and return to zero; reflection moved with tilt. The email link remained the hit-test target during tilt and decoration layers did not intercept clicks. Mailto click attempts did not provide a verifiable external mail-client launch. Keyboard focus exposed an internal card scrolling issue caused by the oversize reflection layer; overflow:clip corrected it. At 390x844, the complete card, name and email were visibly inside the section, with card scrollTop 0.

Stage 2 adds gray corner glows and low-opacity CSS texture without changing questions, answers or deck motion. Five cards use distinct light positions with equal strength. Actual Chrome screenshots at 1440x900 and 390x844 showed readable questions and answers; each card's scrollHeight matched clientHeight (583px desktop, 448px mobile). Desktop hover changed reflection opacity from .75 to .95; background animation-name was none. Existing Q&A scrolling remained functional. Console error log was empty. Syntax and scoped diff whitespace checks passed.

Limits: physical touch and OS reduced-motion rendering were not tested; static fallbacks were reviewed in CSS/JS. External email app launch remains unverified; the existing placeholder email is preserved. Root scrollWidth exceeded clientWidth by 3px at both tested widths, consistent with the existing page-frame overflow; this scoped change does not certify or alter the entire page's overflow.

## 2026-10-02 — Connected outer-frame section entrances

Scope: About through Contact. The existing body::before owns the base rails; body::after overlays two 1px progress rails with one height, ending at scrollY + 65% viewport height. The existing preceding section/tools ::before dots stay in place and brighten on arrival. Existing ::after boundaries reveal across the same boundary; no duplicate dots or boundary elements were added. Frame visibility is preserved above the existing pinned Q&A stage; its moving cards are clipped at the outer rails to avoid crossing text/images.

Replaced per-letter section typing with heading/content groups using opacity and independent 16px translate, preserving card/deck transforms. Dot arrival starts heading at 140ms and body at 220ms with 80ms group spacing. Read groups remain visible when scrolling back; only line length and dot activation reverse. Anchors, focus, restored positions and large scroll jumps bypass waiting. ResizeObserver, fonts, resize/pageshow and image load update document-space geometry. Work sticky layout, rail crossfades and Contact pointer motion are retained. No new pinning or library was added.

Actual Chrome checks: 1440x900 ordinary scroll before/after About arrival, 140ms/220ms delays, shared progress length, dot deactivation on reverse with title opacity remaining 1; Work cover position sticky at 130px and rail at 160px; Q&A anchor and horizontal deck transform, outer clipping, no hidden groups in the reading viewport; Contact appearance followed by nonzero tilt/reflection response. At 390x844: frame/dot alignment, corresponding heading/body delays, reverse scroll retaining title opacity 1, Q&A anchor/reload with all Q&A content visible, and fast scroll into Contact with all groups visible and complete card inside the rails. Viewport resize recomputed the start from 1020px to 936px. Console error log was empty. Syntax/build/scoped whitespace checks passed and temporary viewports were reset.

The build now bakes the unchanged home template into index.html rather than relying on an empty JS shell. A temporary copy without the module script was rendered at 390px: all four section titles/content and 1px base rails were present. The temporary file was removed. Static Work fallback also exposes inline project summaries instead of its JS-driven rail; this additional fallback was reviewed in code. Reduced-motion reveals every group and removes the progress overlay/movement; OS reduced-motion rendering, physical touch, 200% zoom and screen-reader hardware remain untested. Existing page-wide overflow is outside this motion revision.

Final 1440px Work check: after scrolling forward, the rail switched from LG to IVI while remaining at top 160px; LG and IVI covers were both at sticky top 130px, with the next CAFEKOK cover at 490.5px. Temporary viewport reset again after this check.
# KSW intro — 2026-10-02

- Scope: original `assets/ksw-intro.svg`, first-entry overlay/controller, hero marquee gate. Existing Contact, Q&A, Work and section-flow handlers are unchanged.
- Chrome at 1440×900 and 390×844: reviewed initial shapes and final KSW outlines visually. Recorded the real page's intermediate SVG `d` values, panel matrices, inert state and marquee position through an isolated temporary QA server. Paths continuously change and finish at the authored K/S/W contours. Lower-left panel has negative X / positive Y; upper-right has positive X / negative Y. Closed cover shows no bright seam; overlay is removed after exit.
- Timeline is 2.22s, with local resource preparation included the desktop recording finished around 2.38s and mobile around 2.47s. The intro timeline follows wall-clock time independently of GSAP's global lag smoothing. Marquee stays at its initial position while closed and begins moving at the opening callback without resetting its offset.
- Actual browser checks: scroll restored on desktop/mobile; background inert removed; Tab reached the skip link after dependency failure; refresh skips playback; direct Contact anchor exposes its heading immediately; a fresh LG detail tab returning via the home link skips playback. Normal-page console inspection reported no errors/warnings.
- Failure fixtures: MorphSVG 503 and SVG 503 restore content immediately; delaying MorphSVG by 1.8s releases the cover at the 1.2s preparation deadline (observed around 1.3s including page setup). Removing the application module leaves static headings and content visible with no intro overlay. A backgrounded tab's stalled ticker was also released by the watchdog. All temporary fixtures/server files were removed after verification.
- `prefers-reduced-motion` and storage-restricted branches were reviewed in code; the OS setting and physical touch devices were not tested. Existing few-pixel root horizontal overflow visible in prior QA was not changed by this intro task.

## 2026-10-02 — Tools, About proportions and section-centre ripples

Scope: replaced the existing Tools region with HOW I WORK, an original SVG ribbon sculpture, a decorative logo belt and the three supplied capability statements. The About SVG now has continuous shoulder/torso/hip contours, natural wrist/ankle taper and two poses. Section flow is isolated in `dist/section-flow.js`: one left baseline, four top boundaries, one 7px centre marker per section, a shared 65vh progress cursor and one initial arrival ripple. Content entrance is independent of centre arrival. Existing Work and Contact interaction controllers were not changed.

Actual Chrome checks at 1440x900/1000 and 390x844:

- Visually reviewed desktop/mobile Tools composition, three narrow crossing ribbons, subdued logos, exact capability copy, desktop columns and mobile stack. About's large faint human outline remained behind readable text. Decorative graphics did not cover the outer rail or generate a new visible overflow region.
- Measured rail-to-content gaps of 55.5px desktop and 23.5px mobile (56px/24px CSS spacing). All four markers matched section height / 2; maximum measured rounding error was 0.008px. Selected Work has one marker for its complete 4298.7px section, not one per project.
- Real scroll exposed headings before centre arrival. Recorded one 0.4s boundary sweep and one 0.32s dot contraction on arrival, plus the two ripple starts. Scrolling back and returning produced no additional animation starts. Ripple duration is specified in CSS; animation-end timing was not successfully recorded. A separate paused representative ripple frame verified faint arcs, containment and text readability; it was not a live transient screenshot.
- Tools has no focusable logo controls and exposes one nine-item tool list in the accessibility tree. Pointer hover/click left the logo opacity at .23 and animation running; its transform advanced between observations. Equal repeated group widths (1296px desktop, 864px mobile) were measured. The exact full-loop seam was not recorded over a complete 38s cycle.
- A temporary fixture forced the reduced-motion CSS/JS branches: both animations stopped, nine static logos wrapped below the sculpture, and flow/ripples were disabled. This was not an OS reduced-motion setting. A separate no-module fixture displayed all four headings and 1px base rails. A failed-ribbon request hid the sculpture while retaining all capability text and tool information.
- Work retained sticky covers and the summary rail. Contact rendered its full metal card and existing email link. This revision did not re-exercise the Work description switch, external mail-client launch or Contact pointer tracking; previous QA above records earlier checks, not verification of this revision.

Limits: Chrome disconnected during final checks and the browser inventory became empty. The final short-Contact/page-bottom active-section correction was code-reviewed but not re-rendered after that disconnect. Physical touch, native OS reduced motion, screen-reader hardware and performance profiling were not tested. Existing Hero `overflow-clip-margin:3px` still produces a 3px root horizontal overflow; the Hero is outside this revision. Temporary QA fixtures/server and editing helpers were removed. JavaScript syntax, SVG XML parsing, static home build and diff whitespace checks passed.
## HOW I WORK 뫼비우스 · ABOUT 연결 — 2026-10-06

- 이번 브라우저 확인: Chrome 1440×1000, 390×844에서 WebGL 렌더링과 가로 넘침 없음. 데스크톱·모바일 메뉴 ABOUT의 `/#tools` 이동, 모바일 메뉴 닫힘, ABOUT 선택 상태 확인.
- 모션 버튼 클릭으로 일시정지 상태 변경 확인. 키보드 버튼 입력과 정지 프레임 비교는 브라우저 도구 시간 초과로 완료하지 못했다. 동작 축소·화면 밖/탭 비활성 정지·WebGL 미지원/문맥 복구는 이번에는 코드 검토만 수행했다.
- Node 검사로 뫼비우스 반 꼬임 경계 연결과 정점/인덱스 유효성 확인. JS 구문, 정적 빌드, 변경 코드 공백 검사 통과.
- 실제 모바일 기기, Safari/Firefox 및 스크린리더 검증은 수행하지 않았다.
## 교차형 띠 · 제목 타이핑 · 본문 순차 등장 — 2026-10-06

- Chrome 현재 데스크톱과 390×844에서 교차형 그래픽을 직접 확인했다. 모바일 가로 넘침 없음, WebGL 활성 상태, 다섯 제목의 전체 텍스트와 접근 가능한 이름 유지 확인.
- About·Work·Q&A의 시작 상태(타이핑 문자 0, 본문 opacity 0)와 완료 상태(전체 문자, 본문 opacity 1) 확인. HOW I WORK도 완료 후 그래픽·내용 표시 확인. 기존 Q&A 스크롤 모드 유지.
- 절차 중 브라우저의 비동기 프레임 샘플링 API가 제한돼 매 프레임의 타이핑 간격은 측정하지 않았다. 키보드 포커스 즉시 노출·동작 축소·JavaScript 미사용 상태는 이번에는 코드 검토만 수행했다.
- 곡면의 반 꼬임 경계 연결, 유한한 정점과 유효한 인덱스 검사 통과. JS 구문·정적 빌드·공백 검사 통과. 브라우저 콘솔 오류 없음.

## 2026-10-06 — Surface-flow Mobius and landscape engraved Contact card

Scope: the main editable files in `dist/`, confirmed against AGENTS.md, DESIGN.md, README and build.cjs. `app.js` owns the home markup; `build.cjs` regenerates the static home in `index.html`. Product UI sources were not edited.

- Mobius: one half twist, separated front/back crossing, arc-length UVs, 16-second surface travel using the original blue-chrome.jpg. Overlapping periodic image windows and a width-symmetric material make the reversed Mobius join continuous at every phase. Environment reflection remains independent. Mipmaps reduce fine-detail shimmer. Two skins and cut edges form a thin sheet; orientation only oscillates a few degrees. The SVG fallback contains the same renderer's 960px rest-state capture, regenerated by `render-mobius-poster.cjs`.
- Contact: consolidated component rules; border-box 9:5 ratio, 540 x 300 desktop and 326 x 181.109 mobile. Name, role and selectable mailto link remain; internal slogan and caption removed. Fine directional grain, broad/narrow reflections and shallow cut edges stay behind text. The name has an SVG inner-edge filter; smaller text uses separate restrained engraving styles. One smoothed pointer state controls translation, 4-degree tilt and reflection.
- Actual Chrome/Playwright rendering at 1440 x 1000 and 390 x 844: reviewed rest frames and recorded live surface motion for longer than one complete cycle, including sequential frames. Checked visible folds, material flow and repeat seam, card ratio, text containment, pointer return, synchronized reflection, keyboard activation, emulated touch tap and no mobile document overflow. Runtime errors and failed asset requests were empty in the unrestricted final run. External email client launch was deliberately prevented; the mailto click and target were verified.
- Reduced motion was exercised through browser media emulation. Global pause/resume freezes and resumes the renderer and logo track. Offscreen WebGL draw counts stop; the visibility handler was checked using an explicit hidden-state event and Chromium lifecycle freeze/reactivation. This is not a physical tab-switch test. WebGL-disabled and JavaScript-disabled pages rendered their fallback content. No physical phone, Safari, Firefox or native OS reduced-motion setting was tested.
- Geometry checks: boundary mismatch below 1e-14, no inverted sampled face normals after increasing bend radius, and no intersections in 5,120 sampled triangles. Final equal-length center samples differ by less than 0.05%. With fixed camera, UV phase 0 vs 1 differed by less than 0.00002 intensity levels on average (8-bit channels); either side of the wrap remained continuous.
- Existing desktop document overflow is 3px from the Hero overflow-clip margin. It also reproduces using the original ZIP's HTML/JS/CSS. Both revised sections stay inside the viewport; the Hero was outside this request. Current email remains the existing placeholder hello@example.com.

Evidence: `.qa/materials/` contains rest/motion screenshots, WebM recordings, `report.json` and `final-check.json`; browser checks are `.qa/inspect-materials.cjs` and `.qa/check-final.cjs`. Syntax, static build and scoped whitespace checks passed. Temporary exploration scripts and extracted baseline files were removed after validation.

## 2026-10-06 ? Integrated section order, materials and native transitions

This entry supersedes earlier home-order, title typing, sticky-cover, section-rail and 3px overflow observations. Main source remains dist/. No product pages, project data, professional history or contact values were edited in this revision.

- Order: Hero / About / How I Work / Selected Work / Q&A / Contact. ABOUT targets #about and covers both About and How I Work in the active menu. Live DOM geometry drives anchors, next-section cues and current state.
- Materials: consolidated header and Q&A glass rules (20px static blur with solid translucent fallback), stronger original anatomy outline (14% desktop, 13% mobile; 1.2px non-scaling stroke), subdued Tools blue field, and #F4F5F6 Contact/footer. The existing Mobius surface flow, metal card and actual copy are retained. Unused previous card CSS and old cursor/typing/flow rules were removed.
- Transitions: native Hero light falloff, mild Tools convergence, one real Work title settling over 70vh, normal project covers with sticky summary rail, Q&A horizontal sticky plus 18vh final-card hold, and native light Contact entrance. No wheel interception, whole-page snapping or extra Contact pin. Initial direct anchors wait for image/font loading and yield to manual input.
- Actual Chrome rendering: 1440 x 1000 and 390 x 844. Reviewed section screenshots, glass text, anatomy silhouette, Work intermediate/final frames, silver/engraved card, Contact header color boundary and fallback frames. Native wheel input produced reversible Work motion. At the sticky release, scrolling 4px moved the title 3.95px without a discontinuity. Mid-transition reload and resize returned to the same measured positions. Fresh first-entry intro released its inert state.
- The 16px cue line advances on a 2-second cycle at both viewport sizes. Desktop Q&A reserves a 96px right strip so passing card text cannot overlap the cue. Screens and cue-report.json confirm the separation.
- All desktop next-section cue destinations passed. Direct #about/#tools/#work/#qa/#contact entries passed after load; the direct Work title centers at approximately (720, 500). Mobile menu closes after navigation; its Hero cue does not overlap Pause and hides after Hero. Fast section jumps retain content and no horizontal overflow at either width.
- Desktop cursor: exact 4px dot, following 28px ring, 40px link hover, exclusive project cursor, dark Contact/card cursor and native selectable-name behavior passed. Reduced motion and touch keep the native cursor. Email activation passed with keyboard Enter and emulated touch tap; the external mail client was prevented from opening. The existing hello@example.com value remains.
- Q&A: emulated native touch swipe moved the deck 346px; desktop last card is fully inside the viewport before Contact enters. Header stays dark while Contact remains below it and changes only when the light surface reaches its footprint. Card is 540 x 300 desktop and 326 x 181.109 mobile; all card text remains inside its bounds.
- Reduced-motion browser media emulation at both sizes: final Work layout, static Q&A grid, static tool marks, readable card and no custom cursor. JavaScript-disabled static home and WebGL-disabled ribbon fallback passed. A CSS fixture disabled the two backdrop @supports blocks and rendered the actual fallback declarations (.94 header / .95 card), without blur.
- Global pause/resume and offscreen draw suspension passed. A simulated document.hidden visibility event stopped and resumed WebGL draws. This is a visibility-handler fixture, not a physical tab switch. The existing 16-second surface renderer was not rewritten; its full-cycle and topology verification is recorded in the earlier material entry.

Evidence: .qa/transitions/verification-report.json, extra-report.json and final-*.png. Scripts: .qa/verify-transitions.cjs and .qa/transitions-extra.cjs. Final unrestricted Chrome runs loaded external fonts/tool marks without failed requests or runtime errors. JavaScript syntax, static build and scoped diff whitespace checks passed.

Not verified: physical phones, Safari/Firefox, native OS reduced-motion setting, physical tab-switch behavior and external mail-client launch. Backdrop non-support was exercised through a CSS fixture, not an older browser engine.

## 2026-10-06 ? Visible section handoffs and actual project-page transitions

User clarified that transitions mean both main-section scrolling and project-page navigation. The previous revision included only subtle section effects; cross-document transitions were missing.

- Added a real Hero/About margin: measured 160px at 1440 x 1000 and 88px at 390 x 844. Heading and sculpture progress uses visible content positions, not empty section padding. About settles through 32px / 16px; the Tools sculpture keeps .94-to-1 scaling, adds the same small vertical settling, and reveals a stronger broad blue field. Capability text remains fully readable. Q&A retains a 24px glass entry; Work and the native light Contact ending remain.
- Added shared page-transitions.css / page-transitions.js and the build-owned head injection. Forward navigation reveals the new page from below over 620ms desktop / 440ms mobile; return uses the reverse direction. Native links/history are preserved. The custom cursor is hidden before the outgoing snapshot. No permanent overlay, artificial navigation delay or product-copy edits.
- Actual Chrome at 1440 x 1000 and 390 x 844: reviewed boundary, intermediate section, incoming-page and rest screenshots. Browser animation samples confirm the custom forward/back keyframes for LG, IVI, CAF?KOK and OFFER at both widths. Native back restores the actual departure scroll position within 3px. Fixed a restoration bug where the dynamic Work spacer added 700px through scroll anchoring, and disabled smooth scrolling only during that initial native restoration.
- Browser media reduced motion skips document transitions and leaves section effects at their final positions. Global pause skips outgoing page effects. A fixture without the shared transition CSS still navigates to CAF?KOK and back normally. Section reverse scroll, no horizontal overflow, and runtime-error checks passed.
- Compared all seven generated product HTML files with their editable sources: only the two shared transition includes differ. JavaScript syntax, build and scoped whitespace checks passed.

Evidence: .qa/rhythm/spacing-*.png, about-*.png, tools-*.png, qa-*.png, route-*.png and report.json. Browser runner: .qa/verify-transitions.cjs --rhythm. Actual physical phones and other browser engines are not verified. Unsupported-view-transition fallback was simulated by withholding the stylesheet; native Chrome cross-document animations were exercised directly.

## 2026-10-07 — Anton typography and unified project stage

Latest implementation supersedes previous Work title-only pin / gallery / sticky rail records. Sources: `dist/app.js`, `dist/data.js`, `dist/styles.css`, `dist/section-flow.js`; `dist/index.html` is regenerated by `build.cjs`. The latest CAFÉKOK source is an image cover; only its return-link typography changed in the editable source, then was rebuilt. OFFER product code, Mobius code, cursor logic and image lettering are preserved.

- Local Anton 400 and existing Pretendard Variable loaded in Chrome. Fonts are no longer requested from Google Fonts or jsDelivr. Display headings and card name use Anton; Korean headings use Pretendard fallback at 650; body/control text uses Pretendard. Font files and OFL notices are in `dist/assets/fonts/`.
- Visible section titles and 01–05 section numbers follow the requested order. How I Work occupies the existing top spacing, without pushing the sculpture or capability columns down. Main font/heading rules and project CSS are consolidated; obsolete gallery/rail CSS and rail scroll handlers are removed.
- Final mobile anchor screenshot revealed a partially clipped Tools eyebrow inside the existing overflow boundary. Its mobile offsets were corrected without moving the graphic/capability layout; the final navigation runner and `390-tools-anchor.png` verify the full label and title.
- Actual Chrome rendering: 1440×1000, 390×844 with touch emulation, 1440×600, reduced motion, and JavaScript disabled. Screenshot review covered centered Work entry, all four covers, half transition, release, Hero, Tools, Q&A and bright Contact/card. No horizontal page overflow, clipped card name or title/description collision in tested layouts.
- One native sticky stage uses 35/65 columns, 0.55 viewport title entrance and four 0.8 viewport reading slots. Forward/reverse/large jumps, half-cover threshold, both current links, inactive link inertness, keyboard focus transfer, release geometry and mid-stage reload passed. Whole-window link and description always share the current destination.
- Live resize at 1101×760 / 1440×759 / 390×844 / 1440×1000 correctly switches between sticky and list modes. Runtime reduced-motion changes expose all projects. Five Q&A cards remain visible on keyboard focus; the header changes to its light palette at Contact's actual footprint.
- Marquee copy widths and adjacency match. A real mobile repeat boundary measured 940.75px copy width and 940.0524px modulo jump, leaving 0.6976px of ordinary frame movement; no extra seam gap. A blocked-font fixture retained readable content and no horizontal overflow.
- Main runner: `.qa/check-type-stage.cjs`; edge runner: `.qa/check-stage-edge.cjs`. Evidence: `.qa/type-stage/report.json`, `edge-report.json` and PNGs. Initial simultaneous browser runs hit a screenshot timeout and a loop-observation timeout; the final sequential runs passed. No application exceptions were reported.
- Navigation runner: `.qa/check-stage-navigation.cjs`. All four actual cover links opened their detail/product routes with keyboard Enter, and native Back restored the departure position exactly (0px difference). All five direct section anchors passed at 1440px and 390px with titles below the header. Native wheel ±350px preserved its full delta. Desktop no-JS also exposed all four projects. Evidence: `navigation-report.json` and `*-anchor.png`. Navigation waits use DOMContentLoaded so unavailable external tool icons do not block a completed route change.

Limitations: real phones, other browser engines and screen readers were not tested. Existing external Devicon CDN images failed to load in some restricted-network captures; local fonts and local project images loaded. The reference site's actual motion was not inspected in this revision; the implementation follows the supplied specification. OFFER retains its existing typographic placeholder, LG/IVI retain their current detail placeholders, and the existing placeholder email is unchanged.

## 2026-10-07 — Ribbon geometry and cursor ripples

This revision changes `dist/mobius.js`, the cursor function in `dist/section-flow.js`, the cursor CSS block in `dist/styles.css`, and `dist/assets/tools-mobius.svg`. README and this QA record describe the current implementation. The first task's section coordinator and all non-cursor CSS compare exactly with this revision's starting snapshot. Typography, project stage, Q&A, header, capability text, tool belt and card implementation were preserved. `node build.cjs` completed.

- A constant 0.42-unit-wide spatial loop distributes one half twist around its length. No time-dependent geometry deformation remains. Sampled surface intersection count: 0; reversed geometric seam error: 1.73e-18. Arc-length step variation: 0.0392%. Geometry is sampled by `.qa/check-geometry.cjs` and `.qa/check-intersections.cjs`; these are numerical checks, not a proof for every possible view.
- Chrome rendered continuous animation at 1440×1000 and touch-emulated 390×844. Browser MediaRecorder captured the actual canvas, with timed screenshots through a 24-second desktop observation window and a 6-second mobile window (capture overhead extends the recordings). Desktop measurements span over 39 seconds of animation, including the 22-second material wrap. Live Chrome screenshots were also reviewed at both widths. The silhouette retains its openings and broad silver/dark/blue faces throughout sampled phases.
- At a fixed camera, material phases 0 and 1 produce identical pixels; the near-wrap mean difference is 0.0081/255. Ribbon rotation and material travel have independent controls. The static SVG was regenerated from the final renderer. WebGL unavailable, shader failure, blocked hero image, and real WEBGL_lose_context loss/restoration were exercised. No-JavaScript rendering loads the static image.
- Cursor pointer-input tests verify birth coordinates remain fixed, diameter increases while opacity decreases, five pooled nodes remain constant, at most five waves are active, and all disappear after stopping. Contact uses charcoal/blue; card and project wave opacity is reduced. The pinned Work cover now receives the existing VIEW CASE STUDY cursor state. Cover navigation/back and card link clicks pass; the email default action was prevented by the test so no email application was opened.
- Global pause, runtime reduced motion, touch/coarse-pointer emulation, pointer leave, offscreen ribbon suspension and hidden-document suspension pass. Visibility was simulated through document.hidden and visibilitychange; a physical background-tab timing test was not performed. Repeated renderer initialization returns the same instance and retains one canvas. Cursor overlay setup failure retains the native cursor.
- Concurrent native wheel and pointer movement produced 417 frame intervals: median 16.7ms, p95 16.8ms, one interval over 100ms. The recording run, which captures screenshots and video on software WebGL, has higher tail latency; it is not used as a device performance benchmark. No uncaught application errors or horizontal overflow were observed in the tested layouts.

Runners: `.qa/check-ribbon-ripples.cjs`, `.qa/check-ribbon-edge.cjs`. Evidence: `.qa/ribbon-ripples/report.json`, `edge-report.json`, `ribbon-1440.webm`, `ribbon-390.webm`, timed PNGs, cursor/contact/project captures and fallback captures. An initial cursor-video attempt lacked Playwright FFmpeg; the final runner uses browser MediaRecorder for ribbon videos and pointer/frame assertions for the cursor. An initial no-JS assertion ran before the lazy image loaded; the final check waits for its actual image load and passes.

Remaining verification limits: physical touch devices, other browser engines and prolonged thermal/battery performance were not tested. Existing placeholder email and product/detail placeholders remain unchanged.

## 2026-10-07 — Fixed asymmetric conveyor ribbon

This follow-up supersedes the previous half-twisted ribbon and 22-second rotating material. The supplied image is preserved unmodified under `docs/design/references/screenshots/asymmetric-cobalt-ribbon.png`; provenance and hash are in references.md. Only the ribbon renderer/poster and its CSS/scroll entry transform changed. Cursor code, tool-logo marquee and capability text remain unchanged.

- A small left return and larger right return form a closed folded belt. The foreground descending diagonal and rear ascending diagonal remain separated in depth. The image is a visual reference; the render uses reconstructed geometry and a separate procedural cobalt/silver material, not image deformation.
- The camera and mesh have no time-dependent position, rotation or scale. The earlier sculpture entry translation/scale was also removed. Fixed normal-based studio/environment reflections and a static crossing shadow preserve depth while pigment and fine lengthwise grain move through physical arc-length UVs.
- The new geometry is a closed orientable belt, matching the reference's folded construction; it no longer uses the earlier mathematical half-twist. The material join is periodic with matching width orientation. Both edge rails and the center rail have equal length (maximum measured rail difference 2.5e-16); the sampled chord-step variation is 0.62% at rounded bends. Center-path seam error: 0. Sampled non-neighbor surface intersections: 0.
- Actual Chrome animation ran for more than a full 14-second lap and was recorded with MediaRecorder. The final run recorded 543 draw calls and 76 temporal samples. Every sampled silhouette mask was identical (0 changed alpha pixels). Shader phase speed against the requestAnimationFrame clock was 1/14 cycles per second, within floating-point precision.
- The principal silver landmark was sampled at its predicted world/screen position during actual playback, excluding the occluded rear crossing. All 73 visible samples were silver; the path covered all four arc-length quarters. Phase captures show it moving down the front diagonal, around the large right fold, back along the rear diagonal, then around the left return. This check uses actual rendered RGB values, not only the animation timer or static screenshots.
- Fixed-camera phase 0/1 pixel mean difference: 0.000042/255; near-wrap difference: 0.084/255. Global pause, offscreen suspension and runtime reduced motion pass. Chrome at 1440×1000 and touch-emulated 390×844 renders the shape without horizontal overflow. No-JS loads the regenerated static SVG. Live Chrome was also inspected with the tool belt and capability text present.
- JavaScript syntax, `build.cjs`, scoped diff checks and the intersection sampler pass. No application exceptions were captured. The test's pixel readback and recording overhead are not a device performance benchmark.

Current runner: `.qa/check-conveyor.cjs`. Evidence: `.qa/conveyor/report.json`, `phase-times.json`, `conveyor-1440.webm`, phase PNGs, desktop/mobile/reduced/fallback PNGs. Older ribbon tests assume the superseded half-twist and rotation uniforms and are historical. Physical phones and other browser engines were not tested. The reconstruction follows the reference's proportions and material direction; it is not a pixel-identical reproduction of its baked lighting.

## 2026-10-07 — Curved solid infinity ribbon

The latest request supersedes the angular folded-belt interpretation. Runtime changes are confined to `dist/mobius.js` and regenerated `dist/assets/tools-mobius.svg`. `dist/styles.css`, `dist/section-flow.js` and `dist/app.js` compare byte-for-byte with this revision's starting snapshot, preserving cursor, scroll, tool marquee, text and every other section.

- Replaced straight segments/corner fillets with a smooth analytic spatial infinity centerline. The underlying left/right extent ratio is approximately 1:1.3. Static render review identified pinching at the first inner bends; the path curvature and constant sheet width were adjusted before motion checks. Both loop interiors remain open.
- Constant ribbon width: 0.31 units. True thickness: 0.0093 (3% of width). A closed rounded rectangular section supplies front, back, thin sidewalls and a 0.003 bevel. A shallow static transverse curvature helps reflection continuity without turning the sheet into a tube. Mesh normals derive from the actual solid surface. The closed mesh has 25,025 vertices / 49,152 triangles and no invalid values; position and normal seam errors are exactly zero. Sampled width error is below 3e-16. The surface-intersection sampler reports zero intersections.
- Fixed orthographic camera is slightly elevated and offset sideways, avoiding unequal perspective enlargement. Normal/view-dependent broad studio panels, silver base response, restrained blue environment reflection, bounded highlights and soft local crossing occlusion replace the previous painted gradient/gray outline. No outline color is applied to fake thickness. Lighting remains independent from the advancing material UV field.
- Actual Chrome at 1440×1000 and touch-emulated 390×844: reviewed paused/reduced-motion screenshots and continuous animation, including desktop 14-second wrap. Recorded 862 desktop and 311 mobile draw calls. Temporal pixel samples show zero silhouette-mask changes and measurable material-color travel in both layouts. Fixed-camera phase 0 and 1 produce identical pixels. Geometry, position and camera do not animate.
- Both viewport tests pass global pause, runtime reduced motion, offscreen suspension and simulated hidden-document suspension. Both have zero horizontal overflow. WebGL-unavailable fixture loads the final matching static SVG. No uncaught application errors. The unchanged tool-logo strip and capability text remain; some external Devicon images are unavailable in restricted-network captures.

Runner: `.qa/check-curved-ribbon.cjs`; geometry intersection runner: `.qa/check-intersections.cjs`. Evidence: `.qa/curved-ribbon/report.json`, rest-1440.png, rest-390.png, motion PNGs, motion-1440.webm, motion-390.webm and fallback-390.png. The old tests assume superseded geometry/lighting and should not be used as current acceptance checks. Recordings and pixel readback introduce overhead and are not device performance benchmarks. Physical phones, prolonged battery/thermal behavior and other browser engines remain unverified.
# Cursor and scroll integration — 2026-10-07 (current)

Scope: main portfolio interaction only. Chrome was driven through the connected browser UI at 1440×1000 and 390×844. The 390px run is a viewport test with a mouse, not touch-device emulation. Earlier QA sections remain historical.

Reference observations: Insplanet has a 32px filled-looking disc implemented with backdrop inversion (`invert(1) saturate(2.2) contrast(1.5)`), approximately 80px on links/menu, and a 96px dark project disc with a label. The disc visibly catches up after pointer movement; there are no emitted ripples. Short, successive and reverse wheel inputs were exercised. Sticky sections keep their content in place while progressing, then release into the following section; Projects also consumed wheel input while document Y stayed at 13901. That wheel locking was deliberately not reproduced. Exact reference timing constants were not measured.

Verified in the current live browser:

- One cursor root, no ripple nodes; 32px idle, 64px link, 96px project. Project hover exit hides the label. Fast cross-page pointer moves update the hit point immediately. Dragging/selecting text restores the native cursor; a subsequent pointer move restores the custom state.
- OFFER shows `VIEW PROJECT` and points at `/work/offer/`; the other project states retain their existing case-study wording. All four titles, numbers, descriptions and cover links switch together. Sticky stage top remains 0 through IVI and CAFÉKOK; Work releases into Q&A.
- Short wheel input added 120px (3805→3925); successive +350/−120 input ended at 4155. No section snap was introduced. Q&A measured `--qa-x: -517.0949px` at Y=8553 with section start 7854.921875 and the existing 1.35 travel ratio, matching the displayed scroll position. Q&A releases into Contact without a detached spacer.
- Contact/metal card show a dark disc with a contrasting immediate dot. Email hover uses the link state; element hit testing resolves the existing `mailto:hello@example.com`. Actual email sending or mail-client launch was not performed.
- Header anchors, mobile menu open/close, desktop/mobile Tab navigation, Enter on OFFER, and PageDown work. Mid-Work reload restored Y=6005 and project index 3. OFFER detail navigation rendered successfully. Browser back visibly returned to the same project/Y once, but subsequent back automation lost its browser connection; repeated back/BFCache coverage is incomplete.
- At 390px, Work is a readable vertical list, Q&A is not pinned, its native horizontal scroll reached 333px, and Tab reaches the next card. No document horizontal overflow. Resizing back to 1440px restores the pinned layouts.
- The connected browser reported no captured error/warning logs on the final main-page run. JavaScript syntax checks and `git diff --check` for edited tracked source files passed.

Pure regression check: `node portfolio-shell/.qa/cursor-scroll/check-lifecycle.cjs` passed. It verifies coalesced scroll scheduling, reverse cancellation, keyboard/pointer cancellation, horizontal/touch fallback, reduced-motion instance destruction, repeated pageshow, pagehide and hidden-tab lifecycle with a test double. It does not verify browser rendering under those preferences.

Remaining verification limits: real touch hardware, OS/browser reduced-motion rendering, exact window-edge pointer exit/re-entry, native scrollbar drag (outside the browser tool's controllable content viewport), repeated browser-back restoration, Safari/Firefox and frame-accurate motion timing. These are not claimed as passed. No font, body copy, section order, Mobius source or business-card design was changed.

## 2026-10-07 — Hero-matched blue chrome and larger ribbon

Reviewed the actual `assets/hero/blue-chrome.jpg` and its background CSS. Revised the existing WebGL material with deep black/cobalt faces, fixed broad and narrow reflected studio strips, normal-based Hero environment sampling, stronger crossing occlusion and a slightly crowned cross-section. Longitudinal pigment movement stays separate from the fixed geometry and lighting. Replaced the square framing with a 1.65-aspect canvas and increased sampling resolution. Rebuilt `assets/tools-mobius.svg` from the same stationary renderer at 1980×1200.

Live Chrome at 1440×1000 and 390×844: full silhouette and both openings visible, no document horizontal overflow, heading/copy readable, tool logos visible behind the ribbon. The desktop host increased from 460px to 920px. Geometry projection at those measured DOM widths increased the visible object from 372.45×211.88px to 744.90×423.78px (2.000× in both axes); mobile projection is 251.81×143.25px inside a 311px host. Syntax and projection checks passed. Physical mobile GPU behavior and an actual WebGL-loss event were not exercised in this revision. `.qa/blue-chrome/size-report.json` records these checks before the subsequent title-motion changes.

## 2026-10-07 — Five shared section-title entrances (current)

Runtime changes: `dist/section-flow.js`, `dist/app.js`, `dist/styles.css`. About / Who I Am, How I Work, Projects / Things I’ve Designed, Q&A / How I Think and Contact / Let’s Make It Clear. use the original live h2, with measured text bounds and original responsive wrapping. Normal sections release their short sticky shell after entry. Desktop Work and Q&A prepend entry inside their existing single sticky stages; the duplicate Q&A controller was removed from app.js. Desktop entrance is 0.7 viewport heights; narrow or <760px-high screens use 0.42. No new scroll engine or wheel sensitivity changes.

Actual connected Chrome, mouse input, 1440×1000 and 390×844:

- Inspected all five sections at start, intermediate and complete states in both widths. Each has exactly one h2. Start shows the large centered title with content opacity 0; at completion transform is removed and content opacity is 1. No page horizontal overflow. Work/QA retain their final layout positions and their single existing pin. About, Tools and Contact resume document scrolling.
- Desktop About forward/reverse at Y=1560 produced identical progress .5714, translation and scale. Mobile Tools forward/reverse, stopped and after reload all retained Y=2653, progress .4980, transform `translate3d(-48.4197px, 133.391px, 0px) scale(1.31138)`. At progress .8083 its content opacity was .493346, visibly revealing the ribbon/copy late in the transition.
- Work reached OFFER with number 04, matching description and `/work/offer/` cover link while the stage remained at top 0. Q&A retained its scroll-driven deck and released into Contact; mobile horizontal card navigation moved to card 02 at deck scrollLeft 331px. The complete desktop sequence of all five Q&A cards was not re-audited.
- Mobile menu opened, About anchor closed it and displayed the title. All other target hashes were exercised. Contact has the same white background, settles into the existing card layout, and Tab reaches the email link. Desktop End reached the footer (bottom 999.64 in a 1000px viewport).
- Global motion pause removed all five pins and immediately showed every title/content in its final state; resuming restored the enhancement. OS reduced-motion uses the same static JS branch plus its existing CSS fallbacks, but the OS preference was not changed in this browser session.
- Resized between desktop/mobile and checked the 1440×650 layout: shorter 273px entry and uncut title. Font/image/layout measurements are refreshed; explicit anchor destinations are retained through late loading until deliberate input takes over. Captured browser error/warning log was empty.

Scope regression compared the cursor function byte-for-byte and verified hashes of the Mobius renderer, Hero asset and scroll-motion module. App.js differs from the task baseline only by removal of the superseded Q&A controller. JavaScript syntax checks and tracked-source diff checks passed. Hero typography, content, fonts, Mobius design/motion and business-card design are preserved for this title task.

Limits: physical touch devices, Safari/Firefox, OS reduced-motion rendering, frame-by-frame velocity profiling and repeated back/BFCache cycles were not tested. The reference site was opened and scrolled; the supplied local MP4 was located but not decoded or motion-measured. Timing follows the user's specification, not a claimed measurement of that recording.
