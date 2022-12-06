import CountryCard from './CountryCard'

const CountryList = ({ countriesToShow, setCountriesToShow }) => {

    const handleShowCountry = (country) => {
      let updatedCountries = countriesToShow.map(
        (eachCountry) => {
          return (
            eachCountry.cioc === country.cioc
              ? country.showStatus
                ? Object.assign(eachCountry, {showStatus: false})
                : Object.assign(eachCountry, {showStatus: true})
              : eachCountry
            )
        }
        )
      console.log(updatedCountries)
      setCountriesToShow(updatedCountries)
    }
  
    console.log("countries", countriesToShow)
    if (countriesToShow.length >= 10) {
      return (
        <p>There are too many matches; specify another filter</p>
      )} else if (countriesToShow.length === 1) {
        return (
          <CountryCard country={countriesToShow[0]} />
        )
      } else if (countriesToShow.length === 0) {
        return (
          <p>Type to filter countries</p>
        )
      } else {
        return (
        <table>
          <tbody>
          {countriesToShow.map(country => 
            <tr key={country.cioc}>
              {country.showStatus
                ? <td><CountryCard country={country} key={country.cioc} /></td>
                : <>
                    <td>{country.name.common}</td>
                  </>
              }
              <td><button onClick={() => handleShowCountry(country)}>{!country.showStatus ? 'show' : 'hide'}</button></td>
            </tr>
          )}
          </tbody>
        </table>
        )
      }
  }

  export default CountryList