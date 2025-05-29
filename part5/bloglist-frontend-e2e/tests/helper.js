import { expect } from "@playwright/test"

const loginWith = async (page, username, password) => {
	await page.getByTestId("username").fill(username)
	await page.getByTestId("password").fill(password)
	await page.getByRole("button", { name: "log in" }).click()
}

const createBlog = async (page, blog) => {
	await page.getByRole("button", { name: "new blog" }).click()

	await page.getByRole("textbox", { name: "My Blog" }).fill(blog.title)

	await page.getByRole("textbox", { name: "John Doe" }).fill(blog.author)

	await page.getByRole("textbox", { name: "www.example.com/" }).fill(blog.url)

	await page.getByRole("button", { name: "create" }).click()
	await page.getByText(blog.title).waitFor()
}

const clickLike = async (blog, count) => {
	for (let i = 0; i < count; i++) {
		await blog.getByRole("button", { name: "like" }).click()
		await expect(blog.getByTestId("blogLikes")).toHaveText(`${i + 1}`)
	}
}

export { loginWith, createBlog, clickLike }
