import express from "express"
import diaryRouter from "./routes/diaries.ts"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173" }))

const PORT = 3000

app.get("/ping", (_req, res) => {
	console.log("someone pinged. WTF!")
	res.send("ok")
})

app.get("/", (_req, res) => {
	res.send("Fetching diaries")
})

app.use("/api/diaries", diaryRouter)

app.listen(PORT, () => {
	console.log(`Server running at: http://localhost:${PORT}`)
})
