import { moodPhotos } from "./moodPhotos"

export type TastePhoto = {
  src: string
  alt: string
  source: string
  author: string
  fallback: string
}

// Source pages and their free Unsplash License were checked on 2026-11-02.
// Photo subjects are confirmed from the source descriptions; images load from
// Unsplash at 1200px for a crisp mobile crop. The local assets are offline fallbacks.
const photo = (
  image: string,
  id: string,
  author: string,
  alt: string,
  fallback: string,
): TastePhoto => ({
  src: `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1200&q=85`,
  source: `https://unsplash.com/photos/${id}`,
  author,
  alt,
  fallback,
})

const forest = photo(
  "photo-1438179152657-8ce7dfda4f0b",
  "Kb-Cpr5dZXo",
  "Micah Hallahan",
  "조용하고 차분한 취향을 떠올리게 하는, 나무 사이로 햇살이 드는 숲",
  "/work/cafekok/prototype/images/g-1.jpg",
)
const together = photo(
  "photo-1771837602933-c1cc6293702b",
  "YfidYnwtXok",
  "Andrii Solok",
  "활기찬 분위기와 여럿이 함께하는 시간을 담은, 음식과 촛불이 놓인 식탁",
  "/work/cafekok/prototype/images/j-3.jpg",
)
const reading = photo(
  "photo-1706195546790-688005392bf9",
  "5qpIrP9eoBs",
  "Elin Melaas",
  "혼자 머무는 시간을 위한, 펼친 책 앞에서 커피를 든 손",
  "/work/cafekok/prototype/images/s-1.jpg",
)
const twoCups = photo(
  "photo-1680444257344-e9eb152fb116",
  "wGCiYkChdpg",
  "Kat von Wood",
  "둘이 함께하는 아늑한 시간을 떠올리게 하는, 담요 위 책과 커피 두 잔",
  "/work/cafekok/prototype/images/j-2.jpg",
)
const interior = photo(
  "photo-1771888703723-01d85da1dae1",
  "e0oJLc5FYsg",
  "GoodLifeConstruction",
  "균형 있는 공간을 떠올리게 하는, 부드러운 중성색 가구와 나무 바닥의 거실",
  "/work/cafekok/prototype/images/s-3.jpg",
)
const ocean = photo(
  "photo-1755547721876-86687254f129",
  "MoOnz1svMk8",
  "Sebastian Schuster",
  "넓고 개방적인 취향을 담은, 수평선까지 펼쳐진 잔잔한 바다",
  "/work/cafekok/prototype/images/g-2.jpg",
)
const pastry = photo(
  "photo-1544027026-31fbbad5ecee",
  "0UXMMXXupL0",
  "Lucas Mellec",
  "디저트를 좋아하는 취향을 위한, 겹겹이 구워진 크루아상",
  "/work/cafekok/prototype/images/s-2.jpg",
)
const brunch = photo(
  "photo-1710533788728-800be38530a8",
  "VANvc2u1eic",
  "Luke Tokaryk",
  "브런치를 좋아하는 취향을 위한, 흰 접시에 담긴 달걀과 토스트",
  "/work/cafekok/prototype/images/s-4.jpg",
)
const coffee: TastePhoto = { ...moodPhotos.coffee }
const tea: TastePhoto = { ...moodPhotos.tea }

export const tastePhotos: TastePhoto[] = [
  forest,
  together,
  reading,
  twoCups,
  interior,
  ocean,
  pastry,
  brunch,
  coffee,
  tea,
]

const byAtmosphere: Record<string, TastePhoto> = {
  "조용하고 차분한": forest,
  "적당히 활기찬": interior,
  "활기찬 공간": together,
}
const bySpace: Record<string, TastePhoto> = {
  "아늑하고 작은": twoCups,
  "균형 있는": interior,
  "넓고 개방적인": ocean,
}
const bySeat: Record<string, TastePhoto> = {
  "혼자 앉는 자리": reading,
  "둘이 앉는 자리": twoCups,
  "여럿이 앉는 자리": together,
}
const byMenu: Record<string, TastePhoto> = {
  커피: coffee,
  디저트: pastry,
  차·논커피: tea,
  브런치: brunch,
}

export function getTastePhotos(
  prefs: Record<string, string | undefined>,
): TastePhoto[] {
  // Budget and travel distance are filters, not visual styles: do not imply that
  // a premium-looking interior represents an exact drink price or actual distance.
  const selected = [
    byAtmosphere[prefs.atmosphere || ""] || forest,
    bySpace[prefs.space || ""] || interior,
    bySeat[prefs.seat || ""] || reading,
    byMenu[prefs.menu || ""] || coffee,
  ]
  return selected.filter(
    (item, index) =>
      selected.findIndex((other) => other.src === item.src) === index,
  )
}
