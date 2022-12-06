
const NewPersonForm = ({ onSubmit, handleNameChange, handleNumberChange, newName, newNumber }) => {
    return(
      <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    )
  }

export default NewPersonForm