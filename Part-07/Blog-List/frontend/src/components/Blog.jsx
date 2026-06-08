import { useParams } from 'react-router-dom'
import useField from '../hooks/useField'

const Blog = ({ blogs, user, likeBlog, removeBlog, addComment }) => {
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)
  const comment = useField('text')

  if (!blog) {
    return <div>blog not found</div>
  }

  const canRemove = blog.user && blog.user.username === user.username

  const handleComment = event => {
    event.preventDefault()

    addComment(blog.id, comment.input.value)
    comment.reset()
  }

  return (
    <div>
      <h2>{blog.title}</h2>

      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>

      <div>
        {blog.likes} likes{' '}
        <button onClick={() => likeBlog(blog)}>like</button>
      </div>

      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>

      {canRemove && (
        <button onClick={() => removeBlog(blog)}>remove</button>
      )}

      <h3>comments</h3>

      <form onSubmit={handleComment}>
        <input {...comment.input} />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {blog.comments &&
          blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
      </ul>
    </div>
  )
}

export default Blog