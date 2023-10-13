import React from 'react'

export default function Filter({ handleFilter}) {
  return (
    <>
      filter shown with <input onChange={ handleFilter }/>
    </>
  )
}
