// Free Unsplash photos, source pages and licenses verified on 2026-10-28.
// Images are loaded from Unsplash's image CDN. Local photos provide an offline fallback.
export const moodPhotos = {
  cozy: {
    src: 'https://images.unsplash.com/photo-1770062824236-2055ac54f662?w=1000&q=80&fit=max&auto=format',
    alt: '테이블과 카운터가 있는 아늑한 카페 실내',
    author: 'Julee Juu',
    source: 'https://unsplash.com/photos/EFHS9YEiXFI',
    fallback: '/work/cafekok/prototype/images/j-1.jpg',
  },
  green: {
    src: 'https://images.unsplash.com/photo-1777451441095-c7ef2f875929?w=1000&q=80&fit=max&auto=format',
    alt: '나무 테이블과 초록 식물이 어우러진 카페 공간',
    author: 'Nguyen Phuc Hau',
    source: 'https://unsplash.com/photos/FxcSWWu98Ys',
    fallback: '/work/cafekok/prototype/images/j-3.jpg',
  },
  sunlit: {
    src: 'https://images.unsplash.com/photo-1747994569247-f0fdd6fb4b5f?w=1000&q=80&fit=max&auto=format',
    alt: '따뜻한 햇살이 들어오는 카페 실내',
    author: 'Henry Williams',
    source: 'https://unsplash.com/photos/kV6finvoSd0',
    fallback: '/work/cafekok/prototype/images/j-2.jpg',
  },
  coffee: {
    src: 'https://images.unsplash.com/photo-1736173985657-a08ba56d5a28?w=800&q=80&fit=max&auto=format',
    alt: '테이블 위에 놓인 커피 한 잔과 크루아상',
    author: 'Mathias Reding',
    source: 'https://unsplash.com/photos/RJCODpGceTQ',
    fallback: '/work/cafekok/prototype/images/s-2.jpg',
  },
  tea: {
    src: 'https://images.unsplash.com/photo-1512311734173-51a49c854e78?w=800&q=80&fit=max&auto=format',
    alt: '흰 도자기 잔과 받침에 담긴 차',
    author: 'Sixteen Miles Out',
    source: 'https://unsplash.com/photos/dPkn4562j3E',
    fallback: '/work/cafekok/prototype/images/j-4.jpg',
  },
} as const
export type MoodPhotoData = (typeof moodPhotos)[keyof typeof moodPhotos]
