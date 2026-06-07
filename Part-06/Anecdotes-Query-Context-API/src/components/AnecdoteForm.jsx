import { useCreateAnecdote } from '../hooks/useAnecdotes'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const createAnecdoteMutation = useCreateAnecdote()
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

  const onCreate = event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    createAnecdoteMutation.mutate(content, {
      onSuccess: () => {
        showNotification(`anecdote '${content}' created`)
        event.target.anecdote.value = ''
      },
      onError: error => {
        showNotification(error.message)
      },
    })
  }

  return (
    <div>
      <h3>create new</h3>

      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm