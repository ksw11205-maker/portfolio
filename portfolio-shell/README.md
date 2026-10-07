# Kim Seongwon · Portfolio shell
Dependency-free HTML, CSS and ES modules. Source and deployable assets are in dist.
Run: node server.cjs
Open http://localhost:4173
Project routes: /work/lg, /work/ivi, /work/cafekok, /work/offer.
CAFÉKOK and OFFER use generated static entries. LG and IVI use the shared entry and SPA fallback.

To run a standalone copy at home, extract `portfolio.zip`, open the extracted `portfolio-shell` folder in PowerShell, then run `node server.cjs`. Open http://localhost:4173. Node.js is the only requirement; no `npm install` is needed. When the full workspace's sibling `cafekok/` and `OFFER/` sources are present, the server rebuilds those two project pages at startup. A standalone ZIP serves its already-built `dist/` pages directly.

Edit dist/data.js for project metadata, Korean Q&A drafts and CONTACT_EMAIL (currently hello@example.com).
LG and IVI use the supplied TV and car screen mockup covers, with responsive 1920px and 960px JPEGs. CAFÉKOK uses the supplied café photograph. OFFER remains a typographic placeholder.
No project results, professional history or metrics have been invented.
Fonts are local: Anton 400 for display titles and Pretendard Variable for body text and controls. Official files, OFL licenses and provenance are in `dist/assets/fonts/`. No font CDN requests remain in the shell.

Tool marks: Figma, Adobe apps, HTML/CSS/JS use Devicon CDN SVGs; GPT uses the unmodified official white OpenAI Blossom SVG stored locally. Source and usage terms are recorded in ../docs/design/references.md. External Devicon images require internet. Codex uses a local terminal symbol (not an official brand asset).

Project summaries are editable through each project's summary field in dist/data.js. One desktop stage pairs the current description/link with the corresponding cover; smaller screens display all four projects in a vertical list. Contact uses a local CSS card with pointer tilt and reduced-motion fallback. Footer contains copyright only.

## CAFÉKOK case study

The existing editable source is ../cafekok/cafekok-detail/cafekok/.
Run `node build.cjs` to copy CAFÉKOK to dist/work/cafekok/ and OFFER from ../OFFER/offer/ to dist/work/offer/ before static deployment.
`node server.cjs` also performs this copy at startup.
Open http://localhost:4173/work/cafekok/ (the route without the trailing slash redirects).
The generated case study is static HTML and remains readable without JavaScript.
Its project thumbnail uses the supplied photograph and logo. OFFER opens its existing product UI at /work/offer/; both project images and buttons navigate to their respective entries.
The latest CAFÉKOK source is a supplied full-page cover image with a portfolio return link. Text inside that image is preserved. The return link uses its existing local Pretendard font and license.
Edit the existing source, not the generated copy. Rebuild after edits.

Browser QA: `node qa-cafekok.cjs` with the local server running.

## Hero title motion

The title uses individual letter translation and rotation inspired by GreenSock's ContainerAnimation SplitText example. Letters settle onto the baseline as they travel from the right edge. The loop runs at 64px/s on desktop and 42px/s on small screens, with scroll acceleration. The existing pause control freezes the title and tool strip; reduced motion removes both letter and track movement. Animation work is skipped while the hero is outside the viewport or the document is hidden.

## Q&A cards

Questions and answers remain editable in `dist/data.js`. The Q&A section uses portrait cards inspired by DOA's Process interaction: native vertical scrolling moves the horizontal deck while the section stays sticky. At widths of 800px or less, cards use native horizontal scrolling and snap alignment. Reduced motion displays all cards in a static grid. Cards can be reached with Tab / Shift+Tab; desktop focus brings the corresponding card into view.

The pinned mode requires a viewport at least 801px wide and 650px high. Smaller desktop heights use a static grid. Source notes are in `../docs/design/references.md`; current verification and limitations are in `QA.md`.
The script uses the environment-provided Playwright installation (or PLAYWRIGHT_PATH) and installed Chrome.
Evidence is saved to .qa/cafekok/; no dependency installation is required in this environment.

CAFÉKOK logo and icon PNG originals are preserved in its source assets. CSS frames the logo and 16 icons; no regenerated artwork is used. OFFER’s footer links back to /#work.

## Main section flow (2026-10-06)

Home order: Hero -> Who I Am -> How I Work -> Things I’ve Designed -> How I Think -> Let’s Make It Clear. Navigation stays ABOUT / WORK / Q&A / CONTACT. ABOUT links to `/#about` and stays active through How I Work (`/#tools`). Existing project paths and contact data are unchanged.

