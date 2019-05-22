export function e(s?: string) {
  if (!s) return ''
  return s.replace('<', '&lt;').replace('\'', '&apos;').replace('"', '&quot;')
}

export function d(date?: Date|string|number) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().replace(/T.*/, '')
}

export const today = () => d(new Date())
