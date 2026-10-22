import { useState } from "react"
import { downloadProfileCsv } from "@/api/profile"
import type { DownloadStatus } from "@/types/download"

/** Owns the Profile page's CSV download button and its error feedback. */
export function useDownloadProfileCsv() {
  const [status, setStatus] = useState<DownloadStatus>("idle")

  const download = async () => {
    setStatus("downloading")
    try {
      await downloadProfileCsv()
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return { status, download }
}
