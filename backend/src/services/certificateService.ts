import { seedCertificates } from "../constants/seedCertificates.js"
import type { Certificate } from "../types/certificate.js"

export const certificateService = {
    getCertificates(): Certificate[] {
        return seedCertificates
    }
}