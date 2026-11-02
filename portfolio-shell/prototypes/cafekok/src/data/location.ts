// Approximate area centres select the prototype's dataset; these are not cafe coordinates.
const SAMPLE_AREAS = [
  { region: "부산 전포", latitude: 35.156, longitude: 129.064 },
  { region: "부산 광안리", latitude: 35.153, longitude: 129.119 },
  { region: "부산 서면", latitude: 35.158, longitude: 129.059 },
]
export function nearestSampleArea(
  latitude: number,
  longitude: number,
): string | null {
  const radians = (value: number) => (value * Math.PI) / 180
  const ranked = SAMPLE_AREAS.map((area) => {
    const a =
      Math.sin(radians(area.latitude - latitude) / 2) ** 2 +
      Math.cos(radians(latitude)) *
        Math.cos(radians(area.latitude)) *
        Math.sin(radians(area.longitude - longitude) / 2) ** 2
    return {
      region: area.region,
      km: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a))),
    }
  }).sort((a, b) => a.km - b.km)
  return ranked[0].km <= 10 ? ranked[0].region : null
}
