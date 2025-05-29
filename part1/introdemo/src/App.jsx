const Hello = ({name, age }) => {
  return (
    <p>Hello {name}, you are {age} </p>
  )
}

const App = () => {
  const friends = [
    { name: "john", age: "37" },
    { name: "ryan", age: "26"}
  ]
  const arrayEx = ["mike", "edward"]
	return (
		<div>
      <Hello name={friends[0].name} age={friends[0].age} />
		</div>
	)
}

export default App
