import { useAnecdoteActions } from '../stores/anecdoteStore'
import { useNotificationActions } from '../stores/notificationStore'

const Anecdote = ({ anecdote }) => {
  const { vote, remove } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const handleVote = async () => {
    await vote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`)
  }

  const handleRemove = async () => {
    await remove(anecdote.id)
  }

  return (
    <div>
      <div>{anecdote.content}</div>

      <div>
        has {anecdote.votes} votes{' '}
        <button onClick={handleVote}>vote</button>

        {anecdote.votes === 0 && (
          <button onClick={handleRemove}>delete</button>
        )}
      </div>
    </div>
  )
}

export default Anecdote