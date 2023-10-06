import { useState } from 'react';

function App() {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    setGood( good + 1)
  }

  const addNeutral = () => {
    setNeutral( neutral + 1)
  }

  const addBad = () => {
    setBad( bad + 1)
  }

  return (
    <div className="App">
      
      <h1>Give Feedback</h1>
      <Button name={"Good"} handleClick={addGood} />
      <Button name={"Neutral"} handleClick={addNeutral} />
      <Button name={"Bad"} handleClick={addBad} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  );
}

 function Statistics ({good, neutral, bad}){
  
   const total = good + neutral + bad
   const avg = (good * 1 + neutral * 0 + bad * -1) / total
   const goodAvg = (good * 100) / total
   
   if (total === 0) {
     return <p>No feedback given</p>;
   }

  return (
    <>
    <table>
        <tbody>
          <StatisticLine name={"Good"} value={good} />
          <StatisticLine name={"Neutral"} value={neutral} />
          <StatisticLine name={"Bad"} value={bad} />
          <StatisticLine name={"All"} value={total} />
          <StatisticLine name={"Average"} value={avg} />
          <StatisticLine name={"Positive"} value={`${goodAvg}%`} />
        </tbody>
      </table>
    </>
  )
}

function StatisticLine ({name, value}) {

  return (
    <tr>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  )

}

function Button ({name, handleClick}) {

  return(
    <button onClick={handleClick}>
      {name}
    </button>
  )

}

export default App;
