import { useState, useEffect, useRef } from "react"
import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import noteService from "./services/notes"
import loginService from "./services/login"
import LoginForm from "./components/LoginForm"
import NoteForm from "./components/NoteForm"
import Togglable from "./components/Togglable"

const App = () => {
	const [notes, setNotes] = useState([])
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(null)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [user, setUser] = useState(null)
	const noteFormRef = useRef()

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser")
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			noteService.setToken(user.token)
		}
	}, [])

	useEffect(() => {
		noteService.getAll().then((initialNotes) => {
			setNotes(initialNotes)
		})
	}, [])

	const logOut = (e) => {
		e.preventDefault
		window.localStorage.removeItem("loggedNoteappUser")
		setUser(null)
	}

	const toggleImportanceOf = (id) => {
		const note = notes.find((n) => n.id === id)
		const changedNote = { ...note, important: !note.important }

		noteService
			.update(id, changedNote)
			.then((returnedNote) => {
				setNotes(
					notes.map((note) => (note.id !== id ? note : returnedNote))
				)
			})
			.catch((error) => {
				setErrorMessage(
					`Note '${note.content}' was already removed from server`
				)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setNotes(notes.filter((n) => n.id !== id))
			})
	}

	const handleLogin = async (e) => {
		e.preventDefault()

		try {
			const user = await loginService.login({ username, password })

			window.localStorage.setItem(
				"loggedNoteappUser",
				JSON.stringify(user)
			)

			noteService.setToken(user.token)
			setUser(user)
			setUsername("")
			setPassword("")
		} catch (exception) {
			setErrorMessage("Wrong credentials")
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	const notesToShow = showAll ? notes : notes.filter((note) => note.important)

	const addNote = (noteObject) => {
		noteFormRef.current.toggleVisibility()
		noteService.create(noteObject).then((returnedNote) => {
			setNotes(notes.concat(returnedNote))
		})
	}

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />

			{/* user not logged in, show login */}
			{!user && (
				<Togglable buttonLabel="log in">
					<LoginForm
						onSubmit={handleLogin}
						{...{
							username,
							password,
							setUsername,
							setPassword,
						}}
					/>
				</Togglable>
			)}

			{/* user logged in, show details + add note form */}
			{user && (
				<div>
					<p>
						{user.name} logged-in{" "}
						<button onClick={logOut}>logout</button>
					</p>

					<Togglable buttonLabel="new note" ref={noteFormRef}>
						<NoteForm createNote={addNote} />
					</Togglable>
				</div>
			)}

			<h2>Notes</h2>

			<div>
				<button onClick={() => setShowAll(!showAll)}>
					show {showAll ? "important" : "all"}
				</button>
			</div>
			<ul>
				{notesToShow.map((note) => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
					/>
				))}
			</ul>

			<Footer />
		</div>
	)
}

export default App
