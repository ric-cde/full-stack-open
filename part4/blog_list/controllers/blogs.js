const blogsRouter = require("express").Router()
const logger = require("../utils/logger")
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (req, res) => {
	logger.info("returning all blogs... ")
	const blogs = await Blog
		.find({})
		.populate("user", {
			username: 1,
			name: 1,
		})
	res.json(blogs)
})

blogsRouter.post("/", async (req, res) => {
	// const creator = await User.findOne({})

	if (!req.decodedToken.id) {
		return res.status(401).json({ error: "token invalid" })
	}

	const user = await User.findById(req.user)

	if (!user) {
		return res.status(401).json({ error: "user not found" })
	}
	
	const blog = new Blog({
		title: req.body.title,
		url: req.body.url,
		author: req.body.author,
		likes: req.body.likes || 0,
		user: user._id
	})

	logger.info("Saving new blog to database...")

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	res.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (req, res) => {
	if (!req.decodedToken || !req.decodedToken.id) {
		return res.status(401).json({ error: "token invalid" })
	}
	
	logger.info("Deleting blog from database...")
	const blog = await Blog.findById(req.params.id)

	if (!blog) {
		return res.status(404).json({ error: "blog not foud" })
	}

	if (blog.user.toString() !== req.user.toString()) {
		return res.status(403).json({ error: "invalid user" })
	}

	logger.info(`Deleting note ${req.params.id}...`)

	logger.info(await Blog.findByIdAndRemove(req.params.id))
	res.status(204).end()
})

blogsRouter.put("/:id", async (req, res) => {
	await Blog.findByIdAndUpdate(req.params.id, req.body)
	res.status(200).end()
})

module.exports = blogsRouter