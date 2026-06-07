const CountryList = ({ countries, showCountry }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}{' '}
          <button onClick={() => showCountry(country.name.common)}>
            show
          </button>
        </div>
      ))}
    </div>
  )
}

export default CountryList