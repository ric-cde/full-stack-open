import express from "express"

import { calculateBmi } from "./bmiCalculator"
import { calculateExercises } from "./exerciseCalculator"
import { parseNum } from "./utils"

const app = express()

app.use(express.json())

app.get("/ping", (_req, res) => {
	res.send("pong")
})

app.get("/bmi", (req, res) => {
	const { height, weight } = req.query

	if (!height || !weight) {
		return res.status(400).json({ error: "missing parameter" })
	}
	if (typeof height !== "string" || typeof weight !== "string") {
		return res.status(400).json({ error: "input should be a string" })
	}

	try {
		const bmi = calculateBmi(parseNum(height), parseNum(weight))
		return res.send(bmi)
	} catch (error) {
		let errorMsg = ""
		if (error instanceof Error) {
			errorMsg += error.message
		}
		return res.status(400).json({ error: errorMsg })
	}
})

app.post("/exercises", (req, res) => {
	const { dailyExercises, target } = req.body as {
		dailyExercises: unknown
		target: unknown
	}

	if (!dailyExercises || !target) {
		return res.status(400).json({ error: "missing parameter" })
	}

	if (
		!Array.isArray(dailyExercises) ||
		!dailyExercises.every((ex) => typeof ex === "number") ||
		typeof target !== "number"
	) {
		return res.status(400).json({ error: "input of wrong type" })
	}

	try {
		const exerciseResult = calculateExercises(dailyExercises, target)
		return res.json(exerciseResult)
	} catch (error: unknown) {
		let errorMsg = ""
		if (error instanceof Error) {
			errorMsg += error.message
		}
		return res.status(400).json({ error: errorMsg })
	}
})

const PORT = 3001

app.listen(PORT, () => {
	console.log(`Server running on: ${PORT}`)
})
