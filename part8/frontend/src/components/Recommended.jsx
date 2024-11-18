import React from 'react'

export default function Recommended({show, user, books}) {
  
    const favoriteGenre = user ? user.favoriteGenre : null

    if (!show) {
        return null
    }

    const favorites = books.filter( book => book.genres.includes(favoriteGenre))

    return (
    <>
        <h2>Recomendations</h2>

        <p>Books in your favorite {favoriteGenre} </p>

        <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favorites.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}
