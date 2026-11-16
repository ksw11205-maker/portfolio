# KSW Cycle 42 — offline QA baseline (2026-11-13)

## Source and preservation
- Input: Cycle 41 cumulative ZIP. All original site files preserved byte-for-byte; only `qa-static.py`, `qa-static-results.json` and this report added.
- GitHub main / Netlify: no writes or deployment. Live vs ZIP diff not verified in this run.
- Visual reference: existing LG fixed references (Suneui Moon, Sujin Kim, Hyeyeong Shin) retained without claiming renewed URL verification; IVI/CAFEKOK/OFFER fixed reference verification not performed.

## Verified findings
- Offline parser scanned four *case study* HTML entries (not OFFER's storefront home).
- LG 17 images; IVI 31; CAFEKOK 14; OFFER 15.
- Local `img`, `script`, and `link` references: 0 missing on these four HTML pages.
- Cover CTA count: 1 each; floating CTA count: 1 each; paired hrefs match.
- One h1 per page; no missing img alt; no target=_blank link missing noopener.
- New repeatable script: `python qa-static.py`. Requires BeautifulSoup4; writes `qa-static-results.json`.

## Browser QA / before-after
- Cycle 41's browser runner was retried using installed `/usr/bin/chromium` against local HTTP; all 16 routes failed with `ERR_BLOCKED_BY_ADMINISTRATOR`.
- **Before/After images not generated**. 1440/1280/768/390 visual layout, scroll states, focus behavior, runtime image loading, contrast and performance remain unverified.
- No design source edits were made without trustworthy visual evidence; this run improves audit reproducibility only.

## Next priority
- Run HTTP browser QA in an environment permitting localhost. Capture 1440 and 390 before/after, inspect LG full page first; then IVI, CAFEKOK, OFFER. Fix a *visually confirmed* defect, rather than speculative CSS changes.
