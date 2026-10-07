import type { FastifyInstance } from "fastify";
import { certificateService } from "../services/certificateService.js";

export default async function certificateController(app: FastifyInstance): Promise<void> {
    app.get('/api/certificates', async () => ({
        certificates: certificateService.getCertificates()
    }))
}