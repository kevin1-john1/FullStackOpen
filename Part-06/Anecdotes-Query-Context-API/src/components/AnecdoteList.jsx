import { useVoteAnecdote } from '../hooks/useAnecdotes'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const AnecdoteList = ({ anecdotes }) => {
  const voteMutation = useVoteAnecdote()
  const dispatch = useNotificationDispatch()

  const showNotification = message => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: message,
    })

    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      })
    }, 5000)
  }

  const vote = anecdote => {
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })

    showNotification(`you voted '${anecdote.content}'`)
  }

  const anecdotesByVotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {anecdotesByVotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList