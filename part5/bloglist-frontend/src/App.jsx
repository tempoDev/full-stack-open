import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [typeMessage, setTypeMessage] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort( (a, b) => b.likes - a.likes)
      setBlogs( blogs )
    })
  }, [refresh])

  useEffect( () => {
    const loggedUser = window.localStorage.getItem('blogAppUser')
    if( loggedUser ){
      const user = JSON.parse(loggedUser)
      setUser(user)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  const refreshBlogs = () => {
    setRefresh(!refresh)
  }

  const showMessage = (msg, type) => {
    setTypeMessage(type)
    setMessage(msg)

    setTimeout(() => {
      setTypeMessage(null)
      setMessage(null)
    }, 5000)
  }

  const addLike = async (id, updatedBlog) => {
    await blogService.update(id, updatedBlog)
    setRefresh(!refresh)
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)
    setRefresh(!refresh)
  }

  return (
    <div>
      <Notification message={message} msgType={typeMessage} />

      {user === null
        ? <Login setUser={setUser} setMessage={showMessage} />
        : <div>
          <p>{user.name} logged-in  <button onClick={handleLogout}>Logout</button></p>
          <Togglable label={'Create a blog'} ref={blogFormRef}>
            <BlogForm createBlog={blogService.create} setMessage={showMessage} refreshBlogs={refreshBlogs} />
          </Togglable>
        </div>
      }

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App