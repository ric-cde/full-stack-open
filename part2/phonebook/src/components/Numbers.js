import Person from './Person'

const Numbers = ({ persons, handleDelete }) => {
    return(
    <table>
        <tbody>
            {persons.map(person => <Person person={person} key={person.id} handleDelete={() => handleDelete(person)} />)}
        </tbody>
    </table>
    )
  }

export default Numbers