import express from "express"
import cors from "cors"
import diagnosisRouter from "./routes/diagnoses.ts"
import patientRouter from "./routes/patients.ts"

const app = express()
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.use("/api/diagnoses", diagnosisRouter)
app.use("/api/patients", patientRouter)

app.get("/api/ping", (_req, res) => {
	res.send("pong")
})

const PORT = 3001

app.listen(PORT, () => {
	console.log(`Backend server live at: http://localhost:${PORT}`)
})
