import { useState, useEffect } from 'react'
import './index.css'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageStyle, setMessageStyle] = useState('confirmStyle')


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => { setPersons(initialPersons) })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  // || person.number == newNumber
  const addPerson = () => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    const personFound = persons.filter((person) => (person.name.toLowerCase() == newName.toLowerCase()))

    if (personFound.length != 0) {
      if (window.confirm(`${personFound[0].name} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(personFound[0].id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map(person => {
                if (person.name.toLowerCase() == newName.toLowerCase()) {
                  return { id: personFound[0].id, name: newPerson.name, number: newPerson.number }
                } else {
                  return person
                }
              })
            )
            setMessageStyle('confirmStyle')
            setMessage(`Updated ${newPerson.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessageStyle('errorStyle')
            setMessage(
              `Person '${newPerson.name}' was already removed from server`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })

      }
    } else {
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessageStyle('confirmStyle')
          setMessage(`Added ${newPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)

        })
        .catch(error => {
          setMessageStyle('errorStyle')
          setMessage(error.response.data.error)
          setTimeout(() => {
              setMessage(null)
            }, 5000)

        })
    }
  }

  const deletePerson = (id) => {
    personService.deletePerson(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} style={messageStyle} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h2>Add New Record</h2>

      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />

      <h2>Numbers</h2>

      <Persons persons={persons} newFilter={newFilter} deletePerson={deletePerson} />
    </div>
  )
}

export default App