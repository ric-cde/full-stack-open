import { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
const api_key = process.env.REACT_APP_WEATHER_API_KEY

const WeatherCard = ({ country }) => {
    const [weather, setWeather] = useState({})
  
    useEffect(() => {
      console.log('Polling weather...')
      const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital[0]},${country.name.common}&limit=1&appid=${api_key}`
      // console.log(geoURL);
      axios
        .get(geoURL)
        .then((response) => {
          console.log('first response', response.data)
          axios
          .get(`http://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${api_key}`)
          .then(response => {
            setWeather(response.data)
          })
        })
    }, [country])
  
    console.log('pre-if', weather)
    if (Object.keys(weather).length !== 0) {
      // console.log('passed test')
    return (
      <>
        <h2>Weather in {country.capital[0]}</h2>
        <p>temperature {(Math.round((weather.main.temp - 273.15) * 100))/100} C</p> 
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather for ${country.capital[0]}`} />
        <p>wind {weather.wind.speed} m/s</p> 
      </> 
    )
      } else {
        return (<p>No weather</p>)
      }
  }

  export default WeatherCard