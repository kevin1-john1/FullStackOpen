import useResource from './hooks/useResource'

const App = () => {
  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = event => {
    event.preventDefault()

    const content = event.target.note.value

    noteService.create({
      content,
    })

    event.target.note.value = ''
  }

  const handlePersonSubmit = event => {
    event.preventDefault()

    const name = event.target.name.value
    const number = event.target.number.value

    personService.create({
      name,
      number,
    })

    event.target.name.value = ''
    event.target.number.value = ''
  }

  return (
    <div>
      <h2>notes</h2>

      <form onSubmit={handleNoteSubmit}>
        <input name="note" />
        <button type="submit">create</button>
      </form>

      {notes.map(note => (
        <p key={note.id}>{note.content}</p>
      ))}

      <h2>persons</h2>

      <form onSubmit={handlePersonSubmit}>
        name <input name="name" />
        <br />
        number <input name="number" />
        <br />
        <button type="submit">create</button>
      </form>

      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  )
}

export default App