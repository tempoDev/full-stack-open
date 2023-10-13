import axios from "axios";
const baseURl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseURl)
    return request.then( response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseURl}/${id}`)
    return request.then( response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseURl}/${id}`, newObject)
    return request.then( response => response.data)
}

const addNew = (newPerson) => {
    const request = axios.post(baseURl, newPerson)
    return request.then( response => response.data)
}

const PersonsServices = { getAll, remove, update, addNew }

export default PersonsServices
