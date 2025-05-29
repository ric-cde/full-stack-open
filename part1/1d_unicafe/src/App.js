import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const opinions = {good, neutral, bad }
  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </div>
      <Statistics {...opinions} />
    </div> 
    
  )
}

const Statistics = ({ good, neutral, bad }) => {
  console.log(good, neutral, bad);
  const all = good + neutral + bad;
  
  const average = all ? (good - bad) / all : 0;
  const positive = all ? good / all : 0;

  if (all > 0) {
    return (
		<div>
			<h1>statistics</h1>
			<table>
				<StatisticLine text="good" value={good} />
				<StatisticLine text="neutral" value={neutral} />
				<StatisticLine text="bad" value={bad} />
				<StatisticLine text="all" value={all} />
				<StatisticLine
					text="average"
					value={average ? Math.round(average * 100) / 100 : ""}
				/>
				<StatisticLine
					text="positive"
					value={
						positive ? Math.round(positive * 10000) / 100 + "%" : ""
					}
				/>
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