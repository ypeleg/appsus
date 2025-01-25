
const { useState } = React



export function ToolsBtnsNote({ note, onsaveNote }) {


    const [isPaletteOpen, setPaletteOpen] = useState(false)


    function handleColorSelect(ev) {
        ev.stopPropagation()
        note.style.backgroundColor
        onsaveNote(note)
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
            <button className="fa-solid fa-envelope" onClick={() => onSentNoteToMail()}></button>

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
                                onClick={(color) => handleColorSelect(color)}
                            ></div>
                        ))}
                    </div>
                </div>
            }
        </section>
    )


}