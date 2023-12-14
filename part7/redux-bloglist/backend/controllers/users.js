const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, id: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const {username, name, password} = request.body

    if ( !password || !username ) {
        return response.status(400).json({ error: 'Username and password are required'})
    } else if (password.length < 4 || username.length < 4) {
        return response.status(400).json({ error: 'Username and password must be at least 4 characters long'})
    } else {
        const saltRound = 10
        const passwordHash = await bcrypt.hash(password, saltRound)

        const user = new User({
            username,
            name,
            passwordHash
        })

        try{
            const savedUser = await user.save()
            response.status(201).json(savedUser)
        } catch(error){
            next(error)
        }

    }

})

module.exports = usersRouter