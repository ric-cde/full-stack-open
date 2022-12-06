import { useState } from 'react'
import { useEffect } from 'react'
import Filter from './components/Filter'
import CountryList from './components/CountryList'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [currentFilter, setCurrentFilter] = useState('')
  // const [countriesToShow, setCountriesToShow] = useState([])
  
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
        console.log(response.data)
      })
  }, [])

  useEffect(() => {setCountriesToShow(
    countries.filter(
      country => country.name.common.toLowerCase().match(
        currentFilter.toLowerCase()
        )
      ))
  }, [countries, currentFilter])

  const handleFilterChange = (e) => {
    console.log('value: ',e.target.value);
    setCurrentFilter(e.target.value);
    console.log('filter: ', currentFilter);
    
  }

  
  return (
    <>
      <Filter handleChange={handleFilterChange} currentFilter={currentFilter} />
      <CountryList countriesToShow={countriesToShow} setCountriesToShow={setCountriesToShow} />
    </>
    )
}

export default App;
