# Portfolio reading system — 2026-11-16

Current implementation: `redesign/`. Local preview: `npm run dev:redesign`, http://localhost:4175/.
No production deployment is part of this change.

## Changes
- LG cover restored to the original ZIP cover, before screen replacement. Shell images use 90% of their half-screen area; screenshots retain their native aspect ratio.
- Owner-supplied CAFÉKOK cover used unchanged in shell and detail. Desktop heatmaps replaced with the owner's side/top PNGs; the existing menu-task comparison (−1.73 clicks / −12 percentage points) is highlighted.
- Shared glass shell header on all four case studies. A left vertical table of contents uses 16px text, a project accent and underline; mobile uses a collapsible vertical menu.
- A consistent Pretendard hierarchy, minimum 16 CSS px for case-study text, left alignment and smaller chapter padding. Text inside original product screenshots is unchanged.
- WHO I AM uses a compact desktop board and mobile disclosure groups; all education, work and awards content remains available.
- Image hover tooltips removed except for the shell hero brand explanation. Alt text and accessible button names remain.
- Existing viewport-edge reading fades and actual UI annotations are retained.

## CAFÉKOK source
Latest GitHub main snapshot: 7c86676a11d057020068f226267113561a5f9277.
Source: https://github.com/ksw11205-maker/portfolio/tree/7c86676a11d057020068f226267113561a5f9277/portfolio-shell/dist/work/cafekok/prototype
46 built files copied to `redesign/work/cafekok/prototype/`; old hashed assets are preserved. Only root-relative icon/font/local image paths were adapted to the portfolio subroute. No UI redesign.
Updated screenshot states in `redesign/work/cafekok/assets/current/` were captured from that local prototype after completing six real preference choices. These are sample prototype states, not user-research results.
The live exploration map uses the source's sample area view; the Naver image is a reference image in the detail page, not a verified live location API.

## Design references
[Apple HIG layout](https://developer.apple.com/design/human-interface-guidelines/layout) and [typography](https://developer.apple.com/design/human-interface-guidelines/typography) informed hierarchy, deliberate alignment and readable spacing. The 16px minimum is the owner's requirement, not a universal Apple minimum. No Apple fonts or assets were copied.

## Validation
- Chrome: 1920, 1440, 1280, 1024, 768, 430, 390, 320 CSS px.
- 32 project/viewport combinations: no JavaScript errors, horizontal overflow, case-study text under 16px, overlapping device labels or overlapping annotation labels after screenshots decode. Source image aspect ratios preserved (error < 0.02).
- Header and mobile menu verified; IVI click-patterns section selects its exact table-of-contents link. Image hover title count is zero.
- WHO I AM measured at 857px (1440), 877px (1280) and 882px (390), with mobile details closed; opening disclosures intentionally expands it.
- Original API-backed features and real user outcomes were not revalidated.

Evidence:
- [Geometry/font report](final/report.json)
- [Interaction checks](interaction-checks.json)
- [Desktop review](review-1440.png)
- [Tablet review](review-768.png)
- [Mobile review](review-390.png)
- [Profile desktop](about-1440.png)
- [Profile mobile](about-390.png)

Full-resolution section captures at all eight widths remain in the local `final/` folder. Representative sheets and reports are checked in.
