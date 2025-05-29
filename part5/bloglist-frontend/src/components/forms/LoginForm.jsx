import PropTypes from "prop-types"

const LoginForm = ({
	handleLogin,
	username,
	password,
	setUsername,
	setPassword,
}) => {
	return (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input
					type="text"
					name="username"
					value={username}
					onChange={({ target }) => setUsername(target.value)}
					data-testid="username"
				/>
			</div>
			<div>
				password
				<input
					type="password"
					name="password"
					value={password}
					onChange={({ target }) => setPassword(target.value)}
					data-testid="password"
				/>
			</div>
			<button type="submit">log in</button>
		</form>
	)
}

LoginForm.propTypes = {
	handleLogin: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	setUsername: PropTypes.func.isRequired,
	setPassword: PropTypes.func.isRequired,
}

export default LoginForm
