import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const canDelete = blog.user && user && blog.user.username === user.username

  return (
    <div className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div className="blog-details" style={showWhenVisible}>
        <div>{blog.url}</div>

        <div>
          likes {blog.likes}{' '}
          <button onClick={() => likeBlog(blog)}>like</button>
        </div>

        <div>{blog.user ? blog.user.name : ''}</div>

        {canDelete && (
          <button onClick={() => deleteBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object,
}

export default Blog