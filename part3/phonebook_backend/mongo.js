const mongoose = require('mongoose')
const { Schema } = mongoose
const { model } = mongoose

const argc = process.argv.length
if (argc < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@cluster0.or1jbsc.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new Schema({
    name: String,
    number: String,
})

const Person = model('Person', personSchema)

if (argc == 4) {
    console.log('Phonebook: ')

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
    })

    mongoose.connection.close()

} else {

    const person = new Person ({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log('Person saved!');
        console.log(result)
        mongoose.connection.close()
    })
}