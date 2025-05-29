import { MONGODB_URI, PORT } from "./utils/config.js"
import express from "express"
import testingRouter from "./controllers/testing.js"
const app = express()

// import cors from "cors"
import blogsRouter from "./controllers/blogs.js"
import usersRouter from "./controllers/users.js"
import loginRouter from "./controllers/login.js"

import {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
} from "./utils/middleware.js"
import logger from "./utils/logger.js"
import mongoose from "mongoose"

mongoose.set("strictQuery", false)

logger.info("connecting to: ", MONGODB_URI)

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		logger.info("Connected to MongoDB.")
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB: ", error.message)
	})

// app.use(cors())
app.use(express.static("dist"))
app.use(express.json())
app.use(requestLogger)

app.use(tokenExtractor)
app.use("/api/blogs", userExtractor, blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === "test") {
	app.use("/api/testing", testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
