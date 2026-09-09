/** Join Tailwind classes, dropping anything falsy so conditionals stay inline. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
