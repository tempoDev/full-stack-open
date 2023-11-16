import { createSlice } from "@reduxjs/toolkit"
import anecdotesService from '../services/anecdotes'
import { setNotification } from "./notificationReducer"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action){
      state.push(action.payload)
    },
    setAnecdotes(state, action){
      return action.payload.sort( (a, b) => b.votes - a.votes)
    },
    voteAnecdote(state, action){
      const id = action.payload.id
      const updatedAnecdote  = action.payload

      return state.map( anecdote => 
        anecdote.id !== id ? anecdote : updatedAnecdote
      ).sort( (a, b) => b.votes - a.votes)
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = ( content ) => {
  return async dispatch => {
    const anecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(anecdote))
    dispatch(setNotification(`${content} created!!`, 5))
  }
}

export const addVote = ( anecdote ) => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesService.updateVote(anecdote)
    dispatch(voteAnecdote(updatedAnecdote))
  }
}

export const  { appendAnecdote, setAnecdotes, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer