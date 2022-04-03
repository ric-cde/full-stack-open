import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral  + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </div>
      <Statistics opinions={[{good}, {neutral}, {bad}]} />
    </div>
  )
}

const Statistics = ({ opinions }) => {
  console.log(opinions);
  const all = opinions.reduce(
    (acc, val) => acc + Object.values(val)[0], 0);
  let average = 0
  for (const item of opinions) {
    const key = Object.keys(item)[0]
    if (key === "good") {
      average = average + item.good
    } else if (key === "bad") {
      average = average - item.bad
    }
  }
  average = average / all;
  let good = 0;
  for (const item of opinions) {
    if (Object.keys(item)[0] === "good") {
      good = item.good
    }
  }
  const positive = good / all;

  if (all > 0) {
    return (
      <div>
        <h1>statistics</h1>
          <table>
            {opinions.map(item => {
              const text = Object.keys(item)[0]
              const value = Object.values(item)[0]
              return <StatisticLine 
                        text={text} 
                        value={value} 
                        key={text} />
            })}
            <StatisticLine 
              text="all" 
              value={all} />
            <StatisticLine 
              text="average" 
              value={average ? (Math.round(average * 100) / 100) : ""} />
            <StatisticLine 
              text="positive" 
              value={positive ? (Math.round(positive * 10000) / 100) + "%" : ""} />
          </table>
      </div>
  )}
  else {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
}

const StatisticLine = ({ text, value }) => {
  console.log("Stat", text, value)
  return ( 
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Button = ({ handleClick, text }) => {
  return (
  <button onClick={handleClick}>{text}</button>
  )
}
export default App