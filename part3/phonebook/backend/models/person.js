const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// eslint-disable-next-line no-undef
const url = process.env.MONGO_URL
console.log('Connecting...', url)

mongoose.connect(url)
    .then( () => {
        console.log('Connected to MongoDB')
    })
    .catch( error => {
        console.log('ERROR connnecting to MongoDB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v){
                return /^\d{3}-\d{3}-\d{3}/.test(v)
            },
            message: props => `${props.value} is not a valid phone`
        },
        minLength: 11,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)