import { useEffect, useState } from "react"
import { getAllNotes, createNote } from "./services/noteService.ts"
import type { Note } from "./types.ts"

const App = () => {
	const [newNote, setNewNote] = useState("")
	const [notes, setNotes] = useState<Note[]>([
		{ id: "1", content: "first test" },
	])

	const noteCreation = (e: React.SyntheticEvent) => {
		e.preventDefault()

		createNote({ content: newNote }).then((data) => {
			setNotes([...notes, data])
		})

		setNewNote("")
	}

	useEffect(() => {
		getAllNotes().then((data) => {
			setNotes(data)
		})
	}, [])

	return (
		<div>
			<form onSubmit={noteCreation}>
				<input
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
				/>
				<button type="submit">Add</button>
			</form>

			<ul>
				{notes.map((n) => (
					<li key={n.id}>{n.content}</li>
				))}
			</ul>
		</div>
	)

	return null
}

export default App
