import { useEffect, useRef } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import persistentUser from './services/persistentUser'

import { useNotification } from './contexts/NotificationContext'
import { useUser } from './contexts/UserContext'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import ErrorBoundary from './components/ErrorBoundary'
import LoginForm from './components/LoginForm'
import Menu from './components/Menu'
import Notification from './components/Notification'
import NotFound from './components/NotFound'
import Togglable from './components/Togglable'
import User from './components/User'
import Users from './components/Users'

const App = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const blogFormRef = useRef()

  const { notification, showNotification } = useNotification()
  const { user, userDispatch } = useUser()

  useEffect(() => {
    const loggedUser = persistentUser.getUser()

    if (loggedUser) {
      userDispatch({
        type: 'LOGIN',
        payload: loggedUser,
      })

      blogService.setToken(loggedUser.token)
    }
  }, [userDispatch])

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: newBlog => {
      const blogs = queryClient.getQueryData(['blogs']) || []

      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      queryClient.invalidateQueries({ queryKey: ['users'] })

      showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
    },
    onError: () => {
      showNotification('creating blog failed', 'error')
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: updatedBlog => {
      const blogs = queryClient.getQueryData(['blogs']) || []

      queryClient.setQueryData(
        ['blogs'],
        blogs.map(blog => (blog.id !== updatedBlog.id ? blog : updatedBlog))
      )
    },
    onError: () => {
      showNotification('updating blog failed', 'error')
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_data, id) => {
      const blogs = queryClient.getQueryData(['blogs']) || []

      queryClient.setQueryData(
        ['blogs'],
        blogs.filter(blog => blog.id !== id)
      )

      queryClient.invalidateQueries({ queryKey: ['users'] })
      showNotification('blog removed')
      navigate('/')
    },
    onError: () => {
      showNotification('removing blog failed', 'error')
    },
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.createComment(id, comment),
    onSuccess: updatedBlog => {
      const blogs = queryClient.getQueryData(['blogs']) || []

      queryClient.setQueryData(
        ['blogs'],
        blogs.map(blog => (blog.id !== updatedBlog.id ? blog : updatedBlog))
      )

      showNotification('comment added')
    },
    onError: () => {
      showNotification('adding comment failed', 'error')
    },
  })

  const handleLogin = async credentials => {
    try {
      const loggedUser = await loginService.login(credentials)

      persistentUser.saveUser(loggedUser)
      blogService.setToken(loggedUser.token)

      userDispatch({
        type: 'LOGIN',
        payload: loggedUser,
      })

      showNotification(`${loggedUser.name} logged in`)
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    persistentUser.removeUser()
    blogService.setToken(null)

    userDispatch({
      type: 'LOGOUT',
    })

    showNotification('logged out')
    navigate('/')
  }

  const addBlog = blog => {
    blogFormRef.current.toggleVisibility()
    createBlogMutation.mutate(blog)
  }

  const likeBlog = blog => {
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    }

    updateBlogMutation.mutate(changedBlog)
  }

  const removeBlog = blog => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (ok) {
      removeBlogMutation.mutate(blog.id)
    }
  }

  const addComment = (id, comment) => {
    if (!comment.trim()) {
      return
    }

    commentMutation.mutate({
      id,
      comment,
    })
  }

  if (blogsResult.isLoading || usersResult.isLoading) {
    return <div>loading...</div>
  }

  if (blogsResult.isError || usersResult.isError) {
    return <div>service not available</div>
  }

  const blogs = blogsResult.data
  const users = usersResult.data

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />

      <Notification notification={notification} />

      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h2>blogs</h2>

                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>

                <BlogList blogs={sortedBlogs} />
              </div>
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                user={user}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
                addComment={addComment}
              />
            }
          />

          <Route path="/users" element={<Users users={users} />} />

          <Route path="/users/:id" element={<User users={users} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App