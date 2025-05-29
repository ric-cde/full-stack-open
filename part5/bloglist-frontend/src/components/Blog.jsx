import { useState } from "react"

const Blog = ({ blog, updateBlog, handleDelete, user }) => {
	const [details, showDetails] = useState(false)
	const blogStyle = {
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
		paddingTop: "0.5em",
		paddingLeft: "0.5em",
	}

	const itemStyle = {
		lineHeight: 0,
	}

	const incrementLikes = () => {
		updateBlog({
			...blog,
			likes: blog.likes + 1,
		})
	}

	const handleClick = () => showDetails(!details)
	return (
		<div style={blogStyle} data-testid="blogItem">
			<div style={itemStyle}>
				<strong>{blog.title}</strong> <em>{blog.author} </em>
				<button onClick={handleClick}>
					{details ? "hide" : "view"}
				</button>
				{details && (
					<div className="details">
						<p>{blog.url}</p>
						<p>
							<span data-testid="blogLikes">{blog.likes}</span>{" "}
							&nbsp;
							<button onClick={incrementLikes} id="like-button">
								like
							</button>
						</p>
						<p>{blog.user.name}</p>
						{console.log(
							"blog.user.username",
							blog.user.username,
							"| user.username",
							user.username
						)}
						{blog.user.username === user.username && (
							<button onClick={() => handleDelete(blog)}>
								delete
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default Blog
