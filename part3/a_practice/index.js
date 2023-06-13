const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---');
  next()
}
app.use(requestLogger)


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    console.log('returning all notes... ')
    response.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
      console.log(`returning note ${id}: ${note.content} (${note.important ? "important" : "normal"}) 
===`)
      res.json(note)
    } else {
      console.log(`Note ${id}: not found`)
      res.status(404).end() // .send(`Note ${id} not found`)
    }
})
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  console.log(`Deleting note ${id}...`)
  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1
}

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return response.status(404).json({
      error: 'content missing'
    })
  }

  const id = generateId()

  let note = {
    'id': id,
    'content': body.content,
    'date': new Date(),
    'important': body.important || false
  }

  console.log(`adding new note ${id}: ${note.content} (${note.important ? "important" : "normal"}) 
===`)
  
  notes.push(note)
  res.json(note)
  }
)

const PORT = 3001 // process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (req, res) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)