const {
  response,
  request
} = require('express')
const express = require('express')
let morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(express.static('build'))

app.use(cors())

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

let persons = [{
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "555-567-45555",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]
app.get('/api/person', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const data = `<div>${new Date()}</div>`
  const info = `<div>Phonebook has info for ${persons.length} piople</div>${data}`
  response.send(info)
})

app.get('/api/person/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)
  person
    ?
    response.json(person) :
    response.status(404).end()
})

app.delete('/api/person/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
})

const generated = () => {
  let id = Math.floor(Math.random() * 1000)
  let findId = persons.find((p) => p.id === id)
  while (findId) {
    id = Math.floor(Math.random() * 10)
    findId = persons.find((p) => p.id === id)
  }
  return id
}

app.post('/api/person', (request, response) => {
  const body = request.body
  const name = persons.find((p) => p.name === body.name)
  if (!body.number || !body.name ) {
    return response.status(400).json({
      Error: 'content missing'
    })
  }
  if (name) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generated()
  }
  persons = persons.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})