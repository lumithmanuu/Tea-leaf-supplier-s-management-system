const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' })

export const formatCurrency = (value) => `Rs. ${Number(value ?? 0).toLocaleString()}`

export const formatWeight = (value) => `${Number(value ?? 0).toLocaleString()} kg`

export const formatPercent = (value) => `${Number(value ?? 0).toFixed(1)}%`

export const qualityLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Average'
  return 'Poor'
}

export const initialsFromName = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export const getMonthKey = (dateValue) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${date.getMonth()}`
}

export const getMonthLabel = (dateValue) => {
  return monthFormatter.format(new Date(dateValue))
}
