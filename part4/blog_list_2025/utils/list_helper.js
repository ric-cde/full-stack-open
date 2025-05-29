const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (acc, blog) => acc + blog.likes
	return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	const result =
		blogs.length > 0
			? blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
			: null
	return result
}

const mostBlogs = (blogs) => {
	if (!blogs || blogs.length === 0) return null

	const blogCounts = blogs.reduce((acc, blog) => {
		acc[blog.author] = (acc[blog.author] || 0) + 1
		return acc
	}, {})

	let mostBlogsAuthor = null

	for (const author in blogCounts) {
		const count = blogCounts[author]

		if (mostBlogsAuthor) {
			if (count > mostBlogsAuthor.blogs) {
				mostBlogsAuthor = {
					author,
					blogs: count,
				}
			}
		} else {
			mostBlogsAuthor = {
				author,
				blogs: count,
			}
		}
	}

	return mostBlogsAuthor
}

const mostLikes = (blogs) => {
	if (!blogs || blogs.length === 0) return null

	const likeCounts = blogs.reduce((acc, blog) => {
		acc[blog.author] = (acc[blog.author] || 0) + blog.likes
		return acc
	}, {})

	const entries = Object.entries(likeCounts)

	const output = entries.reduce(
		(acc, [author, likes]) => (likes > acc.likes ? { author, likes } : acc),
		{ likes: -Infinity }
	)
	console.log(output)

	return output
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
