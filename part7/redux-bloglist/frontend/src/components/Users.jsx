import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Users() {

  const displayUsers = useSelector( state  => state.users)
  console.log('Users', displayUsers)

  return (
    <>
      <h3>USERS</h3>
      <Table striped>
        <tbody>
          <tr>
            <td>----</td>
            <td>Blogs created</td>
          </tr>
          {
            displayUsers.map( displayUser =>
              <tr key={displayUser.id}>
                <td>
                  <Link to={`/users/${displayUser.id}`} >{displayUser.username}</Link>
                </td>
                <td>
                  {displayUser.blogs.length}
                </td>
              </tr>

            )
          }
        </tbody>
      </Table>

    </>
  )
}
