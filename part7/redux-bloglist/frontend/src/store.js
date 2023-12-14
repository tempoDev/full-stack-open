import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    login: loginReducer
  }
})

export default store

