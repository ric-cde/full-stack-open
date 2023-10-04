const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const logger = require("../utils/logger")
const User = require("../models/user")

usersRouter.get("/", async (req, res) => {
	logger.info("Returning all users...")

	const users = await User
		.find({})
		.populate("blogs", {
			title: 1,
			url: 1,
			author: 1,
			likes: 1
		})
	
	res.json(users)
})

usersRouter.post("/", async (req, res) => {
	const { username, name, password } = req.body

	if (!password || !username) {
		return res.status(400).json({ error: "username or password missing" })
	} else if (password.length < 3) {
		return res
			.status(400)
			.json({ error: "password must be at least 3 characters" })
	} else if (username.length < 3) {
		return res
			.status(400)
			.json({ error: "username must be at least 3 characters" })
	}
	
	logger.info("Adding new user:", username, name)

	const saltRounds = 10
	logger.info("Hashing password...")
	const passwordHash = await bcrypt.hash(password, saltRounds)
	logger.info("Password hashed.")

	const user = new User({
		username,
		name,
		passwordHash
	})

	const savedUser = await user.save()

	res.status(201).json(savedUser)
	
})

module.exports = usersRouter