

const { Link } = ReactRouterDOM
import { NotePreview } from "./NotePreview.jsx";


export function NoteList({ notes, onRemoveNote, onsaveNote }) {

    return (
        <section>
            <h1>Pinned:</h1>
            <ul className="note-list-pinned">
                {notes
                    .filter(note => note.isPinned) // Filter pinned notes
                    .map(note => (
                        <article key={note.id}>
                            <NotePreview
                                note={note}
                                onRemoveNote={onRemoveNote}
                                onSaveNote={(note) => onsaveNote(note)}
                            />
                        </article>
                    ))}
            </ul>

            {/* Render unpinned notes */}
            <h1>_________________________________________________________________________________________________________________________________________________</h1>
            <h1 className="others">Others:</h1>
            <ul className="note-list-pinned">
                {notes
                    .filter(note => !note.isPinned) // Filter unpinned notes
                    .map(note => (
                        <article key={note.id}>
                            <NotePreview
                                note={note}
                                onRemoveNote={onRemoveNote}
                                onSaveNote={(note) => onsaveNote(note)}
                            />
                        </article>
                    ))}
            </ul>

        </section>
        //     <ul className="note-list">
        //         {notes.map(note => (
        //             <article key={note.id}>
        //                 <NotePreview note={note}
        //                     onRemoveNote={onRemoveNote}
        //                     onSaveNote={(note) => onsaveNote(note)} />
        //             </article>
        //         ))}
        //     </ul>
    )
}