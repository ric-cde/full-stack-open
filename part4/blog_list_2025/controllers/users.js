import express from "express"
import User from "../models/user.js"
import "express-async-errors"
import bcrypt from "bcrypt"
const usersRouter = express.Router()

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		url: 1,
		title: 1,
		author: 1,
		id: 1,
	})

	response.json(users)
})

usersRouter.post("/", async (request, response) => {
	const { username, name, password } = request.body

	if (!password || password.length < 3) {
		console.error("Password must be at least 3 characters long.")
		return response
			.status(400)
			.json({ error: "Password must be at least 3 characters long." })
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const newUser = new User({
		username,
		name,
		passwordHash,
	})

	const savedUser = await newUser.save()
	response.status(201).json(savedUser)
})

export default usersRouter
