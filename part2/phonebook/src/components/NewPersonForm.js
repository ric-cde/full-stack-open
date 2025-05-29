
const NewPersonForm = ({
	onSubmit,
	handleInputChange,
	formData
}) => {
	return (
		<form onSubmit={onSubmit}>
			<div>
				name:{" "}
				<input name="name" onChange={handleInputChange} value={formData.name} />
			</div>
			<div>
				number:{" "}
				<input name="number" onChange={handleInputChange} value={formData.number} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

export default NewPersonForm