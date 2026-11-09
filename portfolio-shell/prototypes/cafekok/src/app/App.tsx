import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { moodPhotos, type MoodPhotoData } from "../data/moodPhotos"
import cafePhotoSources from "../data/cafePhotoSources.json"
import { getTastePhotos, tastePhotos } from "../data/tastePhotos"
import TasteSlideshow from "./TasteSlideshow"
import DragCarousel from "./DragCarousel"
import { nearestSampleArea } from "../data/location"

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
  { id: "friends", title: "친구와", desc: "함께 머물기 좋은 자리" },
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
  {
    id: "j-5",
    name: "오후의 창",
    neighborhood: "부산 전포",
    image:
      "https://images.unsplash.com/photo-1740813626378-b690093fcbe6?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "조용하고 차분한",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "창가"],
    menuTypes: ["커피", "디저트"],
    representativeDrinkPrice: 4500,
    sampleDistance: 0.4,
    suitablePurposes: ["study", "date"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "09:00 – 20:00",
    samplePosition: "전포 샘플 기준점에서 동쪽 0.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "j-6",
    name: "모서리 서재",
    neighborhood: "부산 전포",
    image:
      "https://images.unsplash.com/photo-1769184618290-3306edcc3b02?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "적당히 활기찬",
    space: "균형 있는",
    seatTypes: ["둘이 앉는 자리", "소파"],
    menuTypes: ["차·논커피", "디저트"],
    representativeDrinkPrice: 4900,
    sampleDistance: 0.9,
    suitablePurposes: ["date", "friends"],
    amenities: ["Wi‑Fi"],
    sampleHours: "10:00 – 21:00",
    samplePosition: "전포 샘플 기준점에서 서쪽 0.9km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "j-7",
    name: "브릭 커먼",
    neighborhood: "부산 전포",
    image:
      "https://images.unsplash.com/photo-1769184613600-1a309a70196b?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "활기찬 공간",
    space: "넓고 개방적인",
    seatTypes: ["여럿이 앉는 자리", "테이블"],
    menuTypes: ["브런치", "커피"],
    representativeDrinkPrice: 5800,
    sampleDistance: 1.4,
    suitablePurposes: ["friends", "drive"],
    amenities: ["주차", "Wi‑Fi"],
    sampleHours: "08:30 – 19:30",
    samplePosition: "전포 샘플 기준점에서 남쪽 1.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "j-8",
    name: "작은 온실",
    neighborhood: "부산 전포",
    image:
      "https://images.unsplash.com/photo-1771673871892-217da71a8a75?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "조용하고 차분한",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "둘이 앉는 자리"],
    menuTypes: ["차·논커피", "브런치"],
    representativeDrinkPrice: 6200,
    sampleDistance: 2.3,
    suitablePurposes: ["study", "date"],
    amenities: ["콘센트"],
    sampleHours: "11:00 – 22:00",
    samplePosition: "전포 샘플 기준점에서 북쪽 2.3km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "j-9",
    name: "느린 로스터리",
    neighborhood: "부산 전포",
    image:
      "https://images.unsplash.com/photo-1760844893062-d68f86c8c0ff?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "적당히 활기찬",
    space: "균형 있는",
    seatTypes: ["둘이 앉는 자리", "여럿이 앉는 자리"],
    menuTypes: ["커피", "브런치", "디저트"],
    representativeDrinkPrice: 7400,
    sampleDistance: 3.4,
    suitablePurposes: ["friends", "date"],
    amenities: ["Wi‑Fi", "주차"],
    sampleHours: "10:00 – 23:00",
    samplePosition: "전포 샘플 기준점에서 동쪽 3.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "j-10",
    name: "포레스트 테이블",
    neighborhood: "부산 전포",
    image:
      "https://images.unsplash.com/photo-1764964048064-a48368fe7c3e?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "활기찬 공간",
    space: "넓고 개방적인",
    seatTypes: ["혼자 앉는 자리", "바 테이블"],
    menuTypes: ["커피", "차·논커피"],
    representativeDrinkPrice: 8500,
    sampleDistance: 4.6,
    suitablePurposes: ["study", "drive"],
    amenities: ["Wi‑Fi", "콘센트", "주차"],
    sampleHours: "12:00 – 24:00",
    samplePosition: "전포 샘플 기준점에서 서쪽 4.6km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "g-5",
    name: "파도와 잔",
    neighborhood: "부산 광안리",
    image:
      "https://images.unsplash.com/photo-1771344143490-87e02ecc75d2?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "적당히 활기찬",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "창가"],
    menuTypes: ["커피", "디저트"],
    representativeDrinkPrice: 4600,
    sampleDistance: 0.4,
    suitablePurposes: ["study", "date"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "09:00 – 20:00",
    samplePosition: "광안리 샘플 기준점에서 동쪽 0.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "g-6",
    name: "모닝 코스트",
    neighborhood: "부산 광안리",
    image:
      "https://images.unsplash.com/photo-1751151015757-5f3aac54d2ad?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "활기찬 공간",
    space: "균형 있는",
    seatTypes: ["둘이 앉는 자리", "소파"],
    menuTypes: ["차·논커피", "디저트"],
    representativeDrinkPrice: 5000,
    sampleDistance: 0.9,
    suitablePurposes: ["date", "friends"],
    amenities: ["Wi‑Fi"],
    sampleHours: "10:00 – 21:00",
    samplePosition: "광안리 샘플 기준점에서 서쪽 0.9km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "g-7",
    name: "샌드 베이크",
    neighborhood: "부산 광안리",
    image:
      "https://images.unsplash.com/photo-1777709352854-ca94b4564d22?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "조용하고 차분한",
    space: "넓고 개방적인",
    seatTypes: ["여럿이 앉는 자리", "테이블"],
    menuTypes: ["브런치", "커피"],
    representativeDrinkPrice: 5900,
    sampleDistance: 1.4,
    suitablePurposes: ["friends", "drive"],
    amenities: ["주차", "Wi‑Fi"],
    sampleHours: "08:30 – 19:30",
    samplePosition: "광안리 샘플 기준점에서 남쪽 1.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "g-8",
    name: "해질녘 다락",
    neighborhood: "부산 광안리",
    image:
      "https://images.unsplash.com/photo-1762770622112-4a708ce0d731?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "적당히 활기찬",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "둘이 앉는 자리"],
    menuTypes: ["차·논커피", "브런치"],
    representativeDrinkPrice: 6300,
    sampleDistance: 2.3,
    suitablePurposes: ["study", "date"],
    amenities: ["콘센트"],
    sampleHours: "11:00 – 22:00",
    samplePosition: "광안리 샘플 기준점에서 북쪽 2.3km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "g-9",
    name: "블루 가든",
    neighborhood: "부산 광안리",
    image:
      "https://images.unsplash.com/photo-1748369745378-7ea545d386d7?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "활기찬 공간",
    space: "균형 있는",
    seatTypes: ["둘이 앉는 자리", "여럿이 앉는 자리"],
    menuTypes: ["커피", "브런치", "디저트"],
    representativeDrinkPrice: 7500,
    sampleDistance: 3.4,
    suitablePurposes: ["friends", "date"],
    amenities: ["Wi‑Fi", "주차"],
    sampleHours: "10:00 – 23:00",
    samplePosition: "광안리 샘플 기준점에서 동쪽 3.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "g-10",
    name: "코럴 살롱",
    neighborhood: "부산 광안리",
    image:
      "https://images.unsplash.com/photo-1771532447027-e826e58cc93d?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "조용하고 차분한",
    space: "넓고 개방적인",
    seatTypes: ["혼자 앉는 자리", "바 테이블"],
    menuTypes: ["커피", "차·논커피"],
    representativeDrinkPrice: 8600,
    sampleDistance: 4.6,
    suitablePurposes: ["study", "drive"],
    amenities: ["Wi‑Fi", "콘센트", "주차"],
    sampleHours: "12:00 – 24:00",
    samplePosition: "광안리 샘플 기준점에서 서쪽 4.6km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "s-5",
    name: "사이 골목",
    neighborhood: "부산 서면",
    image:
      "https://images.unsplash.com/photo-1772521341005-04ee0a9286d3?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "활기찬 공간",
    space: "균형 있는",
    seatTypes: ["혼자 앉는 자리", "창가"],
    menuTypes: ["커피", "디저트"],
    representativeDrinkPrice: 4700,
    sampleDistance: 0.4,
    suitablePurposes: ["study", "date"],
    amenities: ["Wi‑Fi", "콘센트"],
    sampleHours: "09:00 – 20:00",
    samplePosition: "서면 샘플 기준점에서 동쪽 0.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "s-6",
    name: "페이지 원",
    neighborhood: "부산 서면",
    image:
      "https://images.unsplash.com/photo-1768400777008-148b0aae6346?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "조용하고 차분한",
    space: "넓고 개방적인",
    seatTypes: ["둘이 앉는 자리", "소파"],
    menuTypes: ["차·논커피", "디저트"],
    representativeDrinkPrice: 5100,
    sampleDistance: 0.9,
    suitablePurposes: ["date", "friends"],
    amenities: ["Wi‑Fi"],
    sampleHours: "10:00 – 21:00",
    samplePosition: "서면 샘플 기준점에서 서쪽 0.9km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "s-7",
    name: "테라스 모닝",
    neighborhood: "부산 서면",
    image:
      "https://images.unsplash.com/photo-1761695939616-1c03087c1ce4?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "적당히 활기찬",
    space: "아늑하고 작은",
    seatTypes: ["여럿이 앉는 자리", "테이블"],
    menuTypes: ["브런치", "커피"],
    representativeDrinkPrice: 6000,
    sampleDistance: 1.4,
    suitablePurposes: ["friends", "drive"],
    amenities: ["주차", "Wi‑Fi"],
    sampleHours: "08:30 – 19:30",
    samplePosition: "서면 샘플 기준점에서 남쪽 1.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "s-8",
    name: "라이트 커먼",
    neighborhood: "부산 서면",
    image:
      "https://images.unsplash.com/photo-1781786047465-6fb2eb2815d8?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "활기찬 공간",
    space: "균형 있는",
    seatTypes: ["혼자 앉는 자리", "둘이 앉는 자리"],
    menuTypes: ["차·논커피", "브런치"],
    representativeDrinkPrice: 6400,
    sampleDistance: 2.3,
    suitablePurposes: ["study", "date"],
    amenities: ["콘센트"],
    sampleHours: "11:00 – 22:00",
    samplePosition: "서면 샘플 기준점에서 북쪽 2.3km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "s-9",
    name: "버터 스튜디오",
    neighborhood: "부산 서면",
    image:
      "https://images.unsplash.com/photo-1774684047575-34200538f435?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "조용하고 차분한",
    space: "넓고 개방적인",
    seatTypes: ["둘이 앉는 자리", "여럿이 앉는 자리"],
    menuTypes: ["커피", "브런치", "디저트"],
    representativeDrinkPrice: 7600,
    sampleDistance: 3.4,
    suitablePurposes: ["friends", "date"],
    amenities: ["Wi‑Fi", "주차"],
    sampleHours: "10:00 – 23:00",
    samplePosition: "서면 샘플 기준점에서 동쪽 3.4km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
  {
    id: "s-10",
    name: "밤의 서가",
    neighborhood: "부산 서면",
    image:
      "https://images.unsplash.com/photo-1767522248372-67930aef699f?auto=format&fit=crop&w=1000&q=80",
    atmosphere: "적당히 활기찬",
    space: "아늑하고 작은",
    seatTypes: ["혼자 앉는 자리", "바 테이블"],
    menuTypes: ["커피", "차·논커피"],
    representativeDrinkPrice: 8700,
    sampleDistance: 4.6,
    suitablePurposes: ["study", "drive"],
    amenities: ["Wi‑Fi", "콘센트", "주차"],
    sampleHours: "12:00 – 24:00",
    samplePosition: "서면 샘플 기준점에서 서쪽 4.6km",
    unknownInfo: "혼잡도와 좌석 가능 여부는 방문 전 확인이 필요해요.",
  },
]
function menuItems(cafe: Cafe) {
  const options: Record<string, string[]> = {
    커피: ["아메리카노", "카페 라떼", "바닐라 라떼", "카푸치노", "콜드브루"],
    "차·논커피": ["허브티", "밀크티", "레몬 에이드", "초콜릿 라떼", "과일차"],
    디저트: ["치즈 케이크", "크루아상", "초콜릿 케이크", "스콘", "쿠키"],
    브런치: ["브런치 플레이트", "프렌치 토스트", "샌드위치", "샐러드", "수프"],
  }
  const names = options[cafe.menuTypes[0]] || options["커피"]
  return names.map((name, index) => ({
    name,
    price: cafe.representativeDrinkPrice + [0, 500, 1000, 1200, 1500][index],
  }))
}

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
const primary = "btn-primary"
const secondary = "btn-secondary"
const heading = "page-title"

function Logo({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span
      className={`cafekok-logo inline-flex items-center font-sans font-[850] leading-none tracking-[-0.065em] text-primary ${className}`}
    >
      <span>CAFÉ</span>
      <span className="cafekok-logo-mark ml-[0.18em] rounded-[3px] bg-primary px-[0.24em] pb-[0.14em] pt-[0.12em] font-[800] tracking-[-0.055em] text-primary-foreground">
        KOK
      </span>
    </span>
  )
}

const MAP_BOUNDS: Record<string, string> = {
  "부산 전포": "129.048,35.147,129.081,35.166",
  "부산 광안리": "129.101,35.143,129.135,35.162",
  "부산 서면": "129.042,35.149,129.075,35.168",
}
function areaMapUrl(region: string) {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BOUNDS[region] || MAP_BOUNDS["부산 전포"]}&layer=mapnik`
}
function MiniMap({ region, hours }: { region: string; hours: string }) {
  return (
    <div className="sample-map detail-map">
      <iframe
        className="sample-map-frame"
        title={`${region} 지역 지도`}
        src={areaMapUrl(region)}
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
      />
      <span className="sample-map-label">{region} · 정확한 위치 정보 없음</span>
      <div className="map-info-overlay">
        <p>
          <span>영업시간</span>
          <strong>{hours}</strong>
        </p>
        <p>
          <span>전화번호</span>
          <strong>정보 없음</strong>
        </p>
      </div>
      <a
        className="sample-map-attribution"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap 기여자
      </a>
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
  const icons: Record<string, string> = {
    home: "house",
    search: "search",
    explore: "search",
    saved: "bookmark",
    profile: "user-round",
    arrow: "arrow-right",
    back: "chevron-left",
    chevron: "chevron-right",
    down: "chevron-down",
    check: "check",
    close: "x",
    map: "map",
    pin: "map-pin",
    filter: "sliders-horizontal",
    settings: "settings",
    study: "book-open",
    date: "heart",
    friends: "users",
    drive: "car",
    coffee: "coffee",
    edit: "pencil-line",
    bean: "coffee-bean",
    bell: "bell",
  }
  const mask = `url("/work/cafekok/prototype/icons/${icons[name] || "coffee"}.svg") center / contain no-repeat`
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{ backgroundColor: "currentColor", mask, WebkitMask: mask }}
    />
  )
}

function MoodPhoto({
  photo,
  className = "",
  eager = false,
}: {
  photo: MoodPhotoData
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`overflow-hidden bg-secondary ${className}`}>
      <img
        src={failed ? photo.fallback : photo.src}
        alt={failed ? "카페 분위기 참고 사진" : photo.alt}
        className="h-full w-full object-cover"
        loading={eager ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function OnboardCover() {
  return (
    <div className="onboard-cover">
      <div
        className="absolute inset-0"
        role="img"
        aria-label="햇살이 드는 카페와 아늑한 카페의 분위기 사진"
      >
        {[moodPhotos.sunlit, moodPhotos.cozy, moodPhotos.green].map(
          (photo, index) => (
            <div
              key={photo.src}
              className="home-hero-slide"
              style={{ animationDelay: `${[0, -12, -6][index]}s` }}
              aria-hidden="true"
            >
              <MoodPhoto photo={photo} className="h-full w-full" eager />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function HomeBanner() {
  return (
    <section className="home-hero" aria-label="오늘의 카페 영감">
      <div className="page-intro">
        <h1 className="home-banner">
          오늘은 어떤 카페가
          <br />
          끌리나요?
        </h1>
        <p className="page-subtitle">잠깐의 쉼도, 나의 취향대로.</p>
      </div>
      <div
        className="home-hero-photos"
        role="img"
        aria-label="서로 다른 분위기의 카페 사진"
      >
        {[moodPhotos.sunlit, moodPhotos.cozy, moodPhotos.green].map(
          (photo, index) => (
            <div
              key={photo.src}
              className="home-hero-slide"
              style={{ animationDelay: `${[0, -12, -6][index]}s` }}
              aria-hidden="true"
            >
              <MoodPhoto photo={photo} className="h-full w-full" eager />
            </div>
          ),
        )}
      </div>
    </section>
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
            className={`h-full w-full object-cover ${imgClass}`}
            src={cafe.image}
            alt={`${cafe.name} 분위기 참고 사진 · 실제 카페 사진이 아닙니다`}
            loading={eager ? "eager" : "lazy"}
            onError={() => setFailed(true)}
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
      className={`modal-backdrop ${sheet ? "is-sheet" : ""}`}
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
        className={`modal-panel ${sheet ? "is-sheet" : ""}`}
      >
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [screen, setScreen] = useState<Screen>(new URLSearchParams(window.location.search).get("preview") === "home" ? "home" : "onboard")
  const [tab, setTab] = useState<Screen>("home")
  const [prefs, setPrefs] = useState<Prefs>({})
  const [purpose, setPurpose] = useState<Purpose | undefined>()
  const [region, setRegion] = useState("부산 전포")
  const [locationState, setLocationState] =
    useState<"idle" | "loading" | "ready">("idle")
  const [locationLabel, setLocationLabel] = useState("현재 위치로 설정")
  const [locationMessage, setLocationMessage] = useState("")
  const locationRequest = useRef(0)
  const [saved, setSaved] = useState<string[]>([])
  const [quiz, setQuiz] = useState(0)
  const [detail, setDetail] = useState<string | undefined>()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("추천순")
  const [map, setMap] = useState(false)
  const [filters, setFilters] = useState<Prefs>({})
  const [sheet, setSheet] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [editingTaste, setEditingTaste] = useState<number | null>(null)
  const [toast, setToast] = useState("")
  const [storageError, setStorageError] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    // Every new visit starts with empty prototype state. Ignore legacy answers.
    try {
      localStorage.removeItem("cafekok-state")
    } catch {
      /* State stays in memory even when storage is unavailable. */
    }
    try {
      setNotificationsEnabled(
        localStorage.getItem("cafekok-notifications") === "on" &&
          "Notification" in window &&
          Notification.permission === "granted",
      )
    } catch {
      /* Notifications remain off for this visit. */
    }
    setLoaded(true)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [screen, map, quiz, detail])

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
    if (
      !exists &&
      notificationsEnabled &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        const name = cafes.find((c) => c.id === id)?.name || "카페"
        new Notification("카페콕", { body: `${name}을 저장했어요.` })
      } catch {
        setNotificationMessage(
          "이 브라우저에서는 기기 알림을 표시할 수 없어요.",
        )
      }
    }
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
  const matchLabel = (c: Cafe) =>
    match(c) === undefined ? "취향 비교 전" : `${match(c)}% 취향 일치`
  const resetConditions = () => {
    setFilters({})
    setQuery("")
    setPrefs({ ...prefs, price: undefined, distance: undefined })
  }

  const setCurrentLocation = () => {
    if (locationState === "loading") return
    if (!window.isSecureContext || !("geolocation" in navigator)) {
      setLocationMessage("이 브라우저에서는 현재 위치를 사용할 수 없어요.")
      return
    }
    const request = ++locationRequest.current
    setLocationState("loading")
    setLocationMessage("")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (request !== locationRequest.current) return
        const area = nearestSampleArea(
          position.coords.latitude,
          position.coords.longitude,
        )
        setLocationState("ready")
        if (area) {
          setRegion(area)
          setLocationLabel(`현재 위치 · ${area.replace("부산 ", "")}`)
          setLocationMessage("선택한 지역의 카페를 보여드려요.")
        } else {
          setLocationLabel("현재 위치 설정됨")
          setLocationMessage(
            "현재 위치는 제공 지역 밖이에요. 부산 지역을 보여드려요.",
          )
        }
      },
      (error) => {
        if (request !== locationRequest.current) return
        setLocationState("idle")
        setLocationLabel("현재 위치로 설정")
        setLocationMessage(
          error.code === 1
            ? "위치 권한이 꺼져 있어요. 브라우저에서 허용한 뒤 다시 눌러주세요."
            : error.code === 3
              ? "위치 확인 시간이 길어지고 있어요. 다시 눌러주세요."
              : "현재 위치를 확인하지 못했어요. 다시 눌러주세요.",
        )
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }
  const BellButton = () => (
    <button
      type="button"
      aria-label="알림 설정"
      aria-haspopup="dialog"
      onClick={() => setNotificationsOpen(true)}
      className="icon-button"
    >
      <Icon name="bell" />
    </button>
  )
  const Header = (title?: string) => (
    <header className="app-header">
      <button
        type="button"
        className="header-brand brand-button"
        aria-label={quizCompleted ? "CAFÉKOK 홈" : "CAFÉKOK 첫 화면"}
        onClick={() => nav(quizCompleted ? "home" : "onboard")}
      >
        <Logo className="text-[24px]" />
      </button>
      <div className="header-actions">
        <button
          type="button"
          className="icon-button"
          aria-label="설정"
          aria-current={screen === "settings" ? "page" : undefined}
          onClick={() => nav("settings")}
        >
          <Icon name="settings" />
        </button>
        <BellButton />
      </div>
      {!title && (
        <div className="header-location">
          <Icon name="pin" className="size-4" />
          <button
            type="button"
            className="location-button"
            disabled={locationState === "loading"}
            aria-label="현재 위치로 탐색 지역 설정"
            aria-busy={locationState === "loading"}
            onClick={setCurrentLocation}
          >
            {locationState === "loading" ? "위치 확인 중…" : locationLabel}
          </button>
          {locationMessage && (
            <p className="location-message" role="status">
              {locationMessage}
            </p>
          )}
        </div>
      )}
    </header>
  )
  const SaveButton = (c: Cafe, photo = true) => (
    <button
      type="button"
      aria-label={`${c.name} ${saved.includes(c.id) ? "저장 취소" : "저장"}`}
      aria-pressed={saved.includes(c.id)}
      onClick={() => toggle(c.id)}
      className={`icon-button save-button ${photo ? "on-photo" : ""}`}
    >
      <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        fill={saved.includes(c.id) ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      >
        <path d="M6 3h12v18l-6-4-6 4Z" />
      </svg>
    </button>
  )
  const MatchBlock = (c: Cafe) => {
    const m = match(c)
    if (m === undefined) return null
    const tone = m >= 75 ? "matcha" : m >= 40 ? "oat" : "blue-gray"
    return (
      <span
        className={`match-badge match-badge--${tone}`}
        aria-label={`취향 일치 ${m}%`}
      >
        <b>{m}%</b>
      </span>
    )
  }
  const Card = (c: Cafe, mode: "list" | "tile" = "list") => (
    <article
      key={c.id}
      className={`cafe-card ${mode === "tile" ? "cafe-card-small" : ""}`}
    >
      <div className="relative">
        <button
          className="photo-button"
          onClick={() => open(c.id)}
          aria-label={`${c.name} 상세 보기`}
        >
          <Photo cafe={c} className="cafe-card-photo" />
        </button>
        {SaveButton(c)}
        <div className="photo-badge">{MatchBlock(c)}</div>
      </div>
      <div className="cafe-card-body">
        <p className="cafe-card-meta">
          {c.neighborhood.replace("부산 ", "")} · {c.menuTypes[0]}
        </p>
        <button className="cafe-card-name" onClick={() => open(c.id)}>
          <h3>{c.name}</h3>
        </button>
        <p className="cafe-card-price">
          {c.representativeDrinkPrice.toLocaleString()}원~
        </p>
        {mode === "list" && <p className="cafe-card-note">{reason(c, 1)}</p>}
      </div>
    </article>
  )

  const Empty = () => (
    <div className="empty-state">
      <Icon name="coffee" className="size-8" />
      <h2 className="section-title">맞는 카페가 아직 없어요</h2>
      <p className="page-subtitle">검색어나 거리·가격 조건을 넓혀보세요.</p>
      <button className={secondary} onClick={resetConditions}>
        검색·조건 초기화
      </button>
    </div>
  )
  const PurposeButtons = (compact = false) => (
    <div className={compact ? "purpose-strip no-scrollbar" : "purpose-grid"}>
      {PURPOSES.map((p) => (
        <button
          key={p.id}
          aria-pressed={purpose === p.id}
          onClick={() => setPurpose(purpose === p.id ? undefined : p.id)}
          className={compact ? "purpose-chip" : "purpose-option"}
        >
          <span className="purpose-icon">
            <Icon name={p.id} />
          </span>
          <span className="purpose-label">{p.title}</span>
        </button>
      ))}
    </div>
  )

  const Home = () => {
    const eligible = cafes.filter(
      (c) =>
        c.neighborhood === region &&
        c.representativeDrinkPrice <= priceLimit(prefs.price) &&
        c.sampleDistance <= distLimit(prefs.distance),
    )
    const picks = [...eligible].sort(
      (a, b) => score(b) - score(a) || a.sampleDistance - b.sampleDistance,
    )
    const moodOrder = ["조용하고 차분한", "적당히 활기찬", "활기찬 공간"]
    const referenceMood = prefs.atmosphere || picks[0]?.atmosphere
    const referenceSpace = prefs.space || picks[0]?.space
    const novelty = (c: Cafe) =>
      Math.abs(
        moodOrder.indexOf(c.atmosphere) -
          moodOrder.indexOf(referenceMood || ""),
      ) *
        3 +
      (c.space !== referenceSpace ? 1 : 0)
    const discoveries = eligible
      .filter(
        (c) => c.atmosphere !== referenceMood || c.space !== referenceSpace,
      )
      .sort((a, b) => novelty(b) - novelty(a) || score(a) - score(b))

    const hasPrefs = Object.values(prefs).some(Boolean)
    return (
      <>
        {Header()}
        <main className="home-screen pb-32">
          <HomeBanner />
          <section
            aria-label="오늘의 방문 목적"
            className="section-block purpose-section"
          >
            <h2 className="section-title">오늘은 어떤 목적으로 가세요?</h2>
            {PurposeButtons()}
          </section>
          <section
            className="section-block picks-section"
            aria-labelledby="today-picks-title"
          >
            <div className="section-heading">
              <h2 id="today-picks-title" className="section-title">
                {hasPrefs || purpose
                  ? "내 취향에 맞는 카페"
                  : "추천 카페를 둘러보세요"}
              </h2>
            </div>
            {picks.length ? (
              <DragCarousel
                className="home-picks"
                label="취향 추천 카페, 드래그 또는 좌우 방향키로 넘겨보기"
              >
                {picks.map((c) => (
                  <article key={c.id} className="cafe-card home-pick-card">
                    <div className="relative">
                      <button
                        className="photo-button"
                        onClick={() => open(c.id)}
                        aria-label={`${c.name} 상세 보기`}
                      >
                        <Photo cafe={c} className="cafe-card-photo" />
                      </button>
                      {SaveButton(c)}
                      <div className="photo-badge">{MatchBlock(c)}</div>
                    </div>
                    <div className="cafe-card-body">
                      <p className="cafe-card-meta">
                        {c.neighborhood} · {c.menuTypes[0]}
                      </p>
                      <button
                        className="cafe-card-name"
                        onClick={() => open(c.id)}
                      >
                        <h3>{c.name}</h3>
                      </button>
                      <p className="cafe-card-note">{reason(c, 1)}</p>
                      <p className="cafe-card-price">
                        {c.representativeDrinkPrice.toLocaleString()}원~
                      </p>
                    </div>
                  </article>
                ))}
              </DragCarousel>
            ) : (
              <div className="empty-state">
                <p>이 지역에 예산과 이동 범위가 맞는 카페가 없어요.</p>
                <button className={secondary} onClick={() => nav("profile")}>
                  취향 조건 수정하기
                </button>
              </div>
            )}
          </section>
          <section
            className="section-block discoveries-section"
            aria-labelledby="discover-title"
          >
            <div className="section-heading">
              <h2 id="discover-title" className="section-title">
                다른 분위기의 카페도 만나보세요
              </h2>
            </div>
            {discoveries.length ? (
              <DragCarousel
                className="discovery-carousel"
                label="다른 분위기의 카페, 드래그 또는 좌우 방향키로 넘겨보기"
              >
                {discoveries.map((c) => (
                  <article key={c.id} className="cafe-card">
                    <div className="relative">
                      <button
                        className="photo-button"
                        onClick={() => open(c.id)}
                        aria-label={`${c.name} 상세 보기`}
                      >
                        <Photo cafe={c} className="cafe-card-photo" />
                      </button>
                      {SaveButton(c)}
                    </div>
                    <div className="cafe-card-body">
                      <p className="cafe-card-meta">
                        {c.neighborhood.replace("부산 ", "")}
                      </p>
                      <button
                        className="cafe-card-name"
                        onClick={() => open(c.id)}
                      >
                        <h3>{c.name}</h3>
                      </button>
                      <p className="cafe-card-meta">{c.atmosphere}</p>
                    </div>
                  </article>
                ))}
              </DragCarousel>
            ) : (
              <p className="metadata">
                지금 조건에 다른 분위기의 카페가 없어요.
                <br />
                지역이나 취향 조건을 바꿔보세요.
              </p>
            )}
          </section>
          <section
            className="community-browse"
            aria-labelledby="community-browse-title"
          >
            <h2 id="community-browse-title" className="section-title">
              다양한 카페를 둘러보세요
            </h2>
            <div className="community-buttons">
              <button type="button" className="community-button">
                <Icon name="friends" />
                <span>인기순</span>
              </button>
              <button type="button" className="community-button">
                <Icon name="saved" />
                <span>저장순</span>
              </button>
              <button type="button" className="community-button">
                <Icon name="coffee" />
                <span>최근 오픈</span>
              </button>
            </div>
          </section>
        </main>
      </>
    )
  }

  const Map = () => {
    const pins = [
      [18, 22],
      [52, 14],
      [73, 26],
      [31, 40],
      [61, 46],
      [12, 61],
      [42, 65],
      [73, 68],
      [24, 79],
      [57, 82],
    ]
    const mapUrl = areaMapUrl(region)
    return (
      <div>
        <div className="sample-map">
          <iframe
            className="sample-map-frame"
            title={`${region} 주변 지도`}
            src={mapUrl}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
          />
          <span className="sample-map-label">
            {region.replace("부산 ", "")} · 위치 미확인
          </span>
          {list.map((c, index) => (
            <button
              key={c.id}
              aria-label={`${c.name} 상세 보기 · 위치는 임의 배치`}
              className="map-marker"
              style={{
                left: `${pins[index % pins.length][0]}%`,
                top: `${pins[index % pins.length][1]}%`,
              }}
              onClick={() => open(c.id)}
            >
              {index + 1}
            </button>
          ))}
          <a
            className="sample-map-attribution"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            © OpenStreetMap 기여자
          </a>
        </div>

        {list.length ? (
          <div className="map-results">
            {list.map((c, index) => (
              <button
                key={c.id}
                className="map-result"
                onClick={() => open(c.id)}
              >
                <span className="w-5 text-[14px] text-muted-foreground">
                  {index + 1}
                </span>
                <Photo cafe={c} className="size-16 shrink-0 rounded-[6px]" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[18px]">{c.name}</h3>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {matchLabel(c)}
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
  }
  const Explore = () => (
    <>
      {Header()}
      <main className="explore-screen pb-32" aria-label="카페 탐색">
        <div className="search-field">
          <Icon name="search" />
          <input
            aria-label="카페 이름 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="카페 이름으로 검색"
          />
          {query && (
            <button
              className="icon-button"
              aria-label="검색어 지우기"
              onClick={() => setQuery("")}
            >
              <Icon name="close" />
            </button>
          )}
          <button
            className="icon-button"
            aria-label="카페 필터"
            aria-haspopup="dialog"
            onClick={() => setSheet(true)}
          >
            <Icon name="filter" />
          </button>
        </div>
        {PurposeButtons(true)}
        {(prefs.price || prefs.distance || activeFilters.length > 0) && (
          <div className="filter-chips">
            {["price", "distance"]
              .filter((key) => prefs[key])
              .map((key) => (
                <button
                  key={key}
                  className="purpose-chip"
                  onClick={() => setPrefs({ ...prefs, [key]: undefined })}
                  aria-label={`${prefs[key]} 취향 조건 해제`}
                >
                  {prefs[key]}
                  <Icon name="close" className="size-4" />
                </button>
              ))}
            {activeFilters.map(([key, value]) => (
              <button
                key={key}
                className="purpose-chip"
                onClick={() => setFilters({ ...filters, [key]: undefined })}
                aria-label={`${value} 필터 해제`}
              >
                {value}
                <Icon name="close" className="size-4" />
              </button>
            ))}
          </div>
        )}
        <div className="explore-controls">
          <p className="metadata">
            카페 <b>{list.length}</b>곳
          </p>
          <div className="explore-control-actions">
            <button
              className="purpose-chip"
              aria-pressed={map}
              onClick={() => setMap(!map)}
            >
              <Icon name={map ? "home" : "map"} />
              {map ? "목록" : "지도"}
            </button>
            <select
              aria-label="카페 정렬"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {["추천순", "가까운 순", "가격 낮은 순"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        {map ? (
          Map()
        ) : list.length ? (
          <div className="card-grid">{list.map((c) => Card(c, "tile"))}</div>
        ) : (
          Empty()
        )}
        <p className="metadata mt-8">
          일치율은 목적·분위기·공간·좌석·메뉴 기준이에요.
          <br />
          가격과 이동반경은 검색 조건에 반영해요.
        </p>
      </main>
    </>
  )

  const Profile = () => {
    const keywords = (["atmosphere", "space", "seat", "menu"] as const)
      .map((key) => prefs[key])
      .filter(Boolean) as string[]
    const photos = getTastePhotos(prefs)
    return (
      <>
        {Header("내 취향")}
        <main className="profile-screen">
          <section className="profile-summary">
            <div className="profile-summary-copy">
              <p className="eyebrow">MY CAFÉ TASTE</p>
              <h1 className="page-title">나의 카페 취향</h1>
              {keywords.length > 0 && (
                <div className="taste-keywords">
                  {keywords.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </div>
              )}
            </div>
            <TasteSlideshow
              key={photos.map((photo) => photo.src).join("|")}
              photos={photos}
            />
          </section>
          <section className="taste-fields" aria-label="항목별 취향 수정">
            {QUESTIONS.map(([key], index) => (
              <button
                key={key}
                className="taste-field"
                aria-haspopup="dialog"
                aria-label={`${DIMENSIONS[index]}: ${prefs[key] || "미선택"}. 수정하기`}
                onClick={() => setEditingTaste(index)}
              >
                <span>{DIMENSIONS[index]}</span>
                <strong>{prefs[key] || "미선택"}</strong>
                <Icon name="edit" />
              </button>
            ))}
          </section>
        </main>
      </>
    )
  }
  const Quiz = () => {
    const [key, question, options] = QUESTIONS[quiz]
    return (
      <main className="quiz-screen">
        <header className="quiz-header">
          <button
            className="brand-button"
            aria-label={quizCompleted ? "CAFÉKOK 홈" : "CAFÉKOK 첫 화면"}
            onClick={() => nav(quizCompleted ? "home" : "onboard")}
          >
            <Logo className="text-[24px]" />
          </button>
        </header>
        <div
          className="quiz-progress"
          aria-label={`취향 설정 ${quiz + 1}단계, 총 6단계`}
        >
          {QUESTIONS.map((_, index) => (
            <span key={index} className={index <= quiz ? "is-complete" : ""} />
          ))}
        </div>
        <div className="quiz-intro">
          <p className="quiz-step">{String(quiz + 1).padStart(2, "0")} / 06</p>
          <h1 className="page-title">{question}</h1>
        </div>
        <div className="quiz-options">
          {options.map((option, i) => (
            <button
              key={option}
              aria-pressed={prefs[key] === option}
              className="choice-option"
              onClick={() => setPrefs({ ...prefs, [key]: option })}
            >
              <span className="choice-letter">{"ABCD"[i]}</span>
              <span>{option}</span>
              <span className="choice-check">
                {prefs[key] === option && <Icon name="check" />}
              </span>
            </button>
          ))}
        </div>
        <div className="quiz-footer">
          <p className="metadata">취향은 언제든 바꿀 수 있어요.</p>
          <div className="quiz-navigation">
            <button
              type="button"
              className={secondary}
              disabled={quiz === 0}
              onClick={() => setQuiz((previous) => Math.max(0, previous - 1))}
            >
              <Icon name="back" />
              이전
            </button>
            <button
              disabled={!prefs[key]}
              className={primary}
              onClick={() => {
                if (quiz < QUESTIONS.length - 1) setQuiz(quiz + 1)
                else {
                  setQuizCompleted(true)
                  nav("profile")
                }
              }}
            >
              {quiz === 5 ? "내 취향 보기" : "다음"}
              <Icon name="arrow" />
            </button>
          </div>
        </div>
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
        <main className="saved-screen pb-32">
          <div className="page-intro">
            <h1 className="page-title">저장한 카페</h1>
            <p className="page-subtitle">마음에 담은 카페 {saved.length}곳</p>
          </div>
          {items.length ? (
            <div className="card-grid">{items.map((c) => Card(c, "tile"))}</div>
          ) : (
            <div className="empty-state">
              <Icon name="saved" className="size-8" />
              <h2 className="section-title">첫 번째 카페를 담아보세요</h2>
              <p className="page-subtitle">
                사진 위 저장 버튼을 누르면
                <br />
                마음에 드는 공간이 여기에 모여요.
              </p>
              <button className={primary} onClick={() => nav("explore")}>
                카페 둘러보기
              </button>
            </div>
          )}
          <p className="metadata mt-8">저장 목록은 새로고침하면 초기화돼요.</p>
        </main>
      </>
    )
  }

  const Detail = () => {
    if (!cafe) return null
    const isSaved = saved.includes(cafe.id)
    const why = tags(cafe)
    return (
      <>
        <main className="detail-screen pb-32">
          <div className="detail-toolbar">
            <button
              className="icon-button"
              onClick={() => nav(tab)}
              aria-label="뒤로 가기"
            >
              <Icon name="back" />
            </button>
            <span className="detail-toolbar-title">{cafe.name}</span>
            {SaveButton(cafe, false)}
          </div>
          <div className="detail-hero">
            <Photo cafe={cafe} className="aspect-square" eager />
            <div className="photo-badge">{MatchBlock(cafe)}</div>
          </div>
          <div className="detail-summary">
            <p className="metadata">
              {cafe.neighborhood} · {cafe.menuTypes[0]}
            </p>
            <h1 className="page-title">{cafe.name}</h1>
          </div>
          <section className="detail-reason">
            <Icon name="date" className="detail-ornament" />
            <h2 className="section-title">
              {match(cafe) === undefined
                ? "이런 공간이에요"
                : "이 카페를 고른 이유"}
            </h2>
            <p>{reason(cafe)}</p>
            {why.length > 0 && (
              <div className="detail-tags">
                {why.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
          </section>
          <section className="detail-section detail-interior-section">
            <h2 className="detail-section-title">카페 내부</h2>
            <Photo
              cafe={cafe}
              className="detail-interior-photo"
              imgClass="detail-interior-crop"
            />
          </section>
          <section className="detail-section detail-menu-section">
            <h2 className="detail-section-title">메뉴</h2>
            <ul className="detail-menu-list">
              {menuItems(cafe).map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <span className="menu-dots" aria-hidden="true" />
                  <span>{item.price.toLocaleString()}원</span>
                </li>
              ))}
            </ul>
            <div className="menu-more-row">
              <button type="button" className="menu-more">
                메뉴 더보기 <Icon name="chevron" className="size-4" />
              </button>
            </div>
          </section>
          <section className="detail-section detail-map-section">
            <h2 className="detail-section-title">카페 위치</h2>
            <MiniMap region={cafe.neighborhood} hours={cafe.sampleHours} />
          </section>
        </main>
        <div className="detail-actions">
          <button
            className={secondary}
            onClick={() => {
              nav("explore")
              setMap(true)
            }}
          >
            <Icon name="map" />
            지도 보기
          </button>
          <button className={primary} onClick={() => toggle(cafe.id)}>
            <Icon name={isSaved ? "check" : "saved"} />
            {isSaved ? "저장 취소" : "카페 저장"}
          </button>
        </div>
      </>
    )
  }

  const Onboard = () => (
    <main className="onboard-screen">
      <OnboardCover />
      <div className="onboard-content">
        <div className="onboard-logo">
          <Logo className="text-[38px]" />
        </div>
        <h1 className="onboard-tagline">
          가까운 카페 말고,
          <br />
          나와 맞는 카페.
        </h1>
        <div className="onboard-action">
          <button
            className={primary}
            onClick={() => {
              setPrefs({})
              setQuizCompleted(false)
              setQuiz(0)
              nav("quiz")
            }}
          >
            내 취향으로 시작하기
            <Icon name="arrow" />
          </button>
        </div>
      </div>
    </main>
  )

  const Settings = () => (
    <>
      {Header("설정")}
      <main className="settings-screen pb-32">
        <div className="page-intro">
          <h1 className={heading}>설정과 안내</h1>
        </div>
        <section className="settings-info">
          <h2 className="font-display text-[19px]">이용 안내</h2>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            부산 전포·광안리·서면의 카페를 둘러봐요. 현재 위치를 설정할 때 위치
            권한을 요청해요. 좌표는 저장하거나 외부로 보내지 않고, 취향과 저장
            목록은 새로고침하면 초기화돼요.
          </p>
        </section>
        <button
          className="btn-secondary mt-5 w-full"
          onClick={() => setConfirm(true)}
        >
          데이터 초기화
          <Icon name="arrow" className="size-4" />
        </button>
        <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
          취향·저장 목록·목적·지역을 지우고 처음 화면으로 돌아가요.
        </p>
        <details className="settings-sources mt-8 text-[13px] text-muted-foreground">
          <summary className="cursor-pointer font-semibold text-primary">
            사진과 아이콘 출처
          </summary>
          <div className="mt-4 space-y-2 leading-6">
            <p>
              사진:{" "}
              <a
                href="https://unsplash.com/license"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Unsplash License
              </a>
            </p>
            {Object.values(moodPhotos).map((photo) => (
              <a
                key={photo.source}
                href={photo.source}
                target="_blank"
                rel="noreferrer"
                className="block underline underline-offset-4"
              >
                {photo.author} · Unsplash
              </a>
            ))}
            <div className="pt-2">
              <p className="font-semibold">취향 키워드 사진</p>
              {tastePhotos.map((photo) => (
                <a
                  key={photo.source}
                  href={photo.source}
                  target="_blank"
                  rel="noreferrer"
                  className="block underline underline-offset-4"
                >
                  {photo.author} · Unsplash
                </a>
              ))}
            </div>
            <div className="pt-2">
              <p className="font-semibold">추가 카페 사진</p>
              {cafePhotoSources.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.source}
                  target="_blank"
                  rel="noreferrer"
                  className="block underline underline-offset-4"
                >
                  {cafes.find((c) => c.id === photo.id)?.name} · {photo.author}
                </a>
              ))}
            </div>
            <p>
              커피 원두:{" "}
              <a
                href="https://phosphoricons.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Phosphor Icons
              </a>{" "}
              ·{" "}
              <a
                href="/work/cafekok/prototype/licenses/phosphor-LICENSE.txt"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                MIT 라이선스
              </a>
            </p>
            <p className="pt-2">
              아이콘:{" "}
              <a
                href="https://lucide.dev"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Lucide
              </a>{" "}
              ·{" "}
              <a
                href="/work/cafekok/prototype/licenses/lucide-LICENSE.txt"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                ISC 라이선스
              </a>
            </p>
          </div>
        </details>
      </main>
    </>
  )
  const NotificationSheet = () => (
    <Modal title="알림 설정" sheet onClose={() => setNotificationsOpen(false)}>
      <div className="modal-heading">
        <h2 className="section-title">알림</h2>
        <button
          type="button"
          aria-label="알림 설정 닫기"
          className="icon-button modal-close"
          onClick={() => setNotificationsOpen(false)}
        >
          <Icon name="close" />
        </button>
      </div>
      <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
        카페를 저장하면 기기 알림을 받을 수 있어요. 카페콕을 열어 둔 동안
        작동해요.
      </p>
      {notificationMessage && (
        <p role="status" className="mt-3 text-[14px] leading-6 text-primary">
          {notificationMessage}
        </p>
      )}
      <button
        type="button"
        className={`${primary} mt-6 w-full`}
        onClick={async () => {
          if (notificationsEnabled) {
            setNotificationsEnabled(false)
            try {
              localStorage.setItem("cafekok-notifications", "off")
            } catch {
              /* In-memory setting remains active for this visit. */
            }
            setNotificationMessage("알림을 껐어요.")
            return
          }
          if (!("Notification" in window)) {
            setNotificationMessage(
              "이 브라우저에서는 기기 알림을 지원하지 않아요.",
            )
            return
          }
          try {
            const permission = await Notification.requestPermission()
            if (permission !== "granted") {
              setNotificationMessage(
                permission === "denied"
                  ? "브라우저 설정에서 알림 권한을 허용해 주세요."
                  : "알림 권한을 허용하면 알림을 받을 수 있어요.",
              )
              return
            }
            setNotificationsEnabled(true)
            try {
              localStorage.setItem("cafekok-notifications", "on")
            } catch {
              /* In-memory setting remains active for this visit. */
            }
            setNotificationMessage("알림이 켜졌어요.")
          } catch {
            setNotificationMessage(
              "이 브라우저에서는 알림 권한을 요청할 수 없어요.",
            )
          }
        }}
      >
        {notificationsEnabled ? "알림 끄기" : "알림 켜기"}
      </button>
    </Modal>
  )
  const TasteEditSheet = () => {
    if (editingTaste === null) return null
    const [key, question, options] = QUESTIONS[editingTaste]
    return (
      <Modal
        title={`${DIMENSIONS[editingTaste]} 수정`}
        sheet
        onClose={() => setEditingTaste(null)}
      >
        <div className="modal-heading">
          <h2 className="section-title">{question}</h2>
          <button
            className="icon-button modal-close"
            aria-label="취향 수정 닫기"
            onClick={() => setEditingTaste(null)}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="quiz-options">
          {options.map((option, i) => (
            <button
              key={option}
              aria-pressed={prefs[key] === option}
              className="choice-option"
              onClick={() => {
                setPrefs((previous) => ({ ...previous, [key]: option }))
                setEditingTaste(null)
              }}
            >
              <span className="choice-letter">{"ABCD"[i]}</span>
              <span>{option}</span>
              <span className="choice-check">
                {prefs[key] === option && <Icon name="check" />}
              </span>
            </button>
          ))}
        </div>
      </Modal>
    )
  }
  const FilterSheet = () => (
    <Modal title="카페 필터" sheet onClose={() => setSheet(false)}>
      <div className="modal-heading">
        <h2 className="section-title">나에게 맞는 조건</h2>
        <button
          className="icon-button modal-close"
          aria-label="필터 닫기"
          onClick={() => setSheet(false)}
        >
          <Icon name="close" />
        </button>
      </div>
      <button className="purpose-chip" onClick={() => setFilters({})}>
        추가 필터 초기화
      </button>
      {[0, 2, 3, 4, 5].map((index) => {
        const [key, , options] = QUESTIONS[index]
        return (
          <section key={key} className="filter-group">
            <h3>{DIMENSIONS[index]}</h3>
            <div className="filter-chips">
              {options.map((option) => (
                <button
                  key={option}
                  aria-pressed={filters[key] === option}
                  className="purpose-chip"
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
    <div className="app-shell">
      {storageError && (
        <div
          role="alert"
          className="flex items-center gap-2 bg-secondary p-4 text-[13px] leading-5 text-primary"
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
      <div
        key={`${screen}:${
          screen === "quiz" ? quiz : screen === "detail" ? detail : ""
        }`}
        className="screen-enter"
      >
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
      </div>
      {!["onboard", "quiz", "detail"].includes(screen) && (
        <nav aria-label="주요 메뉴" className="bottom-nav">
          {([
            ["home", "홈"],
            ["explore", "탐색"],
            ["saved", "저장"],
            ["profile", "내 취향"],
          ] as const).map(([id, title]) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              className="nav-item"
              onClick={() => nav(id)}
            >
              <Icon name={id} />
              {title}
            </button>
          ))}
        </nav>
      )}
      {sheet && FilterSheet()}
      {notificationsOpen && NotificationSheet()}
      {editingTaste !== null && TasteEditSheet()}
      {confirm && (
        <Modal title="초기화 확인" onClose={() => setConfirm(false)}>
          <h2 className="section-title">
            처음부터 다시
            <br />
            시작할까요?
          </h2>
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
                setQuizCompleted(false)
                setSaved([])
                setPurpose(undefined)
                setRegion("부산 전포")
                locationRequest.current += 1
                setLocationState("idle")
                setLocationLabel("현재 위치로 설정")
                setLocationMessage("")
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
        <div role="status" aria-live="polite" className="toast-message">
          {toast}
        </div>
      )}
    </div>
  )
}
