const { Link } = ReactRouterDOM
import { NotePreview } from "./NotePreview.jsx";


export function NoteList({ notes, onRemoveNote }) {

    return (
        <ul className="note-list">
            {notes.map(note => (
                <article key={note.id}>
                    <NotePreview note={note} onRemoveNote={(noteId) => onRemoveNote(noteId)} />
                    <section>
                    </section>
                </article>


            ))}
        </ul>
    )
}