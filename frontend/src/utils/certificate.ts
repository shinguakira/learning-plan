/** Accept only absolute web URLs, trimming whitespace from pasted links. */
export function parseCredentialUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return null
  try {
    const url = new URL(trimmed)
    if (!url.hostname || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}
