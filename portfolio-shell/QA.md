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
