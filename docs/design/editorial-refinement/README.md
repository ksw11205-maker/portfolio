# Editorial refinement — 2026-11-16

Design source: [Emil Kowalski skills](https://github.com/emilkowalski/skills), pinned at 64eb3deb9a5fbfa041faf783e0bc3fd635872e9c. Apple Design and Design Engineering skills are installed locally in .agents/skills with the original MIT license. The global skill directory was read-only; the repository-local installation is available to subsequent sessions.

| Before | After | Why |
| --- | --- | --- |
| Evidence hidden behind disclosure controls | Evidence and archives always open | Read the complete argument without extra actions |
| IVI results selected with task buttons | Three original result charts in sequence | Compare real task outcomes directly |
| Mixed type scales and heavy section dividers | Shared type, spacing, surface, and alignment rules | Make structure clear through proximity and hierarchy |
| Margins around shell covers | Artwork fills the left viewport half | Restore a clear image/text split |
| Detached or padded detail art | Left copy and full-height right art in one cover | Keep the introduction visually integrated |

Implementation: DESIGN.md, case-editorial.css, four case HTML files, shell app/index/profile markup, and portfolio-reading.js. Retired five overlapping presentation stylesheets from case pages. Original UI assets, factual paragraphs and tables, navigation destinations, and prototype URLs are preserved. No production deployment.

QA: real local Chrome with Playwright at 1920, 1440, 1280, 1024, 768, 430, 390, and 320px (1000px viewport height). Screenshots are captured with fonts/images decoded and reduced motion. All 32 final checks have no JavaScript errors, horizontal overflow, content disclosures, menu/motion/task toggles, text under 16px, or desktop hero fill gaps. Geometry checks show no label/device collisions or invalid normalized anchors. Existing anchor content and UI were preserved; this change does not establish new research conclusions.

Evidence: final-report.json, geometry-report.json, content-check.json, links-report.json, shell-report.json, covers-responsive.jpg, and per-project review sheets. Local section captures use {project}-{width}-section-{index}.jpg. The initial complete capture pass succeeded; an overwrite pass encountered a file-write error for OFFER 1440 section 9. Existing original-pass capture remains available and the final 32-page validation completed successfully. Additional corrected IVI archive and mobile cover captures were inspected. The new 16px archive caption rule changes typography only.

Inspection found and corrected hidden archive content inherited from details CSS, small legacy labels, and mobile cover ordering/spacing. Cover images intentionally use object-fit:cover to fill the requested area; peripheral artwork may crop. IVI reference archive images retain their original limited resolution. Figma's IVI URL returned HTTP 200; remote interaction was not exhaustively exercised. Other prototype URLs also returned HTTP 200.

Run npm run dev:redesign, then npm run check:redesign. For browser evidence run node scripts/qa-editorial-refinement.cjs; QA_NO_CAPTURE=1 performs final layout checks without overwriting screenshots.
