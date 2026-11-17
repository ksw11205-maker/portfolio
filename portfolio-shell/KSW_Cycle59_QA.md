# KSW 59 — IVI original-image pixel integrity

Date: 2026-11-14

## Baseline
Cycle58 integrated ZIP; no changes to main or Netlify. Existing fixed Korean design references retained, but their URLs and authorship were not reverified in this cycle.

## Actual changes
- `dist/work/ivi/index.html`: added CSS custom property `--ivi-native-width` from the existing original image `width` attribute to each of 15 archive captures. Captions, study figures, file paths, and pixels unchanged.
- `dist/work/ivi/editorial.css`: capped archive image display width to original pixel width to prevent browser enlargement on the three-column desktop grid. Native aspect ratio preserved.

## QA
- 15/15 image width caps added.
- Browser screenshot attempt: Chromium headless timed out when opening local file; **Before/After comparison images not generated**. No visual QA claims.
- 1440/1280/768/390, links, keyboard and scroll require live browser testing.
- GitHub and Netlify source differences not rechecked this cycle.

## Next
Restore reliable browser QA, verify archive at all four widths, then audit LG and IVI end-to-end before CAFEKOK.
