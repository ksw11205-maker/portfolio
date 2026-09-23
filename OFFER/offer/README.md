# OFFER

Design work: read the root [AGENTS.md](../../AGENTS.md), shared [DESIGN.md](../../DESIGN.md), [OFFER project notes](../../docs/projects/offer.md), and [reference sources and scope](../../docs/design/references.md). OFFER-specific design notes have been consolidated into docs/projects/offer.md.

Static Korean promotion discovery portfolio. No framework, build dependency, backend or database.

## Current release — V2 visual refinement
- All six screens share the finished typography, spacing and interaction system.
- Home uses one lead OFFER and two supporting OFFERs, followed by a four-column new-offer grid, a deadline-led section, categories and a personal brand feed.
- Mobile Home moves the actual section nodes into Hero → Popular → Ending Soon → Categories → New → Followed Brands order, so keyboard and visual order agree.
- OFFER Detail preserves the original information hierarchy with a stronger discount, asymmetric hero and a vertical mobile timeline.
- Explore, Brand, Favorite Brands and Saved OFFERs now have completed page compositions, collection counts and refined empty states.
- 12 brands and 18 fictional September 2026 promotions.

## Open
Open index.html directly, or serve this directory with a static HTTP server. Both modes work. An HTTP server loads data/*.json; file:// uses the generated snapshot in js/data.js. Some browsers restrict LocalStorage on file://; HTTP is recommended for persistence testing.

Run `node serve.cjs` in this directory, then open http://127.0.0.1:5501/ to view the local site.

## Architecture
- css/variables.css: palette, spacing, page geometry and motion tokens.
- css/common.css: global layout and Home composition.
- css/components.css: reusable UI and detail information hierarchy.
- css/responsive.css: desktop, laptop, tablet and mobile rules, reduced motion.
- css/design-refresh.css: final visual layer shared by all six screens; marketplace search, image-led cards, editorial detail and mobile refinements.
- js/common.js: shared rendering, search/filter controls, dates, storage, header/footer.
- js/data.js: JSON loader and generated direct-file fallback.
- js/{page}.js: page-specific orchestration.
- data/: canonical brand and promotion records.
- assets/: downloaded imagery; attribution in ASSET-CREDITS.md.

## Data and demo behavior
Promotions are explicitly fictional. Dates remain fixed instead of silently extending; D-Day derives from the visitor's current date in Asia/Seoul. After September 2026 promotions become ended and active collections show their designed empty states. The source URLs deliberately lead to official brand homepages, clearly disclosed in the interface, rather than invented promotion URLs.

Only IDs are stored in LocalStorage keys savedOffers and favoriteBrands. Search, category and sorting state use URL query parameters. Invalid IDs and empty results are handled.

When editing JSON, regenerate the window.OFFER_DATA snapshot in js/data.js using the same records. The rest of that file remains the loader. No manually duplicated card HTML.

## Design principles
White, near-black, quiet rules, self-hosted Pretendard Variable typography and restrained orange benefit/status accents. 1440px maximum container, 64px desktop / 40px laptop / 20px mobile gutters. Controls use 44px minimum touch areas. A lead/supporting editorial Home composition and four-column secondary collections adapt to deliberate 1–2-column mobile layouts. All Home content remains visible at every breakpoint. Reduced-motion and keyboard focus states are provided.

## Deployment
A dist/ copy is generated from these source files for static hosting. The source directory remains the requested offer/ architecture. Never hand-edit dist/.

## V2 implementation notes
- Existing IDs, all 18 promotion records, JSON loading, direct-file fallback, LocalStorage keys and query parameter conventions are unchanged.
- Shared `card(p, variant)` accepts featured, supporting and deadline modifiers; there is still one promotion card renderer.
- CSS declarations are organized and formatted within the original five stylesheet files. Responsive composition remains in responsive.css.
- Fonts are bundled under assets/fonts with the original SIL Open Font License. No new frontend framework or animation library is used.
- QA-REPORT.json records the browser regression pass. Native WebMCP verification is unavailable in the local test browser; its existing optional integration remains feature-detected.
