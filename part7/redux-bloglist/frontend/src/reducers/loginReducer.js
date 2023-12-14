import { createSlice } from '@reduxjs/toolkit'
import LoginService from '../services/login'
import BlogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const loginSlice = createSlice({
  name: 'login',
  initialState: [],
  reducers: {
    initUser(state, action) {
      return action.payload
    },
    loginUser(state, action) {
      return action.payload
    },
    logoutUser() {
      return null
    },
  },
})

export const { initUser, loginUser, logoutUser } = loginSlice.actions

export const login = (username, password) => {

  return async dispatch => {
    try {
      const user = await LoginService.login({ username, password })

      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      BlogService.setToken(user.token)

      dispatch(loginUser(user))
      dispatch(setNotification(`${username} logged in!aa`, 5))
    } catch (error) {
      dispatch(setNotification('Wrong credentials', 5))
    }
  }

}

export const logout = () => {
  return async dispatch => {
    window.localStorage.clear()
    dispatch(logoutUser())
  }
}

export const initializeUser = () => {
  return async dispatch => {
    const loggedUser = window.localStorage.getItem('blogAppUser')
    if(loggedUser){
      const user = JSON.parse(loggedUser)
      dispatch(initUser(user))
      BlogService.setToken(user.token)
    }
  }
}

export default loginSlice.reducer