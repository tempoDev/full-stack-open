import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            value
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