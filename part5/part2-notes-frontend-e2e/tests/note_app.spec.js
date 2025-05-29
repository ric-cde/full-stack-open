import { describe, test, expect, beforeEach } from "@playwright/test"
import { loginWith, createNote } from "./helper.js"

describe("Note app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset")
		await request.post("/api/users", {
			data: {
				name: "m luukkai",
				username: "mluukkai",
				password: "salainen",
			},
		})

		await page.goto("/")
	})

	test("front page can be opened", async ({ page }) => {
		const locator = await page.getByRole("heading", {
			name: "Notes",
			level: 1,
		})
		await expect(locator).toBeVisible()
		await expect(
			page.getByText(
				"Note app, Department of Computer Science, University of Helsinki 2025"
			)
		).toBeVisible()
	})

	test("login fails with wrong password", async ({ page }) => {
		await loginWith(page, "mluukkai", "incorrect")

		const errorDiv = await page.locator(".error")
		await expect(errorDiv).toContainText("Wrong credentials")
		await expect(errorDiv).toHaveCSS("border-style", "solid")
		await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)")

		await expect(page.getByText("m luukkai logged-in")).not.toBeVisible()
	})

	test("user can log in with correct credentials", async ({ page }) => {
		await loginWith(page, "mluukkai", "salainen")

		await expect(page.getByText("m luukkai logged-in")).toBeVisible()
	})

	describe("when logged in", () => {
		beforeEach(async ({ page }) => {
			await loginWith(page, "mluukkai", "salainen")
		})

		test("a new note can be created", async ({ page }) => {
			const newNote = "a note created by playwright"
			await createNote(page, newNote)
			await expect(page.getByText(newNote)).toBeVisible()
		})

		describe("and several notes exist", () => {
			beforeEach(async ({ page }) => {
				await createNote(page, "first note")
				await createNote(page, "second note")
				await createNote(page, "third note")
			})

			test("importance of one can be changed", async ({ page }) => {
				await page.pause()
				const otherNoteElement = await page
					.getByText("second note")
					.locator("..")

				await otherNoteElement
					.getByRole("button", { name: "make not important" })
					.click()
				await expect(
					otherNoteElement.getByText("make important")
				).toBeVisible()
			})
		})
	})
})
