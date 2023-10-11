import React from 'react'

export default function Course({ courses }) {
  
    return (
    <>
        <Header name={ courses.name }/>
        <Content courses={courses.parts} />
        <Total data={courses.parts} />
    </>
  )
}

const Header = ({name}) => {

    return (
        <h1>{name}</h1>
    )

}

const Content = ({courses}) => {

    return (
        <>
        { courses.map( course => (
            <Part key={course.id} data={course} />
        ))}
        </>
    )

}

const Part = ({data}) =>{
    return(
      <p>{data.name} {data.exercises}</p>
    )
  }

const Total = ({data}) =>{

    const total = data.reduce( (sum, index) => sum + index.exercises, 0)

    return (
        <p style={{fontWeight: "bold"}}>Number of exercises {total}</p>
    )
}