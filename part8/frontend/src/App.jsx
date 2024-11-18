import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient, useQuery } from "@apollo/client";
import { ALL_BOOKS, USER } from "./queries";
import Recommended from "./components/Recommended";

export const updateCache = (cache, query, bookAdded ) => {

  const uniqueByTitle = (x) => {
    let seen = new Set()
    return x.filter( (item) => {
      let y = item.title
      return seen.has(y) ? false : seen.add(y)
    })
  }

  cache.updateQuery( query, ({allBooks}) => {
    return {
      allBooks: uniqueByTitle(allBooks.concat(bookAdded))
    }
  })
}

const App = () => {
  const client = useApolloClient()
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(USER)
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if(books.loading){
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
      <button onClick={() => setPage("authors")}>authors</button>
      <button onClick={() => setPage("books")}>books</button>
        { !token ? 
            <Login setToken={setToken} /> 
            :<>
              <button onClick={() => setPage("add")}>Add book</button>
              <button onClick={logout}>Logout</button>
            </>
        }
      <button onClick={() => setPage('recommended')}>Recommended</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} books={ books.data.allBooks }/>

      <NewBook show={page === "add"} />

      <Recommended show={page === 'recommended'} user={user.data.me} books={books.data.allBooks} />
    </div>
  );
};

export default App;
