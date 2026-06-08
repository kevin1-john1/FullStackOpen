import { useState } from 'react'

const AnecdoteForm = ({ addNew }) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    addNew({
      content,
      author,
      info,
    })

    setContent('')
    setAuthor('')
    setInfo('')
  }

  return (
    <div>
      <h2>Create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            value={content}
            onChange={event => setContent(event.target.value)}
          />
        </div>

        <div>
          author
          <input
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>

        <div>
          url for more info
          <input
            value={info}
            onChange={event => setInfo(event.target.value)}
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm