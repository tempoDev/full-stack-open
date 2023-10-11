import React from 'react'

export default function Countries({data, setShow}) {

    const handleShow = (country) => {
        setShow([country])
    }

  return (
    <>
    {
        data.map( (country, i) => {
            return <li key={i}>{ country.name.common }  <button onClick={() => handleShow(country)}>Show</button></li>
        })
    }
    </>
  )
}
