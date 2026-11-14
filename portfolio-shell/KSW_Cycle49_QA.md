# KSW Cycle 49 — IVI mobile evidence numbering

## Baseline
Cycle 48 cumulative archive, unchanged except `dist/work/ivi/editorial.css` and this report. GitHub main and Netlify were not written to. The original shell, all 15 archive screenshots, prototype links, research text, and other project pages remain intact.

## Applied improvement
At <=600px, the horizontally scrolling IVI research archive now displays `01 / 15` through `15 / 15` above each existing figure using CSS counters. This clarifies the sequence and scale of the research evidence without altering the original screenshot pixels or introducing fabricated research findings. Captions have improved wrapping and spacing. This is an additive mobile editorial treatment, not a claim of completing the IVI full redesign.

## Reference provenance
Existing fixed Korean portfolio references from the previous manifest are retained; no new unverified references were added. URL availability and current authorship were not reverified in this run.

## QA
`python qa-static.py`: LG, IVI, CAFEKOK, OFFER all reported zero static issues. ZIP integrity checked at packaging. Attempted Chromium `file://` capture at 390px, but browser did not produce a screenshot before timeout; screenshot not generated. 1440/1280/768/390 live visual QA, scroll behavior, image load timing, and keyboard behavior remain unverified. Before/After comparison images not generated; no synthetic comparisons substituted.

## Next
Validate actual IVI mobile archive and LG full scroll in a working browser, then fix the highest-impact confirmed visual issue. Compare repository main and Netlify against the cumulative build before any future integration. Do not overwrite deployment without approval.
