const { Link } = ReactRouterDOM
import { NotePreview } from "./NotePreview.jsx";


export function NoteList({ notes }) {

    return (
        <ul className="note-list">
            {notes.map(note => (
                <article key={note.id}>
                    <NotePreview note={note} />
                </article>


            ))}
        </ul>
    )
}