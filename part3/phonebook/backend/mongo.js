/* eslint-disable no-undef */
const mongoose = require('mongoose')
require('dotenv').config()

const passwd = process.env.MONGO_PASSWD


if(!passwd){
    console.log('Error: Password not found in environment variables')
    process.exit(1)
}


const url = `mongodb+srv://jcambero1991:${passwd}@fullstackopen.5yobpt5.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


console.log('LONGITUD', process.argv.length)

if( process.argv.length === 2){

    Person.find({}).then( result => {
        console.log('PhoneBook: ')
        result.forEach( person => {
            console.log(`${person.name}: ${person.number}`)
        })
        mongoose.connection.close()
    })

} else {

    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person.save().then( result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })

}

