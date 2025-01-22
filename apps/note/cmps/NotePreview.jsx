

export function NotePreview({ note }) {

    console.log('\n\n\n')
    console.log(note)
    console.log('\n\n\n')

  return (
    <section>

      <pre className="note-preview">
          <h4>{note.info.title}</h4>
          <h4>{note.info.txt}</h4>
      </pre>


    </section>
  )
}