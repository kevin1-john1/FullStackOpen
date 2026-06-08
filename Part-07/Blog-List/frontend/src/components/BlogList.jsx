import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      {blogs.map(blog => (
        <div className="blog" key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList