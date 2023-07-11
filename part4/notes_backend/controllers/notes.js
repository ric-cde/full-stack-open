const notesRouter = require("express").Router()
const logger = require("../utils/logger")
const Note = require("../models/note")

notesRouter.get("/", (req, res) => {
	logger.info("returning all notes... ")
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

notesRouter.get("/:id", (req, res, next) => {
	Note.findById(req.params.id)
		.then((note) => {
			if (note) {
				logger.info(
					`returning note ${note.id}: ${note.content} (${
						note.important ? "important" : "normal"
					})`)
				res.json(note)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => next(error))
})

notesRouter.delete("/:id", (req, res, next) => {
	logger.info(`Deleting note ${req.params.id}...`)

	Note.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

notesRouter.post("/api/notes", (req, res, next) => {
	const note = new Note({
		content: req.body.content,
		date: new Date(),
		important: req.body.important || false,
	})

	logger.info(
		`Saving new note to db: ${note.content} (${
			note.important ? "important" : "normal"
		})`
	)

	note.save()
		.then((savedNote) => {
			res.json(savedNote)
		})
		.catch((error) => next(error))
})

notesRouter.put("/:id", (req, res, next) => {
	const { content, important } = req.body

	const note = {
		content,
		important,
	}
	logger.info(`Updating ${req.params.id} with ${req.body}`)

	Note.findByIdAndUpdate(req.params.id, note, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((updatedNote) => {
			res.json(updatedNote)
		})
		.catch((error) => next(error))
})

module.exports = notesRouter