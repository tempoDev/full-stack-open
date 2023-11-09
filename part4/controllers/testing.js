const resetTesting = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

resetTesting.get('/', async (request, response) => {
  
  response.send({message: 'Received Reset'});
})

resetTesting.post('/', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = resetTesting