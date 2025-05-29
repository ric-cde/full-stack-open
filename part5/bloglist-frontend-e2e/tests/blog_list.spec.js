import { describe, test, beforeEach, expect } from "@playwright/test"
import { loginWith, createBlog, clickLike } from "./helper.js"

describe("Blog List App", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset")
		await request.post("/api/users", {
			data: {
				name: "superuser",
				username: "root",
				password: "myPass",
			},
		})
		await page.goto("/")
	})

	test("login form is shown", async ({ page }) => {
		await expect(page.getByText("Log in to application")).toBeVisible()
		await expect(page.getByRole("button", { name: "log in" })).toBeVisible()
	})

	describe("Login", () => {
		test("succeeds with correct credentials", async ({ page }) => {
			await loginWith(page, "root", "myPass")
			await expect(
				page.getByText("superuser logged in logout")
			).toBeVisible()
		})

		test("fails with incorrect password", async ({ page }) => {
			await loginWith(page, "randomUser", "wrong pasword")

			const errorDiv = await page.locator(".error")
			await expect(errorDiv).toContainText("Wrong credentials")
			await expect(errorDiv).toHaveCSS("border-style", "solid")
			await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)")
			await expect(
				page.getByText("superuser logged in logout")
			).not.toBeVisible()
		})

		describe("When logged in", () => {
			beforeEach(async ({ page }) => {
				await loginWith(page, "root", "myPass")
			})

			test("a new blog can be created", async ({ page }) => {
				const newBlog = {
					title: "Blog Creation Sample",
					author: "Jane Doe",
					url: "www.example.com/5",
				}
				await createBlog(page, newBlog)
				await expect(
					page.getByText(newBlog.title, newBlog.author)
				).toBeVisible()
			})

			describe("When blog added", () => {
				beforeEach(async ({ page }) => {
					await createBlog(page, {
						title: "Default Blog Post",
						author: "Jeremy Doyle",
						url: "www.example.com/8",
					})
				})

				test("a blog can be liked", async ({ page }) => {
					const blogDiv = await page.getByTestId("blogItem")
					await blogDiv.getByRole("button", { name: "view" }).click()
					const likes = blogDiv.getByTestId("blogLikes")
					await blogDiv.getByRole("button", { name: "like" }).click()
					await expect(likes).toHaveText("1")
				})

				test("user who created blog can delete it", async ({
					page,
				}) => {
					const blogDiv = await page.getByTestId("blogItem")
					await blogDiv.getByRole("button", { name: "view" }).click()
					await blogDiv
						.getByRole("button", { name: "delete" })
						.click()

					page.once("dialog", (dialog) => {
						console.log(`Dialog message: ${dialog.message()}`)
						dialog.accept()
					})
					await page.getByRole("button", { name: "delete" }).click()
					await expect(
						page
							.getByRole("strong")
							.filter({ hasText: "Default Blog Post" })
					).not.toBeVisible()
				})

				test("user who didn't create blog doesn't see its delete button", async ({
					page,
					request,
				}) => {
					await page.getByRole("button", { name: "logout" }).click()
					await request.post("/api/users", {
						data: {
							name: "anotheruser",
							username: "extraUser",
							password: "myPass",
						},
					})

					await loginWith(page, "extraUser", "myPass")
					const blogDiv = await page.getByTestId("blogItem")
					await blogDiv.getByRole("button", { name: "view" }).click()
					await expect(
						blogDiv.getByRole("button", { name: "delete" })
					).not.toBeVisible()
				})
			})

			test("three blogs are sorted according to number of likes", async ({
				page,
			}) => {
				await createBlog(page, {
					title: "first blog",
					author: "Jeremy Doyle",
					url: "www.example.com/1",
				})
				await createBlog(page, {
					title: "second blog",
					author: "Jeremy Doyle",
					url: "www.example.com/2",
				})
				await createBlog(page, {
					title: "third blog",
					author: "Jeremy Doyle",
					url: "www.example.com/3",
				})

				const blogOne = await page.getByText("first blog").locator("..")
				const blogTwo = await page
					.getByText("second blog")
					.locator("..")
				const blogThree = await page
					.getByText("third blog")
					.locator("..")

				await blogThree.getByRole("button", { name: "view" }).click()
				await clickLike(blogThree, 3)

				await blogTwo.getByRole("button", { name: "view" }).click()
				await clickLike(blogTwo, 2)

				await blogOne.getByRole("button", { name: "view" }).click()
				await clickLike(blogOne, 1)

				// await page.goto("/")
				await page.reload()
				const blogItems = page.locator('[data-testid="blogItem"]')
				await expect(blogItems.nth(0)).toContainText("third blog")
				await expect(blogItems.nth(1)).toContainText("second blog")
				await expect(blogItems.nth(2)).toContainText("first blog")
			})
		})
	})
})
