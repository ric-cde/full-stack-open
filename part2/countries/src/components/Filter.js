const Filter = ({ handleChange, currentFilter}) => {
    return (
      <>
      find countries: <input onChange={handleChange} value={currentFilter} />
      </>
    )
  }

export default Filter