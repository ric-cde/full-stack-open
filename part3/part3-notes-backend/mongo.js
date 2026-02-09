import mongoose from "mongoose"

if (process.argv.length < 3){
 console.log("give password as argument")
process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.or1jbsc.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

// const note = new Note({
// 	content: "redoing this step",
// 	important: true,
// })

// note.save().then(result => {
// 	console.log("note saved!")
// 	mongoose.connection.close()
// })

Note.find({ content: /opp/i }).then((result) => {
	result.forEach((note) => {
		console.log(note)
	})
	mongoose.connection.close()
})
