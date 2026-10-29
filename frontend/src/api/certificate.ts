import { CERTIFICATE_API_URL } from "@/constants/certificate"
import type { Certificate, CertificateDraft } from "@/types/certificate"
import type { MockUser } from "@/types/user"

async function send(url: string, method: "POST" | "PUT", body: unknown): Promise<Certificate> {
  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(failure?.message ?? `Request failed (${response.status})`)
  }

  return (await response.json()) as Certificate
}

export async function createCertificate(
  user: MockUser,
  draft: CertificateDraft,
): Promise<Certificate> {
  return send(CERTIFICATE_API_URL, "POST", { user, ...draft })
}

export async function updateCertificate(id: string, draft: CertificateDraft): Promise<Certificate> {
  return send(`${CERTIFICATE_API_URL}/${encodeURIComponent(id)}`, "PUT", draft)
}
