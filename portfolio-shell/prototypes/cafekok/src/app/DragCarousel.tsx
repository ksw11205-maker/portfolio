import { useRef, type ReactNode, type PointerEvent } from "react"

export default function DragCarousel({
  children,
  label,
  className = "",
}: {
  children: ReactNode
  label: string
  className?: string
}) {
  const gesture = useRef<{
    id: number
    x: number
    scroll: number
    dragging: boolean
  } | null>(null)
  const suppressClick = useRef(false)
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    const drag = gesture.current
    if (!drag || drag.id !== event.pointerId) return
    suppressClick.current = drag.dragging
    gesture.current = null
    delete event.currentTarget.dataset.dragging
    event.currentTarget.style.removeProperty("scroll-snap-type")
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }
  return (
    <div
      className={`drag-carousel no-scrollbar ${className}`}
      tabIndex={0}
      role="region"
      aria-label={label}
      onPointerDown={(event) => {
        suppressClick.current = false
        if (event.pointerType !== "mouse" || event.button !== 0) return
        gesture.current = {
          id: event.pointerId,
          x: event.clientX,
          scroll: event.currentTarget.scrollLeft,
          dragging: false,
        }
      }}
      onPointerMove={(event) => {
        const drag = gesture.current
        if (!drag || drag.id !== event.pointerId) return
        const delta = event.clientX - drag.x
        if (!drag.dragging && Math.abs(delta) < 6) return
        if (!drag.dragging) {
          drag.dragging = true
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.dataset.dragging = "true"
          event.currentTarget.style.scrollSnapType = "none"
        }
        event.preventDefault()
        event.currentTarget.scrollLeft = drag.scroll - delta
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
      onLostPointerCapture={finish}
      onDragStart={(event) => event.preventDefault()}
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault()
          event.stopPropagation()
          suppressClick.current = false
        }
      }}
      onKeyDown={(event) => {
        suppressClick.current = false
        if (
          event.target !== event.currentTarget ||
          !["ArrowLeft", "ArrowRight"].includes(event.key)
        )
          return
        event.preventDefault()
        event.currentTarget.scrollBy({
          left:
            event.currentTarget.clientWidth *
            0.8 *
            (event.key === "ArrowRight" ? 1 : -1),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        })
      }}
    >
      {children}
    </div>
  )
}
