import { useEffect, useMemo, useRef, useState } from "react"
import TasteScene, { tasteLabel } from "./TasteScene"

type Purpose = "study" | "date" | "friends" | "drive"
type Cafe = {
  id: string
  name: string
  neighborhood: string
  image: string
  atmosphere: string
  space: string
  seatTypes: string[]
  menuTypes: string[]
  representativeDrinkPrice: number
  sampleDistance: number
  suitablePurposes: Purpose[]
  amenities: string[]
  sampleHours: string
  samplePosition: string
  unknownInfo: string
}
type Prefs = Record<string, string | undefined>

const QUESTIONS = [
  [
    "atmosphere",
    "어떤 분위기가 좋아요?",
    ["조용하고 차분한", "적당히 활기찬", "활기찬 공간"],
  ],
  [
    "space",
    "어떤 공간이 편해요?",
    ["아늑하고 작은", "균형 있는", "넓고 개방적인"],
  ],
  [
    "seat",
    "어떤 자리가 좋아요?",
    ["혼자 앉는 자리", "둘이 앉는 자리", "여럿이 앉는 자리"],
  ],
  [
    "menu",
    "어떤 메뉴를 찾나요?",
    ["커피", "디저트", "차·논커피", "브런치"],
  ],
  [
    "price",
    "한 잔 예산은 얼마인가요?",
    ["5,000원 이하", "6,500원 이하", "8,000원 이하", "상관없음"],
  ],
  [
    "distance",
    "어디까지 둘러볼까요?",
    ["1km 이내", "3km 이내", "5km 이내", "거리 상관없음"],
  ],
] as const
const PURPOSES: {
  id: Purpose
  title: string
  desc: string
}[] = [
  { id: "study", title: "공부·작업", desc: "혼자 집중할 공간" },
  { id: "date", title: "데이트", desc: "천천히 이야기할 분위기" },
  { id: "friends", title: "친구와 만남", desc: "함께 머물기 좋은 자리" },
  { id: "drive", title: "드라이브", desc: "가볍게 쉬어가기 좋은 곳" },
]
const cafes: Cafe[] = [
  {
    id: "j-1",
    name: "소일 아틀리에",
    neighborhood: "부산 전포",
    image: "/work/cafekok/prototype/images/j-1.jpg",
    atmosphere: "조용하고 차분한",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "창가"],
    menuTypes: ["커피", "디저트"],
    representativeDrinkPrice: 5200,
    sampleDistance: 0.7,
    suitablePurposes: ["study", "date"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "11:00 – 21:00",
    samplePosition: "전포 샘플 기준점에서 남쪽 0.7km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 확인이 필요해요.",
  },
  {
    id: "j-2",
    name: "윈도우 캐비닛",
    neighborhood: "부산 전포",
    image: "/work/cafekok/prototype/images/j-2.jpg",
    atmosphere: "적당히 활기찬",
    space: "균형 있는",
    seatTypes: ["둘이 앉는 자리", "바 테이블"],
    menuTypes: ["커피", "브런치"],
    representativeDrinkPrice: 6800,
    sampleDistance: 1.8,
    suitablePurposes: ["date", "friends"],
    amenities: ["Wi‑Fi"],
    sampleHours: "10:00 – 22:00",
    samplePosition: "전포 샘플 기준점에서 동쪽 1.8km",
    unknownInfo: "주차 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "j-3",
    name: "테라코타 홀",
    neighborhood: "부산 전포",
    image: "/work/cafekok/prototype/images/j-3.jpg",
    atmosphere: "활기찬 공간",
    space: "넓고 개방적인",
    seatTypes: ["여럿이 앉는 자리", "테이블"],
    menuTypes: ["커피", "디저트"],
    representativeDrinkPrice: 6100,
    sampleDistance: 2.9,
    suitablePurposes: ["friends"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "12:00 – 22:00",
    samplePosition: "전포 샘플 기준점에서 서쪽 2.9km",
    unknownInfo: "단체 좌석은 확인이 필요해요.",
  },
  {
    id: "j-4",
    name: "오프닝 스탠드",
    neighborhood: "부산 전포",
    image: "/work/cafekok/prototype/images/j-4.jpg",
    atmosphere: "조용하고 차분한",
    space: "균형 있는",
    seatTypes: ["혼자 앉는 자리", "바 테이블"],
    menuTypes: ["차·논커피", "디저트"],
    representativeDrinkPrice: 4800,
    sampleDistance: 4.4,
    suitablePurposes: ["study", "drive"],
    amenities: ["콘센트"],
    sampleHours: "09:00 – 19:00",
    samplePosition: "전포 샘플 기준점에서 북쪽 4.4km",
    unknownInfo: "반려동물 동반 여부는 확인이 필요해요.",
  },
  {
    id: "g-1",
    name: "파도 서재",
    neighborhood: "부산 광안리",
    image: "/work/cafekok/prototype/images/g-1.jpg",
    atmosphere: "조용하고 차분한",
    space: "균형 있는",
    seatTypes: ["혼자 앉는 자리", "창가"],
    menuTypes: ["커피", "차·논커피"],
    representativeDrinkPrice: 5900,
    sampleDistance: 1.1,
    suitablePurposes: ["study", "drive"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "10:30 – 20:30",
    samplePosition: "광안리 샘플 기준점에서 해변 쪽 1.1km",
    unknownInfo: "창가 좌석 가능 여부는 확인이 필요해요.",
  },
  {
    id: "g-2",
    name: "마루 앤 웨이브",
    neighborhood: "부산 광안리",
    image: "/work/cafekok/prototype/images/g-2.jpg",
    atmosphere: "적당히 활기찬",
    space: "넓고 개방적인",
    seatTypes: ["둘이 앉는 자리", "테라스"],
    menuTypes: ["커피", "브런치"],
    representativeDrinkPrice: 7500,
    sampleDistance: 2.2,
    suitablePurposes: ["date", "drive"],
    amenities: ["주차"],
    sampleHours: "09:30 – 21:30",
    samplePosition: "광안리 샘플 기준점에서 동쪽 2.2km",
    unknownInfo: "테라스 운영은 날씨에 따라 달라져요.",
  },
  {
    id: "g-3",
    name: "나이트 글래스",
    neighborhood: "부산 광안리",
    image: "/work/cafekok/prototype/images/g-3.jpg",
    atmosphere: "활기찬 공간",
    space: "넓고 개방적인",
    seatTypes: ["여럿이 앉는 자리", "소파"],
    menuTypes: ["디저트", "차·논커피"],
    representativeDrinkPrice: 7900,
    sampleDistance: 3.6,
    suitablePurposes: ["friends", "date"],
    amenities: ["Wi‑Fi"],
    sampleHours: "12:00 – 23:00",
    samplePosition: "광안리 샘플 기준점에서 서쪽 3.6km",
    unknownInfo: "저녁 시간 혼잡도는 확인이 필요해요.",
  },
  {
    id: "g-4",
    name: "사구 로스터스",
    neighborhood: "부산 광안리",
    image: "/work/cafekok/prototype/images/g-4.jpg",
    atmosphere: "적당히 활기찬",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "바 테이블"],
    menuTypes: ["커피"],
    representativeDrinkPrice: 5000,
    sampleDistance: 4.8,
    suitablePurposes: ["study", "drive"],
    amenities: ["콘센트"],
    sampleHours: "08:00 – 18:00",
    samplePosition: "광안리 샘플 기준점에서 북쪽 4.8km",
    unknownInfo: "주차는 확인이 필요해요.",
  },
  {
    id: "s-1",
    name: "느린 계단",
    neighborhood: "부산 서면",
    image: "/work/cafekok/prototype/images/s-1.jpg",
    atmosphere: "조용하고 차분한",
    space: "아늑하고 작은",
    seatTypes: ["둘이 앉는 자리", "창가"],
    menuTypes: ["디저트", "차·논커피"],
    representativeDrinkPrice: 6300,
    sampleDistance: 0.5,
    suitablePurposes: ["date"],
    amenities: ["Wi‑Fi"],
    sampleHours: "11:00 – 20:00",
    samplePosition: "서면 샘플 기준점에서 북쪽 0.5km",
    unknownInfo: "디저트 품절 시간은 확인이 필요해요.",
  },
  {
    id: "s-2",
    name: "플랫폼 17",
    neighborhood: "부산 서면",
    image: "/work/cafekok/prototype/images/s-2.jpg",
    atmosphere: "적당히 활기찬",
    space: "균형 있는",
    seatTypes: ["여럿이 앉는 자리", "테이블"],
    menuTypes: ["커피", "브런치"],
    representativeDrinkPrice: 7200,
    sampleDistance: 1.5,
    suitablePurposes: ["friends", "study"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "09:00 – 22:00",
    samplePosition: "서면 샘플 기준점에서 동쪽 1.5km",
    unknownInfo: "스터디 좌석은 확인이 필요해요.",
  },
  {
    id: "s-3",
    name: "포켓 테라스",
    neighborhood: "부산 서면",
    image: "/work/cafekok/prototype/images/s-3.jpg",
    atmosphere: "활기찬 공간",
    space: "넓고 개방적인",
    seatTypes: ["여럿이 앉는 자리", "테라스"],
    menuTypes: ["커피", "디저트"],
    representativeDrinkPrice: 5600,
    sampleDistance: 2.7,
    suitablePurposes: ["friends", "drive"],
    amenities: ["주차"],
    sampleHours: "10:00 – 22:00",
    samplePosition: "서면 샘플 기준점에서 서쪽 2.7km",
    unknownInfo: "주차 가능 대수는 확인이 필요해요.",
  },
  {
    id: "s-4",
    name: "클레이 라운지",
    neighborhood: "부산 서면",
    image: "/work/cafekok/prototype/images/s-4.jpg",
    atmosphere: "적당히 활기찬",
    space: "넓고 개방적인",
    seatTypes: ["둘이 앉는 자리", "소파"],
    menuTypes: ["차·논커피", "브런치"],
    representativeDrinkPrice: 8100,
    sampleDistance: 4.1,
    suitablePurposes: ["date", "friends"],
    amenities: ["Wi‑Fi"],
    sampleHours: "12:00 – 23:00",
    samplePosition: "서면 샘플 기준점에서 남쪽 4.1km",
    unknownInfo: "예약 가능 여부는 확인이 필요해요.",
  },
]
const priceLimit = (x?: string) =>
  x === "5,000원 이하"
    ? 5000
    : x === "6,500원 이하"
      ? 6500
      : x === "8,000원 이하"
        ? 8000
        : Infinity
const distLimit = (x?: string) =>
  x === "1km 이내" ? 1 : x === "3km 이내" ? 3 : x === "5km 이내" ? 5 : Infinity
type Screen = "onboard" | "quiz" | "profile" | "home" | "explore" | "saved" | "detail" | "settings"
const DIMENSIONS = ["분위기", "공간", "좌석", "메뉴", "가격", "이동반경"]
const primary =
  "min-h-[52px] rounded-[12px] bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-[#462919] active:translate-y-px"
const secondary =
  "min-h-[52px] rounded-[12px] border border-border bg-card px-5 py-3 text-[15px] font-semibold text-primary transition-colors hover:bg-secondary"
const heading = "app-title"
const label = "text-[12px] font-bold tracking-[0.06em] text-primary"
const sectionHeading = "app-section-title"

function Logo({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center font-brand leading-none text-primary ${className}`}
    >
      CAFÉ
      <span className="ml-1 rounded-[4px] bg-primary px-[0.28em] py-[0.12em] text-primary-foreground">
        KOK
      </span>
    </span>
  )
}

function MiniMap() {
  return (
    <div className="relative isolate h-36 overflow-hidden rounded-[8px] bg-[#e6e1d6]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 350 144"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M270 0h80v144H310L290 70Z" fill="#d1d8d0" />
        <path
          d="M-20 40 350 100M80-20 145 160M-20 130 380 30"
          stroke="#f8f5ef"
          strokeWidth="18"
        />
        <path d="M0 20h250M0 80h290M60 0v144M210 0v144" stroke="#d4ccbe" strokeWidth="2" />
      </svg>
      <span className="absolute left-[46%] top-[34%] flex size-9 items-center justify-center rounded-full border-[3px] border-background bg-primary text-primary-foreground">
        <Icon name="coffee" className="size-4" />
      </span>
      <span className="absolute bottom-2 right-3 text-[12px] text-muted-foreground">
        샘플 지도 · 위치 비례 아님
      </span>
    </div>
  )
}

function Icon({
  name,
  className = "size-5",
}: {
  name: string
  className?: string
}) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3Z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    saved: <path d="M6 3h12v18l-6-4-6 4Z" />,
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    back: <path d="m14 5-7 7 7 7" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    down: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    map: (
      <>
        <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    filter: (
      <>
        <path d="M3 6h18M3 12h18M3 18h18" />
        <path d="M8 3v6m8 0v6m-7 0v6" />
      </>
    ),
    study: (
      <>
        <path d="M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3Z" />
        <path d="M12 6v15" />
      </>
    ),
    date: (
      <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-6 6 8 15 8 15S26 11 20 5Z" />
    ),
    friends: (
      <>
        <circle cx="8" cy="8" r="3" />
        <path d="M2 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 4 5v1" />
      </>
    ),
    drive: (
      <>
        <path d="m4 10 2-6h12l2 6v9H4Zm0 0h16M6 19v2m12-2v2M7 14h2m6 0h2" />
      </>
    ),
    coffee: (
      <>
        <path d="M4 8h12v7a6 6 0 0 1-12 0Zm12 1h2a3 3 0 0 1 0 6h-2M3 22h15M7 2v3m5-3v3" />
      </>
    ),
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name === "explore" ? "search" : name] || paths.coffee}
    </svg>
  )
}

function Photo({
  cafe,
  className = "",
  imgClass = "",
  eager = false,
}: {
  cafe: Cafe
  className?: string
  imgClass?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-accent ${className}`}>
      {failed ? (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Icon name="coffee" className="size-8" />
          <span className="text-xs">사진을 불러오지 못했어요</span>
        </div>
      ) : (
        <>
          <img
            className={`h-full w-full object-cover [filter:saturate(.9)] ${imgClass}`}
            src={cafe.image}
            alt={`${cafe.name} 분위기 참고 사진 · 실제 카페 사진이 아닙니다`}
            loading={eager ? "eager" : "lazy"}
            onError={() => setFailed(true)}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-transparent"
          />
        </>
      )}
    </div>
  )
}

function Modal({
  children,
  onClose,
  title,
  sheet = false,
}: {
  children: React.ReactNode
  onClose: () => void
  title: string
  sheet?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    ref.current?.focus()
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current()
      if (event.key === "Tab") {
        const items = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input, select, [tabindex="0"]',
        )
        if (!items?.length) {
          event.preventDefault()
          return
        }
        const first = items[0],
          last = items[items.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handle)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener("keydown", handle)
      previous?.focus()
    }
  }, [])
  return (
    <div
      className={`fixed inset-0 z-40 flex justify-center bg-[#30281f]/40 ${
        sheet ? "items-end" : "items-center px-6"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`max-h-[88dvh] w-full max-w-[440px] overflow-y-auto bg-background p-6 ${
          sheet
            ? "rounded-t-[12px] pb-[max(24px,env(safe-area-inset-bottom))]"
            : "max-w-[350px] rounded-[12px]"
        }`}
      >
        {children}
      </div>
    </div>
  )
}


export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [screen, setScreen] = useState<Screen>("onboard")
  const [tab, setTab] = useState<Screen>("home")
  const [prefs, setPrefs] = useState<Prefs>({})
  const [purpose, setPurpose] = useState<Purpose | undefined>()
  const [region, setRegion] = useState("부산 전포")
  const [saved, setSaved] = useState<string[]>([])
  const [quiz, setQuiz] = useState(0)
  const [editingTaste, setEditingTaste] = useState(false)
  const [detail, setDetail] = useState<string | undefined>()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("추천순")
  const [map, setMap] = useState(false)
  const [filters, setFilters] = useState<Prefs>({})
  const [sheet, setSheet] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [toast, setToast] = useState("")
  const [storageError, setStorageError] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    try {
      const data = localStorage.getItem("cafekok-state")
      if (data) {
        const state = JSON.parse(data)
        if (!state || typeof state !== "object" || Array.isArray(state))
          throw new Error("Invalid state")
        const restored: Prefs = {}
        QUESTIONS.forEach(([key, , options]) => {
          if ((options as readonly string[]).includes(state.prefs?.[key]))
            restored[key] = state.prefs[key]
        })
        setPrefs(restored)
        setSaved(
          Array.isArray(state.saved)
            ? state.saved.filter((id: unknown) =>
                cafes.some((c) => c.id === id),
              )
            : [],
        )
        setPurpose(
          PURPOSES.some((p) => p.id === state.purpose)
            ? state.purpose
            : undefined,
        )
        setRegion(
          ["부산 전포", "부산 광안리", "부산 서면"].includes(state.region)
            ? state.region
            : "부산 전포",
        )
        setScreen("home")
      }
    } catch {
      setStorageError("저장된 상태를 불러오지 못했어요. 새로 설정해주세요.")
    }
    setLoaded(true)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(
          "cafekok-state",
          JSON.stringify({ prefs, saved, purpose, region }),
        )
      } catch {
        setStorageError(
          "기기 저장 공간을 사용할 수 없어 변경 사항이 새로고침 후 유지되지 않을 수 있어요.",
        )
      }
    }
  }, [prefs, saved, purpose, region, loaded])
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen, map])

  const score = (c: Cafe) =>
    (purpose && c.suitablePurposes.includes(purpose) ? 5 : 0) +
    ["atmosphere", "space"].filter(
      (key) => prefs[key] && c[(key as keyof Cafe)] === prefs[key],
    ).length *
      2 +
    (prefs.seat && c.seatTypes.includes(prefs.seat) ? 2 : 0) +
    (prefs.menu && c.menuTypes.includes(prefs.menu) ? 2 : 0)
  const match = (c: Cafe) => {
    const total =
      (purpose ? 5 : 0) +
      ["atmosphere", "space", "seat", "menu"].filter((key) => prefs[key])
        .length *
        2
    return total ? Math.round((score(c) / total) * 100) : undefined
  }
  const list = useMemo(() => {
    const price = filters.price || prefs.price,
      distance = filters.distance || prefs.distance
    return cafes
      .filter(
        (c) =>
          c.neighborhood === region &&
          c.name.includes(query.trim()) &&
          c.representativeDrinkPrice <= priceLimit(price) &&
          c.sampleDistance <= distLimit(distance) &&
          (!filters.atmosphere || c.atmosphere === filters.atmosphere) &&
          (!filters.seat || c.seatTypes.includes(filters.seat)) &&
          (!filters.menu || c.menuTypes.includes(filters.menu)),
      )
      .sort((a, b) =>
        sort === "가까운 순"
          ? a.sampleDistance - b.sampleDistance
          : sort === "가격 낮은 순"
            ? a.representativeDrinkPrice - b.representativeDrinkPrice
            : score(b) - score(a) || a.sampleDistance - b.sampleDistance,
      )
  }, [region, query, filters, prefs, purpose, sort])
  const activeFilters = Object.entries(filters).filter(([, value]) => value)
  const cafe = cafes.find((c) => c.id === detail)
  const purposeTitle = PURPOSES.find((p) => p.id === purpose)?.title
  const nav = (next: Screen, nextTab?: Screen) => {
    setScreen(next)
    if (next !== "quiz") setEditingTaste(false)
    if (nextTab) setTab(nextTab)
    else if (["home", "explore", "saved", "profile"].includes(next))
      setTab(next)
    setMap(false)
  }
  const notify = (message: string) => {
    setToast(message)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(""), 2200)
  }
  const toggle = (id: string) => {
    const exists = saved.includes(id)
    setSaved(exists ? saved.filter((item) => item !== id) : [...saved, id])
    notify(exists ? "저장을 취소했어요" : "저장한 카페에 담았어요")
  }
  const open = (id: string) => {
    setDetail(id)
    setScreen("detail")
  }
  const reason = (c: Cafe, count = 2) => {
    const facts: string[] = []
    if (purpose && c.suitablePurposes.includes(purpose)) {
      if (purpose === "study")
        facts.push(
          `${c.atmosphere} 분위기${
            c.amenities.includes("콘센트") ? "와 콘센트" : ""
          }가 있어 집중하기 좋아요.`,
        )
      if (purpose === "date")
        facts.push(
          `${
            c.seatTypes.includes("둘이 앉는 자리")
              ? "둘이 앉는 자리"
              : `${c.atmosphere} 분위기`
          }가 있어 데이트에 어울려요.`,
        )
      if (purpose === "friends")
        facts.push("함께 머물기 좋은 공간으로 친구와의 만남에 어울려요.")
      if (purpose === "drive")
        facts.push(
          c.amenities.includes("주차")
            ? "주차 공간이 있어 드라이브 중 들르기 좋아요."
            : "드라이브 중 쉬어가기 좋은 곳이에요. 주차는 확인해주세요.",
        )
    }
    if (prefs.atmosphere === c.atmosphere)
      facts.push("선택한 분위기와 잘 맞아요.")
    if (prefs.space === c.space)
      facts.push(`${c.space} 공간을 선호하는 취향과 맞아요.`)
    if (prefs.seat && c.seatTypes.includes(prefs.seat))
      facts.push(`선호하는 ${prefs.seat}가 있어요.`)
    if (prefs.menu && c.menuTypes.includes(prefs.menu))
      facts.push(`좋아하는 ${prefs.menu} 메뉴를 함께 즐길 수 있어요.`)
    if (
      !facts.length &&
      Number.isFinite(priceLimit(prefs.price)) &&
      c.representativeDrinkPrice <= priceLimit(prefs.price)
    )
      facts.push("선택한 예산 안에서 대표 음료를 즐길 수 있어요.")
    return (
      facts.slice(0, count).join(" ") ||
      `${c.atmosphere} 분위기의 공간이에요. 좌석과 메뉴를 살펴보세요.`
    )
  }
  const tags = (c: Cafe) => {
    const t: string[] = []
    if (purpose && purposeTitle && c.suitablePurposes.includes(purpose))
      t.push(purposeTitle)
    if (prefs.atmosphere === c.atmosphere) t.push(c.atmosphere)
    if (prefs.space === c.space) t.push(c.space)
    if (prefs.seat && c.seatTypes.includes(prefs.seat)) t.push(prefs.seat)
    if (prefs.menu && c.menuTypes.includes(prefs.menu)) t.push(prefs.menu)
    return t.slice(0, 4)
  }
  const tasteLine = () => {
    const parts = [
      prefs.atmosphere && `${prefs.atmosphere} 분위기`,
      prefs.space && `${prefs.space} 공간`,
      prefs.seat,
      prefs.menu && `${prefs.menu} 메뉴`,
    ].filter(Boolean) as string[]
    return parts.length ? `${parts.slice(0, 2).join(", ")}.` : ""
  }
  const matchLabel = (c: Cafe) =>
    match(c) === undefined ? "취향 비교 전" : `${match(c)}% 취향 일치`
  const resetConditions = () => {
    setFilters({})
    setQuery("")
    setPrefs({ ...prefs, price: undefined, distance: undefined })
  }

  const Header = (title?: string, right?: React.ReactNode) => (
    <header className="flex min-h-[76px] items-center justify-between gap-3 px-6 py-3">
      {title ? (
        <div className="flex items-center gap-2">
          <button
            className="-ml-2 flex size-11 items-center justify-center text-primary"
            onClick={() => nav(tab)}
            aria-label="뒤로 가기"
          >
            <Icon name="back" />
          </button>
          <span className="font-display text-[20px]">{title}</span>
        </div>
      ) : (
        <div>
          <Logo className="text-[28px]" />
          <div className="mt-2 flex items-center gap-1 text-[14px] font-semibold text-primary">
            <Icon name="pin" className="size-4" />
            <select
              aria-label="탐색 지역"
              className="max-w-32 bg-transparent py-1 font-semibold text-foreground"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              {["부산 전포", "부산 광안리", "부산 서면"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {right || (
        <button
          aria-label="내 취향 보기"
          className="flex size-11 items-center justify-center rounded-[8px] border-[1.5px] border-primary text-primary"
          onClick={() => nav("profile")}
        >
          <Icon name="profile" />
        </button>
      )}
    </header>
  )
  const SaveButton = (c: Cafe, photo = true, small = false) => (
    <button
      aria-label={`${c.name} ${saved.includes(c.id) ? "저장 취소" : "저장"}`}
      aria-pressed={saved.includes(c.id)}
      onClick={() => toggle(c.id)}
      className={`flex items-center justify-center text-primary ${
        small ? "size-10" : "size-11"
      } ${photo ? `absolute right-2.5 top-2.5 rounded-[8px] bg-background` : ""}`}
    >
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        fill={saved.includes(c.id) ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 3h12v18l-6-4-6 4Z" />
      </svg>
    </button>
  )
  const MatchBlock = (c: Cafe, size: "xl" | "md" = "xl") => {
    const m = match(c)
    return <span className={`inline-flex items-baseline gap-1.5 rounded-full bg-primary text-primary-foreground ${size === "xl" ? "px-3.5 py-2" : "px-3 py-1.5"}`}>
      {m === undefined ? <span className="text-[12px] font-semibold">취향 비교 전</span> : <><b className="text-[18px] leading-none tabular-nums">{m}<span className="ml-0.5 text-[11px]">%</span></b><span className="text-[10px] font-medium">취향 일치</span></>}
    </span>
  }
  const Card = (c: Cafe, mode: "list" | "tile" = "list", _index = 0) => (
    <article key={c.id} className={mode === "tile" ? "min-w-0" : "cafe-card"}>
      <div className="relative">
        <button className="block w-full text-left" onClick={() => open(c.id)} aria-label={`${c.name} 상세 보기`}>
          <Photo cafe={c} className={mode === "tile" ? "aspect-[4/5] rounded-[14px]" : "cafe-card-photo"} />
        </button>
        {SaveButton(c, mode === "tile", true)}
        {mode === "list" && <div className="absolute bottom-3 left-3">{MatchBlock(c, "md")}</div>}
      </div>
      <div className={mode === "tile" ? "pt-3" : "cafe-card-body"}>
        <p className="app-note">{c.neighborhood.replace("부산 ", "")} · {c.sampleDistance}km</p>
        <button className="mt-1 block text-left" onClick={() => open(c.id)}><h3 className={mode === "tile" ? "text-[16px] font-semibold leading-snug" : "cafe-card-title"}>{c.name}</h3></button>
        {mode === "list" && <p className="cafe-reason mt-2">{reason(c, 1)}</p>}
        <p className="app-note mt-2">{c.menuTypes[0]} · {c.representativeDrinkPrice.toLocaleString()}원~</p>
      </div>
    </article>
  )

  const Empty = () => (
    <div className="py-12">
      <Icon name="coffee" className="mb-5 size-10 text-primary" />
      <h2 className="font-display text-[26px] leading-snug">
        맞는 카페가
        <br />
        아직 없어요
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
        검색어나 거리·가격을 넓혀보세요.
      </p>
      <button className={`${secondary} mt-6`} onClick={resetConditions}>
        검색·조건 초기화
      </button>
    </div>
  )
  const PurposeButtons = (compact = false) => (
    <div className={compact ? "no-scrollbar flex gap-2 overflow-x-auto pb-1" : "grid grid-cols-2 gap-2"}>
      {PURPOSES.map(p => <button key={p.id} aria-pressed={purpose === p.id} onClick={() => setPurpose(purpose === p.id ? undefined : p.id)} className={`purpose-button ${compact ? "shrink-0" : ""}`}>
        <Icon name={purpose === p.id ? "check" : p.id} /><span>{p.title}</span>
      </button>)}
    </div>
  )

  const Home = () => {
    const top = list[0]
    const hasPrefs = Object.values(prefs).some(Boolean)
    return <>
      {Header()}
      <main className="px-6 pb-28">
        <p className="app-kicker pt-1">FIND YOUR CAFÉ</p>
        <h1 className="app-title mt-2">오늘 가고 싶은<br />카페를 찾아요.</h1>
        <section aria-label="오늘의 방문 목적" className="pt-6">
          <h2 className="mb-3 text-[14px] font-semibold">오늘은 무엇을 할까요?</h2>
          {PurposeButtons()}
        </section>
        <section className="pt-7">
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className={sectionHeading}>{purposeTitle ? `${purposeTitle} 추천` : "오늘의 추천"}</h2><button className="min-h-11 text-[12px] font-semibold text-primary" onClick={() => nav("explore")}>전체 보기 →</button></div>
          {top ? Card(top) : Empty()}
        </section>
        {list.length > 1 && <section className="pt-8"><h2 className={`${sectionHeading} mb-4`}>함께 둘러볼 곳</h2><div className="grid grid-cols-2 gap-3">{list.slice(1,3).map(c => Card(c,"tile"))}</div></section>}
        <button className="mt-7 flex w-full items-center justify-between gap-4 rounded-[16px] bg-secondary p-5 text-left" onClick={() => nav(hasPrefs ? "profile" : "quiz")}>
          <span><span className="app-kicker block">MY TASTE</span><span className="mt-1 block text-[16px] font-semibold">{hasPrefs ? "내 취향 다시 보기" : "어떤 카페를 좋아하세요?"}</span></span><Icon name="arrow" className="size-5 shrink-0 text-primary" />
        </button>
        <p className="app-note mt-5">가상 카페 12곳으로 만든 시연용 앱입니다.</p>
      </main>
    </>
  }

  const Map = () => (
    <div>
      <div className="relative isolate h-[360px] overflow-hidden rounded-[8px] border border-border bg-[#e6e1d6]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 350 360"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M270 0h80v360H310L290 180Z" fill="#d1d8d0" />
          <path
            d="M-20 100 350 250M80-20 145 380M-20 320 380 90"
            stroke="#f8f5ef"
            strokeWidth="22"
          />
          <path
            d="M-20 100 350 250M80-20 145 380M-20 320 380 90"
            stroke="#ccc3b3"
            strokeWidth="1"
          />
          <path
            d="M0 50h250M0 175h290M20 0v360M210 0v360"
            stroke="#d4ccbe"
            strokeWidth="2"
          />
        </svg>
        <p className="absolute left-4 top-4 text-[12px] tracking-[0.06em] font-bold text-primary">
          {region.replace("부산 ", "")} · SAMPLE MAP
        </p>
        <span className="absolute bottom-4 right-4 text-[12px] text-muted-foreground">
          위치 비례 아님
        </span>
        {list.map((c, index) => (
          <button
            key={c.id}
            aria-label={`${c.name} 상세 보기`}
            className={`absolute z-10 flex size-11 items-center justify-center rounded-full border-[3px] border-background bg-primary text-sm font-semibold text-primary-foreground ${["left-[20%] top-[32%]", "left-[57%] top-[45%]", "left-[33%] top-[67%]", "left-[70%] top-[73%]"][index]}`}
            onClick={() => open(c.id)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <p className="my-4 text-[12px] leading-5 text-muted-foreground">
        샘플 지도입니다. 실제 위치·GPS·길 안내는 제공하지 않아요.
      </p>
      {list.length ? (
        <div className="divide-y divide-border">
          {list.map((c, index) => (
            <button
              key={c.id}
              className="flex w-full items-center gap-3 py-4 text-left"
              onClick={() => open(c.id)}
            >
              <span className="w-6 font-display text-[28px] text-primary">
                {index + 1}
              </span>
              <Photo cafe={c} className="size-16 shrink-0 rounded-[6px]" />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[18px]">{c.name}</h3>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {matchLabel(c)} · 샘플 {c.sampleDistance}km
                </p>
              </div>
              <Icon name="chevron" className="size-4" />
            </button>
          ))}
        </div>
      ) : (
        Empty()
      )}
    </div>
  )
  const Explore = () => (
    <>
      {Header(
        undefined,
        <button
          className="flex min-h-11 items-center gap-1.5 rounded-[8px] border-[1.5px] border-primary px-3 text-[14px] font-bold text-primary"
          onClick={() => setSheet(true)}
        >
          <Icon name="filter" className="size-4" />
          필터{activeFilters.length > 0 && ` ${activeFilters.length}`}
        </button>,
      )}
      <main className="px-6 pb-32">
        <p className="app-kicker">EXPLORE</p>
        <h1 className="app-title mt-2">카페 탐색</h1>
        <div className="mb-4 mt-6 flex h-14 items-center gap-3 rounded-[8px] border-[1.5px] border-primary/30 bg-card px-4 focus-within:border-primary">
          <Icon name="search" className="size-5 shrink-0 text-primary" />
          <input
            aria-label="카페 이름 검색"
            className="min-w-0 flex-1 bg-transparent text-[16px] placeholder:text-muted-foreground"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="카페 이름 검색"
          />
          {query && (
            <button
              aria-label="검색어 지우기"
              className="flex size-8 items-center justify-center"
              onClick={() => setQuery("")}
            >
              <Icon name="close" className="size-4" />
            </button>
          )}
        </div>
        {PurposeButtons(true)}
        {(prefs.price || prefs.distance || activeFilters.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-4">
            {["price", "distance"]
              .filter((key) => prefs[key])
              .map((key) => (
                <button
                  key={key}
                  className="flex min-h-11 items-center gap-1 rounded-full bg-secondary px-2.5 text-[13px] font-semibold text-primary"
                  onClick={() => setPrefs({ ...prefs, [key]: undefined })}
                  aria-label={`${prefs[key]} 취향 조건 해제`}
                >
                  {prefs[key]}
                  <Icon name="close" className="size-3" />
                </button>
              ))}
            {activeFilters.map(([key, value]) => (
              <button
                key={key}
                className="flex min-h-11 items-center gap-1 rounded-full bg-secondary px-2.5 text-[13px] font-semibold text-primary"
                onClick={() => setFilters({ ...filters, [key]: undefined })}
                aria-label={`${value} 필터 해제`}
              >
                {value}
                <Icon name="close" className="size-3" />
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 pt-5">
          <span className="flex items-baseline gap-1 text-[15px]">
            <b className="font-display text-[22px] font-semibold leading-none text-primary">
              {list.length}
            </b>
            곳
            <span className="ml-1.5 text-[13px] text-muted-foreground">
              {purposeTitle || "목적 미선택"}
            </span>
          </span>
          <div className="flex items-center gap-3">
            <select
              aria-label="카페 정렬"
              className="max-w-28 bg-transparent text-[14px] font-semibold"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {["추천순", "가까운 순", "가격 낮은 순"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <button
              aria-pressed={map}
              className="flex min-h-11 items-center gap-1 text-[14px] font-bold text-primary"
              onClick={() => setMap(!map)}
            >
              <Icon name={map ? "home" : "map"} className="size-4" />
              {map ? "목록" : "지도"}
            </button>
          </div>
        </div>
        {map ? (
          Map()
        ) : list.length ? (
          <div className="space-y-5">{list.map((c, i) => Card(c, "list", i))}</div>
        ) : (
          Empty()
        )}
        <p className="mt-10 text-[12px] leading-5 text-muted-foreground">
          시연용 추천 결과 · 실제 카페 정보가 아닙니다.
        </p>
      </main>
    </>
  )

  const Profile = () => <>
    {Header("내 취향", <button className="min-h-11 text-[13px] font-medium text-muted-foreground" onClick={() => nav("settings")}>설정</button>)}
    <main className="pb-28">
      <div className="px-6 pt-1"><p className="app-kicker">MY CAFÉ TASTE</p><h1 className="app-title mt-2">취향이 담긴 공간</h1><p className="mt-2 text-[14px] text-muted-foreground">좋아하는 공간을 한 장면으로 모았어요.</p></div>
      <TasteScene prefs={prefs} onEdit={index => {setEditingTaste(true); setQuiz(index); setScreen("quiz")}} />
      <div className="px-6 pt-6"><button className={`${primary} flex w-full items-center justify-between`} onClick={() => nav("home")}>이 취향으로 카페 찾기<Icon name="arrow" className="size-4" /></button><button className="mt-2 min-h-11 w-full text-[13px] font-medium text-muted-foreground" onClick={() => {setEditingTaste(false); setQuiz(0); setScreen("quiz")}}>취향 전체 다시 고르기</button></div>
    </main>
  </>

  const Quiz = () => {
    const [key, question, options] = QUESTIONS[quiz]
    const next = () => editingTaste || quiz === 5 ? nav("profile") : setQuiz(quiz + 1)
    return <main className="flex min-h-[100svh] flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
      <div className="flex items-center justify-between gap-3"><button className="-ml-2 flex size-11 items-center justify-center" aria-label="이전 화면" onClick={() => editingTaste ? nav("profile") : quiz ? setQuiz(quiz-1) : nav("home")}><Icon name="back" className="size-5" /></button><span className="text-[14px] font-semibold">{editingTaste ? "취향 수정" : "내 취향 찾기"}</span><button className="min-h-11 text-[12px] text-muted-foreground" onClick={() => editingTaste ? nav("profile") : quiz < 5 ? setQuiz(quiz + 1) : nav("profile")}>{editingTaste ? "닫기" : "건너뛰기"}</button></div>
      {!editingTaste && <div className="mt-3 grid grid-cols-6 gap-1.5" aria-label={`${quiz+1} / 6단계`}>{QUESTIONS.map((_, i)=><span key={i} className={`h-[3px] rounded-full ${i <= quiz ? "bg-primary" : "bg-border"}`} />)}</div>}
      <div className="pb-7 pt-10"><p className="app-kicker">{DIMENSIONS[quiz]}{!editingTaste && ` · 0${quiz+1} / 06`}</p><h1 className="app-title mt-3">{question}</h1><p className="mt-3 text-[14px] text-muted-foreground">가장 마음에 드는 하나를 골라주세요.</p></div>
      <div className="mb-8 space-y-3">{options.map(option => {
        const on=prefs[key] === option
        return <button key={option} aria-pressed={on} className={`flex min-h-[64px] w-full items-center gap-3 rounded-[14px] border px-4 text-left text-[16px] font-medium transition-colors ${on ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground"}`} onClick={()=>setPrefs({...prefs,[key]:option})}><span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on && <Icon name="check" className="size-3" />}</span><span>{tasteLabel(option)}</span></button>
      })}</div>
      <button disabled={!prefs[key]} className={`${primary} mt-auto flex items-center justify-between`} onClick={next}>{editingTaste ? "변경 완료" : quiz === 5 ? "내 취향 보기" : "다음"}<Icon name="arrow" className="size-4" /></button>
    </main>
  }

  const Saved = () => {
    const items=saved.map(id=>cafes.find(c=>c.id===id)).filter((c):c is Cafe=>Boolean(c))
    return <>{Header()}<main className="px-6 pb-28"><p className="app-kicker">SAVED CAFÉS</p><div className="mt-2 flex items-baseline justify-between gap-3"><h1 className="app-title">저장한 카페</h1><span className="text-[14px] font-semibold text-primary">{items.length}곳</span></div><p className="mt-2 text-[14px] text-muted-foreground">다음에 가고 싶은 곳을 모아두었어요.</p>
      {items.length ? <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7">{items.map(c=>Card(c,"tile"))}</div> : <div className="mt-7 rounded-[18px] bg-secondary p-6 py-9"><Icon name="saved" className="mb-4 size-7 text-primary" /><h2 className="text-[20px] font-semibold">첫 카페를 저장해보세요.</h2><p className="mt-2 text-[14px] text-muted-foreground">마음에 드는 곳을 다시 찾기 쉬워져요.</p><button className={`${primary} mt-6 w-full`} onClick={()=>nav("explore")}>카페 둘러보기</button></div>}
      <p className="app-note mt-6">이 브라우저에 저장됩니다.</p></main></>
  }

  const Detail = () => {
    if (!cafe) return null
    const isSaved=saved.includes(cafe.id)
    return <>
      <main className="pb-28">
        <div className="relative"><Photo cafe={cafe} eager className="h-[min(42dvh,340px)] min-h-[240px]" /><div className="absolute inset-x-0 top-0 flex justify-between p-4"><button className="flex size-11 items-center justify-center rounded-full bg-card/95 text-primary" aria-label="뒤로 가기" onClick={()=>nav(tab)}><Icon name="back" className="size-5" /></button><button className="flex size-11 items-center justify-center rounded-full bg-card/95 text-primary" aria-label={isSaved ? "저장 취소" : "카페 저장"} aria-pressed={isSaved} onClick={()=>toggle(cafe.id)}><Icon name="saved" className="size-5" /></button></div></div>
        <div className="px-6 pt-6"><div className="flex items-center justify-between gap-3"><p className="app-note">{cafe.neighborhood} · {cafe.sampleDistance}km</p>{MatchBlock(cafe,"md")}</div><h1 className="app-title mt-2">{cafe.name}</h1><p className="mt-2 text-[14px] text-muted-foreground">{tasteLabel(cafe.atmosphere)} · {tasteLabel(cafe.space)}</p>
          <section className="mt-5 rounded-[16px] bg-secondary p-4" aria-label="추천 이유"><p className="text-[12px] font-semibold text-primary">{match(cafe)===undefined ? "이런 공간이에요" : "이런 점이 잘 맞아요"}</p><p className="mt-2 text-[14px] leading-6">{reason(cafe,1)}</p></section>
          <section className="pt-7"><h2 className="app-section-title">방문 전 살펴봐요</h2><dl className="mt-4 grid grid-cols-2 gap-3"><div className="info-cell"><dt>대표 음료</dt><dd>{cafe.representativeDrinkPrice.toLocaleString()}원~</dd></div><div className="info-cell"><dt>운영 시간</dt><dd>{cafe.sampleHours}</dd></div><div className="info-cell"><dt>자리</dt><dd>{cafe.seatTypes.map(tasteLabel).join(" · ")}</dd></div><div className="info-cell"><dt>메뉴</dt><dd>{cafe.menuTypes.join(" · ")}</dd></div></dl><p className="mt-4 text-[13px] leading-6"><span className="mr-3 text-muted-foreground">편의 시설</span>{cafe.amenities.join(" · ") || "확인 필요"}</p></section>
          <section className="pt-7"><h2 className="app-section-title mb-4">위치</h2><MiniMap /><p className="app-note mt-3">{cafe.samplePosition}</p><p className="mt-4 border-l-2 border-accent pl-3 text-[13px] leading-6 text-muted-foreground">{cafe.unknownInfo}</p></section>
          <details className="mt-6 border-t border-border py-4 text-[12px] text-muted-foreground"><summary className="cursor-pointer font-medium">취향 일치율 기준</summary><p className="mt-2 leading-6">목적·분위기·공간·자리·메뉴를 비교한 예시 점수입니다. 가격과 거리는 목록 조건으로 반영합니다.</p></details><p className="app-note">가상 카페 · 사진과 정보는 시연용 예시입니다.</p>
        </div>
      </main>
      <div className="fixed bottom-0 z-20 flex w-full max-w-[440px] gap-3 border-t border-border bg-background/95 px-6 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl"><button className={`${secondary} flex-1 px-2`} onClick={()=>{nav("explore");setMap(true)}}>지도 보기</button><button className={`${primary} flex-[1.6]`} onClick={()=>toggle(cafe.id)}>{isSaved ? "저장됨 · 취소" : "카페 저장하기"}</button></div>
    </>
  }
  const Onboard = () => <main className="flex min-h-[100svh] flex-col">
    <div className="relative"><Photo cafe={cafes[1]} eager className="h-[42dvh] min-h-[220px] max-h-[360px]" /><div className="absolute left-6 top-6 rounded-full bg-card/95 px-4 py-2.5"><Logo className="text-[23px]" /></div></div>
    <div className="flex flex-1 flex-col px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-7"><p className="app-kicker">A CAFÉ THAT FEELS LIKE YOU</p><h1 className="app-title mt-3">내 취향에 맞는<br />카페를 찾아요.</h1><p className="mb-6 mt-3 text-[14px] text-muted-foreground">좋아하는 공간에, 오늘의 목적을 더해요.</p><div className="mt-auto"><button className={`${primary} flex w-full items-center justify-between`} onClick={()=>{setEditingTaste(false);setQuiz(0);setScreen("quiz")}}>내 취향 찾기<Icon name="arrow" className="size-4" /></button><button className="min-h-11 w-full pt-2 text-[13px] font-medium text-muted-foreground" onClick={()=>nav("home")}>먼저 둘러보기</button></div><p className="app-note mt-4">부산의 가상 카페로 구성한 프로토타입</p></div>
  </main>

  const Settings = () => (
    <>
      {Header("설정", <Logo className="text-[18px]" />)}
      <main className="px-6 pb-32">
        <h1 className={heading}>데모 안내</h1>
        <section className="mt-7 border-y border-primary/20 py-6">
          <h2 className="font-display text-[19px]">이 프로토타입은</h2>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            부산 전포·광안리·서면의 가상 카페를 둘러봐요. 위치 권한이나 계정은
            필요 없고, 취향과 저장 목록은 이 브라우저에만 보관돼요.
          </p>
        </section>
        <button
          className="mt-5 flex min-h-14 w-full items-center justify-between border-b border-primary/20 text-left text-[15px] font-bold text-primary"
          onClick={() => setConfirm(true)}
        >
          데모 데이터 초기화
          <Icon name="arrow" className="size-4" />
        </button>
        <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
          취향·저장 목록·목적·지역을 지우고 처음 화면으로 돌아가요.
        </p>
      </main>
    </>
  )
  const FilterSheet = () => (
    <Modal title="카페 필터" sheet onClose={() => setSheet(false)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className={sectionHeading}>나에게 맞는 조건</h2>
        <button
          className="flex size-11 items-center justify-center"
          aria-label="필터 닫기"
          onClick={() => setSheet(false)}
        >
          <Icon name="close" />
        </button>
      </div>
      <button
        className="mb-3 min-h-8 text-[14px] font-bold text-primary underline underline-offset-4"
        onClick={() => setFilters({})}
      >
        추가 필터 초기화
      </button>
      {[0, 2, 3, 4, 5].map((index) => {
        const [key, , options] = QUESTIONS[index]
        return (
          <section key={key} className="border-t border-border py-5">
            <h3 className="mb-3 text-[15px] font-bold">
              {DIMENSIONS[index]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  aria-pressed={filters[key] === option}
                  className={`min-h-10 rounded-[6px] border px-3.5 py-2 text-[14px] font-medium ${
                    filters[key] === option
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      [key]: filters[key] === option ? undefined : option,
                    })
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </section>
        )
      })}
      <button className={`${primary} w-full`} onClick={() => setSheet(false)}>
        카페 {list.length}곳 보기
      </button>
    </Modal>
  )

  if (!loaded) return <div className="min-h-[100dvh] bg-background" />
  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-[440px] bg-background min-[1000px]:border-x min-[1000px]:border-border">
      {storageError && (
        <div
          role="alert"
          className="flex items-start gap-2 border-b border-border bg-secondary p-4 text-[12px] leading-5 text-primary"
        >
          <p className="flex-1">{storageError}</p>
          <button
            aria-label="저장 안내 닫기"
            onClick={() => setStorageError("")}
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>
      )}
      {screen === "onboard"
        ? Onboard()
        : screen === "quiz"
          ? Quiz()
          : screen === "home"
            ? Home()
            : screen === "explore"
              ? Explore()
              : screen === "saved"
                ? Saved()
                : screen === "profile"
                  ? Profile()
                  : screen === "detail"
                    ? Detail()
                    : Settings()}
      {!["onboard", "quiz", "detail"].includes(screen) && (
        <nav
          aria-label="주요 메뉴"
          className="fixed bottom-0 z-20 flex w-full max-w-[440px] justify-around px-3 border-t border-primary/15 bg-card/95 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
        >
          {([
            ["home", "홈"],
            ["explore", "탐색"],
            ["saved", "저장"],
            ["profile", "내 취향"],
          ] as const).map(([id, title]) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              className={`relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] ${
                tab === id ? "font-bold text-primary" : "text-muted-foreground"
              }`}
              onClick={() => nav(id)}
            >
              {tab === id && (
                <span className="absolute top-0 h-[3px] w-3 rounded-full bg-primary" />
              )}
              <Icon name={id} className="size-[21px]" />
              {title}
            </button>
          ))}
        </nav>
      )}
      {sheet && FilterSheet()}
      {confirm && (
        <Modal title="데모 초기화 확인" onClose={() => setConfirm(false)}>
          <h2 className="font-display text-[24px] leading-snug">처음부터 다시<br />시작할까요?</h2>
          <p className="mt-4 text-[14px] leading-7 text-muted-foreground">
            취향과 저장 목록, 방문 목적과 지역을 현재 브라우저에서 초기화합니다.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              className={`${secondary} flex-1`}
              onClick={() => setConfirm(false)}
            >
              취소
            </button>
            <button
              className={`${primary} flex-1`}
              onClick={() => {
                try {
                  localStorage.removeItem("cafekok-state")
                } catch {
                  setStorageError(
                    "기기 저장 공간의 데이터는 삭제하지 못했어요.",
                  )
                }
                setPrefs({})
                setSaved([])
                setPurpose(undefined)
                setRegion("부산 전포")
                setFilters({})
                setQuery("")
                setSort("추천순")
                setQuiz(0)
                setDetail(undefined)
                setToast("")
                setConfirm(false)
                nav("onboard", "home")
              }}
            >
              초기화
            </button>
          </div>
        </Modal>
      )}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
