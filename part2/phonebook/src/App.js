import { useState } from 'react'
import { useEffect } from 'react'
import NewPersonForm from './components/NewPersonForm'
import Numbers from './components/Numbers'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [currentFilter, setCurrentFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [messageType, setMessageType] = useState(0)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log(`Failed to retrieve notes: ${error}`)
      })
    }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    // check if the name input already exists
    const findPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (findPerson) {
      console.log('Found a person:', findPerson)
      const updatedPerson = { ...findPerson, number: newNumber }

      // Prompt user to confirm, then send idea and new object in put request
      if (window.confirm(`${newName} already exists. Do you want to update their number?`)) {

        personService
          .update(findPerson.id, updatedPerson)
          .then(returnedPerson => {
            console.log('Returned: ', returnedPerson)
            setPersons([...persons.filter(p => p.id !== findPerson.id), returnedPerson])
            console.log(persons)
            setMessageType(1)
            setNewMessage(
              `Updated ${returnedPerson.name} with phone number: ${newNumber}`
            )
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      // If the person wasn't found, post a new person to the server
      console.log('Adding new person...')
      const newPerson = {name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(returnedPerson => {
          console.log('response: ', returnedPerson)
          setPersons([...persons, returnedPerson])
          setMessageType(1)
          setNewMessage(
            `Added ${newName}`
          )
        })
        .catch(error => {
          console.log('Error while adding item: ', error)
        })

      setTimeout(() => {
        setNewMessage(null)
      }, 5000)
      // console.log(persons)
      setNewName('')
      setNewNumber('')
    }
  }

  const handleDelete = (person) => {
    console.log('DELETING...', person.name)
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          console.log('error :', error)
          setMessageType(0)
            setNewMessage(
              `${person.name} has already been removed from the server.`
            )
            setTimeout(() => {
              setNewMessage(null)
            }, 5000)
        }
        )
      }
  }

  const handleNameChange = (e) => {
    console.log(e.target.value);
    setNewName(e.target.value);
  }

  const handleNumberChange = (e) => {
    console.log(e.target.value);
    setNewNumber(e.target.value);
  }

  const handleFilterChange = (e) => {
    console.log(e.target.value);
    setCurrentFilter(e.target.value);
  }

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().match(
      currentFilter.toLowerCase()
      )
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} type={messageType} />
        <Filter handleChange={handleFilterChange} value={currentFilter} />
        <div>debug: {currentFilter} | {newName} | {newNumber}</div>

      <h2>Add a new</h2>
      <NewPersonForm 
        onSubmit={handleSubmit} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        newName={newName} 
        newNumber={newNumber}
        />

      <h2>Numbers</h2>
      <Numbers persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App