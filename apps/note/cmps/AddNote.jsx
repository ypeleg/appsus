const { useEffect, useState, useRef } = React
import { noteService } from "../services/note.service.js";
import { modifyYoutubeUrl } from "../../../services/util.service.js"
import { ToolsBtnsNote } from "./ToolsBtnsNote.jsx";


export function AddNote({ onSaveNote }) {


  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState(null)
  const [cmpType, setCmpType] = useState('NoteTxt')
  const [todos, setTodos] = useState([])
  const [noteToEdit, setNoteToEdit] = useState(noteService.getEmptyNote())

  const txtRef = useRef(null);
  const titleRef = useRef(null);
  const urlImageRef = useRef(null);
  const urlVideoRef = useRef(null);
  const todoRef = useRef(null);


  useEffect(() => {
    console.log(cmpType);
  }, [cmpType])

  function openEditor() {
    setIsOpen(true);
  }

  function onChangeInfo(cmpType) {
    noteToEdit.type = cmpType
    noteToEdit.info.title = titleRef.current.value

    switch (cmpType) {
      case 'NoteTxt':
        noteToEdit.info.txt = txtRef.current.innerText.trim()
        return
      case 'NoteImg':
        noteToEdit.info.url = urlImageRef.current.value
        return
      case 'NoteVideo':
        const url = modifyYoutubeUrl(urlVideoRef.current.value)
        noteToEdit.info.url = url
        return
      case 'NoteTodos':
        const txt = todoRef.current.value
        const date = Date.now()
        noteToEdit.info.todos.push({ txt, doneAt: date })
        return

    }

  }


  function saveNote(ev) {
    ev.preventDefault()
    console.log(cmpType);

    onChangeInfo(cmpType)
    setNoteToEdit(noteToEdit)
    console.log(noteToEdit);
    setIsOpen(false)
    onSaveNote(noteToEdit)
    setCmpType('NoteTxt')
  }

  function handaleType(ev, type) {
    ev.stopPropagation()
    setCmpType(type)
    setIsOpen(true)
  }


  function NoteTxtEdit() {
    return (
      <div>
        <input type="text"
          placeholder="Name"
          ref={titleRef}
        />
        <blockquote contentEditable="true"
          ref={txtRef}
        >
          <p data-placeholder="Type your text here..."></p>
        </blockquote>
      </div>
    )
  }

  function NoteImgEdit() {
    return (
      <div className="editor">
        <input type="text"
          placeholder="Enter Image URl"
          ref={titleRef}
        />
        <input type="text"
          placeholder="Enter Image URl"
          ref={urlImageRef}
        />
      </div>

    )
  }

  function NoteVideoEdit() {
    return (
      <div className="editor">
        <input type="text"
          placeholder="Enter Title"
          ref={titleRef}
        />
        <input type="text"
          placeholder="Enter Video URL"
          ref={urlVideoRef}
        />
      </div>
    )
  }

  function NoteTodosEdit() {
    return (
      <div className="editor">
        <input type="text"
          placeholder="Enter Title"
          ref={titleRef}
        />

        <section className="add-todo">

          <input type="text"
            placeholder="Enter todo"
            ref={todoRef}
          />
          <button onClick={() => addTodo(todoRef.current.value)}>+</button>
        </section>

        <ul className="todos">

        </ul>
      </div>

    )
  }







  function DynamicCmp(props) {
    console.log('props:', cmpType)
    switch (props.cmpType) {
      case 'NoteTxt':
        return <NoteTxtEdit />
      case 'NoteImg':
        return <NoteImgEdit />
      case 'NoteVideo':
        return <NoteVideoEdit />
      case 'NoteTodos':
        return <NoteTodosEdit />
    }
  }






  return (
    <section className="add-note-container">

      {isOpen ?
        <div className="note-editor">
          <DynamicCmp cmpType={cmpType} />

          <section className="note-editor-button">
            <button className="close" onClick={(ev) => saveNote(ev)}>Close</button>

            <ToolsBtnsNote />
          </section>
        </div>
        :
        <div className="new-note" onClick={openEditor}>
          <div className="text">
            Write somthing...
          </div>

          <div className="notes-buttons">
            <div className="fa-regular fa-a" onClick={(ev) => handaleType(ev, 'NoteTxt')}></div>
            <div className="fa-regular fa-image" onClick={(ev) => handaleType(ev, 'NoteImg')}> </div>
            <div className="fa-brands fa-youtube" onClick={(ev) => handaleType(ev, 'NoteVideo')}> </div>
            <div className="fa-regular fa-circle-check" onClick={(ev) => handaleType(ev, 'NoteTodos')}> </div>
          </div>
        </div >
      }



    </section >
  )

}