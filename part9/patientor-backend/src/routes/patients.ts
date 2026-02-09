import express, { Router } from "express"
import type { Response } from "express"
import type { RedactedPatient, ErrorResponse } from "../types.ts"
import patientService from "../services/patientService.ts"
import { toNewPatient } from "../utils.ts"

type RedactedPatientResponse = Response<RedactedPatient[] | ErrorResponse>

const router: Router = express.Router()

router.get("/", (_req, res: RedactedPatientResponse) => {
	res.send(patientService.getRedactedPatients())
})

router.post("/", (req, res) => {
	try {
		const newPatient = toNewPatient(req.body)
		const addedPatient = patientService.addPatient(newPatient)
		res.json(addedPatient)
	} catch (error) {
		let errorMessage = "Something went wrong: "
		if (error instanceof Error) errorMessage += error.message
		res.status(400).send(errorMessage)
	}
})

export default router
