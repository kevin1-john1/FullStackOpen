import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showMessage(`${user.name} logged in`)
    } catch {
      showMessage('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()

      const returnedBlog = await blogService.create(blogObject)

      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id,
        },
      }

      setBlogs(blogs.concat(blogWithUser))

      showMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
    } catch {
      showMessage('creating blog failed', 'error')
    }
  }

  const likeBlog = async blog => {
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    }

    const returnedBlog = await blogService.update(blog.id, changedBlog)

    setBlogs(
      blogs.map(item =>
        item.id !== blog.id
          ? item
          : {
              ...returnedBlog,
              user: blog.user,
            }
      )
    )
  }

  const deleteBlog = async blog => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)

    if (!ok) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(item => item.id !== blog.id))
    } catch {
      showMessage('removing blog failed', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message} />

        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const blogsByLikes = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} />

      <p data-testid="logged-user">
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {blogsByLikes.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App