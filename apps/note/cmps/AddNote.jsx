

const { useEffect, useState } = React
const { useParams, useNavigate, useSearchParams } = ReactRouterDOM

import { ToolsBtnsNote } from "../cmps/ToolsBtnsNote.jsx"
import { noteService } from "../services/note.service.js"
import { utilService } from "../../../services/util.service.js"

const NOTE_EDITORS = {
  NoteTxt: NoteTxtInput,
  NoteImg: NoteImgInput,
  NoteTodos: NoteTodosInput,
}

export function AddNote({ onSaveNote }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPaletteOpen, setPaletteOpen] = useState(false)
  const [note, setNote] = useState(() => noteService.getEmptyNote())
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  function isUsingSearchParams(searchParams) { return (searchParams.get('title') && searchParams.get('txt')) }

  useEffect(() => {
    if (noteId) {
      noteService.get(noteId).then(noteLoaded => {
        setNote(noteLoaded)
        setIsOpen(true)
      })
    } else if (isUsingSearchParams(searchParams)) {
      console.log('using search params!')
      setNote({ ...note, info: { title: searchParams.get('title'), txt: searchParams.get('txt') } })
      setIsOpen(true)
    }
  }, [noteId])

  function handleChange(changes) {
    setNote(prevNote => ({ ...prevNote, info: { ...prevNote.info, ...changes } }))
  }

  function handleSave(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    onSaveNote(note)
    setNote(noteService.getEmptyNote())
    setIsOpen(false)
    navigate('/note')
  }

  function handleTypeChange(ev, type) {
    ev.stopPropagation()
    ev.preventDefault()
    if (note.type === type) return
    const defaultInfos = { title: '' }
    switch (type) {
      case 'NoteImg':
        defaultInfos.url = ''
        break
      case 'NoteTodos':
        defaultInfos.todos = []
        break
      case 'NoteTxt':
        defaultInfos.txt = ''
        break
    }
    setNote(prevNote => ({
      ...prevNote,
      type,
      info: { ...defaultInfos, ...prevNote.info }
    }))
    setIsOpen(true)
  }

  function onSentNoteToMail(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    console.log('Sent to mail')

    navigate(`/mail?body=${encodeURIComponent(note.info.txt)}&subject=${encodeURIComponent(note.info.title)}`)
  }

  function handleColorSelect(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    setNote(prevNote => ({ ...prevNote, style: { backgroundColor: ev.target.style.backgroundColor } }))
    onSaveNote(note)
  }

  function onTogglePalette(ev) {
    console.log('palette open')
    ev.stopPropagation()
    ev.preventDefault()
    setPaletteOpen(!isPaletteOpen)
  }

  function onClickReminder(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    console.log('Reminder')
  }

  function onClickCollaborators(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    console.log('Collaborators')
  }

  function onClickPlaceholder(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    console.log('More')
  }

  function onPinClicked(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    setNote(prevNote => ({ ...prevNote, isPinned: !prevNote.isPinned }))
  }

  return (

    <div className="keep-note-container" onClick={() => {
      if (!isOpen) setIsOpen(true)
    }}>

      <div className={`note-editor note-edit-closed`} style={{ borderColor: note.style.backgroundColor }}>   {/* ${isOpen ? 'note-edit-open' : ''}`}>*/}
        {isOpen ? (
          <form className="internal-editor" onSubmit={handleSave} >
            <NoteInput note={note} onChange={handleChange} onPinClicked={onPinClicked} />
            <div className="note-actions">
              <div className="note-tools">

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

                <button title="Reminder" className="tooltip tooltip-smaller" data-tip="Remind Me" onClick={onClickReminder}><i className="fa-regular fa-bell" /></button>
                <button className="fa-solid fa-envelope" onClick={(ev) => onSentNoteToMail(ev)}></button>
                <button title="Collaborator" className="tooltip tooltip-smaller" data-tip="Collaborators" onClick={onClickCollaborators} ><i className="fa-regular fa-user" /></button>
                <button title="Background" className="tooltip tooltip-smaller" onClick={(ev) => handleTypeChange(ev, 'NoteImg')} data-tip="Add Image / Video"><i className="fa-regular fa-image" /></button>
                <button title="Image" className="tooltip tooltip-smaller" onClick={(ev) => handleTypeChange(ev, 'NoteTodos')} data-tip="ToDo List"><i className="fa-regular fa-check-square" /></button>
                <button title="Background Color" className="tooltip tooltip-smaller" data-tip="Background Color" onClick={onTogglePalette} ><i className="fa-regular fa-palette" /></button>
                <button title="More" className="tooltip tooltip-smaller" data-tip="More" onClick={onClickPlaceholder}><i className="fa-solid fa-ellipsis-vertical" /></button>
                <button title="Undo" className="tooltip tooltip-smaller" data-tip="Undo" onClick={onClickPlaceholder}><i className="fa-solid fa-reply" /></button>
                <button title="Redo" className="tooltip tooltip-smaller" data-tip="Redo" onClick={onClickPlaceholder}><i className="fa-solid fa-share" /></button>
              </div>
              <button type="submit" className="close-button">Close</button>
            </div>
          </form>
        ) : (
          <div className="note-placeholders-before-open">
            <div className="note-placeholder">Take a note...</div>
            <div className="note-tools">
              <button onClick={(ev) => handleTypeChange(ev, 'NoteTodos')} ><i className="fa-regular fa-check-square" /></button>
              <button onClick={(ev) => handleTypeChange(ev, 'NoteImg')}><i className="fa-regular fa-image" /></button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

function NoteInput({ note, onChange, onPinClicked }) {

  console.log('note type', note.type)
  switch (note.type) {
    case 'NoteTxt': return <NoteTxtInput note={note} onChange={onChange} onPinClicked={onPinClicked} />
    case 'NoteImg': return <NoteImgInput note={note} onChange={onChange} onPinClicked={onPinClicked} />
    case 'NoteTodos': return <NoteTodosInput note={note} onChange={onChange} onPinClicked={onPinClicked} />
    default: return <NoteTxtInput note={note} onChange={onChange} onPinClicked={onPinClicked} />
  }
}

function NoteTxtInput({ note, onChange, onPinClicked }) {
  console.log('txt', note)
  return (
    <div className="note-content" aria-hidden={false}>
      <i className="note-pin fa-solid fa-thumbtack" onClick={onPinClicked}></i>
      <input
        type="text"
        value={note.info.title || ''}
        onChange={ev => onChange({ title: ev.target.value })}
        placeholder="Title"
        className="note-title"
      />
      <textarea
        value={note.info.txt || ''}
        onChange={ev => onChange({ txt: ev.target.value })}
        placeholder="Take a note..."
        className="note-text"
      />
    </div>
  )
}

function NoteImgInput({ note, onChange, onPinClicked }) {
  console.log('img', note)


  function onImgError(ev) {

    ev.stopPropagation()
    ev.preventDefault()
    console.log('error')
    console.log(ev)

    ev.target.src = "/images/no-image-100px.gif"
    ev.target.onerror = null
    return true
  }

  return (
    <div className="note-content">
      <i className="note-pin fa-solid fa-thumbtack" onClick={onPinClicked}></i>
      <input
        type="text"
        value={note.info.title || ''}
        onChange={ev => onChange({ title: ev.target.value })}
        placeholder="Title"
        className="note-title"
      />
      <input
        type="url"
        value={note.info.url || ''}
        onChange={ev => onChange({ url: ev.target.value })}
        placeholder="Add image URL"
        className="note-url url-input"
      />
      {note.info.url && (
        <img src={note.info.url} className="note-image note-editor-img" onError={(ev) => { ev.target.src = 'assets/img/unavailable.jpg' }} />
      )}
    </div>
  )
}

function NoteTodosInput({ note, onChange, onPinClicked }) {
  console.log('todos', note)
  const [todoInput, setTodoInput] = useState('')

  function handleAddTodo(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    console.log('add todo', todoInput)
    if (!todoInput.trim()) return

    onChange({
      todos: [...(note.info.todos || []), { txt: todoInput, doneAt: null }]
    })
    setTodoInput('')
  }

  function handleToggleTodo(idx) {
    const todos = [...note.info.todos]
    todos[idx].doneAt = todos[idx].doneAt ? null : Date.now()
    onChange({ todos })
  }

  return (
    <div className="note-content">
      <i className="note-pin fa-solid fa-thumbtack" onClick={onPinClicked}></i>
      <input
        type="text"
        value={note.info.title || ''}
        onChange={ev => onChange({ title: ev.target.value })}
        placeholder="Title"
        className="note-title"
      />
      <ul className="todo-list">
        {note.info.todos.map((todo, idx) => (
          <li
            key={idx}
            className={"todo-item" + (todo.doneAt ? " completed" : "")}
            onClick={() => handleToggleTodo(idx)}
          >
            <div className="checkbox">
              <input type="checkbox" checked={!!todo.doneAt} readOnly />
              <span className="checkmark"></span>
            </div>
            <span className="todo-text">{todo.txt}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={todoInput}
          onChange={ev => setTodoInput(ev.target.value)}
          placeholder="List item"
          className="todo-input"
        />
        <button type="submit" className="todo-add" onClick={handleAddTodo}>Add</button>
      </form>

    </div>
  )
}

