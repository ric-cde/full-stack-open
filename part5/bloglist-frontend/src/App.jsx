import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import LoginForm from "./components/forms/LoginForm"
import BlogForm from "./components/forms/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [notification, setNotification] = useState([])
	const [user, setUser] = useState(null)
	const blogFormRef = useRef()

	useEffect(() => {
		blogService
			.getAll()
			.then((blogs) => {
				console.log(blogs)
				return blogs
			})
			.then((blogs) => blogs.toSorted((a, b) => b.likes - a.likes))
			.then(setBlogs)
	}, [])

	useEffect(() => {
		const loggedOnUserJSON = window.localStorage.getItem("loggedOnUser")
		if (loggedOnUserJSON) {
			const user = JSON.parse(loggedOnUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async (e) => {
		e.preventDefault()

		try {
			const user = await loginService.login({ username, password })

			window.localStorage.setItem("loggedOnUser", JSON.stringify(user))

			blogService.setToken(user.token)
			setUser(user)
			setUsername("")
			setPassword("")
		} catch (exception) {
			setNotification({ message: "Wrong credentials", type: 0 })
			setTimeout(() => {
				setNotification(null)
			}, 5000)
		}
	}

	const logOut = (e) => {
		e.preventDefault()
		window.localStorage.removeItem("loggedOnUser")
		setUser(null)
	}

	const addBlog = async (newBlog) => {
		try {
			const returnedBlog = await blogService.create(newBlog)
			console.log("returnedBlog: ", returnedBlog)
			setBlogs(blogs.concat(returnedBlog))
			blogFormRef.current.toggleVisibility()
			return true
		} catch (exception) {
			setNotification({
				message:
					"Blog failed validation. Ensure 5 characters in each field.",
				type: 0,
			})
			setTimeout(() => {
				setNotification(null)
			}, 5000)
			return false
		}
	}

	const updateBlog = async (updatedBlog) => {
		try {
			const returnedBlog = await blogService.update(updatedBlog)
			setBlogs(
				blogs.map((blog) => {
					return blog.id === returnedBlog.id ? returnedBlog : blog
				})
			)
		} catch (error) {
			console.log(error.message)
			setNotification({ message: "Blog update failed.", type: 0 })
			setTimeout(() => {
				setNotification(null)
			}, 5000)
			return false
		}
	}

	const handleDelete = async (blog) => {
		const confirmMsg = "Are you sure you want to delete this blog?"
		if (window.confirm(confirmMsg)) {
			try {
				await blogService.remove(blog)
				console.log(`Deleted blog with id: ${blog.id}`)
				setBlogs(blogs.filter((b) => b.id !== blog.id))
				setNotification({
					message: `Deleted blog "${blog.title}"`,
					type: 1,
				})
				setTimeout(() => {
					setNotification(null)
				}, 5000)
				return false
			} catch (error) {
				console.log(error?.response?.data?.error)
				console.log(error.message)

				setNotification({
					message:
						error.response?.data?.error || "Blog deletion failed.",
					type: 0,
				})
				setTimeout(() => {
					setNotification(null)
				}, 5000)
				return false
			}
		}
	}

	if (user === null) {
		return (
			<>
				<Notification {...{ notification }} />
				<h2>Log in to application</h2>
				<LoginForm
					{...{
						handleLogin,
						username,
						password,
						setUsername,
						setPassword,
					}}
				/>
			</>
		)
	} else {
		return (
			<div>
				<h2>blogs</h2>
				<Notification {...{ notification }} />

				<p>
					{user.name} logged in{" "}
					<button onClick={logOut}>logout</button>
				</p>
				<Togglable
					buttonLabel="new blog"
					cancelLabel="cancel"
					ref={blogFormRef}
				>
					<BlogForm {...{ addBlog }} />
				</Togglable>
				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						{...{ blog, updateBlog, handleDelete, user }}
					/>
				))}
			</div>
		)
	}
}

export default App
