import { gql, useApolloClient, useQuery } from "@apollo/client"

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const ALL_BOOKS = gql`query {
  allBooks {
    title
    author
    published
    id
  }
}`

const result = useQuery(ALL_BOOKS)

if( result.loading ){
  return <div>cargando...</div>
}

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
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
