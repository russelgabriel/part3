const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const PORT = process.env.PORT || 3001

morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan('tiny', {
  skip: (request, response) => Object.keys(request.body).length !== 0
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (request, response) => Object.keys(request.body).length === 0
}))

let people = 
[
    { 
      "id": 1,
      "name": "Tamilyn Te", 
      "number": "347-366-1522"
    },
    { 
      "id": 2,
      "name": "Russel Sy", 
      "number": "646-787-5397"
    },
    { 
      "id": 3,
      "name": "Grant Kind", 
      "number": "1234567890"
    },
    { 
      "id": 4,
      "name": "Sagar Risal", 
      "number": "0987654321"
    },
    {
      "id": 5,
      "name": "Lillie Yao",
      "number": "6574839201"
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
  } else if (people.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
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