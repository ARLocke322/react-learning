import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <form>
      <div>
        Filter shown with
        <input
          value={newFilter}
          onChange={handleFilterChange}
        />
      </div>
    </form>
  )
}

const Countries = ({ countries, newFilter, handleShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    return <Country country={countries[0]} advanced={true} />
  } else {
    return (
      countries.map(country =>
        <Country key={country.name.common} country={country} advanced={false} handleShow={handleShow} />
      )
    )
  }
}

const Country = ({ country, advanced, handleShow }) => {
  const advancedView = (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital && country.capital.join(', ')}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>{country.languages && Object.values(country.languages).map(language => <Language key={language} language={language}/>)}</ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
    </div>
  )

  if (!advanced) {
    return (
      <p>{country.name.common} <button onClick={() => handleShow(country)}>Show</button></p>
    )
  } else {
    return advancedView
  }
}

const Language = ({language}) => <li>{language}</li>

function App() {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => { setCountries(initialCountries) })
  }, [])

  if (!countries) {
    return null
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setSelectedCountry(null)
  }

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newFilter.toLowerCase())
  )

 

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      {selectedCountry
        ? <Country country={selectedCountry} advanced={true} />
        : <Countries countries={filteredCountries} newFilter={newFilter} handleShow={handleShow} />
      }
    </div>
  )
}

export default App
