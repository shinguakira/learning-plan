import { useState } from "react"
import { downloadProfilePdf } from "@/api/profile"
import type { DownloadStatus } from "@/types/download"
import type { ProfileSeed } from "@/types/profile"
import type { MockUser } from "@/types/user"

/** Owns the Profile page's PDF download button and its error feedback. */
export function useDownloadProfilePdf(user: MockUser, profile: ProfileSeed) {
  const [status, setStatus] = useState<DownloadStatus>("idle")

  const download = async () => {
    setStatus("downloading")
    try {
      await downloadProfilePdf(user, profile)
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return { status, download }
}
