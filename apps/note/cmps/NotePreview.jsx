

export function NotePreview({ note, onRemoveNote }) {
  return (


    <pre className="note-preview">
      <div className="remove fa-solid fa-circle-mark" onClick={() => onRemoveNote(note.id)}>X</div>
      <h4>{note.info.title}</h4>
      <h4>{note.info.txt}</h4>

    </pre>


  )
}