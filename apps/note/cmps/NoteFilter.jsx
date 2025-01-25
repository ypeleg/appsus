
const { useState, useEffect, useRef } = React

export function NoteFilter({ onFilterNotes }) {

  const [filterByToEdit, setFilterByToEdit] = useState({})
  useEffect(() => {
    console.log(filterByToEdit);

    onFilterNotes(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value
        break;

      case 'checkbox':
        value = target.checked
        break
    }
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  const { type } = filterByToEdit

  return (
    <section className="search">
      <div className="search-bar">
        <input className="searchbox"
          type="text"
          name='type'
          value={type}
          placeholder="Search"
          onChange={handleChange}
        />
      </div>
    </section>
  )
}