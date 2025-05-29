import express from "express"
import Blog from "../models/blog.js"
import User from "../models/user.js"
import "express-async-errors"

const testingRouter = express.Router()

testingRouter.post("/reset", async (request, response) => {
	await Blog.deleteMany({})
	await User.deleteMany({})

	response.status(204).end()
})

export default testingRouter