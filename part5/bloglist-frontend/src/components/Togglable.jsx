import { useState, forwardRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"

const Togglable = forwardRef(({ buttonLabel, cancelLabel, children }, ref) => {
	const [visible, setVisible] = useState(false)

	const toggleVisibility = () => setVisible(!visible)
	useImperativeHandle(ref, () => ({
		toggleVisibility,
	}))

	if (visible) {
		return (
			<div>
				{children}{" "}
				<button onClick={toggleVisibility}>{cancelLabel}</button>
			</div>
		)
	} else {
		return <button onClick={toggleVisibility}>{buttonLabel}</button>
	}
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
