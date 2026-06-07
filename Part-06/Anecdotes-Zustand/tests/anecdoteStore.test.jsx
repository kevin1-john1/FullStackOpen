import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

vi.mock('../src/services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from '../src/services/anecdotes'
import useAnecdoteStore, {
  useAnecdoteActions,
  useAnecdotes,
} from '../src/stores/anecdoteStore'
import AnecdoteList from '../src/components/AnecdoteList'

beforeEach(() => {
  cleanup()

  useAnecdoteStore.setState({
    anecdotes: [],
    filter: '',
  })

  vi.clearAllMocks()
})

describe('anecdote store', () => {
  test('state is initialized with anecdotes returned by the backend', async () => {
    const anecdotes = [
      {
        id: '1',
        content: 'first anecdote',
        votes: 0,
      },
      {
        id: '2',
        content: 'second anecdote',
        votes: 3,
      },
    ]

    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current).toEqual([
      {
        id: '2',
        content: 'second anecdote',
        votes: 3,
      },
      {
        id: '1',
        content: 'first anecdote',
        votes: 0,
      },
    ])
  })

  test('AnecdoteList receives anecdotes sorted by votes', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        {
          id: '1',
          content: 'least voted',
          votes: 1,
        },
        {
          id: '2',
          content: 'most voted',
          votes: 5,
        },
        {
          id: '3',
          content: 'middle voted',
          votes: 3,
        },
      ],
      filter: '',
    })

    render(<AnecdoteList />)

    const anecdotes = screen.getAllByText(/voted/)

    expect(anecdotes[0]).toHaveTextContent('most voted')
    expect(anecdotes[1]).toHaveTextContent('middle voted')
    expect(anecdotes[2]).toHaveTextContent('least voted')
  })

  test('AnecdoteList receives properly filtered anecdotes', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        {
          id: '1',
          content: 'React is useful',
          votes: 2,
        },
        {
          id: '2',
          content: 'Zustand is simple',
          votes: 1,
        },
      ],
      filter: 'react',
    })

    render(<AnecdoteList />)

    expect(screen.getByText('React is useful')).toBeInTheDocument()
    expect(screen.queryByText('Zustand is simple')).toBeNull()
  })

  test('voting increases the number of votes for an anecdote', async () => {
    const anecdote = {
      id: '1',
      content: 'testing voting',
      votes: 0,
    }

    useAnecdoteStore.setState({
      anecdotes: [anecdote],
      filter: '',
    })

    anecdoteService.update.mockResolvedValue({
      ...anecdote,
      votes: 1,
    })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})