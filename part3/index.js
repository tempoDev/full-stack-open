const express = require("express")
const bodyParser = require('body-parser');
const cors = require("cors")
const morgan = require("morgan")
const app = express()

app.use(bodyParser.json());
app.use(cors());

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :response-time ms - :req-body'))

/*----------------------------------------------------------*/

app.get('/api/persons', (request, response) => {
  response.json(data.persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const people = data.persons.length
    response.send(
        `
        <p>PhoneBook has info for ${people} persons</p>
        <p>${date}</p>
        `
    )
})

app.post('/api/persons', (request, response) => {

    const body = request.body
    
    if(body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (!body.name) {
      return response.status(400).json({ error: 'Name is required' });
    } else if(!body.number){
      return response.status(400).json({ error: 'Phone number is required' });
    }

    const exists = data.persons.find( person => person.name === body.name)

    if(exists){
      return response.status(400).json({ error: 'Name already exists' });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    data.persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.persons.find( p => p.id === id)
    console.log(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(data.persons)
    data.persons = data.persons.filter( person => person.id !== id)
    
    
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const generateId = () => {
    const maxId = data.persons.length > 0
      ? Math.max(...data.persons.map(n => n.id))
      : 0
    return maxId + 1
  }

let data = {
    "persons": [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "123-123-213",
        "id": 4
      }
    ]
  }

