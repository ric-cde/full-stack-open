import axios from "axios"
import type { Note, NewNote } from "../types.ts"

const baseUrl = "http://localhost:3001/notes"

export const getAllNotes = () => {
	return axios.get<Note[]>(baseUrl).then((response) => response.data)
}

export const createNote = (newNote: NewNote) => {
	return axios.post<Note>(baseUrl, newNote).then((response) => response.data)
}
