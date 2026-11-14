# KSW Cycle 61 — IVI keyboard scope and motion behavior (2026-11-14)

## Source and preservation
- Input: Cycle60 full integrated ZIP, preserved separately.
- Modified: `dist/work/ivi/editorial.js` and `dist/work/ivi/index.html` only.
- Original 15 reference images, four research type labels, experiment findings, prototype URLs, shell and other projects unchanged.
- No changes to GitHub main or Netlify.

## Actual improvement
- The archive's Arrow/Home/End handler now operates only at mobile widths (<=600px) where the gallery is intentionally horizontally scrollable. On desktop/tablet, the archive is a multi-column grid and should not intercept arrow keys even if an overflow calculation is nonzero.
- Keyboard handler requires focus on the gallery itself; prevents capturing keyboard input from nested controls if introduced later.
- Reduced-motion uses standardized `scrollTo({behavior:'auto'})` rather than `instant`.
- Accessible gallery label now accurately specifies that swipe/arrow navigation is for mobile.

## References
- Existing fixed Korean reference list retained without substitutions. Reference URLs/creators were not independently reverified in this run; no new fixed references claimed.
- No third-party source code added.

## QA
- `node --check` editorial.js: PASS.
- HTML parsed: 15 source figures, 15 images, 4 category labels: PASS.
- ZIP integrity: PASS (checked after packaging).
- Chromium 144 headless file URL at 390px: timed out after 14 seconds; screenshots not produced. Browser visual/interaction tests at 1440/1280/768/390 remain unverified.
- **Before/After comparison images not generated**: headless Chromium timed out; no synthetic comparisons.
- Live GitHub/Netlify diff and Korean reference URL verification not completed in this run.

## Next
- Prioritize stable real-browser QA of LG and IVI, especially mobile disclosure/keyboard navigation, then IVI overall design and original high-resolution screenshots; follow with CAFEKOK and OFFER.
