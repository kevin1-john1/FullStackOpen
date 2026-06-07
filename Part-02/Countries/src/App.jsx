import { useEffect, useState } from 'react'
import countryService from './services/countries'
import Search from './components/Search'
import CountryList from './components/CountryList'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(data => {
        setCountries(data)
      })
  }, [])

  const countriesToShow = search
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const showCountry = name => {
    setSearch(name)
  }

  const renderCountries = () => {
    if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (countriesToShow.length > 1) {
      return (
        <CountryList
          countries={countriesToShow}
          showCountry={showCountry}
        />
      )
    }

    if (countriesToShow.length === 1) {
      return <Country country={countriesToShow[0]} />
    }

    return null
  }

  return (
    <div>
      <Search
        value={search}
        onChange={event => setSearch(event.target.value)}
      />

      {renderCountries()}
    </div>
  )
}

export default App