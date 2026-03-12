import express, { Router } from "express"
import type { NextFunction, Request, Response } from "express"
import type {
	NonSensitiveDiaryEntry,
	NewDiaryEntry,
	DiaryEntry,
} from "../types.ts"
import diaryService from "../services/diaryService.ts"
import { newEntrySchema } from "../utils.ts"
import { z } from "zod"

const router: Router = express.Router()

router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
	res.send(diaryService.getEntries())
})

router.get("/:id", (req, res) => {
	const entry = diaryService.findById(Number(req.params.id))
	if (entry) res.send(entry)
	else res.sendStatus(404)
})

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		newEntrySchema.parse(req.body)
		next()
	} catch (error: unknown) {
		next(error)
	}
}

const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (error instanceof z.ZodError) {
		res.status(400).send({ error: error.issues })
	} else {
		next(error)
	}
}

router.post(
	"/",
	newDiaryParser,
	(
		req: Request<unknown, unknown, NewDiaryEntry>,
		res: Response<DiaryEntry>,
	) => {
		const addedEntry = diaryService.addDiary(req.body)
		res.json(addedEntry)
		// try {
		// 	const newDiaryEntry = newEntrySchema.parse(req.body)

		// } catch (error: unknown) {
		// 	if (error instanceof z.ZodError) {
		// 		res.status(400).send({ error: error.issues })
		// 		res.status(400).send("unknown error")
		// 	}
		// }
	},
)

router.use(errorMiddleware)

export default router
