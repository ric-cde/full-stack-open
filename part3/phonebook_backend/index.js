const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
require("dotenv").config()

// const requestLogger = (req, res, next) => {
//     console.log('Method:', req.method)
//     console.log('Path: ', req.path)
//     console.log('Body: ', req.body)
//     console.log('---')
//     next()
//     }
// app.use(requestLogger)

morgan.token("body", (req) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body) // req.headers['content-type'] == 'application/json' ? _ : "not JSON"
	}
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" })
}

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

const Person = require("./models/person")

// app.use(morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms',
//       tokens.res(req, res, 'body'),
//     ].join(' ')
//   }))

// let phonebook = [
// 	{
// 		id: 1,
// 		name: "Arto Hellas",
// 		number: "040-123456",
// 	},
// 	{
// 		id: 2,
// 		name: "Ada Lovelace",
// 		number: "39-44-5323523",
// 	},
// 	{
// 		id: 3,
// 		name: "Dan Abramov",
// 		number: "12-43-234345",
// 	},
// 	{
// 		id: 4,
// 		name: "Mary Poppendieck",
// 		number: "39-23-6423122",
// 	},
// ]

app.get("/api/people", (req, res) => {
	console.log("returning every person...")
	Person.find({}).then(people => {
		res.json(people)
	})
})

app.get("/api/people/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				console.log(
					`returning person ${person.id}: ${person.name} (${person.number})`
				)
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => next(error))

	// const id = Number(req.params.id)
	// const person = phonebook.find((person) => person.id === id)
	// if (person) {
	// 	res.json(person)
	// } else {
	// 	res.status(404).end()
	// }
})

app.get("/api/info", (req, res, next) => {
	const time = new Date()
	Person.find({})
		.then((people) => {
			const count = people.length
			const page = `<p>Phonebook has info for ${count} people</p>
						<p>${time}</p>`
			res.send(page)
		})
		.catch((error) => next(error))
})

app.get("/", (req, res) => {
	res.send("<h1>Phonebook</h1>")
})

app.delete("/api/people/:id", (req, res, next) => {
	const id = req.params.id
	console.log(`Deleting person  ${id}...`)

	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			console.log("Removed:", result)
			res.status(204).end()
		})
		.catch(error => next(error))

	// const id = Number(req.params.id)
	// phonebook = phonebook.filter((person) => id !== person.id)
	// res.status(204).end()
})

app.post("/api/people", (req, res, next) => {
	const body = req.body

	Person.find({ name: body.name })
		.then((existingPersons) => {
			console.log(existingPersons)

			if (existingPersons.length !== 0) {
				return res.status(409).json({
					error: "name already exists",
				})
			} else {
				const person = new Person({
					name: body.name,
					number: body.number,
				})

				person.save().then((savedPerson) => {
					res.status(201).json(savedPerson)
				})
					.catch((error) => next(error))
			}

		})
		.catch(error => next(error))
})

app.put("/api/people/:id", (req, res, next) => {
	const id = req.params.id
	const { name, number } = req.body

	const person = {
		name,
		number,
	}
	console.log(`Updating ${id} with ${req.body}`)

	Person.findByIdAndUpdate(
		id,
		person,
		{ new: true, runValidators: true, context: "query" }
	)
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

// const generateId = () => Math.round(Math.random() * 1000000000000000)

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})


const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)