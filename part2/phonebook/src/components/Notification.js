
const Notification = ({ message, type }) => {
	// console.log('message: ', message, ' type: ', type)
    if (message === null) {
		// console.log('message was null')
		return null
		}
	return (
		<div className={ type === 1 ? "message" : "error" }>
		{message}
		</div>
	)
}

export default Notification