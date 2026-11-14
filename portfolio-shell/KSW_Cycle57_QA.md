# KSW Cycle 57 — IVI evidence archive keyboard guidance and source-resolution audit
Date: 2026-11-14

## Baseline
Cycle56 integrated archive. Preserved all existing project pages, shell, scripts, research data and original image bytes.

## Modified
- `dist/work/ivi/index.html`: mobile archive instruction now explains swipe **and** keyboard arrow navigation.
- `dist/work/ivi/editorial.js`: accessibility label aligned to actual responsive behavior; reduced-motion scroll uses standardized `auto` rather than nonstandard `instant`.

## Important audit finding
All 15 IVI reference JPG files were inspected at the pixel-dimension level. The images are mostly low-resolution, ranging from 142–546 pixels wide. Several are only 235×173 or smaller. This means enlarged desktop screenshots can look blurred even if CSS layout is correct. Do **not** synthesize replacement UI pixels or upscale while claiming originals. Obtain higher-resolution captures from the original prototypes/research assets before further enlargement.

## Validation
- JavaScript syntax: `node --check` passed.
- Archive ZIP CRC: checked during packaging.
- Real Chromium screenshots: **not generated**. Local Chromium headless screenshot attempt timed out; no fabricated Before/After images.
- GitHub main / Netlify: not modified. Live deployment diff and reference URL revalidation not completed in this run.
- No new reference design added; previous fixed-reference selection remains provisional where source verification is missing.

## Next priority
Resolve local browser screenshot environment; then audit LG at 1440/1280/768/390 and IVI source capture quality before further visual redesign. Finish whole-page redesign instead of endlessly adding archive micro-patches.
