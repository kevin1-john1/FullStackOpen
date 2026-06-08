import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useMatch,
} from 'react-router-dom'

import Menu from './components/Menu'
import Footer from './components/Footer'
import About from './components/About'
import Anecdote from './components/Anecdote'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const AppContent = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ])

  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/anecdotes/:id')

  const anecdote = match
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  const addNew = anecdote => {
    const newAnecdote = {
      ...anecdote,
      id: Math.round(Math.random() * 10000),
      votes: 0,
    }

    setAnecdotes(anecdotes.concat(newAnecdote))

    setNotification(`a new anecdote '${newAnecdote.content}' created`)

    setTimeout(() => {
      setNotification(null)
    }, 5000)

    navigate('/')
  }

  return (
    <div>
      <h1>Software anecdotes</h1>

      <Menu />

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={<AnecdoteList anecdotes={anecdotes} />}
        />

        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdote={anecdote} />}
        />

        <Route
          path="/create"
          element={<AnecdoteForm addNew={addNew} />}
        />

        <Route
          path="/about"
          element={<About />}
        />
      </Routes>

      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App