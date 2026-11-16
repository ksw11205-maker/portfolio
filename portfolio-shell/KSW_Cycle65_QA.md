# KSW Cycle 65 — IVI archive screen-reader duplication correction

## Baseline
- Input: Cycle 64 cumulative integrated ZIP, not the older Cycle 14/21 packages.
- Modified: `dist/work/ivi/index.html` only.
- All 15 source UI image files, src URLs, figure order, captions, category labels, research findings, shell, scripts and styles remain unchanged.

## Actual defect and correction
- Each of the 15 source thumbnails repeated its adjacent visible figcaption verbatim in the image `alt` attribute, causing redundant screen-reader announcements.
- The `img` alt is now empty (`alt=""`) in those 15 `figure` elements. The surrounding `figcaption` continues to provide the source image's accessible description. No research-specific visual meaning was inferred or invented.
- This is an accessibility fix, not a visual redesign or a substitute for original high-resolution captures.

## Reference and upstream status
- No new visual reference was selected. Previous Korean reference list is unchanged; its actual URLs were not independently reverified here.
- GitHub `ksw11205-maker/portfolio` and Netlify live deployment were not modified or fully diffed in this run.

## QA
- Parsed IVI gallery: 15 figures; all 15 captions preserved; 15 duplicate image alt texts removed.
- JavaScript syntax: `node --check dist/work/ivi/editorial.js` PASS.
- Static asset check: `python qa-static.py` reported zero issues for all four projects.
- Attempted 16 viewport browser checks (LG/IVI/CAFEKOK/OFFER × 1440/1280/768/390). Chromium started, but every local HTTP navigation failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR` on 127.0.0.1. Browser QA therefore NOT VERIFIED.
- Before/After comparison images: NOT GENERATED (browser navigation policy blocked). No synthetic images made.
- Live GitHub/Netlify diff, actual screen-reader speech and visual layout remain unverified.

## Next
- Resolve sandbox browser navigation restrictions in a suitable environment, perform four-width screenshot and interaction QA, and obtain high-resolution original IVI captures before enlarging evidence.
