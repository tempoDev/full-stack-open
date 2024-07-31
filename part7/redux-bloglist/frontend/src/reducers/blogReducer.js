import { createSlice } from '@reduxjs/toolkit'
import BlogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action){
      return action.payload
    },
    appendBlog(state, action){
      state.push(action.payload)
    },
    removeBlog(state, action){
      state.filter( (blog) => blog.id !== action.payload.id)
    },
    likeBlog(state, action){
      const id = action.payload.id
      const changedBlog = action.payload

      return state.map( blog => blog.id !== id ? blog : changedBlog )
    }
  }
})

export const { setBlogs, appendBlog, removeBlog, likeBlog } = blogSlice.actions

export const getBlogs = () => {
  return async dispatch => {
    const blogs = await BlogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = ( content ) => {
  return async dispatch => {
    const newBlog = await BlogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = ( id ) => {
  return async dispatch => {
    const deletedBlog = await BlogService.remove(id)
    dispatch(removeBlog(deletedBlog))
  }
}

export const addLike = ( blog ) => {
  return async dispatch => {
    const updatedBlog = await BlogService.update({
      ...blog,
      likes: blog.likes + 1
    })
    dispatch(likeBlog(updatedBlog))
  }
}

export default blogSlice.reducer