import { useEffect, useState } from 'react'

/**
 * A small string value persisted under `key` - a view mode, a selected tab.
 *
 * `allowed` is required rather than optional: whatever is in storage came from a
 * previous version of the app or from the user editing it, so it is validated
 * before being trusted as a T.
 */
export function useLocalStorageState<T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[],
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null && (allowed as readonly string[]).includes(stored)
        ? (stored as T)
        : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Private mode or a full quota: keep rendering with the value in memory.
    }
  }, [key, value])

  return [value, setValue]
}
