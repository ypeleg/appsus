

export function NotePreview({ note }) {


  return (
    <section>

      <pre className="note-preview">
        {/* <h2>Title: {note.}</h2> */}
        <h4>{note.info.txt}</h4>

      </pre>


    </section>
  )
}