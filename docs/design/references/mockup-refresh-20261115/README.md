# Project cover refresh · 2026-11-15

The three covers embed the portfolio's actual UI images. They do not use a stock screenshot or generated interface. IVI keeps the existing concept artwork, as requested.

## Adopted device source

[Devices.css by Yan Zhu](https://github.com/picturepan2/devices.css/tree/11846244977a4905a4fb9ac12bb2121e068d6147) is MIT licensed. Original SCSS and its complete license are retained under `devices.css/`; the license is also distributed beside the resulting covers as `redesign/assets/covers/Devices-css-LICENSE.txt`.

The generator translates the following source geometry into SVG primitives, rather than only copying their visual appearance:

- **LG:** `_macbook-pro.scss` — 740×434 outer box, 618×418 display frame, 600×375 viewport, 120×10 opening lip, 64×12 camera header and feet. The TV uses a separately authored bezel and stand. Dark graphite studio, magenta floor reflection and violet edge light.
- **CAFÉKOK:** `_iphone-14-pro.scss` — 428px device width, 68px frame radius, 390px content width, 49px content radius, 120×35 camera island, side controls and 85px antenna offsets. The device is extended to leave a camera-safe band above the unchanged UI. Gold metal gradients and a modest rotation complement the original cafe photograph.
- **OFFER:** `_pro-display-xdr.scss` — 640×368 screen frame, 624×352 viewport and 152px stand; `_ipad-pro.scss` — 560×778 frame, 27px bezel, sensors and buttons; the same iPhone frame. Actual Explore screenshots retain their original 4/2/1-column layout. The desktop is centered and the smaller devices overlap its sides.

Studio gradients, metallic highlight layers, reflections and contact shadows are original additions. SVG resolution is 2400×1350; each embedded screenshot retains its original pixels. The viewport may crop the source vertically, never stretch it. Tablet content is fitted at its original 3:4 capture ratio, leaving a white continuation below it inside the taller source device geometry.

## Other sites checked

[Mockuuups Studio license](https://mockuuups.studio/license/) and [pricing](https://mockuuups.studio/pricing/) were checked. The free personal license includes visible attribution and watermark conditions; the commercial license is paid. No Mockuuups asset was used or purchased. A GitHub source with explicit redistribution terms was adopted for this implementation.

## Reproduction and verification

Run `node scripts/create-cover-assets.cjs`, then `node docs/design/references/mockup-refresh-20261115/check-covers.cjs`. The latter writes static PNG proofs here and verifies source hashes, intrinsic dimensions, and original embedded bytes. WebP sources are decoded to PNG without altering pixels for portable SVG rendering. The source/reference/provenance details are in `redesign/assets/covers/manifest.json`.

All three 1200×675 proofs were visually inspected. This is asset inspection, independent of the parent's webpage verification.
