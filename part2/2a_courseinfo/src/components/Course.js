const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
  {parts.map(part => (
    <Part part={part} key={part.id} />
  ))} 
  </>

const Course = ({course}) => {
    return (
      <>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((acc, val) => {
          console.log("Val ", val.exercises, ", acc ", acc)
          return val.exercises + acc}, 0)
          } />
      </>
    )
  }

  export default Course