import { useState, useEffect } from 'react'

const App = () => {

  const [anecdotes, setAnecdote] = useState([
    {
        "quote": "If it hurts, do it more often",
        "votes": 0
    },
    {
        "quote": "Adding manpower to a late software project makes it later!",
        "votes": 0
    },
    {
        "quote": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        "votes": 0
    },
    {
        "quote": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "votes": 0
    },
    {
        "quote": "Premature optimization is the root of all evil.",
        "votes": 0
    },
    {
        "quote": "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "votes": 0
    },
    {
        "quote": "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
        "votes": 0
    }
  ])
  
  const [selected, setSelected] = useState(0)
  
  const randomSelect = () => {
    const randomNumber = Math.round(Math.random()*(anecdotes.length - 1))
    setSelected(randomNumber)
  }

const voteSelected = () => {
  const newAnecdotes = [...anecdotes]
  newAnecdotes[selected].votes++
  setAnecdote(newAnecdotes)
}

const findMostVotes = () => {
  const max = anecdotes.reduce((prev, curr) => (prev.votes > curr.votes ? prev : curr)
  )
  return max
}

  useEffect(() => {
    randomSelect()
  }, [])

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected].quote} />
      has {anecdotes[selected].votes} votes
      <Button handleClick={voteSelected} text="vote" />
      <Button handleClick={randomSelect} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={findMostVotes().quote} />

    </div>
  )
}

const Anecdote = ({ anecdote }) => {
  return (
    <p>{anecdote}</p>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick }>{text}</button>
  )
}

export default App