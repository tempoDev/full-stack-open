import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import Select from 'react-select'
import { updateCache } from "../App";
import { ALL_BOOKS } from "../queries";

const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
    }
  }`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }`

  const ALL_AUTHORS = gql`query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }`

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [born, setBorn] = useState('')
  
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR);
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: (error) => {
      const message = error.graphQLErrors[0].message
      alert(message)
      console.log('ERROR: ', message)
    },
    update: (cache, response) => {
      updateCache( cache, {query: ALL_BOOKS}, response.data.addBook)
    }
  });

  if( loading ) return <div>Cargando autores</div>

  const options = data.allAuthors.map((author) => ({
    value: author.name,
    label: author.name,
  }))


  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    console.log("add book...");

    const publishedInt = parseInt(published);

    try {
      await addBook({
        variables: { title, author, published: publishedInt, genres },
      });

      alert("Book added!");
    } catch (error) {
      alert("Error adding the book");
    }

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const edit = async(event) => {

    event.preventDefault()
    console.log("changing author...")

    if( !selectedAuthor ){
      alert("No author selected")
      return  
    }

    const intBorn = parseInt(born)

    try {
      
      await editAuthor({
        variables: { name: selectedAuthor.value, setBornTo: intBorn},
        update: (cache, { data: { editAuthor }}) => {
          const { allAuthors } = cache.readQuery({ query: ALL_AUTHORS})

          cache.writeQuery({
            query: ALL_AUTHORS,
            data: {
              allAuthors: allAuthors.map( author => 
                author.name === editAuthor.name ? editAuthor : author
              )
            }
          })
        }
      })

      alert('Author birth date updated!')

    } catch (error) {
      alert("Error updating author")
      console.log(error)
    }

    setSelectedAuthor(null)
    setBorn('')
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <>
      <div>
        <h2>Books</h2>
        <form onSubmit={submit}>
          <div>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </div>
          <div>
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button onClick={addGenre} type="button">
              add genre
            </button>
          </div>
          <div>genres: {genres.join(" ")}</div>
          <button type="submit">create book</button>
        </form>
      </div>

      <div>
        <h2>Author</h2>
        <form onSubmit={edit}>
          <div>
            Author:
            <Select
              options={options}
              value={selectedAuthor}
              onChange={setSelectedAuthor}
              placeholder="Select author"
            />
          </div>
          <div>
            Born: 
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          
          <button type="submit">Edit author</button>
        </form>
      </div>
    </>
  );
};

export default NewBook;
