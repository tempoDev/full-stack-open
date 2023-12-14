import { useState } from 'react'
import PropTypes from 'prop-types'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { addLike, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ user, blog, removeBlog }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const authUser = useSelector( state => state.login)
  const dispatch = useDispatch()

  Blog.propTypes = {
    addLike : PropTypes.func.isRequired
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

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
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='basic-info'>
        {blog.title} {blog.author}
        <button className='show_details' onClick={toggleVisibility}>View</button>
      </div>
      <div className='more_info' style={showWhenVisible}>
        <ul>
          <li>{blog.title} - {blog.author}</li>
          <li>{blog.url}</li>
        </ul>
        <p>
          { blog.likes } likes <button className='like_button' onClick={handleLike} >Like</button>
        </p>
        <button onClick={toggleVisibility}>Hide</button>
        {
          showRemove && <button className="delete_button" onClick={handleDelete}>Delete</button>
        }
      </div>
    </div>
  )
}

export default Blog