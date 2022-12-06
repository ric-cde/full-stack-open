import WeatherCard from './WeatherCard'

const CountryCard = ({ country }) => {
    return (
      <>
        <h1>{country.name.common}</h1>
        <p>
          capital {country.capital[0]} <br />
          area {country.area}
        </p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map(
            language => <li key={language}>{language}</li>
          )}
        </ul>
        <img src={country.flags.png} alt={country.name.common} />
        <WeatherCard country={country} />
      </>
    )
  }

  export default CountryCard