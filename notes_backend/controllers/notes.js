const notesRouter = require("express").Router()
const Note = require("../models/note")

notesRouter.get("/", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

notesRouter.post("/", (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important,
    date: new Date()
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(err => next(err))
})

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(err => next(err))
})

module.exports = notesRouter