const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({
      error: 'only the creator can delete this blog',
    })
  }

  await Blog.findByIdAndDelete(request.params.id)

  request.user.blogs = request.user.blogs.filter(
    blogId => blogId.toString() !== request.params.id
  )

  await request.user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogsRouter