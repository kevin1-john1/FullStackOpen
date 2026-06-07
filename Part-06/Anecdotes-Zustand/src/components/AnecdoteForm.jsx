import { useAnecdoteActions } from '../stores/anecdoteStore'
import { useNotificationActions } from '../stores/notificationStore'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const addAnecdote = async event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    if (!content.trim()) {
      return
    }

    await create(content)

    showNotification(`you created '${content}'`)
    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm