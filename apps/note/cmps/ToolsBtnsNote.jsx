
const { useState } = React
const { useParams, useNavigate, useSearchParams } = ReactRouterDOM



export function ToolsBtnsNote({ note, onsaveNote }) {
  const [isPaletteOpen, setPaletteOpen] = useState(false)
  const [editedNote, setEditedNote] = useState(note);
  const navigate = useNavigate()


  function handleColorSelect(ev, color) {
    ev.stopPropagation()
    console.log(color);

    editedNote.style.backgroundColor = color

    setEditedNote(editedNote)
    onsaveNote(editedNote)
  }

  function onSentNoteToMail(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    console.log('Sent to mail')

    navigate(`/mail?body=${encodeURIComponent(note.info.txt)}&subject=${encodeURIComponent(note.info.title)}`)
  }

  function onTogglePalette(ev) {
    ev.stopPropagation()
    setPaletteOpen(!isPaletteOpen)
  }

  return (
    <section className="tools-btns">
      <button className="fa-solid fa-download"></button>
      <button className="fa-solid fa-image"></button>
      <button className="fa-solid fa-palette" onClick={onTogglePalette}></button>
      <button className="fa-solid fa-envelope" onClick={(ev) => onSentNoteToMail(ev)}></button>

      {isPaletteOpen &&

        <div className="palette-modal">
          <div className="color-grid">
            {[
              "#F28B82",
              "#FBBC04",
              "#FFF475",
              "#CCFF90",
              "#A7FFEB",
              "#CBF0F8",
              "#AECBFA",
              "#D7AEFB",
              "#FDCFE8",
            ].map((color) => (
              <div
                key={color}
                className="color-circle"
                style={{ backgroundColor: color }}
                onClick={(ev) => handleColorSelect(ev, color)}
              ></div>
            ))}
          </div>
        </div>
      }
    </section>
  )


}