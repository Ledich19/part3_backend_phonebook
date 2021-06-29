const {
  response,
  request
} = require('express')
require('dotenv').config()
const express = require('express')
const app = express()
let morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('content', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/api/person', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
    console.log(persons);
  })
})

app.get('/api/info', (request, response) => {
  const data = `<div>${new Date()}</div>`
  const info = `<div>Phonebook has info for ${persons.length} piople</div>${data}`
  response.send(info)
})

app.get('/api/person/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person
        ?
        response.json(person) :
        response.status(404).end()
    })
    .catch(error => next(error))

})

app.delete('/api/person/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/person/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, {
      new: true
    })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.post('/api/person', (request, response,next) => {
  const body = request.body
  if (!body.number || !body.name) {
    return response.status(400).json({
      Error: 'content missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(newPerson => {
      response.json(person.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name==='ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})