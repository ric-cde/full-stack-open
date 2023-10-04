const logger = require("../utils/logger")

const dummy = (blogs) => {
	logger.info(blogs)
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (acc, cur) => acc + cur.likes
	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
	const mostLikes = blogs.reduce((acc, blog) => {
		if (!acc.length || blog.likes > acc[0].likes) {
			return [blog]
		} else if (blog.likes === acc[0].likes) {
			return acc.concat(blog)
		}
		return acc
	}, [])
	return mostLikes
}

const mostBlogs = (blogs) => {
	const blogAuthorCounts = blogs.reduce((acc, blog) => {
		const authorExists = acc.find((author) => author.author === blog.author)

		if (authorExists) {
			return acc.map((author) =>
				author.author === blog.author
					? { ...author, total: author.total + 1 }
					: author
			)
		} else {
			return [...acc, { author: blog.author, total: 1 }]
		}
	}, [])

	return blogAuthorCounts.reduce((acc, curr) =>
		acc.total > curr.total ? acc : curr
	)
}

const mostAuthorLikes = (blogs) => {
	const blogAuthorTotalLikes = blogs.reduce((acc, blog) => {
		const authorExists = acc.find(author => author.author === blog.author)

		if (authorExists) {
			return acc.map(author =>
				author.author === blog.author
					? { ...author, likes: author.likes + blog.likes }
					: author
			)
		} else {
			return [...acc, { author: blog.author, likes: blog.likes }]
		}
	}, [])
	return blogAuthorTotalLikes.reduce((acc, curr) =>
		acc.likes > curr.likes ? acc : curr
	, { likes: 0 })
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostAuthorLikes }
