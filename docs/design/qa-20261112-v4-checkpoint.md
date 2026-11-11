# KSW Portfolio V4 — Scheduled Visual QA
2026-11-12 / Initial checkpoint

## Scope
- Previous high-impact shell remains the baseline; do NOT replace with simplified V3 shell.
- Four unique visual languages: LG (magenta research tool), IVI (cyan HMI), CAFEKOK (cream/coral app), OFFER (warm gray/orange archive).
- UX case studies read in order: problem → evidence → design decision → actual screens and component rationale → reflection.
- Remove confusing '원본 보기' links; keep only floating optional demo/website CTA.
- Never claim personal ownership of team-developed research model, fabricated stats, or unverified outcomes.

## Source warning
This branch begins from GitHub main. The **full V4 compiled snapshot** was produced separately in the conversation as `KSW_V4_Original_Shell_Project_Identity_20261112.zip`, and V4.1 improvement as `KSW_V4_1_LG_First_Pass_20261112.zip`.
The canonical GitHub deploy directory is `portfolio-shell/dist`, **not repository root**.
These snapshots are NOT yet merged into GitHub; do not assume main branch matches the V4 snapshot and do not blindly overwrite main.

## Phase 1 (LG) — Done locally; integration pending
### Grounded UI audit
The fifth screen image `05-settings.webp` shows API 설정, API KEY, 요청 제한, model/evaluation criteria and storage/security menu. Previous narrative incorrectly described brightness and sound. Revised text to reflect the actual screen.
### Implemented
- Corrected Settings screen function and all three component descriptions.
- Added optional 'UI 크게 보기' controls to five actual LG UI images, with original-resolution viewing in native HTML dialog.
- Added each screen's concise role caption.
- Keyboard Escape and close button, focus return, mobile horizontal inspection.
- Kept all five original screenshot assets and prototype routes intact.
- Unique LG-specific CSS and JS, without forcing a React UI library into the static V4 site.
### Tested
1440 / 1024 / 768 / 390px: 5 buttons exist, open dialog, image natural resolution = 1600x1000 for first input, Escape closes, focus returns, document horizontal overflow absent, no JS errors. Browser-rendered gallery originally showed footnote as an unwanted side column; changed to vertically stacked layout and rechecked.
### Edited files in conversation bundle
`work/lg/index.html`; `lg-qa-polish.css`; `lg-qa-polish.js`. Handoff: `V4_1_LG_DESIGN_QA.md`.

## Next priority
1. IVI: audit real HMI images and four layout descriptions, mobile view readability, user action and evaluation evidence.
2. CAFEKOK: purpose vs preference, radar, recommendation, details, save; persona vs validated evidence distinguish.
3. OFFER: responsive desktop/tablet/mobile, promotion cards, filters, brand/category, bookmark, CTA and screen rationale.

## QA sources
- https://www.nngroup.com/articles/ux-design-portfolios/ — case study should show problem, role, decisions, constraints, process and verified outcome.
- https://github.com/ibelick/motion-primitives — MIT, motion patterns.
- https://github.com/motiondivision/motion — MIT, production-ready motion.
- https://github.com/shadcn-ui/ui — MIT, accessible UI patterns.
- https://github.com/darkroomengineering/lenis — MIT, motion / smooth scroll; do not add without performance and scroll testing.
