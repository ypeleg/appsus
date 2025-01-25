

const { useState, useEffect } = React


import { ToolsBtnsNote } from "../cmps/ToolsBtnsNote.jsx";


export function UpdateNote({ note, onClose, onSaveNote }) {



  const [editedNote, setEditedNote] = useState(note);


  function handleSave() {
    setEditedNote(editedNote)
    onSaveNote(editedNote)
    // console.log('sss');

    onClose()
  }

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
    console.log(editedNote);

    setEditedNote(prevNote => ({
      ...prevNote, info: {
        ...prevNote.info,
        [field]: value,
      },
    }))
  }

  function padNum(num) {
    return (num > 9) ? num + '' : '0' + num
  }

  function prettyShortPaddedDate(date) {
    if (date !== null) {
      // console.log('date:', date)
      date = new Date(date)
      return `${padNum(date.getDate())}/${padNum(date.getMonth() + 1)}`
    } else {
      return ''
    }

  }

  const { title, url } = editedNote.info

  return (
    <div>

      <div className="backdrop" onClick={onClose}></div>
      <section className="update-note">
        <input type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />

        {note.type === 'NoteTxt' ? (
          <blockquote
            contentEditable="true"
            suppressContentEditableWarning={true}
            onChange={handleChange}
            onInput={(ev) =>
              setEditedNote((prevNote) => ({
                ...prevNote,
                info: { ...prevNote.info, txt: ev.target.textContent },
              }))
            }
          >
            {editedNote.info.txt}
          </blockquote>

        ) : (
          <input
            type="text"
            placeholder="Enter Url"
            name='url'
            value={url}
            onChange={handleChange}
          />
        )}
        <section className="time-edit">
          <h5>{`Edited At: ${prettyShortPaddedDate(note.createdAt)}`}</h5>
        </section>

        <section className="note-editor-button">
          <button className="close" onClick={handleSave}>Save</button>
          <ToolsBtnsNote
            note={editedNote}
            onsaveNote={onSaveNote}
          />
        </section>

      </section>
    </div>

  )
}