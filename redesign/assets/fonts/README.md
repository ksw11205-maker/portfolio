# Local portfolio fonts

- Anton Regular (400): unmodified official [Google Fonts distribution](https://github.com/google/fonts/tree/main/ofl/anton), fetched 2026-10-07. [Upstream project](https://github.com/googlefonts/AntonFont). Copyright 2020 The Anton Project Authors. Distributed with `Anton-OFL.txt` (SIL OFL 1.1).
- `Anton-Regular.ttf` SHA-256: `a4ba3a92350ebb031da0cb47630ac49eb265082ca1bc0450442f4a83ab947cab`.
- Pretendard Variable: reused byte-for-byte from `OFFER/offer/assets/fonts/PretendardVariable.woff2`, with its original `LICENSE.txt` copied as `Pretendard-OFL.txt`. [Upstream project](https://github.com/orioncactus/pretendard).
- `PretendardVariable.woff2` SHA-256: `9599f12fd42fc0bce1cd50b47a0c022e108d7aa64dd0d1bb0ed44f3282d900b4`.

Only the portfolio typography uses these shared files. Product UI fonts and text baked into artwork are preserved. CSS and HTML preload URLs refer to local files; system sans-serif remains the failure fallback.
