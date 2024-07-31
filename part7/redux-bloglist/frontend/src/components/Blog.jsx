import { useState } from 'react'
import PropTypes from 'prop-types'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { addLike, deleteBlog } from '../reducers/blogReducer'
import { useParams } from 'react-router-dom'

const Blog = () => {

  //const [visible, setVisible] = useState(false)

  // const hideWhenVisible = { display: visible ? 'none' : '' }
  // const showWhenVisible = { display: visible ? '' : 'none' }

  const id = useParams().id
  const blogs = useSelector( state => state.blogs)
  const blog = blogs.find( b => b.id === id )
  const authUser = useSelector( state => state.login)
  const dispatch = useDispatch()

  Blog.propTypes = {
    addLike : PropTypes.func.isRequired
  }

  /*const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }*/

  const handleLike = () => {
    dispatch(addLike(blog))
    dispatch(setNotification(`You liked ${blog.title}!`, 5))
  }

  const handleDelete = () => {
    if( window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`) ){
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification(`${blog.title} deleted!!`))
    }
  }

  const showRemove = authUser && blog.user.username === authUser.username
  console.log('AUTH DELETE', showRemove)
  return (
    <div className='blog'>
      <div className='basic-info'>
        <h2>{blog.title}</h2>
      </div>
      <div className='more_info'>
        <p>{blog.url}</p>
        <p>
          { blog.likes } likes <button className='like_button' onClick={handleLike} >Like</button>
        </p>
        <p>Added by {blog.user.name}</p>
        {
          showRemove && <button className="delete_button" onClick={handleDelete}>Delete</button>
        }
      </div>
    </div>
  )
}

export default Blog