Edit `dist/app.js`, `dist/styles.css` and `dist/section-flow.js` directly. Run `node build.cjs` to regenerate the readable static home in `dist/index.html`. The scroll coordinator uses native scrolling and live element geometry. Desktop Work uses one sticky stage at widths above 1100px and heights at least 760px: a 0.55 viewport title entrance, followed by four 0.8 viewport project slots. Covers rise within one fixed window; descriptions and the whole-window link switch at 50% coverage. Hidden links are inert. Mobile, low-height, paused, reduced-motion and no-JS states expose the full vertical list. Q&A retains its horizontal sticky deck. Contact and the footer share a light surface.

Header glass, the section cue and the unified cursor are owned by the same section coordinator. Header color follows the surface under the header, not section visibility alone. Direct anchors settle after images/fonts; manual input cancels the initial correction. Reduced motion shows final layouts and the native cursor. The existing Mobius renderer and engraved 9:5 card are preserved.

Current browser checks: `node .qa/verify-transitions.cjs` and `node .qa/verify-transitions.cjs --extra`, with the local server running. Screens and measured results are in `.qa/transitions/`; limitations are recorded in `QA.md`.

Current typography/project-stage checks (2026-10-07): run `node .qa/check-type-stage.cjs`, `node .qa/check-stage-edge.cjs` and `node .qa/check-stage-navigation.cjs` sequentially with the local server running. These supersede the older Work-specific assertions above. Screens and measured results are in `.qa/type-stage/`.

## Ribbon and cursor motion (2026-10-07)

`dist/mobius.js` sweeps a solid ribbon around a smooth asymmetric infinity centerline (approximately 1:1.3). The constant-width sheet has front/back surfaces, 3% physical thickness, sidewalls and small rounded bevels. Normals derive from the actual mesh. A fixed elevated/side camera, broad studio reflections and soft crossing occlusion establish depth independently from the subtle 14-second longitudinal blue/silver field. Each surface rail uses normalized physical arc length. No rigid rotation or displacement is animated. Regenerate the matching static SVG with `node render-mobius-poster.cjs` after renderer changes.

The cursor in `dist/section-flow.js` now uses one 32px background-inverting disc, a 64px link state and a 96px project state. A small hit point moves immediately; only the disc follows with a short, time-based delay. The project label uses the current link's existing wording. Ripple elements and the separate project cursor have been removed. Inputs, text selection, dragging, pause, reduced motion and touch retain native handling. Hidden tabs and pointer leave clear cursor state; the ribbon implementation is unchanged.

## Cursor and wheel response (2026-10-07)

`dist/scroll-motion.js` owns one locally hosted Lenis 1.3.11 instance, with `lerp: .24`, unscaled wheel distance and no touch smoothing. Reverse input discards the pending target; keyboard and pointer-down input cancel wheel inertia before native handling. The instance is destroyed for reduced motion, coarse pointers, pause, hidden documents and page exit, and recreated without duplicates on return. Its single demand-driven scroll clock updates both Work and Q&A from actual browser scroll position. Their existing sticky geometry is preserved without another animation delay. Resize observers and font/image layout hooks recalculate distances.

The older “native scroll” implementation notes above describe the pre-Lenis version. Current browser observations and unverified device cases are recorded in `QA.md`. Run `node portfolio-shell/.qa/cursor-scroll/check-lifecycle.cjs` from the repository root for the pure lifecycle regression check; it is not a substitute for browser QA.

Current ribbon checks: `node .qa/check-curved-ribbon.cjs` and `node .qa/check-intersections.cjs`, with the server running. Rest/motion captures, actual browser recordings and numerical results are in `.qa/curved-ribbon/`. The earlier conveyor and half-twist records are historical. These checks use installed Chrome and MediaRecorder; no FFmpeg installation is required.

## Section spacing and page navigation (2026-10-06 follow-up)

Hero/About now have an extra responsive gap: 112?176px on desktop (160px at a 1000px-tall viewport), 88px at widths up to 600px. About and Tools entry progress follows the visible heading/sculpture, so the effect does not finish in empty padding. Tools has a stronger broad blue field; Q&A keeps its short glass-panel entrance.

Shared document transitions live in dist/page-transitions.css and dist/page-transitions.js. build.cjs includes them in the shell and generated CAF?KOK/OFFER HTML; edit the build hook instead of generated product HTML. Standalone product sources remain unchanged. Native same-origin navigation reveals the new page upward, with the reverse direction on return. There is no click interception or navigation timer. Reduced motion and the global pause control skip the effect; unsupported browsers navigate normally. During history restoration, temporary scroll-anchor and scroll-behavior settings prevent the Work spacer from shifting the saved reading position.

Follow-up browser checks: node .qa/verify-transitions.cjs --rhythm (or add --routes-only for navigation-only checks). Evidence is in .qa/rhythm/.
