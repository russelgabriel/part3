require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const PORT = process.env.PORT
const Person = require("./models/person")

morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan('tiny', {
  skip: (request, response) => Object.keys(request.body).length !== 0
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (request, response) => Object.keys(request.body).length === 0
}))

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response, next) => {
  Person.countDocuments().then(numPeople => {
    response.send(
      `<p>Phonebook has entries for ${numPeople} people</p>
      <p>${new Date()}</p>`
    )
  })
  .catch(err => next(err))
})

app.get('/api/people/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const person = people.find(person => person.id === id)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }

  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(err => next(err))
})

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))

})

// const generateId = () => {
//   return Math.floor(Math.random() * (100000))
// }

app.post('/api/people', (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(404).json({
      error: "Name and number not provided"
    })
  } else if (!body.name) {
    return response.status(404).json({
      error: "Name not provided"
    })
  } else if (!body.number) {
    return response.status(404).json({
      error: "Number not provided"
    })}
  // } else if (people.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
  //   return response.status(404).json({
  //     error: "Name must be unique"
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === "CastError") {
    return response.status(400).send({error: "malformatted id"})
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Phonebook server running on port ${PORT}`);
})