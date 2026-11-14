# KSW Cycle 64 — IVI research archive visual baseline

## Baseline / preservation
- Input: Cycle 63 cumulative integrated ZIP (not Cycle 21 or 14).
- Changed: `dist/work/ivi/editorial.css` only.
- Added a consistent desktop image viewing stage at >=1200px, capped to 228px high; original image width remains capped by `--ivi-native-width`, avoiding pixel enlargement.
- Added a thin caption separator to clarify which caption belongs to each source UI, and explicit reduced-motion scroll fallback.
- No source image, research number, content, URL, shell or JS changed.

## Reference basis
- Existing Korean visual reference set is preserved, not reselected. Original verified reference URLs could not be established from the available files in this run; therefore none is newly claimed as verified.
- No third-party source code copied; this is original CSS.

## QA
- CSS structural checks and archive checks: see output below.
- Browser capture: attempted Chromium `--headless --no-sandbox --disable-gpu` with local file URL at 390px, timed out after 18s; no screenshot produced.
- Before/After images: NOT GENERATED. No synthetic comparison was created.
- 1440/1280/768/390 visual QA, keyboard behavior, contrast, live Netlify/GitHub diff: NOT VERIFIED.
- Main branch and Netlify were not modified.

## Next priority
- Restore reliable browser capture and run four-viewpoint visual QA for LG and IVI before further visual adjustments. Recover high-resolution original IVI evidence screenshots if available; never regenerate source UI.

- CSS brace count: 216 open / 216 close — PASS.
