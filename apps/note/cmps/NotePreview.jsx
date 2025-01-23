

export function NotePreview({ note, onRemoveNote }) {



  function NoteTxt({ note }) {
    return (
      <div className="note-txt">
        <h4>{note.info.title}</h4>
        <h4>{note.info.txt}</h4>
      </div>
    );
  }

  function NoteImg({ note }) {
    return (
      <div className="note-img">
        <h1>{note.info.title}</h1>
        <img src={note.info.url} alt="Note" />
      </div>
    );
  }

  function NoteVideo({ note }) {
    return (
      <div className="note-video">
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
      <ul className="note-todos">
        {note.content.map((todo, idx) => (
          <li key={idx} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </li>
        ))}
      </ul>
    );
  }








  return (


    <pre className="note-preview">
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



    </pre>


  )
}