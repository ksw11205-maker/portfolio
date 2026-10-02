# Kim Seongwon · Portfolio shell
Dependency-free HTML, CSS and ES modules. Source and deployable assets are in dist.
Run: node server.cjs
Open http://localhost:4173
Project routes: /work/lg, /work/ivi, /work/cafekok, /work/offer.
CAFÉKOK and OFFER use generated static entries. LG and IVI use the shared entry and SPA fallback.

Edit dist/data.js for project metadata, Korean Q&A drafts and CONTACT_EMAIL (currently hello@example.com).
LG and IVI use the supplied TV and car screen mockup covers, with responsive 1920px and 960px JPEGs. CAFÉKOK uses the supplied café photograph. OFFER remains a typographic placeholder.
No project results, professional history or metrics have been invented.
Fonts use Google Fonts and jsDelivr with local system fallbacks.

Tool marks: Figma, Adobe apps, HTML/CSS/JS use Devicon CDN SVGs; GPT uses the unmodified official white OpenAI Blossom SVG stored locally. Source and usage terms are recorded in ../docs/design/references.md. External Devicon images require internet. Codex uses a local terminal symbol (not an official brand asset).

Project summaries are editable through each project's summary field in dist/data.js. The sticky rail follows scroll position on desktop; smaller screens display the same text beneath project headings. Contact uses a local CSS card with pointer tilt and reduced-motion fallback. Footer contains copyright only.

## CAFÉKOK case study

The existing editable source is ../cafekok/cafekok-detail/cafekok/.
Run `node build.cjs` to copy CAFÉKOK to dist/work/cafekok/ and OFFER from ../OFFER/offer/ to dist/work/offer/ before static deployment.
`node server.cjs` also performs this copy at startup.
Open http://localhost:4173/work/cafekok/ (the route without the trailing slash redirects).
The generated case study is static HTML and remains readable without JavaScript.
Its project thumbnail uses the supplied photograph and logo. OFFER opens its existing product UI at /work/offer/; both project images and buttons navigate to their respective entries.
CAFÉKOK uses a local Pretendard font and includes its license. Its UI panels are labeled concepts with example data.
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
