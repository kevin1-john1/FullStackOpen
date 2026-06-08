import { useState } from 'react'
import useCountry from './hooks/useCountry'

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  const data = country.data

  return (
    <div>
      <h3>{data.name.common}</h3>

      <div>capital {data.capital[0]}</div>
      <div>population {data.population}</div>

      <img
        src={data.flags.png}
        alt={data.flags.alt}
        width="200"
      />
    </div>
  )
}

const App = () => {
  const [name, setName] = useState('')
  const country = useCountry(name)

  const handleChange = event => {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <input
          value={name}
          onChange={handleChange}
        />
      </form>

      <Country country={country} />
    </div>
  )
}

export default App