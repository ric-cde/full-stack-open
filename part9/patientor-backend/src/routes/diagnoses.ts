import express, { Router } from "express"
import type { Response } from "express"
import type { Diagnosis, ErrorResponse } from "../types.js"
import diagnosisService from "../services/diagnosisService.ts"

type DiagnosisResponse = Response<Diagnosis[] | ErrorResponse>

const router: Router = express.Router()

router.get("/", (_req, res: DiagnosisResponse) => {
	res.send(diagnosisService.getDiagnoses())
})

export default router
