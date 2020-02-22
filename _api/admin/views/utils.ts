export function html(title: string, body: string) {
  return `<!doctype html><html><head><title>Torela ${e(title)}</title></head><body>${body}</body></html>`
}

export function e(s?: string) {
  if (!s) return ''
  return s.replace(/</g, '&lt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;')
}

export function d(date?: Date|string|number) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().replace(/T.*/, '')
}

export function iso2eu(isoDate: string) {
  const parts = isoDate.split('-', 3)
  return parts[2] + '.' + parts[1] + '.' + parts[0]
}

export const today = () => d(new Date())
