
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make normal'
    : 'make important'
 
  return (
    <li className="note">
      {note.content} {" "}
      <button onClick={toggleImportance} className="priority-button">{label}</button>
      {" "} {note.important ? "✅" : "⬜" }
    </li>
  )
  }

  export default Note;