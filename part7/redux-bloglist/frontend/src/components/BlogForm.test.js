import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates states values and calls submit method', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={addBlog} />)

  const titleInput = container.querySelector('input[name="Title"]')
  const authorInput = container.querySelector('input[name="Author"]')
  const urlInput = container.querySelector('input[name="Url"]')
  const submitButton = container.querySelector('button[type="submit"]');

  await user.type(titleInput, 'El de los test')
  await user.type(authorInput, 'Tempo TEST')
  await user.type(urlInput, 'localhost/tempoTest')
  await user.click(submitButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog).toHaveBeenCalledWith({
    title: 'El de los test',
    author: 'Tempo TEST',
    url: 'localhost/tempoTest',
  })
})