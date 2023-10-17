const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
app.use(bodyParser.json())
app.use(cors())

morgan.token('req-body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms - :req-body'))

/*----------------------------------------------------------*/

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then( result => {
            response.json(result)
        })
        .catch( error => next(error))
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({})
        .then( result => {
            response.send(`<p>Phonebook has info for ${result.length} persons</p>
            <br>
            <p>${date}</p>`)
        })
})

app.post('/api/persons', (request, response, next) => {

    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({ error: 'Name is required' })
    } else if(!body.number){
        return response.status(400).json({ error: 'Phone number is required' })
    }

    //const exists = data.persons.find( person => person.name === body.name)

    // if(exists){
    //   return response.status(400).json({ error: 'Name already exists' });
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then( result=> {
            response.json(result)
        })
        .catch( error => next(error))

    // data.persons = data.persons.concat(person)
    // response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {

    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        {name, number},
        {new: true, runValidators: true, context: 'query'}
    )
        .then( updated => {
            response.json(updated)
        })
        .catch( error => { next( error)})

})

app.get('/api/persons/:id', (request, response) => {
  
    Person.findById(request.params.id)
        .then( person => {
            if(person){ response.json(person)}
            else{ response.status(404).end() }
        })
        .catch( error => {
            console.log(error)
            response.status(500).end()
        })

})

app.delete('/api/persons/:id', (request, response) => {
    
    Person.findByIdAndRemove(request.params.id)
        .then( () => {
            response.status(204).end()
        })
        // eslint-disable-next-line no-undef
        .catch( error => next(error))

})

const errorHandler = (error, request, response, next) => {

    console.log(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({ message: 'malformatted id'})
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({message: error.message})
    }

    next(error)
}
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// const generateId = () => {
//     const maxId = data.persons.length > 0
//         ? Math.max(...data.persons.map(n => n.id))
//         : 0
//     return maxId + 1
// }

// let data = {
//     'persons': [
//         {
//             'name': 'Arto Hellas',
//             'number': '040-123456',
//             'id': 1
//         },
//         {
//             'name': 'Ada Lovelace',
//             'number': '39-44-5323523',
//             'id': 2
//         },
//         {
//             'name': 'Dan Abramov',
//             'number': '12-43-234345',
//             'id': 3
//         },
//         {
//             'name': 'Mary Poppendieck',
//             'number': '123-123-213',
//             'id': 4
//         }
//     ]
// }

