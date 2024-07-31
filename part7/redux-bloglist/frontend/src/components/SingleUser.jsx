import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function SingleUser() {

  const users = useSelector( state  => state.users)
  const id = useParams().id
  const user = users.find( n => n.id === String( id ) )

  if( !user) { return null}

  return (
    <>
      <h2>{user.name}</h2>

      <ul>
        { user.blogs.map( blog => (
          <li key={ blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}
