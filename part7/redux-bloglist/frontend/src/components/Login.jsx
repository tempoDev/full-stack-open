import React, { useState } from 'react'
import PropTypes from 'prop-types'
import LoginService from '../services/login'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'

export default function Login({ setUser, setMessage }) {

  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  Login.propTypes = {
    setUser: PropTypes.func.isRequired
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(login(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}
