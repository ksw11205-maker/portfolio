import { useEffect, useMemo, useRef, useState } from "react"

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
    "어떤 분위기에 더 마음이 가나요?",
    ["조용하고 차분한", "적당히 활기찬", "활기찬 공간"],
  ],
  [
    "space",
    "어떤 공간에서 편안함을 느끼나요?",
    ["아늑하고 작은", "균형 있는", "넓고 개방적인"],
  ],
  [
    "seat",
    "어떤 자리를 선호하나요?",
    ["혼자 앉는 자리", "둘이 앉는 자리", "여럿이 앉는 자리"],
  ],
  [
    "menu",
    "카페에서 가장 기대하는 것은 무엇인가요?",
    ["커피", "디저트", "차·논커피", "브런치"],
  ],
  [
    "price",
    "음료 한 잔의 예산은 어느 정도인가요?",
    ["5,000원 이하", "6,500원 이하", "8,000원 이하", "상관없음"],
  ],
  [
    "distance",
    "얼마나 가까운 카페를 찾고 있나요?",
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
    image: "/images/j-1.jpg",
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
    image: "/images/j-2.jpg",
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
    image: "/images/j-3.jpg",
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
    image: "/images/j-4.jpg",
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
    image: "/images/g-1.jpg",
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
    image: "/images/g-2.jpg",
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
    image: "/images/g-3.jpg",
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
    image: "/images/g-4.jpg",
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
    image: "/images/s-1.jpg",
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
    image: "/images/s-2.jpg",
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
    image: "/images/s-3.jpg",
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
    image: "/images/s-4.jpg",
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
  "min-h-14 rounded-[10px] bg-primary px-5 py-3 text-[16px] font-bold text-primary-foreground transition-colors hover:bg-[#462919] active:translate-y-px"
const secondary =
  "min-h-14 rounded-[10px] border-[1.5px] border-primary px-5 py-3 text-[16px] font-bold text-primary transition-colors hover:bg-secondary"
const heading = "font-display text-[34px] leading-[1.3] tracking-[-0.01em]"
const label = "text-[12px] font-bold tracking-[0.06em] text-primary"
const sectionHeading = "font-display text-[26px] leading-[1.3]"

function Logo({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center font-display leading-none text-primary ${className}`}
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
            className={`h-full w-full object-cover [filter:saturate(0.92)_brightness(1.1)_contrast(0.93)_sepia(0.16)] ${imgClass}`}
            src={cafe.image}
            alt={`${cafe.name} 분위기 참고 사진 · 실제 카페 사진이 아닙니다`}
            loading={eager ? "eager" : "lazy"}
            onError={() => setFailed(true)}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#f6dfb8]/20 mix-blend-soft-light"
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
    <header className="flex min-h-24 items-center justify-between gap-3 px-6 py-5">
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
    return (
      <div
        className={`inline-flex items-baseline gap-2 rounded-[8px] bg-primary text-primary-foreground ${
          size === "xl" ? "px-4 py-3" : "px-3 py-2"
        }`}
      >
        {m === undefined ? (
          <span
            className={`font-display leading-tight ${size === "xl" ? "text-[22px]" : "text-[17px]"}`}
          >
            취향 비교 전
          </span>
        ) : (
          <>
            <span
              className={`font-display leading-none tabular-nums ${
                size === "xl" ? "text-[48px]" : "text-[30px]"
              }`}
            >
              {m}
              <span className="text-[0.55em]">%</span>
            </span>
            <span
              className={`font-bold ${size === "xl" ? "text-[15px]" : "text-[13px]"}`}
            >
              취향 일치
            </span>
          </>
        )}
      </div>
    )
  }
  const Card = (
    c: Cafe,
    mode: "list" | "tile" = "list",
    index = 0,
  ) => {
    if (mode === "tile") {
      const ratio = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"][index % 3]
      const m = match(c)
      return (
        <article key={c.id} className="mb-7">
          <div className="relative">
            <button
              className="block w-full text-left"
              onClick={() => open(c.id)}
              aria-label={`${c.name} 상세 보기`}
            >
              <Photo cafe={c} className={`${ratio} rounded-[6px]`} />
            </button>
            {SaveButton(c, true, true)}
          </div>
          <button className="mt-3 block text-left" onClick={() => open(c.id)}>
            <h3 className="font-display text-[19px] leading-snug">{c.name}</h3>
          </button>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {c.neighborhood.replace("부산 ", "")}
            {m !== undefined && (
              <b className="ml-2 font-display text-[15px] font-normal text-primary">
                {m}%
              </b>
            )}
          </p>
        </article>
      )
    }
    const wide = index % 2 === 1
    return (
      <article key={c.id}>
        <div className={`relative ${wide ? "-mr-6 ml-8" : ""}`}>
          <button
            className="block w-full text-left"
            onClick={() => open(c.id)}
            aria-label={`${c.name} 상세 보기`}
          >
            <Photo
              cafe={c}
              className={`${wide ? "aspect-[1.5] rounded-l-[6px]" : "aspect-[1.25] rounded-[6px]"}`}
            />
          </button>
          {SaveButton(c)}
          <div className="absolute -bottom-5 left-3">{MatchBlock(c, "md")}</div>
        </div>
        <div className={`pt-9 ${wide ? "ml-8" : ""}`}>
          <p className="text-[13px] text-muted-foreground">
            {c.neighborhood.replace("부산 ", "")} · 샘플 {c.sampleDistance}km
          </p>
          <button className="mt-0.5 block text-left" onClick={() => open(c.id)}>
            <h3 className="font-display text-[25px] leading-snug">{c.name}</h3>
          </button>
          <p className="mt-2 text-[15px] leading-[1.6] text-foreground/80">
            {reason(c, 1)}
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {c.menuTypes[0]} · {c.representativeDrinkPrice.toLocaleString()}원~
          </p>
        </div>
      </article>
    )
  }
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
  const PurposeButtons = (compact = false) => {
    const spans = ["col-span-3", "col-span-2", "col-span-2", "col-span-3"]
    return (
      <div
        className={
          compact
            ? "no-scrollbar flex gap-2 overflow-x-auto"
            : "grid grid-cols-5 gap-2"
        }
      >
        {PURPOSES.map((p, i) => (
          <button
            key={p.id}
            aria-pressed={purpose === p.id}
            onClick={() => setPurpose(purpose === p.id ? undefined : p.id)}
            className={
              compact
                ? `shrink-0 rounded-[8px] border-[1.5px] px-4 py-2.5 text-[14px] font-bold transition-colors ${
                    purpose === p.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/25 text-foreground"
                  }`
                : `${spans[i]} relative flex min-h-[96px] flex-col justify-between rounded-[8px] border-[1.5px] p-3.5 text-left transition-colors ${
                    purpose === p.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/25 text-foreground hover:border-primary"
                  }`
            }
          >
            {compact ? (
              p.title
            ) : (
              <>
                <Icon
                  name={purpose === p.id ? "check" : p.id}
                  className="size-6"
                />
                <span>
                  <span className="block whitespace-nowrap font-display text-[19px] leading-tight">
                    {p.title}
                  </span>
                  <span
                    className={`mt-0.5 block text-[12px] ${
                      purpose === p.id ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {p.desc}
                  </span>
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    )
  }

  const Home = () => {
    const top = list[0]
    const hasPrefs = Object.values(prefs).some(Boolean)
    const line = tasteLine() || (hasPrefs ? "가격·거리 조건만 정했어요." : "")
    return (
      <>
        {Header()}
        <main className="pb-32">
          <h1 className="isolate px-6 pt-2 font-display text-[42px] leading-[1.22] tracking-[-0.02em]">
            오늘은
            <br />
            <span className="relative ml-7 inline-block text-primary">
              <span
                aria-hidden="true"
                className="absolute -inset-x-1 bottom-1.5 -z-10 h-3.5 bg-accent"
              />
              어떤 카페
            </span>
            가
            <br />
            끌리나요?
          </h1>
          <section aria-label="오늘의 방문 목적" className="px-6 pt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-[20px]">오늘의 목적은?</h2>
              {purpose && (
                <span className="text-[12px] text-muted-foreground">
                  다시 누르면 해제
                </span>
              )}
            </div>
            {PurposeButtons()}
          </section>
          <section className="pt-12">
            {top ? (
              <article>
                <div className="relative">
                  <button
                    className="block w-full text-left"
                    onClick={() => open(top.id)}
                    aria-label={`${top.name} 상세 보기`}
                  >
                    <Photo cafe={top} eager className="h-[440px]" />
                  </button>
                  {SaveButton(top)}
                  <span className="absolute left-6 top-4 rounded-[4px] bg-background px-2.5 py-1 text-[13px] font-bold text-primary">
                    {purpose ? `${purposeTitle} 추천` : "오늘의 픽"}
                  </span>
                  <div className="absolute -bottom-9 left-6">
                    {MatchBlock(top)}
                  </div>
                </div>
                <div className="px-6 pt-14">
                  <p className="text-[13px] text-muted-foreground">
                    {top.neighborhood} · 샘플 {top.sampleDistance}km
                  </p>
                  <button
                    className="mt-1 block text-left"
                    onClick={() => open(top.id)}
                  >
                    <h2 className="font-display text-[34px] leading-[1.25]">
                      {top.name}
                    </h2>
                  </button>
                  <p className="mt-6 font-display text-[13px] text-primary">
                    WHY KOK?
                  </p>
                  <p className="mt-1.5 font-display text-[21px] leading-[1.5]">
                    “{reason(top, 1)}”
                  </p>
                  <p className="mt-4 text-[13px] text-muted-foreground">
                    {top.menuTypes[0]} · {top.representativeDrinkPrice.toLocaleString()}원~
                  </p>
                </div>
              </article>
            ) : (
              <div className="px-6">{Empty()}</div>
            )}
          </section>
          {list.length > 1 && (
            <section className="px-6 pt-16">
              <div className="mb-5 flex items-end justify-between">
                <h2 className={sectionHeading}>
                  이런 곳도
                  <br />
                  어때요?
                </h2>
                <button
                  className="flex min-h-11 items-center gap-1 text-[14px] font-bold text-primary"
                  onClick={() => nav("explore")}
                >
                  전체 보기
                  <Icon name="arrow" className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-[1.2fr_1fr] items-start gap-3">
                {list.slice(1, 3).map((c, i) => (
                  <article key={c.id} className={i ? "mt-14" : ""}>
                    <div className="relative">
                      <button
                        className="block w-full text-left"
                        onClick={() => open(c.id)}
                        aria-label={`${c.name} 상세 보기`}
                      >
                        <Photo
                          cafe={c}
                          className={`rounded-[6px] ${i ? "aspect-[4/3]" : "aspect-[3/4.3]"}`}
                        />
                      </button>
                      {SaveButton(c, true, true)}
                    </div>
                    <p className="mt-3 font-display text-[24px] leading-none text-primary">
                      {match(c) === undefined ? (
                        <span className="text-[14px]">취향 비교 전</span>
                      ) : (
                        <>
                          {match(c)}%
                          <span className="ml-1.5 font-sans text-[13px] font-bold">
                            취향 일치
                          </span>
                        </>
                      )}
                    </p>
                    <button
                      className="mt-1.5 block text-left"
                      onClick={() => open(c.id)}
                    >
                      <h3 className="font-display text-[19px] leading-snug">
                        {c.name}
                      </h3>
                    </button>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      {c.neighborhood.replace("부산 ", "")} · {c.menuTypes[0]}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section className="mt-16 bg-primary px-6 py-10 text-primary-foreground">
            <p className="text-[13px] font-bold tracking-[0.08em] text-primary-foreground/80">
              MY CAFÉ TASTE
            </p>
            <p className="mt-4 font-display text-[28px] leading-[1.4]">
              {line ? (
                `“${line}”`
              ) : (
                <>
                  나는 어떤
                  <br />
                  카페를 좋아할까?
                </>
              )}
            </p>
            <button
              className="mt-7 min-h-12 rounded-[8px] bg-background px-5 text-[15px] font-bold text-primary"
              onClick={() => nav(hasPrefs ? "profile" : "quiz")}
            >
              {hasPrefs ? "내 취향 보기" : "내 취향 등록하기"}
            </button>
          </section>
          <p className="mt-6 px-6 text-[12px] leading-5 text-muted-foreground">
            부산의 가상 카페 12곳으로 만든 프로토타입이에요.
            <br />
            사진은 분위기 참고용이며 실제 카페와 무관해요.
          </p>
        </main>
      </>
    )
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
        <h1 className="font-display text-[38px] leading-[1.22] tracking-[-0.02em]">
          취향 따라,
          <br />
          <span className="ml-7 text-primary">카페</span> 찾기
        </h1>
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
                  className="flex min-h-9 items-center gap-1 rounded-[6px] bg-accent px-2.5 text-[13px] font-semibold text-primary"
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
                className="flex min-h-9 items-center gap-1 rounded-[6px] bg-accent px-2.5 text-[13px] font-semibold text-primary"
                onClick={() => setFilters({ ...filters, [key]: undefined })}
                aria-label={`${value} 필터 해제`}
              >
                {value}
                <Icon name="close" className="size-3" />
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 pb-8 pt-7">
          <span className="flex items-baseline gap-1 text-[15px]">
            <b className="font-display text-[32px] font-normal leading-none text-primary">
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
          <div className="space-y-12">{list.map((c, i) => Card(c, "list", i))}</div>
        ) : (
          Empty()
        )}
        <p className="mt-10 text-[12px] leading-5 text-muted-foreground">
          일치율은 목적·분위기·공간·좌석·메뉴 기준이에요.
          <br />
          가격·이동반경은 목록 조건으로 반영해요.
        </p>
      </main>
    </>
  )

  const Profile = () => {
    const setCount = QUESTIONS.filter(([key]) => prefs[key]).length
    const line = tasteLine()
    const keywords = (["atmosphere", "space", "seat", "menu"] as const)
      .map((key) => prefs[key])
      .filter(Boolean)
      .slice(0, 3) as string[]
    const R = 88
    const cx = 160
    const cy = 150
    const pt = (i: number, r: number) => {
      const a = ((-90 + i * 60) * Math.PI) / 180
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
    }
    const ring = (f: number) =>
      DIMENSIONS.map((_, i) => pt(i, R * f).join(",")).join(" ")
    const shape = QUESTIONS.map(([key], i) =>
      pt(i, prefs[key] ? R : R * 0.22).join(","),
    ).join(" ")
    return (
      <>
        {Header(
          "내 취향",
          <button
            className="min-h-11 text-[14px] font-bold text-primary"
            onClick={() => nav("settings")}
          >
            설정
          </button>,
        )}
        <main className="pb-32">
          <section className="px-6 pt-2">
            <p className="font-display text-[15px] text-primary">
              MY CAFÉ TASTE
            </p>
            <h1 className="mt-4 font-display text-[36px] leading-[1.3] tracking-[-0.01em]">
              {line ? (
                <>
                  <span className="text-[28px]">나의 카페 취향은</span>
                  <br />
                  <span className="text-primary">“{line}”</span>
                </>
              ) : (
                <>
                  아직 비어 있는
                  <br />
                  <span className="text-primary">나의 취향</span>
                </>
              )}
            </h1>
            {keywords.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {keywords.map((word) => (
                  <span
                    key={word}
                    className="rounded-[6px] bg-primary px-3.5 py-2 font-display text-[17px] text-primary-foreground"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </section>
          <section className="mt-8 bg-secondary px-2 py-6">
            <svg
              viewBox="0 0 320 300"
              className="mx-auto w-full max-w-[360px]"
              role="img"
              aria-label={`여섯 가지 취향 중 ${setCount}가지를 설정했어요`}
            >
              {[1, 0.5].map((f) => (
                <polygon
                  key={f}
                  points={ring(f)}
                  className="fill-none stroke-primary/25"
                  strokeWidth="1.5"
                />
              ))}
              {DIMENSIONS.map((_, i) => (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={pt(i, R)[0]}
                  y2={pt(i, R)[1]}
                  className="stroke-primary/20"
                />
              ))}
              <polygon
                points={shape}
                className="fill-primary/20 stroke-primary"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {QUESTIONS.map(([key], i) => {
                const on = Boolean(prefs[key])
                const [x, y] = pt(i, on ? R : R * 0.22)
                const [lx, ly] = pt(i, R + 30)
                return (
                  <g key={key}>
                    <circle
                      cx={x}
                      cy={y}
                      r={on ? 6 : 4}
                      className={
                        on
                          ? "fill-primary"
                          : "fill-secondary stroke-muted-foreground"
                      }
                    />
                    <text
                      x={lx}
                      y={ly + 5}
                      textAnchor="middle"
                      className={`text-[15px] font-bold ${on ? "fill-primary" : "fill-muted-foreground"}`}
                    >
                      {DIMENSIONS[i]}
                    </text>
                  </g>
                )
              })}
            </svg>
            <p className="-mt-2 text-center text-[13px] text-muted-foreground">
              6가지 중 <b className="text-primary">{setCount}가지</b> 설정
            </p>
          </section>
          <section className="px-6 pt-6">
            {QUESTIONS.map(([key], index) => (
              <button
                key={key}
                className="flex w-full items-center gap-4 border-b border-primary/15 py-4 text-left"
                onClick={() => {
                  setQuiz(index)
                  setScreen("quiz")
                }}
              >
                <span className="w-16 shrink-0 text-[14px] font-semibold text-muted-foreground">
                  {DIMENSIONS[index]}
                </span>
                <span
                  className={`flex-1 ${
                    prefs[key]
                      ? "font-display text-[20px] leading-snug"
                      : "text-[15px] text-muted-foreground"
                  }`}
                >
                  {prefs[key] || "미선택"}
                </span>
                <Icon name="chevron" className="size-4 text-primary" />
              </button>
            ))}
            <button
              className={`${secondary} mt-7 w-full`}
              onClick={() => {
                setQuiz(0)
                setScreen("quiz")
              }}
            >
              취향 수정하기
            </button>
            <button
              className={`${primary} mt-3 flex w-full items-center justify-between`}
              onClick={() => nav("home")}
            >
              나에게 맞는 카페 찾기
              <Icon name="arrow" className="size-4" />
            </button>
          </section>
        </main>
      </>
    )
  }
  const Quiz = () => {
    const [key, question, options] = QUESTIONS[quiz]
    return (
      <main className="flex min-h-[100dvh] flex-col px-6 pb-8 pt-6">
        <div className="flex items-center justify-between text-[14px] font-bold text-primary">
          <button
            className="flex min-h-11 items-center gap-1"
            onClick={() => (quiz ? setQuiz(quiz - 1) : nav("home"))}
          >
            <Icon name="back" className="size-4" />
            이전
          </button>
          <button
            className="min-h-11"
            onClick={() => (quiz < 5 ? setQuiz(quiz + 1) : nav("profile"))}
          >
            건너뛰기
          </button>
        </div>
        <div
          className="mt-2 grid grid-cols-6 gap-1"
          aria-label={`취향 설정 ${quiz + 1}단계, 총 6단계`}
        >
          {QUESTIONS.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-[2px] ${index <= quiz ? "bg-primary" : "bg-accent"}`}
            />
          ))}
        </div>
        <div className="pb-8 pt-10">
          <p className="flex items-baseline gap-2 font-display text-primary">
            <span className="text-[64px] leading-none tabular-nums">
              0{quiz + 1}
            </span>
            <span className="text-[20px]">/ 06</span>
            <span className="ml-auto rounded-[4px] bg-accent px-2.5 py-1 text-[14px]">
              {DIMENSIONS[quiz]}
            </span>
          </p>
          <h1 className="mt-6 font-display text-[36px] leading-[1.35] tracking-[-0.01em] [text-wrap:balance]">
            {question}
          </h1>
        </div>
        <div className="mb-8 space-y-2.5">
          {options.map((option, i) => {
            const on = prefs[key] === option
            return (
              <button
                key={option}
                aria-pressed={on}
                className={`flex min-h-[72px] w-full items-center gap-4 rounded-[10px] border-[1.5px] px-5 text-left font-display text-[21px] transition-all ${
                  on
                    ? "translate-x-1.5 border-primary bg-primary text-primary-foreground"
                    : "border-primary/20 bg-card text-foreground hover:border-primary"
                }`}
                onClick={() => setPrefs({ ...prefs, [key]: option })}
              >
                <span className="w-5 text-[15px] opacity-60">
                  {"ABCD"[i]}
                </span>
                <span className="flex-1">{option}</span>
                {on && <Icon name="check" className="size-5" />}
              </button>
            )
          })}
        </div>
        <button
          disabled={!prefs[key]}
          className={`${primary} mt-auto flex items-center justify-between`}
          onClick={() => (quiz < 5 ? setQuiz(quiz + 1) : nav("profile"))}
        >
          {quiz === 5 ? "내 취향 보기" : "다음"}
          <Icon name="arrow" className="size-4" />
        </button>
        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          취향은 언제든 바꿀 수 있어요.
        </p>
      </main>
    )
  }
  const Saved = () => {
    const items = saved
      .map((id) => cafes.find((c) => c.id === id))
      .filter((c): c is Cafe => Boolean(c))
    return (
      <>
        {Header()}
        <main className="px-6 pb-32">
          <div className="flex items-end justify-between">
            <h1 className="font-display text-[38px] leading-[1.22] tracking-[-0.02em]">
              다시,
              <br />
              <span className="ml-7 text-primary">가고 싶은 곳</span>
            </h1>
            <span className="mb-1 font-display text-[44px] leading-none text-primary">
              {saved.length}
              <span className="ml-0.5 text-[18px]">곳</span>
            </span>
          </div>
          {items.length ? (
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div>{items.filter((_, i) => i % 2 === 0).map((c, i) => Card(c, "tile", i * 2))}</div>
              <div className="pt-12">
                {items.filter((_, i) => i % 2 === 1).map((c, i) => Card(c, "tile", i * 2 + 1))}
              </div>
            </div>
          ) : (
            <div className="mt-10 border-t-2 border-primary py-12">
              <Icon name="saved" className="mb-6 size-10 text-primary" />
              <h2 className="font-display text-[28px] leading-[1.35]">
                첫 번째 카페를
                <br />
                담아보세요
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
                사진 위 저장 버튼을 누르면 여기에 모여요.
              </p>
              <button
                className={`${primary} mt-7`}
                onClick={() => nav("explore")}
              >
                카페 둘러보기
              </button>
            </div>
          )}
          <p className="mt-8 text-[12px] text-muted-foreground">
            저장 목록은 이 브라우저에만 보관돼요.
          </p>
        </main>
      </>
    )
  }
  const Detail = () => {
    if (!cafe) return null
    const isSaved = saved.includes(cafe.id)
    const why = tags(cafe)
    const sec = "px-6 pt-14"
    const secLabel = (n: string, t: string) => (
      <h2 className="flex items-baseline gap-2 font-display text-[16px] text-primary">
        <span className="rounded-[4px] bg-primary px-1.5 py-0.5 text-[12px] text-primary-foreground">
          {n}
        </span>
        {t}
      </h2>
    )
    return (
      <>
        <main className="pb-32">
          <div className="relative">
            <Photo cafe={cafe} className="h-[470px]" eager />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <button
                className="flex size-11 items-center justify-center rounded-[8px] bg-background text-primary"
                onClick={() => nav(tab)}
                aria-label="뒤로 가기"
              >
                <Icon name="back" />
              </button>
              <button
                className="flex min-h-11 items-center gap-1.5 rounded-[8px] bg-background px-3.5 text-[14px] font-bold text-primary"
                aria-pressed={isSaved}
                onClick={() => toggle(cafe.id)}
              >
                <Icon name="saved" className="size-4" />
                {isSaved ? "저장됨" : "저장"}
              </button>
            </div>
            <div className="absolute -bottom-10 left-6">{MatchBlock(cafe)}</div>
          </div>
          <div className="px-6 pt-16">
            <p className="text-[13px] text-muted-foreground">
              {cafe.neighborhood} · 샘플 {cafe.sampleDistance}km
            </p>
            <h1 className="mt-1 font-display text-[40px] leading-[1.2] tracking-[-0.02em]">
              {cafe.name}
            </h1>
          </div>
          <section className="mt-9 bg-primary px-6 py-10 text-primary-foreground">
            <p className="font-display text-[15px] tracking-[0.04em]">
              {match(cafe) === undefined ? "이런 곳이에요" : "WHY KOK?"}
            </p>
            {why.length > 0 && (
              <>
                <p className="mt-5 font-display text-[21px] leading-[1.5]">
                  {why.map((t, i) => (
                    <span key={t}>
                      {i > 0 && (
                        <span className="mx-2 text-primary-foreground/60">+</span>
                      )}
                      {t}
                    </span>
                  ))}
                </p>
                <p aria-hidden="true" className="my-3 text-[22px] text-primary-foreground/70">
                  ↓
                </p>
              </>
            )}
            <p className={`font-display text-[27px] leading-[1.45] ${why.length ? "" : "mt-5"}`}>
              “{reason(cafe)}”
            </p>
            <p className="mt-6 text-[13px] leading-5 text-primary-foreground/80">
              일치율은 선택한 목적·취향 항목으로 계산해요.
              <br />
              가격·거리는 목록 조건으로 반영돼요.
            </p>
          </section>

          <section className={sec}>
            {secLabel("01", "분위기")}
            <div className="mt-4 -mr-6 ml-14">
              <Photo
                cafe={cafe}
                className="aspect-[4/3] rounded-l-[8px]"
                imgClass="scale-[1.75] origin-[78%_72%]"
              />
            </div>
            <div className="relative -mt-12 w-[72%] rounded-[6px] border border-primary/15 bg-card p-4">
              <p className="font-display text-[22px] leading-snug">
                {cafe.atmosphere}
              </p>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {cafe.space} 공간
              </p>
            </div>
          </section>

          <section className={sec}>
            {secLabel("02", "좌석")}
            <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              {cafe.seatTypes.map((s, i) => (
                <span
                  key={s}
                  className={
                    i === 0
                      ? "font-display text-[36px] leading-tight text-primary"
                      : "font-display text-[24px] leading-tight text-foreground/70"
                  }
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-primary/15 pt-3 text-[15px]">
              <span className="mr-3 font-bold text-primary">시설</span>
              {cafe.amenities.length
                ? cafe.amenities.join(" · ")
                : "등록된 시설 정보가 없어요"}
            </p>
          </section>

          <section className={sec}>
            {secLabel("03", "메뉴")}
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[13px] text-muted-foreground">대표 음료</p>
                <p className="font-display text-[46px] leading-none text-primary">
                  {cafe.representativeDrinkPrice.toLocaleString()}
                  <span className="text-[20px]">원~</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {cafe.menuTypes.map((m) => (
                  <span
                    key={m}
                    className="rounded-[6px] border-[1.5px] border-primary px-3 py-1.5 text-[14px] font-bold text-primary"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className={sec}>
            {secLabel("04", "위치")}
            <div className="mt-4">
              <MiniMap />
            </div>
            <p className="mt-4 text-[22px] font-bold">{cafe.sampleHours}</p>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {cafe.samplePosition}
            </p>
            <p className="mt-5 border-l-[3px] border-primary pl-3 text-[14px] leading-6">
              <b className="text-primary">방문 전 확인</b>
              <br />
              {cafe.unknownInfo}
            </p>
            <p className="mt-8 text-[12px] leading-5 text-muted-foreground">
              가상의 카페와 샘플 정보예요.
              <br />
              사진은 분위기 참고용이며 실제 장소와 무관해요.
            </p>
          </section>
        </main>
        <div className="fixed bottom-0 z-20 flex w-full max-w-[440px] gap-3 border-t border-primary/15 bg-background px-6 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
          <button
            className={`${secondary} flex-1 px-2`}
            onClick={() => {
              nav("explore")
              setMap(true)
            }}
          >
            샘플 지도
          </button>
          <button
            className={`${primary} flex-[1.3]`}
            onClick={() => toggle(cafe.id)}
          >
            {isSaved ? "저장 취소하기" : "이 카페 저장하기"}
          </button>
        </div>
      </>
    )
  }
  const Onboard = () => (
    <main className="flex min-h-[100dvh] flex-col">
      <div className="relative">
        <Photo
          cafe={cafes[1]}
          className="h-[52dvh] min-h-[320px] max-h-[500px]"
          eager
        />
        <div className="absolute left-6 top-7 rounded-[6px] bg-background px-3 py-2">
          <Logo className="text-[26px]" />
        </div>
        <span className="absolute -bottom-4 right-6 rounded-[6px] bg-primary px-3 py-2 font-display text-[15px] text-primary-foreground">
          전포 · 광안리 · 서면
        </span>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-7 pt-10">
        <h1 className="font-display text-[42px] leading-[1.25] tracking-[-0.02em]">
          가까운 카페 말고,
          <br />
          <span className="text-primary">나와 맞는</span> 카페.
        </h1>
        <p className="mb-7 mt-4 text-[16px] leading-6 text-muted-foreground">
          분위기, 자리, 오늘의 목적으로 골라요.
        </p>
        <div className="mt-auto space-y-3">
          <button
            className={`${primary} flex w-full items-center justify-between`}
            onClick={() => {
              setQuiz(0)
              setScreen("quiz")
            }}
          >
            내 취향으로 시작하기
            <Icon name="arrow" className="size-4" />
          </button>
          <button className={`${secondary} w-full`} onClick={() => nav("home")}>
            먼저 둘러보기
          </button>
        </div>
        <p className="mt-5 text-[12px] leading-5 text-muted-foreground">
          가상의 카페 12곳 프로토타입 · 사진은 분위기 참고용, 위치·가격은 샘플이에요.
        </p>
      </div>
    </main>
  )
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
          className="fixed bottom-0 z-20 flex w-full max-w-[440px] justify-around border-t border-primary/15 bg-background pb-[max(10px,env(safe-area-inset-bottom))] pt-2"
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
              className={`relative flex min-h-14 min-w-16 flex-col items-center justify-center gap-1.5 text-[12px] ${
                tab === id ? "font-bold text-primary" : "text-muted-foreground"
              }`}
              onClick={() => nav(id)}
            >
              {tab === id && (
                <span className="absolute -top-2 h-[3px] w-9 bg-primary" />
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
