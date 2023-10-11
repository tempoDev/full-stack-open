import React from 'react'
import Person from './Person'

export default function Persons({list, removeNumber}) {
  return (
    <>
    {
        list.map( (person, i) => {
          return <div key={person.id}>
            <Person name={person.name} phone={person.number} removeNumber={removeNumber}/>
            <button onClick={() => removeNumber(person.id)}>Delete</button>
          </div>
        })
      }
    </>
  )
}
