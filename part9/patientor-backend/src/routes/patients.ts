import express, { Router } from "express"
import type { NextFunction, Request, Response } from "express"
import type {
	RedactedPatient,
	ErrorResponse,
	NewPatient,
	Patient,
	Entry,
	NewEntry,
} from "../types.ts"
import patientService from "../services/patientService.ts"
// import { toNewPatient } from "../utils.ts"
import { newPatientSchema, toNewEntry } from "../utils.ts"
import { z } from "zod"

const router: Router = express.Router()

type RedactedPatientResponse = Response<RedactedPatient[] | ErrorResponse>
router.get("/", (_req, res: RedactedPatientResponse) => {
	res.send(patientService.getRedactedPatients())
})

type PatientResponse = Response<Patient | ErrorResponse>
router.get("/:id", (req, res: PatientResponse, next: NextFunction) => {
	try {
		const id = req.params.id
		res.send(patientService.getPatient(id))
	} catch (error) {
		next(error)
	}
})

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		newPatientSchema.parse(req.body)
		next()
	} catch (error: unknown) {
		next(error)
	}
}

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		toNewEntry(req.body)
		next()
	} catch (error: unknown) {
		next(error)
	}
}

router.post(
	"/",
	newPatientParser,
	(req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
		const addedPatient = patientService.addPatient(req.body)
		res.json(addedPatient)
	},
)

router.post(
	"/:id/entries",
	newEntryParser,
	(req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
		const id = req.params.id
		const addedEntry = patientService.addEntry(id, req.body)
		res.json(addedEntry)
	},
)

const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (error instanceof z.ZodError) {
		res.status(400).send({ error: error.issues })
	} else if (error instanceof Error) {
		res.status(404).send({ error: error.message })
	} else {
		next(error)
	}
}

router.use(errorMiddleware)

export default router
