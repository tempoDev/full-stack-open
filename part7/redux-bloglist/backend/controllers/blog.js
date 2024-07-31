const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("comment").populate( 'user', {name: 1, username: 1, id: 1})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("comment")

  if(blog){
    response.json(blog.toJSON())
  } else {
    response.status(400).end()
  }
})

blogRouter.post('/', async (request, response) => {
    
    const body = request.body
    const user = request.user

    if(!user){
      return response.status(401).json({ error: 'token missing or invalid'})
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user.id
    })

    if( !body.title || !body.url ){
      response.status(400).end()
    } else {
    
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog.id)
      await user.save()

      response.status(201).json(savedBlog)
    }
  
  })

blogRouter.delete('/:id', async (request, response) => {

  const token = request.token
  const user = request.user
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if( !token && !decodedToken.id ){
    console.log("FALLO 1")
    return response.status(401).json({ error: 'Missing TOKEN or invalid'})
 }

  const id = request.params.id
  const blog = await Blog.findById(id)
  
  if ( blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } else {
    console.log("FALLO 2")
    return response.status(401).json({ error: 'Unauthorized'})
  }
})
  
blogRouter.put('/:id', async (request, response) => {

  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  };

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(blog);
})

module.exports = blogRouter