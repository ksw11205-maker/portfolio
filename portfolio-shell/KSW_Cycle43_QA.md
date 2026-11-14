# KSW Cycle 43 — expanded static route and CSS integrity audit
Date: 2026-11-13

## Baseline and changes
Input is the Cycle 42 cumulative ZIP, not the older Cycle 21 checkpoint. The 42 baseline site under `dist/` is byte-for-byte preserved. Only `qa-static.py`, its generated `qa-static-results.json`, and this report changed/added. No visual CSS/HTML/JS changes were made: no verified visual defect was available to safely fix. GitHub main and Netlify were not modified. Comparison to current live repository/deployment is **not verified**.

## Fixed visual references
Previously recorded LG Korean-designer references: Suneui Moon 2026 Portfolio, Sujin Kim 2025 UIUX Portfolio, Hyeyeong Shin 2025 UIUX Portfolio. Their URLs/creator attribution were not reverified in this run; no new references were promoted. The IVI/CAFEKOK/OFFER reference manifests still require independent confirmation. No third-party implementation code was copied.

## Improvement in this run
Offline QA now resolves local `<a href>` routes, in-page fragment targets, responsive `srcset` images, CSS `url(...)` assets, and recursively linked CSS `@import` files. This closes a substantial blind spot in the previous audit, which checked only direct HTML image/script/link assets. It retains cover/floating CTA parity, single H1, image alt, and external new-tab security checks.

## Results
- LG: 17 images; 2 linked CSS files inspected; 0 issues.
- IVI: 31 images; 15 linked CSS files inspected; 0 issues.
- CAFEKOK: 14 images; 13 linked CSS files inspected; 0 issues.
- OFFER case study: 15 images; 11 linked CSS files inspected; 0 issues.
- `python qa-static.py` writes machine-readable `qa-static-results.json`.
- This is static integrity only; it does **not** prove images render, design quality, accessible contrast, JS behavior, or actual page routing under a configured server.

## Before/After and limitations
**Before/After images not generated**: this run made no visual changes and no trusted browser captures were available. Earlier Chromium attempts were blocked by environment restrictions. No screenshot was fabricated. 1440/1280/768/390 live rendering remains unverified.

## Next priority
Run HTTP browser QA on LG first in a browser-enabled environment. Verify actual prototype link and original UI screenshots, typography and full-page scroll at 1440 and 390, then 1280/768. Only after a confirmed issue should visual code be edited. Proceed IVI → CAFEKOK → OFFER; preserve the shell and research facts.
