import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, /*screen*/ } from '@testing-library/react'
//import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe( '<Blog /> component', () => {

  const blog = {
    title: 'El de los test',
    author: 'Tempo TEST',
    url: 'localhost/tempoTest',
    likes: 0,
    user: {
      username: 'username',
      name: 'name'
    }
  }

  let component
  const likesMockHandler = jest.fn()

  beforeEach( () => {
    component = render(
      <Blog key={blog.id} blog={blog} addLike={likesMockHandler} />
    )
  })

  test('Renders the author and title but not the url and likes', () => {

    expect(component.container.querySelector('.basic-info')).toHaveTextContent(blog.title)
    expect(component.container.querySelector('.basic-info')).toHaveTextContent(blog.author)

    const div = component.container.querySelector('.more_info')
    expect(div).toHaveStyle('display: none')
  })

  test('show blog details when the show button is clicked', () => {
    const button = component.container.querySelector('.show_details')

    fireEvent.click(button)
    const details = component.container.querySelector('.more_info')
    expect(details).toBeInTheDocument()
  })

  test('Clicked twice the like button event handler is called twice', () => {
    const showButton = component.container.querySelector('.show_details')
    fireEvent.click(showButton)

    const likeButton = component.container.querySelector('.like_button')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(likesMockHandler.mock.calls).toHaveLength(2)
  })
})