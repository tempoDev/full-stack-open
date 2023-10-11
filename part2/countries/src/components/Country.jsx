import React from 'react'
import Weather from './Weather'

export default function Country({data}) {

  return (
    <>
        <h1>{data.name.common}</h1>
        <img src={data.flags.png} alt={`${data.name.common} flag`} />
        <p>Capital: {data.capital}</p>
        <p>Population: {data.population}</p>

        <h2>Languages</h2>
        {
            Object.values(data.languages).map( (language, i) => {
                return <li key={`${language}${i}`}>{language}</li>
            })
        }

        <Weather capital={data.capital} />
    </>
  )
}
