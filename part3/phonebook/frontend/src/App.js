import { useEffect, useState } from "react";
import PersonsServices from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

function App() {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const [ filterName, setFilterName] = useState('')
  const [ message, setMessage ] = useState(null)

  useEffect( () => {
    PersonsServices.getAll()
    .then( initialData => {
      setPersons(initialData)
    }
    )
  }, [])

  useEffect( () => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }, [message])

  const handleName = (event) => {
    setNewName( event.target.value)
  }

  const handlePhone = (event) => {
    setNewPhone( event.target.value )
  }

  const addName = (event) => {
    event.preventDefault();

    const exists = persons.find( data => data.name.toLowerCase() === newName.toLowerCase())
    const changed = {...exists, number: newPhone}
    const newPerson = {
      name: newName,
      number: newPhone
    }

    if( exists && exists.number === newPerson.number ){
      alert(`${newName} is already added to phonebook`)
      return false
    } else if( exists && exists.number !== newPerson.number){
      if(window.confirm(`${newName} already exists. Replace the old number with a new one?`)){
        PersonsServices.update(exists.id, changed)
        .then( newPerson => {
          const updated = persons.map( (person) => 
            person.id !== newPerson.id ? person : newPerson
          )
          setPersons(updated)
        })
        .catch( (error) => {
          error = JSON.parse(error.request.response)
          setMessage( 'ERROR: ' + error.message)
        })
      }
    } else {
      PersonsServices.addNew(newPerson)
      .then( returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`${returnedPerson.name} added to PhoneBook`)
      })
      .catch( (error) => {
        error = JSON.parse(error.request.response)
        setMessage( 'ERROR: ' + error.message)
      })
    }

    setNewName("")
    setNewPhone("")
  }

  const removeNumber = (id) => {
    const person = persons.find( person => person.id === id)
    if(window.confirm(`Delete ${person.name}?`)){
      PersonsServices.remove(id)
      .then( response=> {
        const newList = persons.filter( person => person.id !== id)
        setPersons(newList)
        alert(`${person.name} removed`)
      })
      .catch( (error) => {
        setMessage(`ERROR: Information of ${person.name} has already been removed from server`)
      })
    }
  }

  const handleFilter = ( event ) => {
    setFilterName( event.target.value )
  }

  const setFilter = persons.map( data => data.name.toLowerCase().includes( filterName.toLowerCase)) 
    ? persons.filter( data =>  data.name.toLowerCase().includes( filterName.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter handleFilter={handleFilter} />

      <h2>Add a new</h2>
      <Notification message={message} />
      <PersonForm newName={newName} newPhone={newPhone} addName={addName} handleName={handleName} handlePhone={handlePhone} />

      <h2>Numbers</h2>
      <Persons list={setFilter} removeNumber={removeNumber} />
      
    </div>
  )
}

export default App;
