const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blog')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleware  = require('./utils/middleware')
const mongoose = require('mongoose')
const commentRouter = require('./controllers/comments')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then( () => {
    logger.info('connected to MongoDB')
})
.catch( (error) => {
    logger.error('error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', commentRouter)

if (process.env.NODE_ENV === 'test') {
    console.log("Run in TEST MODE")
    const testingRouter = require('./controllers/testing')
    app.use('/api/reset', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
