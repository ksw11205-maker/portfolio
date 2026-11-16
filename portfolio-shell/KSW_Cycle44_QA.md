# KSW Cycle 44 — CAFEKOK skip-link correction
Date: 2026-11-14

## Actual change
`dist/work/cafekok/index.html`: changed the keyboard-accessible `본문 바로가기` skip-link destination from `#background` to `#overview`. The former jumped past the first content chapter (01 / OVERVIEW), which contained the service introduction. The new destination is the first main content chapter, retaining the rest of the content and all source screenshots untouched.

## Reference / rationale
No new design references selected this cycle. Existing project visual language and fixed-reference policy retained. This is an accessibility/information-order correction, not a new visual redesign.

## Verification
Ran bundled `qa-static.py` after the edit: LG 17, IVI 31, CAFEKOK 14, OFFER 15 image elements checked, zero reported static issues. Verified `id="overview"` exists and the skip link targets it. Only one HTML file changed versus Cycle 43 (excluding generated report/QA results). Existing images, research claims, shell, prototype URLs and deployment untouched.

## Limitations
No live browser QA, no verified GitHub/Netlify diff, and no visual Before/After screenshot generated. The skip-link's focus/scroll behavior still requires keyboard testing in a browser. Previous external fixed-reference verification remains unconfirmed in this run.

## Next priority
LG end-to-end real-browser audit, then IVI → CAFEKOK → OFFER; do not modify main or Netlify without approval.
