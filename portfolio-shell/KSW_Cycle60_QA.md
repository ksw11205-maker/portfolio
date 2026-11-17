# KSW Cycle 60 — IVI evidence grouping (2026-11-14)

## Source and preservation
- Input: Cycle59 full integrated ZIP, not Cycle21/14. Input archive preserved separately at `/mnt/data/KSW_Portfolio_Cycle59_Integrated_IVI_Native_Image_20261114.zip`.
- Changed: `dist/work/ivi/index.html`, `dist/work/ivi/editorial.css` only.
- Four semantic category labels inserted before existing first evidence image in each documented type: A unified (6), B double tab (4), C top (1), D side (4). Existing 15 figures, original image files, captions, order, and research metrics unchanged.
- Shell, LG, CAFEKOK, OFFER and prototype links not edited. No GitHub main or Netlify deployment.

## Design rationale
- Group labels establish the connection between the four compared prototypes and the fifteen underlying research references without repeating the same decorative card template.
- Existing fixed Korean references (Suneui Moon / Sujin Kim / Hyeyeong Shin for LG) retained. Exact URLs and the IVI fixed reference set were not independently verified in this run; do not claim new reference approval.

## QA
- Parsed HTML: 15 archive figures, 15 images, exactly 4 new category labels; category counts 6/4/1/4.
- ZIP integrity: passed.
- Chromium headless local-file screenshot attempt: timed out (18 seconds), no screenshot output.
- **Before/After comparison images not generated**: rendering unavailable; do not infer visual pass at 1440/1280/768/390.
- GitHub live code / Netlify deployment difference not verified this run.

## Next
- Restore browser QA and verify actual rendered layout at four widths; check group labels do not compete with index counters.
- Continue IVI information architecture and high-resolution source acquisition, then CAFEKOK and OFFER.
