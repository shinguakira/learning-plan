import { useEffect, useState } from 'react'

/** Copy feedback belongs to each message; clear its timer when it unmounts. */
export function useCopyText(text: string) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (status !== 'copied' && status !== 'error') return
    const timer = window.setTimeout(() => setStatus('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [status])

  const copy = async () => {
    setStatus('copying')
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  return { status, copy }
}
