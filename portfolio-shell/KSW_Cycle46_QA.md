# KSW 46 — IVI reduced-motion and research emphasis QA

## Baseline and scope
- Source: KSW_Portfolio_Cycle45_Integrated_LG_Editorial_Rhythm_20261114.zip.
- Modified: `dist/work/ivi/editorial.css` only; added scoped reduced-motion overrides.
- No changes to original UI screenshots, research figures, prototype links, shell, other project pages, GitHub main, or Netlify.

## Verified source defect
The IVI CSS applied `animation: ... !important` to `.layout-item.editorial-viewing .menu-highlight` and `.concept-image.editorial-viewing` focus markers. Those declarations had no equivalent `!important` reduced-motion override in this stylesheet. When the viewer requests reduced motion, these emphasis effects could continue despite the preference.

## Change
- Disable menu-highlight pulsing and concept focus pulsing in `prefers-reduced-motion: reduce`.
- Keep both highlight regions visible at a restrained static opacity (.14), preserving the two original design annotations.
- Disable concept image parallax transform and findings chart transition under reduced motion.
- Avoid altering layout or original research content.

## Reference and visual comparison
- Existing Korean fixed visual references were not re-verified in this cycle; no new visual references were claimed or substituted.
- Before/After screenshot comparison: **비교 이미지 미생성**. Browser screenshots were not obtained during this cycle.

## Validation
- Offline `qa-static.py` completed; verify its results in `qa-static-results.json`.
- Browser sizes 1440/1280/768/390, focus, actual scrolling, live Netlify and source-vs-live diff remain unverified.
- Next: real-browser LG full-scroll and IVI 390px verification; finish project-by-project editorial redesign, not only maintenance.
