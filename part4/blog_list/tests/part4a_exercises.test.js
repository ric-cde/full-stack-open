const {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs,
	mostAuthorLikes
} = require("../utils/list_helper")

describe("dummy", () => {
	test("dummy returns one", () => {
		const blogs = []

		expect(dummy(blogs)).toBe(1)
	})
})

describe("totalLikes", () => {
	const emptyList = []

	test("of empty list is zero", () => {
		const result = totalLikes(emptyList)

		expect(result).toBe(0)
	})

	const listWithOneBlog = [
		{
			_id: "5a422aa71b54a676234d17f8",
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
			likes: 5,
			__v: 0,
		},
	]

	test("when list has only 1 blog, equals the likes of that", () => {
		const result = totalLikes(listWithOneBlog)
		expect(result).toBe(5)
	})

	const listWithManyBlogs = [
		{
			_id: "5a422a851b54a676234d17f7",
			title: "React patterns",
			author: "Michael Chan",
			url: "https://reactpatterns.com/",
			likes: 7,
			__v: 0,
		},
		{
			_id: "5a422aa71b54a676234d17f8",
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
			likes: 5,
			__v: 0,
		},
		{
			_id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
			__v: 0,
		},
		{
			_id: "5a422b891b54a676234d17fa",
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
			likes: 10,
			__v: 0,
		},
		{
			_id: "5a422ba71b54a676234d17fb",
			title: "TDD harms architecture",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
			likes: 4,
			__v: 0,
		},
		{
			_id: "5a422bc61b54a676234d17fc",
			title: "Type wars",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
			likes: 12,
			__v: 0,
		},
	]

	test("when list has many blogs, equals the likes of that", () => {
		const result = totalLikes(listWithManyBlogs)
		expect(result).toBe(50)
	})

	const mostLikes = [
		{
			_id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
			__v: 0,
		},
		{
			_id: "5a422bc61b54a676234d17fc",
			title: "Type wars",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
			likes: 12,
			__v: 0,
		},
	]

	test("returns list of one or more blog objects with highest likes", () => {
		const result = favouriteBlog(listWithManyBlogs)
		expect(result).toEqual(mostLikes)
	})

	const mostBlogsAuthor = { author: "Robert C. Martin", total: 3 }

	test("returns artist with highest count of blogs", () => {
		const result = mostBlogs(listWithManyBlogs)
		expect(result).toEqual(mostBlogsAuthor)
	})

	test("returns count of artist with highest count of blogs", () => {
		const result = mostBlogs(listWithManyBlogs).total
		expect(result).toBe(mostBlogsAuthor.total)
	})

	const mostLikesAuthor = { author: "Robert C. Martin", likes: 26 }

	test("returns an author who has the most likes across all articles", () => {
		const result = mostAuthorLikes(listWithManyBlogs)
		expect(result).toEqual(mostLikesAuthor)
	})
})
