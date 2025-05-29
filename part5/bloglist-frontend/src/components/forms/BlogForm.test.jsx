import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm.jsx"

describe("<BlogForm />", () => {
	let container, mockHandler, testUser

	beforeEach(() => {
		mockHandler = vi.fn()
		testUser = userEvent.setup()
		container = render(<BlogForm addBlog={mockHandler} />).container
	})

	test("form calls event handler with correct props when blog added", async () => {
		const title = screen.getByPlaceholderText("My Blog")
		const author = screen.getByPlaceholderText("John Doe")
		const url = screen.getByPlaceholderText("www.example.com/1")
		const addButton = screen.getByRole("button", { name: /create/i })

		await testUser.type(title, "example title")
		await testUser.type(author, "example author")
		await testUser.type(url, "www.example.url")

		await testUser.click(addButton)

		console.log(mockHandler.mock.calls)

		expect(mockHandler.mock.calls).toHaveLength(1)
		expect(mockHandler.mock.calls[0][0].title).toBe("example title")
		expect(mockHandler.mock.calls[0][0].author).toBe("example author")
		expect(mockHandler.mock.calls[0][0].url).toBe("www.example.url")
	})
})
