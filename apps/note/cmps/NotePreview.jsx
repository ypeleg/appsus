

export function NotePreview({ note }) {
  return (


    <pre className="note-preview">
      <h4>{note.info.title}</h4>
      <h4>{note.info.txt}</h4>
    </pre>


  )
}