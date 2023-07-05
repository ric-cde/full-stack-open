const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---');
  next()
  }

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}
  
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

const Note = require('./models/note')


// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       date: "2022-05-30T17:30:31.098Z",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only Javascript",
//       date: "2022-05-30T18:39:34.091Z",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       date: "2022-05-30T19:20:14.298Z",
//       important: true
//     }
//   ]

// app.get('/', (req, res) => {
//     res.send('<h1>Hello World</h1>')
// })

app.get('/api/notes', (req, res) => {
    console.log('returning all notes... ')
    Note.find({}).then(notes => {
      res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    console.log(`returning note ${note.id}: ${note.content} (${note.important ? "important" : "normal"})`)
    res.json(note)
  })

//     const id = Number(req.params.id)
//     const note = notes.find(note => note.id === id)
//     if (note) {
//       console.log(`returning note ${id}: ${note.content} (${note.important ? "important" : "normal"}) 
// ===`)
//       res.json(note)
//     } else {
//       console.log(`Note ${id}: not found`)
//       res.status(404).end() // .send(`Note ${id} not found`)
//     }
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
    return res.status(404).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  console.log(`Saving new note to db: ${note.content} (${note.important ? "important" : "normal"})`);
  
  note.save().then(savedNote => {
    res.json(savedNote)
  })
  // const id = generateId()
  // let note = {
  //   'id': id,
  //   'content': body.content,
  //   'date': new Date(),
  //   'important': body.important || false
  // }
  // notes.push(note)
  
  // console.log(`adding new note ${id}: ${note.content} (${note.important ? "important" : "normal"}) 

})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})