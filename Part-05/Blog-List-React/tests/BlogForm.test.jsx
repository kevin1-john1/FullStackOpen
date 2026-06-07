import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import BlogForm from '../src/components/BlogForm'

afterEach(() => {
  cleanup()
})

describe('BlogForm component', () => {
  test('calls event handler with right details when a new blog is created', async () => {
    const userEventApi = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    await userEventApi.type(screen.getByTestId('title'), 'Testing React apps')
    await userEventApi.type(screen.getByTestId('author'), 'Test Author')
    await userEventApi.type(
      screen.getByTestId('url'),
      'https://example.com/react-tests'
    )

    await userEventApi.click(screen.getByText('create'))

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing React apps',
      author: 'Test Author',
      url: 'https://example.com/react-tests',
    })
  })
})