import { useEffect, useState } from 'react'
import axios from 'axios'

const useCountry = name => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry({
          found: true,
          data: response.data,
        })
      })
      .catch(() => {
        setCountry({
          found: false,
          data: null,
        })
      })
  }, [name])

  return country
}

export default useCountry