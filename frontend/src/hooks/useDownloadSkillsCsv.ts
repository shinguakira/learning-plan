import { useState } from "react"
import { downloadSkillsCsv } from "@/api/profile"

export type DownloadStatus = "idle" | "downloading" | "error"

/** Owns the Skills section's CSV download button and its error feedback. */
export function useDownloadSkillsCsv() {
  const [status, setStatus] = useState<DownloadStatus>("idle")

  const download = async () => {
    setStatus("downloading")
    try {
      await downloadSkillsCsv()
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return { status, download }
}
