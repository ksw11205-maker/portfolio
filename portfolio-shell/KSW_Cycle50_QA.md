# KSW Cycle 50 — LG tablet annotation layout

Source: Cycle 49 integrated ZIP (preserved in full). Only `dist/work/lg/remaster.css` changed.

## Verified source issue
LG's Tool screenshot markers (`.ui-pin`) were hidden only at <=600px. At 601–800px the screenshots narrow while 11px annotation labels remain overlaid; the four numbered `.mobile-callout` descriptions were hidden. The source HTML already provides the four descriptions, so no research text or screenshot pixels needed changing.

## Implementation
At 601–800px, hide overlay pins and show existing numbered notes below their corresponding actual UI screenshots. Existing <=600px rules and >=801px layout are unchanged. No new dependencies, invented UI or study results.

## Reference usage
LG fixed Korean references previously recorded: Suneui Moon 2026, Sujin Kim 2025, Hyeyeong Shin 2025. URLs/author verification were not repeated this cycle; no new reference was added. Editorial pattern: let actual UI occupy the frame and move explanatory annotations outside at reduced viewport widths.

## Validation
- CSS brace count and ZIP integrity: locally checked.
- Chromium headless file screenshot attempt at 390px timed out after 12 seconds, so visual QA at 1440/1280/768/390 remains unverified.
- Before/After comparison images: **not generated** (browser screenshot unavailable).
- GitHub main and Netlify: untouched; live diff not checked.
- Next: run full browser QA of LG and IVI, then continue full visual redesign rather than only incremental fixes.
