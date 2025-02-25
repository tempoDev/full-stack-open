import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            value
        }
    }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    genres
    author{
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`query {
    allBooks {
      title
      author{
        name
        born
      }
      published
      genres
      id
    }
  }`

  export const USER = gql`query{
    me{
      username,
      favoriteGenre
    }
  }
  `

  export const BOOK_ADDED = gql`
    subscription {
      bookAdded{
        ...BookDetails 
      }
    }
      ${BOOK_DETAILS}
  `