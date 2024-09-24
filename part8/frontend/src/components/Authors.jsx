import { gql, useQuery } from "@apollo/client"

const Authors = (props) => {
  if (!props.show) {
    return null
  }

  const ALL_AUTHORS = gql`query {
  allAuthors {
    name
    id
    born
    bookCount
  }
}`

const result = useQuery(ALL_AUTHORS)

if( result.loading) {
  return <div>cargando...</div>
}

const authors = []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
