import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeComments } from '../reducers/commentReducer'

export default function Comment( { id } ) {

  const comments = useSelector( state => state.comments )

  return (
    <>
      <h2>Comentarios</h2>

      { comments.map( (comment) => {
        <li key={comment.id}>{comment.content}</li>
      })}
    </>
  )
}
