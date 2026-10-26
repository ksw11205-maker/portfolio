# GSAP 3.13.0 — locally vendored distribution

Unmodified official npm distribution files, downloaded 2026-10-02:

- https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js
- https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MorphSVGPlugin.min.js

Copyright 2025, GreenSock. All rights reserved. Original license notices are
preserved in both files. This package uses the GSAP Standard License, not MIT:
https://gsap.com/standard-license/

Official distribution and installation documentation:
https://github.com/greensock/GSAP/tree/3.13.0
https://gsap.com/docs/v3/Installation/

The official package has no standalone LICENSE file; its headers and the official
license URL above provide the license notice. No CodePen-only trial build is used.

SHA-256:

- `gsap.min.js`: `96c01b81f44a3290e2b4532f55e2c9534b2adc43273a19f3756b2cb41f0fd0b6`
- `MorphSVGPlugin.min.js`: `fe638800184406468075bdb59ef41ea264d5d3568fff5f68f3ce46bb132a02fe`

## LG case-study addition — 2026-10-26

ScrollTrigger.min.js comes from the official gsap@3.13.0 npm distribution; only header/end-of-file whitespace is normalized. It matches the existing GSAP core version and retains its original Standard License header. It is loaded only by the LG detail page for finite, once-on-entry reveals; no new scroll smoother is introduced.

SHA-256: a3c80b65976721ec6ff3cf72cd4a9b30a8ef4c2f24d9fca821b693c674b246ed
