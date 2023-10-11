import axios from "axios";
import { useEffect, useState } from "react";
import Countries from "./components/Countries";
import Country from "./components/Country";

function App() {

  const [countries, setCountries] = useState([])
  const [findCountry, setFindCountry] = useState("")
  const [searchCountries, setSearchCountries] = useState([])

  const handleFilter = (event) => {
    setFindCountry( event.target.value)

    const filterCountries = countries.filter( (country) => 
      country.name.common.toLowerCase().includes( findCountry.toLowerCase() )
    )

    setSearchCountries( filterCountries )
  }

  useEffect( () => {

    axios.get("https://restcountries.com/v3.1/all")
    .then( (response) => {
      setCountries(response.data)
    })

  }, [])

  return (
    <div className="App">
      
      <h2>FIND COUNTRIES</h2>
      <input value={findCountry} onChange={handleFilter} />

      {
        searchCountries.length === 1 
        ? <Country data={searchCountries[0]} />
        : null
      }

      {
        searchCountries.length > 10 ? <h4>Too many matches, specify another filter</h4>
        : searchCountries.length > 1 ? <Countries data={searchCountries} setShow={setSearchCountries}/>
        : null
      }

    </div>
  );
}

export default App;
