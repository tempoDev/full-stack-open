import { createSlice } from '@reduxjs/toolkit'
import BlogService from '../services/blogs'

const commentSlice = createSlice({
  name: 'comment',
  initialState: [],
  reducers: {
    setComment(state, action){
      return action.payload
    },
    appendComment(state, action){
      state.push(action.payload)
    }
  }
})

export const { setComment, appendComment } = commentSlice.actions

export const initializeComments = (id) => {
  return async dispatch => {
    const comments = await BlogService.getComments(id)
    dispatch(setComment(comments))
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    const blogComment = await BlogService.postComment(id, comment)
    dispatch(appendComment(blogComment))
  }
}

export default commentSlice.reducer