const { useEffect, useState, useRef } = React
import { noteService } from "../services/note.service.js";


export function AddNote({ onSaveNote }) {


  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState(null)

  // const openClass = isOpen ? 'open' : ''
  const [noteToEdit, setNoteToEdit] = useState(noteService.getEmptyNote())
  const texRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    loadNotes()
  }, [noteToEdit])

  function loadNotes() {
    noteService.query()
      .then(notes => {
        console.log(notes);
        setNotes(notes)

      })
      .catch(err => {
        console.log('Problems getting notes:', err)
      })
  }

  function openEditor() {
    setIsOpen(true);
  }


  function saveNote(ev) {
    ev.preventDefault()
    const text = texRef.current.innerText.trim()
    console.log(titleRef);

    const title = titleRef.current.value

    noteToEdit.info.txt = text
    noteToEdit.info.title = title
    noteToEdit.type = 'NoteTxt'

    setNoteToEdit(noteToEdit)
    console.log(noteToEdit);
    onSaveNote(noteToEdit)
  }






  return (
    <section className="add-note-container">

      {isOpen ?
        <div className="note-editor">
          <form onSubmit={saveNote}>

            <input type="text"
              placeholder="Name"
              ref={titleRef}
            />
            <blockquote contenteditable="true"
              ref={texRef} >
              <p contenteditable="true" data-placeholder="Type your text here..."></p>
            </blockquote>


            <section className="note-editor-button">
              <button className="close">Close</button>
              <button className="fa-solid fa-download"></button>
              <button className="fa-solid fa-image"></button>
              <button className="fa-solid fa-palette"></button>

            </section>
          </form>

        </div>
        :
        <div className="new-note" onClick={openEditor}>
          <div className="text">
            Write somthing...
          </div>

          <div class="notes-buttons">
            <div className="" class="fa-regular fa-lightbulb" ></div>
            <div className="" class="fa-regular fa-bell"> </div>
          </div>
        </div >
      }



    </section>
  )

}