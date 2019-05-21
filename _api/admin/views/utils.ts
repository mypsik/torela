export function e(s: string) {
  if (!s) return '';
  return s.replace('<', '&lt;').replace('\'', '&apos;').replace('"', '&quot;');
}
