import { useEffect, useState } from "react"
import type { TastePhoto } from "../data/tastePhotos"

function TasteImage({ photo }: { photo: TastePhoto }) {
  const [fallback, setFallback] = useState(false)
  return (
    <img
      src={fallback ? photo.fallback : photo.src}
      alt={fallback ? "취향 분위기 참고 사진" : photo.alt}
      referrerPolicy="no-referrer"
      onError={() => setFallback(true)}
    />
  )
}

export default function TasteSlideshow({ photos }: { photos: TastePhoto[] }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let timer: ReturnType<typeof setInterval> | undefined
    const update = () => {
      clearInterval(timer)
      if (motion.matches) setActive(0)
      else if (photos.length > 1)
        timer = setInterval(
          () => setActive((index) => (index + 1) % photos.length),
          6000,
        )
    }
    update()
    motion.addEventListener("change", update)
    return () => {
      clearInterval(timer)
      motion.removeEventListener("change", update)
    }
  }, [photos.length])
  if (!photos.length) return null
  return (
    <div className="taste-slideshow" aria-label="선택한 취향을 담은 사진">
      {photos.map((photo, index) => (
        <div
          key={photo.src}
          className={`taste-slide${index === active ? " is-active" : ""}`}
          aria-hidden={index !== active}
        >
          <TasteImage photo={photo} />
        </div>
      ))}
    </div>
  )
}
