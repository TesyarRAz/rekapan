export function formatNumber(num: number) {
  return Intl.NumberFormat('id-ID').format(num)
}