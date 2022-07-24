const express = require("express")
const app = express()
app.use(express.json())
const PORT = 3001

let people = 
[
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

app.get('/api/people', (request, response) => {
    response.json(people)
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${people.length} people</p>
    <p>${new Date()}</p>`
  )
})

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = people.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * (100000))
}

app.post('/api/people', (request, response) => {
  const body = request.body

  const found = people.find(person => {
    return person.name.toLowerCase() === body.name.toLowerCase()
  })

  console.log(found);

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
    })
  } else if (found) {
    return response.status(404).json({
      error: "Name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  people = people.concat(person)
  response.json(person)
})

app.listen(PORT, () => {
    console.log(`Phonebook server running on port ${PORT}`);
})