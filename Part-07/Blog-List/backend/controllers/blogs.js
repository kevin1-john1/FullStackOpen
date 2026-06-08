const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })

  if (!blog) {
    return response.status(404).end()
  }

  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    comments: [],
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

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user, comments } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title,
      author,
      url,
      likes,
      user,
      comments,
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate('user', {
    username: 1,
    name: 1,
  })

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  const comment = request.body.comment

  if (!comment) {
    return response.status(400).json({
      error: 'comment is missing',
    })
  }

  blog.comments = blog.comments.concat(comment)

  const savedBlog = await blog.save()

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

module.exports = blogsRouter