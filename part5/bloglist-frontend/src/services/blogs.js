import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {

  const conf = {
    headers: { Authorization: token }
  }

  const response = await axios.post( baseUrl, newBlog, conf)
  return response.data
}

const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const remove = async (id) => {
  const conf = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, conf)
  return response.data
}

export default { setToken, getAll, create, update, remove }