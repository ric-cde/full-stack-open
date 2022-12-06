const Filter = ({ handleChange, value}) => {
    return(
      <div>
        filter shown with <input onChange={handleChange} value={value} />
      </div>
    )
  }

export default Filter