import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import SingleUser from './components/SingleUser'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUser, logout } from './reducers/loginReducer'
import { getBlogs } from './reducers/blogReducer'
import { initializeAllUsers } from './reducers/userReducer'

import { Routes, Route, Link, Router } from 'react-router-dom'
import BlogList from './components/BlogList'
import { Nav, Navbar } from 'react-bootstrap'
import SingleBlog from './components/SingleBlog'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  //const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [typeMessage, setTypeMessage] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const blogFormRef = useRef()

  const authUser = useSelector( state => state.login)
  console.log(authUser)
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort( (a, b) => b.likes - a.likes)
      setBlogs( blogs )
    })
  }, [refresh])

  useEffect( () => {
    dispatch(initializeUser())
    dispatch(getBlogs())
    dispatch(initializeAllUsers())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  /*const refreshBlogs = () => {
    setRefresh(!refresh)
  }

  const showMessage = (msg, type) => {
    setTypeMessage(type)
    setMessage(msg)

    setTimeout(() => {
      setTypeMessage(null)
      setMessage(null)
    }, 5000)
  }*/

  const setPadding = {
    padding: '5px'
  }

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        {/* <Navbar.Toggle aria-controls='responsive-navbar-nav' /> */}

        <Navbar.Collapse id="header-navbar">

          <Nav.Link href='#' as='span'>
            <Link style={setPadding} to='/'>Home</Link>
          </Nav.Link>

          <Nav.Link href='#' as='span'>
            <Link style={setPadding} to='/blogs'>Blogs</Link>
          </Nav.Link>

          <Nav.Link href='#' as='span'>
            <Link style={setPadding} to='/users'>Users</Link>
          </Nav.Link>

          <Nav.Link href='#' as='span'>
            { authUser ? <em>{authUser.name} logged</em>
              : <Link style={setPadding} to='login'>Login</Link>
            }
          </Nav.Link>
          <button onClick={handleLogout}>Logout</button>

        </Navbar.Collapse>

        <Notification message={message} msgType={typeMessage} />

      </Navbar>

      <Routes>
        <Route path='/blogs' element={<BlogList />}></Route>
        <Route path='/users' element={<Users />}></Route>
        <Route path='/users/:id' element={<SingleUser />}></Route>
        <Route path='/blogs/:id' element={<SingleBlog />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>

    </>
  )

}

export default App