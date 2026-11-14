# KSW Cycle 53 — IVI evidence archive responsive editorial grid

## Baseline / change
Based on Cycle 52 integrated archive, retaining all existing files and assets. Only `dist/work/ivi/editorial.css` changed. At 701–1199px, the 15 reference captures previously fit into five narrow columns, compromising legibility. The research archive now uses three columns with larger captures, restrained hairline dividers and readable captions. At 601–700px it uses two columns. At <=600px, the existing swipeable gallery and numbered evidence remain intact. At >=1200px the original layout remains.

## Content preservation
No images, data, research findings, CTA links, shell, LG, CAFEKOK or OFFER files changed. This is a layout correction, not a completed full redesign.

## Reference and validation
This applies the previously established IVI dark HMI editorial direction (#0B0D10 / #63D9EA) and user requirement to prioritize large authentic interface captures. No external reference URLs, author credentials, GitHub HEAD or Netlify version were reverified during this run. `qa-static.py` was executed; see `KSW_Cycle53_Static_QA.log`.

## Browser screenshots
**Before/After comparison images not generated.** Chromium headless local-file capture timed out in the execution environment. Thus 1440/1280/768/390px visual checks, JS runtime, focus and scroll interactions remain unverified. Do not interpret static QA as browser QA.

## Next
Prioritize working browser QA for LG and IVI and a full IVI case-study visual redesign. Do not deploy to main or Netlify without approval.
