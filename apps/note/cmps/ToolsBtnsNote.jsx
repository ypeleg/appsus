const { useState } = React

export function ToolsBtnsNote({ }) {

  const [isPaletteOpen, setPaletteOpen] = useState(false)

  function onTogglePalette() {
    setPaletteOpen(!isPaletteOpen)
  }

  return (
    <section className="tools-btns">
      <button className="fa-solid fa-download"></button>
      <button className="fa-solid fa-image"></button>
      <button className="fa-solid fa-palette" onClick={t()}></button>
      <button className="fa-solid fa-envelope" onClick={() => onSentNoteToMail()}></button>

    </section>
  )


}