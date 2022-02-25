export default function getUviLevelName(uvi: number) {
  if (uvi < 3) return '低量'
  if (uvi < 6) return '中量'
  if (uvi < 8) return '高量'
  if (uvi < 11) return '過量'
  return '危險'
}
