const mongoose = require("mongoose")
mongoose.set("bufferTimeoutMS", 30000)
const helper = require("./test_helper")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")
const logger = require("../utils/logger")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let token

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

	const rootId = user2._id.toString()

	const userForToken = {
		username: "root",
		id: rootId,
	}

	token = jwt.sign(userForToken, process.env.SECRET, {
		expiresIn: 60 * 60,
	})
	
	await Blog.deleteMany({})
	logger.info("Blogs cleared.")

	const creator = await User.findOne({})
	if (!creator) {
		throw new Error("No user found")
	}

	const blogObjects = helper.initialBlogs
		.map(blog => new Blog({ ...blog, user: creator.id }))
		
	const blogPromises = blogObjects.map(blog => blog.save())
	
	const savedBlogs = await Promise.all(blogPromises)
	const savedBlogIds = savedBlogs.map(blog => blog._id)

	creator.blogs = savedBlogIds

	await creator.save()

	logger.info("Finished adding all blogs.")
}, 100000)

describe("4.8", () => {
	test("returns correct number of blogs", async () => {
		const response = await api.get("/api/blogs")
		logger.info(response.body)
		
		expect(response.body).toHaveLength(helper.initialBlogs.length)
	}, 100000)
	test("blogs are in json format", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})
})

describe("4.9", () => {
	test("id property is named 'id'", async () => {
		const response = await api.get("/api/blogs")
		expect(response.body[0].id).toBeDefined
	})
})

describe("4.10", () => {
	test("a new blog post is created", async () => {

		const newBlog = {
			title: "Writing tests with Jest",
			author: "Jessica Jestaine",
			url: "www.jest.com/3",
			likes: 100
		}

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/)
		
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
		
		expect(blogsAtEnd).toContainEqual(expect.objectContaining(newBlog))

	})
})

describe("4.11", () => {
	test("if likes property is missing, it defaults to 0", async () => {
		const newBlog = {
			title: "Very Unpopular Blog",
			author: "John Doe",
			url: "www.💩.com/4",
		}

		const response = await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		expect(response.body.likes).toBe(0)
	})
})

describe("4.12", () => {
	test("if title property is missing, response is 400", async () => {
		const newBlog = {
			author: "Jake Doe",
			url: "www.💩.com/5",
			likes: 0
		}

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
	})

	test("if url property is missing, response is 400", async () => {
		const newBlog = {
			author: "Jake Doe",
			title: "Yet Another Blog Post",
			likes: 0,
		}

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
	})
})

describe("4.13", () => {
	test("blog deleted if id valid and 204 response", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204)
		
		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const titles = blogsAtEnd.map(blog => blog.title)
		expect(titles).not.toContain(blogToDelete.title)
	})
})

describe("4.14", () => {
	test("blog with valid id is updated", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		const newLikes = 37

		const fieldsToUpdate = {
			likes: newLikes
		}

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(fieldsToUpdate)
			.expect(200)
		
		const blogsAtEnd = await helper.blogsInDb()
		const updatedBlog = blogsAtEnd.filter(blog => blog.id === blogToUpdate.id)[0]

		expect(updatedBlog.likes).toBe(newLikes)
	})

	test("blog with invalid id is not updated, returns 404", async () => {
		const invalidId = "5a3d5da59070081a82a3445"
		const newLikes = 70
		const fieldsToUpdate = {
			likes: newLikes,
		}

		await api
			.put(`/api/blogs/${invalidId}`)
			.send(fieldsToUpdate)
			.expect(400)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})