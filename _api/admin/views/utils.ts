export function e(s: string) {
  if (!s) return '';
  return s.replace('<', '&lt;').replace('\'', '&apos;').replace('"', '&quot;');
}

export const today = () => new Date().toISOString().replace(/T.*/, '')
