import express from "express"

const app = express()

// import cors from "cors"
import notesRouter from "./controllers/notes.js"
import usersRouter from "./controllers/users.js"
import loginRouter from "./controllers/login.js"
import config from "./utils/config.js"

import testingRouter from "./controllers/testing.js"

import {
	requestLogger,
	unknownEndpoint,
	errorHandler,
} from "./utils/middleware.js"
import logger from "./utils/logger.js"
import mongoose from "mongoose"

mongoose.set("strictQuery", false)

logger.info("connecting to", config.MONGODB_URI)

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB")
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB:", error.message)
	})

// app.use(cors())
app.use(express.static("dist"))
app.use(express.json())
app.use(requestLogger)

// if request made to "/api/notes", directed to notesRouter callbacks
app.use("/api/notes", notesRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === "test") {
	app.use("/api/testing", testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
