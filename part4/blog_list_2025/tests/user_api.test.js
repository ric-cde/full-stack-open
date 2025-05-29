import { test, beforeEach, after, describe } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"
import bcrypt from "bcrypt"
import app from "../app.js"
const api = supertest(app)

import helper from "./test_helper.js"
import User from "../models/user.js"

describe("when a new user is created", () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash("myPass", 10)
		const user = new User({
			username: "root",
			name: "admin",
			passwordHash,
		})

		await user.save()
	})
	test("valid user with unique username passes", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "micky",
			name: "michael michaels",
			password: "siucra",
		}

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

		const usernames = usersAtEnd.map((u) => u.username)
		assert(usernames.includes(newUser.username))
	})
	test("password less than 3 characters fails", async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: "micky",
			name: "michael michaels",
			password: "si",
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)

		assert(
			result.body.error.includes(
				"Password must be at least 3 characters long."
			)
		)
	})
	test("username less than 3 characters fails", async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: "mi",
			name: "michael michaels",
			password: "myPass",
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)

		assert(
			result.body.error.includes(
				"is shorter than the minimum allowed length"
			)
		)
	})
	test("existing username fails", async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: "root",
			name: "michael michaels",
			password: "myPass",
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)

		assert(result.body.error.includes("expected `username` to be unique"))
	})
})

after(async () => {
	await mongoose.connection.close(0)
})
