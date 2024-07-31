import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'
import commentReducer from './reducers/commentReducer'

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    login: loginReducer,
    users: userReducer,
    blogs: blogReducer,
    comments: commentReducer
  }
})

export default store

