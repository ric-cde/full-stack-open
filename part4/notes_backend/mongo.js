const mongoose = require('mongoose')
const { Schema } = mongoose
const { model } = mongoose

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.or1jbsc.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new Schema({
    content: String,
    important: Boolean,
})

const Note = model('Note', noteSchema)

// const note = new Note({
//     content: 'also not important.',
//     important: false,
// })

// note.save().then(result => {
//     console.log('Note saved!')
//     console.log('result', result)
//     mongoose.connection.close()
// })

Note.find({ important: false }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})