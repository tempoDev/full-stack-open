import React, { useState } from 'react'
import PropTypes from 'prop-types'
import LoginService from '../services/login'
import blogService from '../services/blogs'

export default function Login({ setUser, setMessage }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  Login.propTypes = {
    setUser: PropTypes.func.isRequired
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await LoginService.login({
        username,
        password,
      })

      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials', 'error-msg')
    }
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
