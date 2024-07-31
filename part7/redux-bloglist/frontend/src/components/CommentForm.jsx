import React from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { setNotification } from '../reducers/notificationReducer'
import { addComment } from '../reducers/commentReducer'

export default function CommentForm( { id } ) {

  const dispatch = useDispatch()

  const sendComment = async (event) => {
    event.preventDefault()

    const comment = event.target.comment.value
    event.target.comment.value = ''

    dispatch(addComment(id, comment))
    dispatch( setNotification('New comment added', 5))
  }


  return (
    <>
      <Form onSubmit={sendComment}>
        <Form.Group>
          <Form.Control name="comment" />
        </Form.Group>

        <Button type='submit' variant='primary'>
                Comentar
        </Button>
      </Form>
    </>
  )
}
