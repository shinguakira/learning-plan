import { useEffect, useState } from "react"
import { fetchTechnologies } from "@/api/technology"
import type { Technology } from "@/types/technology"

export type TechnologiesApi = {
  technologies: Technology[]
  loading: boolean
  error: string | null
}

export function useTechnologies(): TechnologiesApi {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchTechnologies(controller.signal)
      .then((rows) => {
        setTechnologies(rows)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : "Could not load the skill list.")
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { technologies, loading, error }
}
