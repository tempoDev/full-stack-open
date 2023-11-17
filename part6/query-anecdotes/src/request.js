//request.js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {
    return axios.get(baseUrl).then( res => res.data )   
}

export const createAnecdote = (newAnecdote) => {
    return axios.post(baseUrl, newAnecdote)
      .then(res => res.data)
      .catch(error => {
        console.error('Error creating anecdote:', error);
        throw error; 
      });
}

export const updateVote = updatedAnecdote =>{
    return axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then( res => res.data)
}