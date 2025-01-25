

const { Link } = ReactRouterDOM
import { NotePreview } from "./NotePreview.jsx";


export function NoteList({ notes, onRemoveNote, onsaveNote }) {

    return (
        <ul className="note-list">
            {notes.map(note => (
                <article key={note.id}>
                    <NotePreview note={note}
                        onRemoveNote={onRemoveNote}
                        onSaveNote={(note) => onsaveNote(note)} />
                </article>


            ))}
        </ul>
    )
}