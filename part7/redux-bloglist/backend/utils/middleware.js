const logger = require('./logger')
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const requestLogger = (request, respones, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = ( error, request, response, next ) => {
    
    logger.error(error.message)

    if ( error.name === 'CastError' ) {
        return response.status(400).send({ error: 'malformatted id'})
    } else if ( error.name === 'ValidationError' ) {
        return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {    
		return response.status(400).json({ error: error.message })  
	}else if (error.name === 'TokenExpiredError') {    
		return response.status(401).json({      
			error: 'token expired'    
		})  
	}

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        request.token = authorization.substring(7)
    } else {
        request.token = null; // Establece un valor nulo para el token si no se proporciona
    }

    next()
}


const userExtractor = async (request, response, next) => {
    const token = request.token

    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        request.user = user
    } else {
        request.user = null; // Establece un valor nulo para el usuario si no se proporciona un token válido
    }

    next()
}


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}