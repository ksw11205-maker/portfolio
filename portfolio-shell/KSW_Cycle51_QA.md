# KSW Cycle 51 — LG compact-laptop annotation layout

## Source and scope
Base: Cycle 50 integrated ZIP. Changed only `dist/work/lg/remaster.css`. All source assets, original UI screenshots, research results, shell and other three project pages remain byte-for-byte unchanged.

## Design correction
At 801–1100px the LG AI Design Tool screenshots were scaled down while absolute-positioned annotation pins and labels remained overlaid on controls. This can obscure important source UI and interfere with comprehension. The compact-laptop breakpoint now hides the overlaid pins and presents the existing numbered explanations below the screenshots. 601–800px and <=600px behavior from Cycle 50 is retained; large desktop >1100px keeps the annotated pin design.

## Reference basis
Existing LG fixed Korean designer references recorded in earlier manifest: Suneui Moon (2026), Sujin Kim (2025), Hyeyeong Shin (2025). No new references adopted. Reference URLs and author provenance not independently revalidated this cycle; do not interpret this as a fresh reference audit.

## QA
- `qa-static.py`: all four projects 0 issues.
- Chromium file navigation attempted but blocked by `net::ERR_BLOCKED_BY_ADMINISTRATOR` in this runtime.
- **Before/After comparison images not generated**: no actual browser rendering possible. The change is a source-level fix, not a visually verified result.
- GitHub live HEAD and Netlify deploy were not compared this cycle. Neither was modified.

## Next
Run browser QA at 1440/1280/768/390 and at 1024px to verify the newly corrected breakpoint. Capture matching Before/After images before declaring visual completion. Continue IVI editorial layout work after LG QA.
