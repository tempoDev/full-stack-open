const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {

    const {user, password} = request.body

    const userDB = await User.findOne({user})
    const correctPsw = userDB === null ? false
        : await bcrypt.compare( password, userDB.passwordHash)

    if ( !user && !correctPsw ){
        return response.status(401).json({
            error: 'Invalid password or username'
        })
    }

    
    const userToken = {
        username: userDB.username,
        id: userDB._id
    }

    const token = jwt.sign(
        userToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    response.status(200)
        .send({token, username: userDB.username, name: userDB.name})
})

module.exports = loginRouter