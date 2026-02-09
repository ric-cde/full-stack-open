import { useState } from "react"
import PropTypes from "prop-types"

const LoginForm = ({ handleSubmit }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const logIn = (e) => {
		e.preventDefault()
		handleSubmit({
			username,
			password,
		})
	}

	return (
		<form onSubmit={logIn}>
			<h2>Login</h2>
			<div>
				Username
				<input
					id="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div>
				Password
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button id="login-button" type="submit">
				Log in
			</button>
		</form>
	)
}

LoginForm.PropTypes = {
	handleSubmit: PropTypes.func.isRequired,
}

export default LoginForm
