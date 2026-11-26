# Lenis 1.3.11

Upstream: https://github.com/darkroomengineering/lenis
Distribution: https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.mjs
License: MIT, preserved in LICENSE.

The unmodified ESM distribution is named `lenis.js` so the existing static server
serves it with a JavaScript MIME type. Only this locally hosted dependency is used
for wheel smoothing. `scroll-motion.js` owns initialization, the animation clock,
input cancellation and native/reduced-motion fallback. No runtime CDN request.
