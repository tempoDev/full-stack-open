import { gql, useApolloClient, useQuery } from "@apollo/client"
import { useState } from "react"

const Books = ({ show, books}) => {
  if (!show) {
    return null
  }

  const [selectedGenre, setGenre] = useState('all genres')

const genres = ["all genres", ...new Set(books.flatMap(b => b.genres))]

const filteredBooks = selectedGenre === 'all genres'
  ? books
  : books.filter(book => book.genres.includes(selectedGenre))

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {
          genres.map( (genre) => (
            <button onClick={() => setGenre(genre)}>{genre}</button>
          ))
        }
      </div>
    </div>
  )
}

export default Books
