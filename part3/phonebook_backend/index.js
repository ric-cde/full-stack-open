const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json()) 
morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body) // req.headers['content-type'] == 'application/json' ? _ : "not JSON"
    }
})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

// app.use(morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms',
//       tokens.res(req, res, 'body')
//     ].join(' ')
//   }))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phonebook.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const count = phonebook.length
    const time = new Date()
    const page = `<p>Phonebook has info for ${count} people</p>
                <p>${time}</p>`
    res.send(page)
})

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(person => id !== person.id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name
    
    if (!name) {
        return res.status(400).json({
            error: 'name missing'
          })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
          })
    } else if (
        phonebook.find(
            person => person.name === name
        )) {
            return res.status(409).json({
                error: 'name already exists'
              })
    } else {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        } 
        phonebook = phonebook.concat(person)  
        res.json(person)        
    }
})

const generateId = () => Math.round(Math.random()*1000000000000000)

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})