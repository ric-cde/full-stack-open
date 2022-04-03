import { useState } from "react"

const Header = (props) => {
  console.log(props)
  return (
  <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <>
      <Part name={props[0].name} exercises={props[0].exercises} />
      <Part name={props[1].name} exercises={props[1].exercises} />
      <Part name={props[2].name} exercises={props[1].exercises} />
    </>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <p>
        {props.name} {props.exercises}
    </p>
  )
}

const Total = (props) => {
  console.log(props)
  const total = props.parts.reduce(
      (acc, val) => acc + val.exercises, 0
      )
      console.log("total is " + total)
  return (
    <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const [ counter, setCounter ] = useState(0)
  const increaseByOne = () => setCounter(counter+1)
  const resetToZero = () => setCounter(0)

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  console.log(course.parts)
  return (
    <div>
      <Header {...course.name} />
      <Content {...course.parts} />
      <Total parts={course.parts} />
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={resetToZero}>reset</button>
    </div>
  )
}

export default App