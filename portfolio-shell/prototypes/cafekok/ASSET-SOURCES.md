# Asset sources

Checked 2026-10-28.

## Photography

The five free Unsplash photographs and their original pages, authors, and CDN URLs are recorded in `src/data/moodPhotos.ts`. The cover and preference moodboard load these photographs from the Unsplash CDN, with existing local cafe photographs as fallbacks. These images illustrate a mood and do not represent the fictional cafes in the prototype.

- License: https://unsplash.com/license
- Julee Juu: https://unsplash.com/photos/EFHS9YEiXFI
- Nguyen Phuc Hau: https://unsplash.com/photos/FxcSWWu98Ys
- Henry Williams: https://unsplash.com/photos/kV6finvoSd0
- Mathias Reding: https://unsplash.com/photos/RJCODpGceTQ
- Sixteen Miles Out: https://unsplash.com/photos/dPkn4562j3E

## Icons

Lucide Static 0.468.0 icons downloaded from the official package on jsDelivr. Unmodified SVG files are bundled under `public/icons/`. The full license is included at `public/licenses/lucide-LICENSE.txt` and shipped with the site. Icons use a CSS mask to inherit the interface color.

- Website: https://lucide.dev/
- Source: https://github.com/lucide-icons/lucide
- Package: https://www.npmjs.com/package/lucide-static
- License: ISC, with Feather portions noted in the bundled license.

User-facing credits are available in Settings → 사진과 아이콘 출처.

## Coffee bean correction

The introduction ornament uses Phosphor Icons' coffee-bean (regular), from @phosphor-icons/core 2.1.1, under the MIT license. The unmodified SVG is bundled at public/icons/coffee-bean.svg and the full license at public/licenses/phosphor-LICENSE.txt. Source: https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/regular/coffee-bean.svg . Website: https://phosphoricons.com .

## Unique cafe photography

Each of the 30 fictional cafes has its own photo source. The original twelve local JPGs have distinct SHA-256 hashes. The eighteen added cafes use distinct Unsplash photo IDs recorded in src/data/cafePhotoSources.json; all source pages state the free Unsplash License. The additional photos load from the Unsplash CDN. Failed cafe photos display an error placeholder, never a shared substitute photo. Credits are available in Settings.

## Preference keyword photography — 2026-11-02

`src/data/tastePhotos.ts` maps atmosphere, space, seating and menu choices to a small photographic sequence. The eight additional photographs below are all marked **Free to use under the Unsplash License** on their source pages. Subjects, authors and their `images.unsplash.com` file links were checked through the web source pages; a rendered pixel preview was unavailable. Images use 1200px CDN derivatives and the existing local photo library as a network fallback. Existing coffee and tea images are reused from `moodPhotos.ts` with their recorded credits.

- Quiet nature: Micah Hallahan — https://unsplash.com/photos/Kb-Cpr5dZXo
- Social table: Andrii Solok — https://unsplash.com/photos/YfidYnwtXok
- Solo reading: Elin Melaas — https://unsplash.com/photos/5qpIrP9eoBs
- Two cups and a book: Kat von Wood — https://unsplash.com/photos/wGCiYkChdpg
- Balanced interior: GoodLifeConstruction — https://unsplash.com/photos/e0oJLc5FYsg
- Open ocean: Sebastian Schuster — https://unsplash.com/photos/MoOnz1svMk8
- Pastry: Lucas Mellec — https://unsplash.com/photos/0UXMMXXupL0
- Brunch: Luke Tokaryk — https://unsplash.com/photos/VANvc2u1eic

The image sequence deduplicates matching sources. Budget and travel distance are not mapped to visual claims about an actual café's price or location. License: https://unsplash.com/license .
