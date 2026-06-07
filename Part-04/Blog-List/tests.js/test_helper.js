const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Matti Luukkainen',
    url: 'https://example.com/html-is-easy',
    likes: 5,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Matti Luukkainen',
    url: 'https://example.com/browser-js',
    likes: 3,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'will remove this soon',
    author: 'test author',
    url: 'https://example.com/remove',
    likes: 0,
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createTestUser = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  await user.save()

  return user
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  createTestUser,
}