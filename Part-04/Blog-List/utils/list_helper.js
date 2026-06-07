const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}

  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(authors).reduce((a, b) =>
    authors[a] > authors[b] ? a : b
  )

  return {
    author: topAuthor,
    blogs: authors[topAuthor],
  }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}

  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.keys(authors).reduce((a, b) =>
    authors[a] > authors[b] ? a : b
  )

  return {
    author: topAuthor,
    likes: authors[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}