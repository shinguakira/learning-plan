import { useState } from "react"
import { downloadTasksCsv } from "@/api/tasks"
import type { DownloadStatus } from "@/types/download"

/** Owns the Tasks page's CSV download button and its error feedback. */
export function useDownloadTasksCsv() {
  const [status, setStatus] = useState<DownloadStatus>("idle")

  const download = async () => {
    setStatus("downloading")
    try {
      await downloadTasksCsv()
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return { status, download }
}
