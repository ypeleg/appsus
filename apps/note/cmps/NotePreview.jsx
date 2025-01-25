

const { useEffect, useState, useRef } = React
const { useSearchParams, useParams, useNavigate } = ReactRouterDOM


import { UpdateNote } from "./UpdateNote.jsx";
import { ToolsBtnsNote } from "../cmps/ToolsBtnsNote.jsx";



export function NotePreview({ note, onRemoveNote, onSaveNote }) {

  const [isEditing, setIsEditing] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  console.log(onSaveNote);


  function NoteTxt({ note }) {
    return (
      <div className="note-layout" style={{ backgroundColor: note.style.backgroundColor }} >
        <p className="note-preview-txt note-preview-title">{note.info.title}</p>
        <p className="note-preview-txt">{note.info.txt}</p>
      </div>
    );
  }

  function NoteImg({ note }) {
    console.log('img', note)
    return (
      <div className="note-layout">

        {((note.info.url) && (!note.info.url.includes('youtube'))) ? (

          <img src={note.info.url} alt="Note" />
        ) : (
          <iframe
            width="100%"
            height="200"
            src={note.info.url}
            frameBorder="0"
            // allow="autoplay; encrypted-media"
            // allowFullScreen
            title="Video Note"
          ></iframe>)}

        <p className="note-preview-txt note-preview-title">{note.info.title}</p>
      </div>
    )
  }

  function NoteVideo({ note }) {
    return (
      <div className="note-layout">
        <iframe
          width="100%"
          height="200"
          src={note.info.url}
          frameBorder="0"
          // allow="autoplay; encrypted-media"
          // allowFullScreen
          title="Video Note"
        ></iframe>
      </div>
    );
  }

  function NoteTodos({ note }) {
    console.log('img', note)
    return (
      <section>{note.info.title && <p className="note-preview-txt note-preview-title">{note.info.title}</p>}
        <ul className="note-layout clean-list todo-list">

          {note.info.todos.map((todo, idx) => (
            <li key={idx} className={`todo-item ${todo.doneAt ? 'completed' : ''}`}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={!!todo.doneAt}
                onChange={() => { }}
              />
              <span className="todo-text">{todo.txt}</span>
            </li>
          ))}
          {note.info.todos.some((todo, idx) => (!!todo.doneAt))
            && <li className="completed-split"> </li>
          }
        </ul>
      </section>
    );
  }

  function onOpenUpdate(note) {
    setIsEditing(true)
    setSelectedNote(note)
  }

  return (

    <div >
      <pre className="note-preview" onClick={() => onOpenUpdate(note)} style={{ backgroundColor: note.style.backgroundColor }}>
        <div className="remove fa-solid fa-circle-mark" onClick={() => onRemoveNote(note.id)}>X</div>
        {note.type === 'NoteTxt' && <NoteTxt note={note} />}
        {note.type === 'NoteImg' && <NoteImg note={note} />}
        {note.type === 'NoteVideo' && <NoteVideo note={note} />}
        {note.type === 'NoteTodos' && <NoteTodos note={note} onSaveNote={(note) => onSaveNote(note)} />}
        <ToolsBtnsNote
          note={note}
          onsaveNote={(note) => onSaveNote(note)}
        />
      </pre>
      {isEditing && (
        <UpdateNote
          note={selectedNote}
          onClose={() => setIsEditing(false)}
          onSaveNote={(note) => onSaveNote(note)}
        />
      )}

    </div>

  )
}