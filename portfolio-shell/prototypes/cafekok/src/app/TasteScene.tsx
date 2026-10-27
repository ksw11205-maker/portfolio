type Preferences = Record<string, string | undefined>
export const TASTE_FIELDS = [
  ["atmosphere", "분위기"], ["space", "공간"], ["seat", "자리"],
  ["menu", "메뉴"], ["price", "음료 예산"], ["distance", "이동 범위"],
] as const
const SHORT_LABELS: Record<string, string> = {
  "조용하고 차분한": "차분한 분위기", "적당히 활기찬": "적당한 활기",
  "아늑하고 작은": "아늑한 공간", "균형 있는": "적당한 크기", "넓고 개방적인": "넓은 공간",
  "혼자 앉는 자리": "혼자 앉기", "둘이 앉는 자리": "둘이 앉기", "여럿이 앉는 자리": "여럿이 앉기",
}
export const tasteLabel = (value?: string) => value ? SHORT_LABELS[value] || value : "선택하기"
/** Photo tiles share a camera angle; menu cutouts remain a separate layer. */
export function CafeScene({ prefs }: { prefs: Preferences }) {
  const room = ["아늑하고 작은", "균형 있는", "넓고 개방적인"].indexOf(prefs.space || "균형 있는")
  const seat = ["혼자 앉는 자리", "둘이 앉는 자리", "여럿이 앉는 자리"].indexOf(prefs.seat || "둘이 앉는 자리")
  const menu = ["커피", "디저트", "차·논커피", "브런치"].indexOf(prefs.menu || "")
  const visual = ["atmosphere", "space", "seat", "menu"].some(k => prefs[k])
  const description = TASTE_FIELDS.filter(([key]) => prefs[key]).map(([key, label]) => `${label}: ${prefs[key]}`).join(". ")
  return (
    <div className="taste-scene" role="img" aria-label={description ? `선택한 취향의 분위기 이미지. ${description}` : "취향을 고르면 채워지는 카페 이미지"} data-space={prefs.space || "unselected"} data-seat={prefs.seat || "unselected"} data-menu={prefs.menu || "unselected"} data-atmosphere={prefs.atmosphere || "unselected"}>
      <div className={`taste-scene-room ${visual ? "" : "taste-scene-empty"}`} style={{backgroundPosition: `${Math.max(0, seat) * 50}% ${Math.max(0, room) * 50}%`, filter: visual ? prefs.atmosphere === "활기찬 공간" ? "saturate(1.06) brightness(1.03)" : prefs.atmosphere === "적당히 활기찬" ? "saturate(.96)" : "saturate(.82)" : undefined}} />
      {menu >= 0 && <div className="taste-scene-menu" aria-hidden="true" style={{backgroundPosition: `${(menu % 2) * 100}% ${Math.floor(menu / 2) * 100}%`}} />}
      <div className="taste-scene-shade" />
      <span className="taste-scene-caption">{visual ? "나의 카페 한 장면" : "어떤 공간이 좋아요?"}</span>
      <span className="taste-scene-note">분위기 이미지</span>
    </div>
  )
}
export default function TasteScene({ prefs, onEdit }: { prefs: Preferences; onEdit: (index: number) => void }) {
  return (
    <section aria-label="선택한 카페 취향" className="px-6 pt-6">
      <CafeScene prefs={prefs} />
      <div className="mt-4 grid grid-cols-2 gap-x-5" aria-label="취향 요약">
        {TASTE_FIELDS.map(([key, label], index) => (
          <button key={key} type="button" data-taste-field={key} aria-label={`${label}: ${prefs[key] || "미선택"}. 수정하기`} onClick={() => onEdit(index)} className="taste-choice">
            <span className="taste-choice-label">{label}</span>
            <span className="taste-choice-value"><span>{tasteLabel(prefs[key])}</span><svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" /></svg></span>
          </button>
        ))}
      </div>
    </section>
  )
}
