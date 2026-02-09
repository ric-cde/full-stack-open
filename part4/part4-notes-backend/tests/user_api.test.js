import { test, beforeEach, after, describe } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"
import bcrypt from "bcrypt"

import app from "../app.js"
const api = supertest(app)

import helper from "./test_helper.js"
import User from "../models/user.js"

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash("sekret", 10)
		const user = new User({ username: "root", passwordHash })

		await user.save()
	})

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "dv_lut",
			name: "David Lutnick",
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

	test("creation fails with proper statuscode & message for existing username", async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salainen",
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		console.log("explicit error was: ", result.body.error)
		assert(result.body.error.includes("expected `username` to be unique"))

		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})
})

after(async () => {
	await mongoose.connection.close(0)
})
