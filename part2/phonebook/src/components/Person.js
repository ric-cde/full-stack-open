import DeleteButton from './DeleteButton'

const Person = ({ person, handleDelete }) => {
    return(
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><DeleteButton handleDelete={handleDelete} /></td>
    </tr>)
  }

export default Person