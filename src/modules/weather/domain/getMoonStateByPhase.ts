export default function getMoonStateByPhase(phase: number) {
  if (phase === 0 || phase === 1) return '新月'
  if (phase < 0.25) return '娥眉月'
  if (phase === 0.25) return '上弦月'
  if (phase < 0.5) return '盈凸月'
  if (phase === 0.5) return '滿月'
  if (phase < 0.75) return '虧凸月'
  if (phase === 0.75) return '下弦月'
  if (phase < 1) return '殘月'
  return '資料格式錯誤'
}
