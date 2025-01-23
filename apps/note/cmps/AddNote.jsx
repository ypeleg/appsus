const { useEffect, useState, useRef } = React
import { noteService } from "../services/note.service.js";


export function AddNote({ onSaveNote }) {


  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState(null)
  const [cmpType, setCmpType] = useState('NoteTxt')

  const [noteToEdit, setNoteToEdit] = useState(noteService.getEmptyNote())
  const texRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // loadNotes()
    console.log(cmpType);

  }, [cmpType])

  // // useEffect(() => {
  // //   loadNotes()
  // // }, [noteToEdit])

  // function loadNotes() {
  //   noteService.query()
  //     .then(notes => {
  //       console.log(notes);
  //       setNotes(notes)

  //     })
  //     .catch(err => {
  //       console.log('Problems getting notes:', err)
  //     })
  // }

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
    setIsOpen(false)
    onSaveNote(noteToEdit)
  }

  function handaleType(ev, type) {
    console.log(ev);
    ev.stopPropagation()
    setCmpType(type)
  }










  function DynamicCmp(props) {
    // console.log('props:', props)
    switch (cmpType) {
      case 'TextBox':
        return <ColorInput {...props} />
      case 'fontSize':
        return <FontsizeInput {...props} />
    }
  }






  return (
    <section className="add-note-container">

      {isOpen ?
        <div className="note-editor">

          <input type="text"
            placeholder="Name"
            ref={titleRef}
          />
          <blockquote contentEditable="true"
            ref={texRef}
          >

            <p data-placeholder="Type your text here..."></p>
          </blockquote>


          <section className="note-editor-button">
            <button className="close" onClick={(ev) => saveNote(ev)}>Close</button>
            <section className="tools-btns">
              <button className="fa-solid fa-download"></button>
              <button className="fa-solid fa-image"></button>
              <button className="fa-solid fa-palette"></button>
            </section>

          </section>


        </div>
        :
        <div className="new-note" onClick={openEditor}>
          <div className="text">
            Write somthing...
          </div>

          <div className="notes-buttons">
            <div className="fa-regular fa-a" onClick={(ev) => handaleType(ev, 'TextBox')}></div>
            <div className="fa-regular fa-image" onClick={(ev) => handaleType(ev, 'NoteImg')}> </div>
            <div className="fa-brands fa-youtube" onClick={(ev) => handaleType(ev, 'TextBox')}> </div>
            <div className="fa-regular fa-circle-check" onClick={(ev) => handaleType(ev, 'NoteTodos')}> </div>
          </div>
        </div >
      }



    </section >
  )

}