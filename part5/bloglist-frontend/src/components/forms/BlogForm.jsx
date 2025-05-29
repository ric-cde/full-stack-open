import { useState } from "react"
import PropTypes from "prop-types"

const BlogForm = ({ addBlog }) => {
	const [title, setTitle] = useState("")
	const [author, setAuthor] = useState("")
	const [url, setUrl] = useState("")

	const onSubmit = async (e) => {
		e.preventDefault()
		const success = await addBlog({ title, author, url })
		if (success) {
			setTitle("")
			setAuthor("")
			setUrl("")
		}
	}
	return (
		<form onSubmit={onSubmit}>
			<h2>create new</h2>
			<div>
				title:
				<input
					type="text"
					value={title}
					name="title"
					onChange={({ target }) => setTitle(target.value)}
					placeholder="My Blog"
				/>
			</div>
			<div>
				author:{" "}
				<input
					type="text"
					value={author}
					name="author"
					onChange={({ target }) => setAuthor(target.value)}
					placeholder="John Doe"
				/>
			</div>
			<div>
				url:{" "}
				<input
					type="text"
					value={url}
					name="url"
					onChange={({ target }) => setUrl(target.value)}
					placeholder="www.example.com/1"
				/>
			</div>
			<button type="submit" id="add-button">create</button>
		</form>
	)
}

BlogForm.propTypes = {
	addBlog: PropTypes.func.isRequired,
}

export default BlogForm
