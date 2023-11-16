import axios from 'axios'

const baseURL = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

const getId = () => (100000 * Math.random()).toFixed(0)

const createNew = async (anecdote) => {
    const newAnecdote = { content: anecdote, id: getId(), votes: 0 }
    const response = await axios.post(baseURL, newAnecdote)
    return response.data
}

const updateVote = async (id) => {
    const response = await axios.get(`${baseURL}/${id}`)
    const anecdote = response.data
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const request = axios.put(`${baseURL}/${id}`, updatedAnecdote)
    return request.then( response => response.data)
}

export default { getAll, createNew, updateVote}