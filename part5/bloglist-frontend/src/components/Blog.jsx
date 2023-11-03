import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, removeBlog }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

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

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    addLike( blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if( window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`) ){
      removeBlog(blog.id)
    }
  }

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
          { blog.likes } <button className='like_button' onClick={handleLike} >Like</button>
        </p>
        <button onClick={toggleVisibility}>Hide</button>
        <button className="delete_button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}

export default Blog