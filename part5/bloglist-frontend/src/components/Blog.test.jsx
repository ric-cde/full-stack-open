import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog.jsx"
import { beforeEach } from "vitest"

describe("<Blog />", () => {
	let container, blog, testUser, viewButton, mockHandler

	beforeEach(() => {
		blog = {
			title: "Type wars",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
			likes: 2,
			user: {
				name: "Martin Fan",
				username: "martinfan",
			},
		}

		const user = {
			name: "Martin Fan",
			username: "martinfan",
		}

		mockHandler = vi.fn()
		testUser = userEvent.setup()

		container = render(
			<Blog {...{ user, blog }} updateBlog={mockHandler} />
		).container
		viewButton = screen.getByText("view")
	})

	test("renders title & author but not URL or likes", () => {
		screen.getByText("Type wars")
		screen.getByText("Robert C. Martin")

		expect(screen.queryByText(blog.url)).toBeNull()
		expect(screen.queryByText("likes 2")).toBeNull()

		const details = container.querySelector(".details")
		expect(details).toBeNull()
	})

	test("URL and likes shown after details clicked", async () => {
		await testUser.click(viewButton)

		const details = container.querySelector(".details")
		expect(details).toBeDefined()

		within(details).getByText(blog.url)
		within(details).getByText(blog.likes.toString())
	})

	test("clicking like button twice calls event handler twice", async () => {
		await testUser.click(viewButton)

		const likeButton = container.querySelector("#like-button")
		await testUser.click(likeButton)
		await testUser.click(likeButton)
		console.log(mockHandler.mock.calls)
		expect(mockHandler.mock.calls).toHaveLength(2)
	})
})
