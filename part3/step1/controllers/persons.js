const personsRouter = require('express').Router()
const Person = require('../models/person')


const generateId = () => {
  const persons = Person.find({})
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

personsRouter.get('/info', (request, response) => {
  const ts = Date.now()
  const persons = Person.find({})
  const date_ob = new Date(ts)
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${date_ob.toString()}</p>`)
})

personsRouter.get('/', (request, response) => {
  console.log('phonebook:')
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number
  })

  console.log(person)

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {

      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    //result
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})


module.exports = personsRouter