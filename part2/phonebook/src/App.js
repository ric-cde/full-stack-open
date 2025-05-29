// latest updated version

import { useState } from "react"
import { useEffect } from "react"
import NewPersonForm from "./components/NewPersonForm"
import Numbers from "./components/Numbers"
import Filter from "./components/Filter"
import personService from "./services/people"
import Notification from "./components/Notification"

const App = () => {
	const [persons, setPersons] = useState([])
	const [formData, setFormData] = useState({ name: "", number: "" })
	const [currentFilter, setCurrentFilter] = useState("") // input filter for filtering persons
	const [newMessage, setNewMessage] = useState(null)
	const [messageType, setMessageType] = useState(0)

	useEffect(() => {
		personService
			.getAll()
			.then(setPersons)
			.catch((error) => console.log(`Failed to retrieve notes: ${error}`))
	}, []) // ✅ Runs only once when the component mounts

	useEffect(() => {
		if (newMessage) {
			const timeout = setTimeout(() => setNewMessage(null), 5000)
			return () => clearTimeout(timeout)
		}
	}, [newMessage]) // ✅ Only depends on newMessage

	const personsToShow = persons.filter((p) =>
		p.name.toLowerCase().includes(currentFilter.toLowerCase())
	)

	const handleSubmit = (e) => {
		e.preventDefault()

		// check if the name input already exists in client memory
		const foundPerson = persons.find(
			(person) =>
				person.name &&
				person.name.toLowerCase() === formData.name.toLowerCase()
		)
		if (foundPerson) {
			console.log("Found a person:", foundPerson)
			const updatedPerson = { ...foundPerson, number: formData.number }
			console.log("updatedPerson:", updatedPerson)

			// Prompt user to confirm, then send idea and new object in put request
			if (
				window.confirm(
					`${formData.name} already exists. Do you want to update their number?`
				)
			) {
				personService
					.update(foundPerson.id, updatedPerson)
					.then((returnedPerson) => {
						console.log("Returned: ", returnedPerson)
						setPersons((prevPersons) =>
							prevPersons.map((p) =>
								p.id !== foundPerson.id ? p : returnedPerson
							)
						)
						setMessageType(1)
						setNewMessage(
							`Updated ${returnedPerson.name} with phone number: ${formData.number}`
						)
					})
					.catch((error) => {
						console.log("Error while updating item: ", error)
						const errorMessage =
							error.response?.data?.error ||
							"An unexpected error occurred."
						console.log(errorMessage)
						setMessageType(0)
						setNewMessage(`${errorMessage}.`)
					})
			}
		} else {
			// If the person wasn't found, post a new person to the server
			console.log("Adding new person...")
			const newPerson = { name: formData.name, number: formData.number }
			personService
				.create(newPerson)
				.then((returnedPerson) => {
					console.log("response: ", returnedPerson)
					setPersons((prevPersons) => [
						...prevPersons,
						returnedPerson,
					])
					setMessageType(1)
					setNewMessage(`Added ${formData.name}`)
				})
				.catch((error) => {
					console.log("Error while adding item: ", error)
					const errorMessage =
						error.response?.data?.error ||
						"An unexpected error occurred."
					console.log(errorMessage)
					setMessageType(0)
					setNewMessage(`${errorMessage}.`)
				})
		}
		setFormData({ name: "", number: "" })
	}

	const handleDelete = (person) => {
		console.log("DELETING...", person.name)
		if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
			personService
				.remove(person.id)
				.then((response) => {
					setPersons((prevPersons) =>
						prevPersons.filter((p) => p.id !== person.id)
					)
				})
				.catch((error) => {
					console.log("error :", error)
					setMessageType(0)
					setNewMessage(
						`${person.name} has already been removed from the server.`
					)
					    setPersons((prevPersons) =>
							prevPersons.filter((p) => p.id !== person.id)
						)

					setTimeout(() => {
						setNewMessage(null)
					}, 5000)
				})
		}
	}

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleFilterChange = (e) => {
		console.log(e.target.value)
		setCurrentFilter(e.target.value)
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={newMessage} type={messageType} />
			<Filter handleChange={handleFilterChange} value={currentFilter} />
			<div>
				debug: {currentFilter} | {formData.name} | {formData.number}
			</div>

			<h2>Add a new</h2>
			<NewPersonForm
				onSubmit={handleSubmit}
				handleInputChange={handleInputChange}
				formData={formData}
			/>

			<h2>Numbers</h2>
			<Numbers persons={personsToShow} handleDelete={handleDelete} />
		</div>
	)
}

export default App
