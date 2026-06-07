const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token
let user

const loginAndGetToken = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret',
    })

  return response.body.token
}

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    user = await helper.createTestUser()
    token = await loginAndGetToken()

    const blogObjects = helper.initialBlogs.map(blog => {
      return new Blog({
        ...blog,
        user: user._id,
      })
    })

    const savedBlogs = await Promise.all(
      blogObjects.map(blog => blog.save())
    )

    user.blogs = savedBlogs.map(blog => blog._id)
    await user.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog identifier field is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'async/await simplifies backend code',
      author: 'Test Author',
      url: 'https://example.com/async-await',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('async/await simplifies backend code'))
  })

  test('adding a blog fails with status 401 if token is missing', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Test Author',
      url: 'https://example.com/no-token',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('likes defaults to zero if missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'https://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://example.com/no-title',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL blog',
      author: 'Test Author',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('a blog can be deleted by its creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('deleting a blog fails without token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('likes of a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const changedBlog = {
      ...blogToUpdate,
      likes: 99,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 99)
  })
})

after(async () => {
  await mongoose.connection.close()
})