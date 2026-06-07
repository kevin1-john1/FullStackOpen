import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng

    weatherService
      .getWeather(lat, lon)
      .then(data => {
        setWeather(data)
      })
  }, [country])

  if (weather === null) {
    return null
  }

  const icon = weather.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>

      <p>temperature {weather.main.temp} Celsius</p>

      <img
        src={iconUrl}
        alt={weather.weather[0].description}
      />

      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather