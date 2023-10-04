const mongoose = require("mongoose")
mongoose.set("bufferTimeoutMS", 30000)
const helper = require("./test_helper")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

const logger = require("../utils/logger")
const bcrypt = require("bcrypt")
// const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

beforeEach(async () => {
	logger.info("Deleting test users.")
	await User.deleteMany({})
	logger.info("Users cleared.")

	const passwordHash = await bcrypt.hash("curry", 10)

	const user = new User({
		username: "root",
		name: "Admin",
		passwordHash,
	})

	const user2 = new User({
		username: "novice",
		name: "Novitiate",
		passwordHash,
	})

	await Promise.all([user.save(), user2.save()])
	logger.info("Two users added.")

	
	// const rootId = user2._id.toString()
	// const userForToken = {
	// 	username: "root",
	// 	id: rootId,
	// }
	// token = jwt.sign(userForToken, process.env.SECRET, {
	// 	expiresIn: 60 * 60,
	// })

}, 100000)

describe("Creating users - 4.15", () => {

	test("user account with unique username can be added", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "secondUser",
			name: "Acolyte",
			password: "lemons",
		}

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/)
			
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	}, 100000)

	test("returns list of two users", async () => {
		
		const response = await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/)
		
		expect(response.body).toHaveLength(2)
	})
})

describe("Validating users - 4.16", () => {
	test("no username results in failed user creation", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			name: "michael",
			password: "sugar",
		}

		await api
			.post("/api/users")
			.send(newUser)
			.expect(400)


		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test("2-letter password results in 400 error and message", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "mich",
			name: "michael",
			password: "su",
		}

		await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect({ error: "password must be at least 3 characters" })

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
	
	test("2-letter username results in 400 error and message", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "mi",
			name: "michael",
			password: "sugar",
		}

		await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect({ error: "username must be at least 3 characters" })

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
})

describe("Creating blog w/ invalid token - 4.19", () => {
	test("adding blog with invalid token fails", async () => {
		const newBlog = {
			title: "Writing tests with Jest",
			author: "Jessica Jestaine",
			url: "www.jest.com/3",
			likes: 100,
		}

		await api
			.post("/api/blogs")
			.set(
				"Authorization",
				"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY1MTlkZTAyOTdiY2Y2M2RjMTg3MGY4NyIsImlhdCI6MTY5NjI4MjQ2NywiZXhwIjoxNjk2Mjg2MDY3fQ.RpQ23MYcLv6KsCvYpGonZQfyLVMIxz6Uc56xk9c9Hm8"
			)
			.send(newBlog)
			.expect(401)
			.expect("Content-Type", /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

		expect(blogsAtEnd).not.toContainEqual(expect.objectContaining(newBlog))
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})