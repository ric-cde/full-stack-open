import { test, describe } from "node:test"
import assert from "node:assert"
import listHelper from "../utils/list_helper.js"

test("dummy returns one", () => {
	const blogs = []

	const result = assert.strictEqual(listHelper.dummy(blogs), 1)
})

const listWithOneBlog = [
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 5,
		__v: 0,
	},
]

const blogs = [
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
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0,
	},
]

const blogsWithZeroLikes = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 0,
		__v: 0,
	},
]

const blogsWithTwoMaxLikes = [
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
		likes: 7,
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 5,
		__v: 0,
	},
]

describe("total likes", () => {
	test("when list is empty, equals 0", () => {
		const result = listHelper.totalLikes([])
		assert.strictEqual(result, 0)
	})

	test("when list has only one blog, equals the likes of that", () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		assert.strictEqual(result, 5)
	})
	test("when list has several blogs, equals likes of all", () => {
		const result = listHelper.totalLikes(blogs)
		assert.strictEqual(result, 36)
	})
})

describe("most likes", () => {
	test("when list has one blog, returns one blog", () => {
		const result = listHelper.favoriteBlog(listWithOneBlog)
		assert.deepStrictEqual(listWithOneBlog[0], result)
	})

	test("when list has several blogs, returns blog with most likes", () => {
		const result = listHelper.favoriteBlog(blogs)
		assert.deepStrictEqual(blogs[2], result)
	})

	test("empty list returns null", () => {
		const result = listHelper.favoriteBlog([])
		assert.strictEqual(null, result)
	})

	test("all blogs with zero likes returns first blog", () => {
		const result = listHelper.favoriteBlog(blogsWithZeroLikes)
		assert.strictEqual(blogsWithZeroLikes[0], result)
	})

	test("two blogs with max likes returns first blog", () => {
		const result = listHelper.favoriteBlog(blogsWithTwoMaxLikes)
		assert.strictEqual(blogsWithTwoMaxLikes[0], result)
	})
})

describe("most blogs", () => {
	test("when list has one blog, returns author with count of 1", () => {
		const result = listHelper.mostBlogs(listWithOneBlog)
		const topAuthor = {
			author: "Edsger W. Dijkstra",
			blogs: 1,
		}
		assert.deepStrictEqual(topAuthor, result)
	})
	test("when list has multiple blogs, returns object for author with most blogs", () => {
		const result = listHelper.mostBlogs(blogs)
		const topAuthor = {
			author: "Robert C. Martin",
			blogs: 3,
		}
		assert.deepStrictEqual(topAuthor, result)
	})

	test("when list is empty, returns null", () => {
		const result = listHelper.mostBlogs([])
		assert.strictEqual(null, result)
	})
})

describe("most likes", () => {
	test("all blogs with zero likes returns first blog", () => {
		const result = listHelper.mostLikes(blogsWithZeroLikes)
		const topAuthor = {
			author: "Michael Chan",
			likes: 0,
		}
		assert.deepStrictEqual(topAuthor, result)
	})

	test("when list has one blog, returns author with count of 5", () => {
		const result = listHelper.mostLikes(listWithOneBlog)
		const topAuthor = {
			author: "Edsger W. Dijkstra",
			likes: 5,
		}
		assert.deepStrictEqual(topAuthor, result)
	})
	test("when list has multiple blogs, returns object for author with most likes", () => {
		const result = listHelper.mostLikes(blogs)
		const topAuthor = {
			author: "Edsger W. Dijkstra",
			likes: 17,
		}
		assert.deepStrictEqual(topAuthor, result)
	})

	test("when list is empty, returns null", () => {
		const result = listHelper.mostLikes([])
		assert.strictEqual(null, result)
	})
})
