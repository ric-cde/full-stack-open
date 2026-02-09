import { test, after, beforeEach, describe, before } from "node:test"
import assert from "node:assert"
import mongoose from "mongoose"
import supertest from "supertest"

import app from "../app.js"
const api = supertest(app)

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import helper from "./test_helper.js"
import Note from "../models/note.js"
import User from "../models/user.js"

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

	token = jwt.sign(userForToken, process.env.SECRET, {
		expiresIn: 600,
	})

	helper.initialNotes = helper.initialNotes.map((n) => ({
		...n,
		user: savedUser.id,
	}))

	console.log(helper.initialNotes)
})

describe("when there are some notes saved initially", () => {
	beforeEach(async () => {
		await Note.deleteMany({})

		await Note.insertMany(helper.initialNotes)
	})

	test("notes are returned as json", async () => {
		await api
			.get("/api/notes")
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test("all notes are returned", async () => {
		const response = await api
			.get("/api/notes")
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
		assert.strictEqual(response.body.length, helper.initialNotes.length)
	})

	test("a specific note is within the returned notes", async () => {
		const response = await api
			.get("/api/notes")
			.set("Authorization", `Bearer ${token}`)
			.expect(200)

		const contents = response.body.map((n) => n.content)
		assert(contents.includes("Browser can execute only JavaScript"))
	})

	describe("viewing a specific note", () => {
		test("succeeds with a valid id", async () => {
			const notesAtStart = await helper.notesInDb()

			const noteToView = notesAtStart[0]

			const response = await api
				.get(`/api/notes/${noteToView.id}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(200)
				.expect("Content-Type", /application\/json/)

			assert.deepStrictEqual(
				helper.normalizeNote(response.body),
				helper.normalizeNote(noteToView)
			)
		})

		test("fails with statuscode 404 if note does not exist", async () => {
			const validNonExistingId = await helper.nonExistingId()
			const response = await api
				.get(`/api/notes/${validNonExistingId}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(404)
		})

		test("fails with statuscode 400 if id is invalid", async () => {
			const invalidId = "5"
			await api
				.get(`/api/notes/${invalidId}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(400)
		})
	})

	describe("addition of a new note", () => {
		test("succeeds with valid data", async () => {
			const newNote = {
				content: "async/await simplifies making async calls",
				important: true,
			}

			await api
				.post("/api/notes")
				.set("Authorization", `Bearer ${token}`)
				.send(newNote)
				.expect(201)
				.expect("Content-Type", /application\/json/)

			const notesFound = await helper.notesInDb()

			await assert.strictEqual(
				notesFound.length,
				helper.initialNotes.length + 1
			)

			const contents = notesFound.map((n) => n.content)
			assert(
				contents.includes("async/await simplifies making async calls")
			)
		})

		test("fails with status code 400 if data invalid", async () => {
			const newNote = {
				important: true,
			}

			await api
				.post("/api/notes")
				.set("Authorization", `Bearer ${token}`)
				.send(newNote)
				.expect(400)

			const notesFound = await helper.notesInDb()
			await assert.strictEqual(
				notesFound.length,
				helper.initialNotes.length
			)
		})
	})

	describe("deletion of a note", () => {
		test("succeeds with 204 if id is valid", async () => {
			const notesAtStart = await helper.notesInDb()
			const noteToDelete = notesAtStart[0]

			await api
				.delete(`/api/notes/${noteToDelete.id}`)
				.set("Authorization", `Bearer ${token}`)
				.expect(204)

			const notesAtEnd = await helper.notesInDb()

			const contents = notesAtEnd.map((n) => n.id)
			assert(!contents.includes(noteToDelete.id))

			assert.strictEqual(
				notesAtEnd.length,
				helper.initialNotes.length - 1
			)
		})
	})
})

after(async () => {
	await mongoose.connection.close(0)
})
