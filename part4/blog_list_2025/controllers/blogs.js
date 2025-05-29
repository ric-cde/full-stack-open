import express from "express"
import Blog from "../models/blog.js"
import User from "../models/user.js"
import "express-async-errors"
import jwt from "jsonwebtoken"

const blogsRouter = express.Router()

blogsRouter.get("/", async (request, response, next) => {
	const foundBlogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	})
	response.json(foundBlogs)
})

blogsRouter.get("/:id", async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)

	if (blog) response.json(blog)
	else response.status(404).end()
})

blogsRouter.post("/", async (request, response, next) => {
	const body = request.body

	if (!request.user) {
		return response.status(401).json({ error: "token invalid" })
	}
	const user = await User.findById(request.user)
	if (!user) {
		return response.status(401).json({ error: "user not found" })
	}

	const blog = new Blog({
		...body,
		user: user._id,
		likes: 0,
	})

	const savedBlog = await blog.save()
	await savedBlog.populate("user", { username: 1, name: 1 })

	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (request, response, next) => {
	if (!request.user) {
		return response.status(401).json({ error: "token invalid" })
	}

	const blogToDelete = await Blog.findById(request.params.id)

	if (!blogToDelete) {
		return response.status(404).json({ error: "blog not found" })
	}
	if (request.user === blogToDelete.user.toString()) {
		await blogToDelete.deleteOne()
		response.status(204).end()
	} else {
		return response.status(403).json({ error: "user not owner of blog" })
	}
})

blogsRouter.put("/:id", async (request, response, next) => {
	const { title, url, author, likes } = request.body

	if (request.params.id !== request.body.id) {
		return response.status(401).json({ error: "URL and ID don't match" })
	}

	if (!request.user) {
		return response.status(401).json({ error: "token invalid" })
	}
	const user = await User.findById(request.user)
	if (!user) {
		return response.status(401).json({ error: "user not found" })
	}

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		{
			title,
			url,
			author,
			likes,
		},
		{ new: true, runValidators: true, context: "query" }
	).populate("user", { name: 1, username: 1 })

	console.log(updatedBlog)

	if (updatedBlog) response.json(updatedBlog)
	else response.status(404).end()
})

blogsRouter

export default blogsRouter
