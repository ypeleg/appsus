import { ToolsBtnsNote } from "./ToolsBtnsNote.jsx";
import { UpdateNote } from "./UpdateNote.jsx";

const { useEffect, useState, useRef } = React



export function NotePreview({ note, onRemoveNote, onSaveNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);



  function NoteTxt({ note }) {
    return (
      <div className="note-layout">
        <div>
          <h4>{note.info.title}</h4>
        </div>
        <div>
          <h4>{note.info.txt}</h4>
        </div>

      </div>
    );
  }

  function NoteImg({ note }) {
    return (
      <div className="note-layout">
        <h1>{note.info.title}</h1>
        <img src={note.info.url} alt="Note" />
      </div>
    );
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
    return (
      <ul className="note-layout">
        {note.info.todos.map((todo, idx) => (
          <li key={idx} style={{ textDecoration: todo.doneAt ? 'line-through' : 'none' }}>
            {todo.txt}
          </li>
        ))}
      </ul>
    );
  }

  function onOpenEdit() {

  }

  function onOpenUpdate(note) {
    setIsEditing(true)
    setSelectedNote(note)
  }






  return (
    // onOpenUpdate(note)}
    <div>

      <pre className="note-preview" onClick={() => onOpenUpdate(note)} >
        <div className="remove fa-solid fa-circle-mark" onClick={() => onRemoveNote(note.id)}>X</div>

        {note.type === 'NoteTxt' &&
          <NoteTxt note={note} />
        }
        {note.type === 'NoteImg' &&
          <NoteImg note={note} />
        }
        {note.type === 'NoteVideo' &&
          <NoteVideo note={note} />
        }
        {note.type === 'NoteTodos' &&
          <NoteTodos note={note} />
        }

        <ToolsBtnsNote />

      </pre>

      {isEditing && (
        <UpdateNote
          note={selectedNote}
          onClose={() => setIsEditing(false)}
          onSaveNote={(note) => onSaveNote(note)}
        />
      )
      }

    </div>

  )
}