import { useState, forwardRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"

const Togglable = forwardRef((props, refs) => {
	const [visible, setVisible] = useState(false)

	const hideWhenVisible = { display: visible ? "none" : "" }
	const showWhenVisible = { display: visible ? "" : "none" }

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility,
		}
	})

	return (
		<div>
			<div style={hideWhenVisible}>
				<button onClick={toggleVisibility}>{props.buttonLabel}</button>
			</div>
			<div style={showWhenVisible} className="togglableContent">
				{props.children}
				<button onClick={toggleVisibility}>cancel</button>
			</div>
		</div>
	)
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired
}

// ALTERNATE IMPLEMENTATION

// const Togglable = (props) => {
// 	const [open, setOpen] = useState(false)

// 	if (open) {
// 		return (
// 			<>
// 				{children}
// 				<button onClick={() => setOpen(false)}>cancel</button>
// 			</>
// 		)
// 	} else {
// 		return (
// 			<>
// 				<button onClick={() => setOpen(true)}>props.opener</button>
// 			</>
// 		)
// 	}
// }

export default Togglable
