import React from 'react'

export default function PersonForm({newName, newPhone, addName, handleName, handlePhone}) {
  return (
    <>
    <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleName} />
          number: <input value={newPhone} type="tel" onChange={handlePhone} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}
