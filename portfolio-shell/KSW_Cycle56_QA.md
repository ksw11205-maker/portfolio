# KSW Cycle 56 — IVI mobile archive keyboard navigation

Baseline: Cycle 55 cumulative ZIP. Modified only `dist/work/ivi/editorial.js`; retained all source screenshots, research text, shell, project links and other files.

## Change
The 15-image mobile research archive was focusable but relied on browser-native scrolling without predictable item-by-item keyboard controls. Added ArrowLeft/ArrowRight handling scoped to the gallery when its content overflows. Keys advance to adjacent figure positions, with motion preference respected. No new image, text, invented result, or external library.

## Reference
Existing fixed Korean editorial references inherited from prior manifest; no new reference verified this run. Pattern: evidence-first, numbered original research screenshots. Source URL and authorship not revalidated.

## QA
- `node --check dist/work/ivi/editorial.js`: pass.
- ZIP integrity: pass.
- Chromium headless screenshot attempt on local file timed out, no screenshot generated. **비교 이미지 미생성**. 1440/1280/768/390 browser QA remains unverified.
- GitHub main / Netlify untouched. Live/source comparison not performed.
- Keyboard interaction not verified in a live browser; JS syntax only.

## Next
Restore reliable browser rendering, inspect LG and IVI at 1440/1280/768/390 and capture matched Before/After; then address full-page editorial hierarchy rather than small incremental cosmetic patches.
