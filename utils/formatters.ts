
export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(typeof value === "string" ? parseInt(value) : value)
}

export function formatPercent(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "-"
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
}

export function getGrowthColor(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "text-gray-400"
  if (num > 0) return "text-green-600"
  if (num < 0) return "text-red-600"
  return "text-gray-600"
}

export function getTargetPercentColor(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "text-gray-400"
  if (num >= 80) return "text-green-600"
  if (num >= 60) return "text-blue-600"
  if (num >= 40) return "text-yellow-600"
  return "text-red-600"
}
