const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {  
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("example", 10)
    const user = new User({
       username: "tempo",
       name: "tempo",
       blogs: [],
       passwordHash
    })
  
    await user.save()
}, 100000)

beforeEach(async () => {  
  await Blog.deleteMany({})

  const users = await User.find({})
  const user = users[0]

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: user._id,
      likes: blog.likes ? blog.likes : 0
    }))

  const promiseArray = blogObjects.map(blog => {
      blog.save()
      user.blogs = user.blogs.concat(blog._id)
    })
  await Promise.all(promiseArray)
  await user.save()
}, 100000)

describe('there is some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique id  of the blog posts is named id', async () => {
    const startBlogs = await helper.blogsInDb()
  
    const blog = startBlogs[0]
  
    const responseBlog = await api    
      .get(`/api/blogs/${blog.id}`)    
      .expect(200)    
      .expect('Content-Type', /application\/json/)
  
    expect(responseBlog).toBeDefined()
  })
})

describe('view of a specific blog', () => {

  test('a valid blog added by authorized user', async () => {
    const user = {
      username: "tempo",
      password: "example",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'Este es el valido',
      author: 'Tempo valido',
      url: 'http://localhost/elvalido',
      likes: 500
    }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)

    expect(titles).toContain('Este es el valido')
  }, 100000)

  test('cant add a blog by unauthorized users', async () => {
    
    const startBlog = helper.initialBlogs

    const newBlog = {
      title: 'Faileeddd',
      author: 'El autor que falló',
      url: 'http://localhost/elblog',
      likes: 2
    }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const endBlogs = await helper.blogsInDb()
    const titles = endBlogs.map(n => n.title)

    expect(endBlogs).toHaveLength(startBlog.length)
    expect(titles).not.toContain('Faileeddd')
  }, 100000)

  test('new blog without likes property will be set to 0', async () => {
    const user = {
      username: "tempo",
      password: "example",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)
    
    const newBlog = {
      title: 'Yo no tengo likes',
      url: 'http://localhost/unblogsinlikes',
      author: 'tempo likes',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect('Content-Type', /application\/json/)

      const endBlogs = await helper.blogsInDb()
      const likes = endBlogs.map(n => n.likes)

      expect(endBlogs).toHaveLength(helper.initialBlogs.length + 1)
      expect(likes).toContain(0)
  }) 

  test('without title property will not be added', async () => {
    const user = {
      username: "tempo",
      password: "example",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)
    
    const newBlog = {
      url: 'http://localhost/nopuedoagregar',
      author: 'El que no se curra los titulos',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .set('Authorization', `Bearer ${loginUser.body.token}`)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }) 

  test('new blog without url cannot be added', async () => {
    const user = {
      username: "tempo",
      password: "example",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'Yo no tengo url',
      author: 'Roberto desactualizado'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .set('Authorization', `Bearer ${loginUser.body.token}`)

      const endBlogs = await helper.blogsInDb()
      expect(endBlogs).toHaveLength(helper.initialBlogs.length)
  }) 
})

describe('Delete a blog', () => {
  
  test('a blog can be deleted', async () => {
    const user = {
      username: "tempo",
      password: "example",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)
  
    const startBlog = await helper.blogsInDb()
    const deleteBlog = startBlog[0]

    await api    
      .delete(`/api/blogs/${deleteBlog.id}`)  
      .expect(204)
      .set('Authorization', `Bearer ${loginUser.body.token}`)

    const endBlogs = await helper.blogsInDb()
    expect(endBlogs).toHaveLength( helper.initialBlogs.length - 1 )

    const titles = endBlogs.map(r => r.title)
    expect(titles).not.toContain(deleteBlog.title)

  })
})

describe('Update a note', () => {
  test('A individual post is updated', async () => {
    
    const startBlogs = await helper.blogsInDb()
    const blogToUpdate = startBlogs[0]
    const startLikes = blogToUpdate.likes
    
    const newBlog = {
      title: startBlogs[0].title,
      author: startBlogs[0].author,
      url: startBlogs[0].url,
      likes: 154
    }  

    await api    
      .put(`/api/blogs/${blogToUpdate.id}`)  
      .send(newBlog)  
      .expect(200)    
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    
      const updatedLikes = blogsAtEnd.map(n => n.likes)
    
      expect(updatedLikes).not.toContain(startLikes)
  })
})



afterAll(async () => {
  await mongoose.connection.close()
})