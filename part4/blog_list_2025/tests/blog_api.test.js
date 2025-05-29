import { test, after, beforeEach, describe, before } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"
import app from "../app.js"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import Blog from "../models/blog.js"
import User from "../models/user.js"
import helper from "./test_helper.js"

const api = supertest(app)

let token

before(async () => {
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash("myPass", 10)

	const username = "testUser"
	const newUser = new User({
		username,
		passwordHash,
	})

	const savedUser = await newUser.save()

	const userForToken = {
		username,
		id: savedUser.id,
	}

	token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 90 })

	helper.blogs = helper.blogs.map((b) => ({
		...b,
		user: savedUser._id,
	}))

	console.log(helper.blogs)
})

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.blogs)
})

test("correct number of notes returned", async () => {
	const { body } = await api.get("/api/blogs").expect(200)
	assert.strictEqual(body.length, helper.blogs.length)
})

test("notes returned in JSON format", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/)
})

test("blog post _id property is named id", async () => {
	const { body } = await api.get("/api/blogs")
	assert(body[0].hasOwnProperty("id"))
})

test("a valid blog can be added", async () => {
	await api
		.post("/api/blogs")
		.set("Authorization", `Bearer ${token}`)
		.send(helper.newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	console.log(blogsAtEnd)
	const titles = blogsAtEnd.map((b) => b.title)
	const urls = blogsAtEnd.map((b) => b.url)
	const authors = blogsAtEnd.map((b) => b.author)

	assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)
	assert(titles.includes(helper.newBlog.title))
	assert(urls.includes(helper.newBlog.url))
	assert(authors.includes(helper.newBlog.author))
})

test("likes of a new post is 0", async () => {
	const response = await api
		.post("/api/blogs")
		.set("Authorization", `Bearer ${token}`)
		.send(helper.newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/)

	assert.strictEqual(response.body.likes, 0)
})

test("blog with missing title cannot be added", async () => {
	const { title, ...blogWithoutTitle } = await helper.newBlog

	await api
		.post("/api/blogs")
		.set("Authorization", `Bearer ${token}`)
		.send(blogWithoutTitle)
		.expect(400)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(helper.blogs.length, blogsAtEnd.length)
})

test("blog with no token cannot be added and proper status code", async () => {
	await api
		.post("/api/blogs")
		.set("Authorization", `Bearer notaValidToken`)
		.send(helper.newBlog)
		.expect(401)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(helper.blogs.length, blogsAtEnd.length)
})

test("blog with missing url cannot be added", async () => {
	const { url, ...blogWithoutUrl } = await helper.newBlog

	await api
		.post("/api/blogs")
		.set("Authorization", `Bearer ${token}`)
		.send(blogWithoutUrl)
		.expect(400)

	const blogsAtEnd = await helper.blogsInDb()
	assert.strictEqual(helper.blogs.length, blogsAtEnd.length)
})

describe.only("deletion of a note", () => {
	test.only("succeeds with 204 when id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		const contents = blogsAtEnd.map((blog) => blog.id)
		assert(!contents.includes(blogToDelete.id))

		assert.strictEqual(helper.blogs.length - 1, blogsAtEnd.length)
	})
})

describe("updating a note", () => {
	test("succeeds with valid id and fields", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]

		const response = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(helper.newBlog)
			.expect(200)

		const { body: updatedBlog } = await api
			.get(`/api/blogs/${blogToUpdate.id}`)
			.expect(200)

		assert.deepStrictEqual(
			{
				title: updatedBlog.title,
				url: updatedBlog.url,
				author: updatedBlog.author,
			},
			helper.newBlog
		)
	})
	test("fails with invalid id", async () => {
		const invalidId = "x"

		await api
			.put(`/api/blogs/${invalidId}`)
			.send(helper.newBlog)
			.expect(400)
	})
	test("fails with a url that is too short", async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		const incorrectBlog = {
			...helper.newBlog,
			url: "http",
		}
		console.log(incorrectBlog)
		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(incorrectBlog)
			.expect(400)
	})
})

after(async () => {
	await mongoose.connection.close()
})
