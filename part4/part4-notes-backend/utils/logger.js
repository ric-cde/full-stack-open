const info = (...params) => {
	if (process.env.NODE_ENV !== "testz") {
		console.log(...params)
	}
}

const error = (...params) => {
	if (process.env.NODE_ENV !== "testz") {
		console.error(...params)
	}
}

export default { info, error }
