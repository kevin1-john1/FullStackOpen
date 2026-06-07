import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },

    create: async content => {
      const newAnecdote = await anecdoteService.createNew(content)

      set(state => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))

      return newAnecdote
    },

    vote: async id => {
      const anecdote = get().anecdotes.find(item => item.id === id)

      const changedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1,
      }

      const updatedAnecdote = await anecdoteService.update(changedAnecdote)

      set(state => ({
        anecdotes: state.anecdotes.map(item =>
          item.id !== id ? item : updatedAnecdote
        ),
      }))

      return updatedAnecdote
    },

    remove: async id => {
      await anecdoteService.remove(id)

      set(state => ({
        anecdotes: state.anecdotes.filter(item => item.id !== id),
      }))
    },

    setFilter: value => {
      set(() => ({ filter: value }))
    },
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return filteredAnecdotes.toSorted
    ? filteredAnecdotes.toSorted((a, b) => b.votes - a.votes)
    : [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
}

export const useAnecdoteActions = () =>
  useAnecdoteStore(state => state.actions)

export default useAnecdoteStore