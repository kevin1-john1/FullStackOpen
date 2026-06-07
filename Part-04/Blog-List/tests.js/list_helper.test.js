const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://example.com/react-patterns',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/goto',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/reduction',
    likes: 12,
  },
]

describe('dummy', () => {
  test('dummy returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has many blogs', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 24)
  })
})

describe('favorite blog', () => {
  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/reduction',
      likes: 12,
    })
  })
})

describe('most blogs', () => {
  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 2,
    })
  })
})

describe('most likes', () => {
  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})