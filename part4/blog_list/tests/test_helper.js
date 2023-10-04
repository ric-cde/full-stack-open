const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
	{
		title: "How to build an Express app",
		author: "Gerry Fish",
		url: "www.fish.com/1",
		likes: 500,
	},
	{
		title: "Creating React apps from scratch",
		author: "Maurice Fishburne",
		url: "www.fish.com/2",
		likes: 250,
	}
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}


// TODO: nonExistingId

// const nonExistingId = async () => {
// 	const note = new Note({ content: "willremovethissoon" })
// 	await note.save()
// 	await note.deleteOne()

// 	return note._id.toString()
// }

module.exports = {
	initialBlogs,
	blogsInDb,
	usersInDb
}