import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { addLike } from '../reducers/blogReducer'
import CommentForm from './CommentForm'
import Comment from './Comment'
import { setNotification } from '../reducers/notificationReducer'

export default function SingleBlog() {

  const dispatch = useDispatch()
  const id = useParams().id
  const blogs = useSelector( state => state.blogs )

  const blog = blogs.find( b => b.id === id )

  if( !blog ) { return null}

  const handleLike = () => {
    dispatch(addLike(blog))
    dispatch(setNotification(`${blog.title} liked!`, 5))
  }

  /*  --------- DISPLAY --------- */
  return (
    <>
      <h2>{ blog.title }</h2>

      <div>
        <p>{ blog.url }</p>
        <p> { blog.likes } <button onClick={handleLike}>Like</button></p>
        <CommentForm id={blog.id} />
        <Comment id={blog.id}/>
      </div>
    </>
  )
}
