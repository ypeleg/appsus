

const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { ToolsBtnsNote } from "../cmps/ToolsBtnsNote.jsx"
import { noteService } from "../services/note.service.js"
import { utilService } from "../../../services/util.service.js"



const NOTE_EDITORS = {
    NoteTxt: NoteTxtInput,
    NoteImg: NoteImgInput,
    NoteTodos: NoteTodosInput,
}



export function AddNote({ onSaveNote }) {
    const {noteId} = useParams()
    const [isOpen, setIsOpen] = useState(false)
    const [note, setNote] = useState(() => noteService.getEmptyNote())
    const navigate = useNavigate()

    useEffect(() => {
        if (noteId) {
            noteService.get(noteId).then(noteLoaded => {
                setNote(noteLoaded)
                setIsOpen(true)
            })
        }
    }, [noteId])

    function handleChange(changes) {
        setNote(prevNote => ({...prevNote, info: {...prevNote.info, ...changes}}))
    }

    function handleSave(ev) {
        ev.preventDefault()
        onSaveNote(note)
        setNote(noteService.getEmptyNote())
        setIsOpen(false)
        navigate('/note')
    }

    function handleTypeChange(type) {
        setNote(prevNote => ({...prevNote, type}))
        setIsOpen(true)
    }

    return (
        <div className="keep-note-container" onClick={() => setIsOpen(true)}>

            <div className={`note-editor note-edit-closed`}>   {/* ${isOpen ? 'note-edit-open' : ''}`}>*/}
                {isOpen ? (
                    <form className="internal-editor" onSubmit={handleSave}>
                        <NoteInput note={note} onChange={handleChange}/>
                        <div className="note-actions">
                            <div className="note-tools">
                            {/*    <button type="button" onClick={() => handleTypeChange('NoteImg')}>*/}
                            {/*        <i className="fa-regular fa-image"/>*/}
                            {/*    </button>*/}
                            {/*    <button type="button" onClick={() => handleTypeChange('NoteTodos')}>*/}
                            {/*        <i className="fa-regular fa-check-square"/>*/}
                            {/*    </button>*/}
                            </div>
                            <button type="submit" className="close-button">Close</button>
                        </div>
                    </form>
                ): (
                    <div className="note-placeholders-before-open">
                        <div className="note-placeholder">Take a note...</div>
                        <div className="note-tools">
                            <button><i className="fa-regular fa-check-square" /></button>
                            <button><i className="fa-regular fa-image" /></button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

function NoteInput({ note, onChange}) {
    switch(note.type) {
        case 'NoteTxt': return <NoteTxtInput note={note} onChange={onChange} />
        case 'NoteImg': return <NoteImgInput note={note} onChange={onChange} />
        case 'NoteTodos': return <NoteTodosInput note={note} onChange={onChange} />
        default: return <NoteTxtInput note={note} onChange={onChange}/>
    }
}

function NoteTxtInput({ note, onChange}) {
    return (
        <div className="note-content" aria-hidden={false}>
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

function NoteImgInput({ note, onChange }) {
    return (
        <div className="note-content">
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
                className="note-url"
            />
            {note.info.url && (
                <img src={note.info.url} alt="" className="note-image" />
            )}
        </div>
    )
}

function NoteTodosInput({ note, onChange }) {
    const [todoInput, setTodoInput] = useState('')

    function handleAddTodo(ev) {
        ev.preventDefault()
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
            <input
                type="text"
                value={note.info.title || ''}
                onChange={ev => onChange({ title: ev.target.value })}
                placeholder="Title"
                className="note-title"
            />
            <form onSubmit={handleAddTodo} className="todo-form">
                <input
                    type="text"
                    value={todoInput}
                    onChange={ev => setTodoInput(ev.target.value)}
                    placeholder="List item"
                    className="todo-input"
                />
                <button type="submit" className="todo-add">Add</button>
            </form>
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
        </div>
    )
}

