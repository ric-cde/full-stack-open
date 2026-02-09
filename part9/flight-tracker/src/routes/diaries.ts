import express, { Router } from "express"
import type { Response } from "express"
import type { NonSensitiveDiaryEntry } from "../types.ts"
import diaryService from "../services/diaryService.ts"
import { toNewDiaryEntry } from "../utils.ts"

const router: Router = express.Router()

router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
	res.send(diaryService.getNonSensitiveEntries())
})

router.get("/:id", (req, res) => {
	const entry = diaryService.findById(Number(req.params.id))
	if (entry) res.send(entry)
	else res.sendStatus(404)
})

router.post("/", (req, res) => {
	try {
		const newDiaryEntry = toNewDiaryEntry(req.body)

		const addedEntry = diaryService.addDiary(newDiaryEntry)
		res.json(addedEntry)
	} catch (error: unknown) {
		let errorMessage = "Something went wrong. "
		if (error instanceof Error) {
			errorMessage += "Error: " + error.message
		}
		res.status(400).send(errorMessage)
	}
})

export default router
