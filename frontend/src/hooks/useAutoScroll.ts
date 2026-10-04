import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

/**
 * Keep a scroll container pinned to its bottom as content is appended.
 * Layout effect rather than effect, so the jump happens before paint.
 */
export function useAutoScroll<T extends HTMLElement>(
  deps: readonly unknown[],
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (node) node.scrollTop = node.scrollHeight
    // The caller decides what counts as new content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
