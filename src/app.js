const express = require('express')
const app = express()

app.use(express.json())

const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')

app.use(cors())

mongoose.connect(process.env.mongodb_url).then(() => console.log("Connected Successfully")).catch(err => console.log(err))

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  }
})

const Notes = mongoose.model("NotesList", NoteSchema)

app.post('/enterNote', async (req, res) => {
  const { title, note } = req.body
  try {
    const newNote = new Notes({ title, note })
    await newNote.save()
    console.log("Inserted Succesfully")
    res.status(201).send("Posted Succesfully")

  }
  catch (err) {
    console.log(err)
    res.status(501).send("error")
  }
})

app.put('/updateNote/:id', async (req, res) => {
  const { title, note } = req.body
  try {
    const FindNote = await Notes.findByIdAndUpdate(req.params.id, { title: title, note: note })

    if (!FindNote) {
      return res.status(301).json({ message: "note not found" })
    }

    console.log("updated successfuly")
    res.status(201).json({ message: "Updated Successfully" })
  }
  catch (err) {
    console.log(err)
    res.status(501).json({ error: "error" })

  }
})

app.get('/getNotes', async (req, res) => {
  try {
    const data = await Notes.find()
    res.status(201).json(data)
  }
  catch (err) {
    console.log(err)
    res.status(501).send("error")
  }
})

app.get('/getNote/:title', async (req, res) => {
  try {
    const data = await Notes.find({ title: req.params.title })
    res.status(201).json(data)
  }
  catch (err) {
    console.log(err)
    res.status(501).json({ err: "error" })
  }
})

app.delete('/deleteNote/:id', async (req, res) => {
  try {
    const delnote = await Notes.findByIdAndDelete(req.params.id)
    res.status(201).json({ message: "Deleted the note" })
    if (!delnote) {
      return res.status(301).json({ message: "Note not Found" })
    }
    console.log("Deleted Successfully")

  }
  catch (err) {
    console.log(err)
    res.status(501).json(err)
  }
})

const port = 8000
app.listen(port, () => {
  console.log("Server connected successfully http://localhost:%s", port)
})

app.get('/', (req, res) => {
  res.send("Welcome to 'Note Maker From Mongodb' ")
})

