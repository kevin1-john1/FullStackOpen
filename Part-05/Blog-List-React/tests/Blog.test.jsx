import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import Blog from '../src/components/Blog'

afterEach(() => {
  cleanup()
})

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'https://example.com/testing',
  likes: 7,
  user: {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    id: '123',
  },
}

const user = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  id: '123',
}

describe('Blog component', () => {
  test('renders title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        likeBlog={() => {}}
        deleteBlog={() => {}}
        user={user}
      />
    )

    expect(
      screen.getByText(
        'Component testing is done with react-testing-library Matti Luukkainen',
        { exact: false }
      )
    ).toBeInTheDocument()

    expect(screen.queryByText('https://example.com/testing')).not.toBeVisible()
    expect(screen.queryByText('likes 7', { exact: false })).not.toBeVisible()
  })

  test('url and likes are shown after clicking view', async () => {
    const userEventApi = userEvent.setup()

    render(
      <Blog
        blog={blog}
        likeBlog={() => {}}
        deleteBlog={() => {}}
        user={user}
      />
    )

    await userEventApi.click(screen.getByText('view'))

    expect(screen.getByText('https://example.com/testing')).toBeVisible()
    expect(screen.getByText('likes 7', { exact: false })).toBeVisible()
  })

  test('like handler is called twice when like button is clicked twice', async () => {
    const userEventApi = userEvent.setup()
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        likeBlog={mockHandler}
        deleteBlog={() => {}}
        user={user}
      />
    )

    await userEventApi.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await userEventApi.click(likeButton)
    await userEventApi.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})