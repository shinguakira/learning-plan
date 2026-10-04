import { useEffect, useState } from 'react'

/**
 * Whether a CSS media query currently matches, so behaviour can follow the same
 * breakpoint the styles do instead of a second, drifting definition of "phone".
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)

    // The query may already have changed between the first render and this effect.
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}
