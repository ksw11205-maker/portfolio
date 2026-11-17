# Architectural cover scene revision — 2026-11-15

The LG and OFFER backgrounds were rebuilt as original SVG studio sets. This revision changes the actual architecture and depth of the scenes. It keeps all embedded project screenshots unchanged. CAFE KOK keeps its existing photograph and uses a smaller upright phone.

## Reference research and use

| Reference | Observed material | Application here | Asset use |
| --- | --- | --- | --- |
| [LS Graphics — The Frames](https://products.ls.graphics/frames/) | Scene creator with interior and decor elements, varied frame materials, high-resolution renders. | Objects sit in an environment with visible wall, floor, material and depth changes. | Conceptual reference only. No source image, PSD, model or download included. |
| [Mockup Maison — LT-H-04](https://mockup.maison/products/macbook-pro-16-lt-h-04) | The [laptop collection page](https://mockup.maison/collections/subscription-library-unlimited-downloads?filter.p.m.custom.filter_category=Laptop) describes a laptop on a wooden desk, a wall, and pronounced light/shadow. | Strong cast light gives OFFER spatial structure. | Collection text/alt description consulted. Direct product fetch was unavailable. No paid asset used. |
| [Mockup Maison — LT-G-02](https://mockup.maison/products/macbook-pro-16-lt-g-02) | Laptop on a metal shelf with window-lit natural shadows. Layered PSD offered under paid license. | A defined supporting surface and shadows make the devices belong to a scene. | Product description consulted. No PSD/image downloaded. |
| [Devices.css](https://github.com/picturepan2/devices.css/tree/11846244977a4905a4fb9ac12bb2121e068d6147) | Device proportions and frame geometry. | Existing MacBook, display, tablet and phone vectors retained. | MIT adaptation. Copyright notice and full license remain in `redesign/assets/covers/Devices-css-LICENSE.txt`. |

[LS Graphics terms](https://www.ls.graphics/terms-of-service) describe purchase-based usage and restrictions on source redistribution. [Mockup Maison LT-G-02](https://mockup.maison/products/macbook-pro-16-lt-g-02) describes a standard license for self-promotion. No paid license is presumed and no paid mockup source is redistributed. These references informed general scene composition; the SVG set geometry, materials, colors and object arrangement were authored for this portfolio.

## Final compositions

- **LG:** Fluted charcoal wall at left, thin magenta architectural light, large violet arched recess behind TV, raised graphite TV plinth, separate foreground laptop slab. Screen pixels and device layout are unchanged.
- **OFFER:** Warm-gray wall return, diagonal window shadows, recessed archive niche, limestone display table with visible edge, paper volumes and a terracotta object on a wall shelf. Central desktop and overlapping tablet/mobile retain the same actual Explore page at their respective breakpoints.
- **CAFE KOK:** Existing cafe photograph retained. Phone scale changed from 1.85 to 1.45 (about 22% narrower), rotation from -6 degrees to 0. Translation is `(1540,390)` on the 2400x1350 canvas. The header, hero and all four purpose choices remain visible. The source's incomplete lower card area is below the canvas; no source pixels were repainted.
- **IVI:** Unchanged.

## Verification

Run from repository root:

```powershell
node scripts/create-cover-assets.cjs
node docs/design/references/mockup-scene-20261115/check-covers.cjs
```

The second command verifies output hashes, source hashes, native source dimensions, self-contained images, absence of baked vector text, and a 2400x1350 canvas. JPEG/PNG embeds are byte-identical to the original. The two WebP sources are converted losslessly to PNG and checked for decoded pixel equality. All seven original inputs passed.

Static 1200x675 proofs were rendered and visually inspected:

- [LG](proofs/lg.png): architectural layers readable, TV and laptop grounded, screenshot content intact.
- [OFFER](proofs/offer.png): three responsive formats visible, table and wall depth readable, archive objects supported by a shelf.
- [CAFE KOK](proofs/cafekok.png): zero rotation, visibly reduced phone width, all four purpose options complete, lower loading placeholder outside the cover.

The SVG backgrounds and frames scale cleanly. Embedded screenshots retain their actual source resolution; no artificial claim of improved source detail is made. Proofs are static artwork renders, not browser screenshots or a live site check.
