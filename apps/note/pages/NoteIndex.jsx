

const { useEffect, useState } = React


import { AddNote } from "../cmps/AddNote.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { NoteList } from "../cmps/NoteList.jsx"

import { NoteHeader } from "../cmps/NoteHeader.jsx"
import { noteService } from "../services/note.service.js"


export function NoteIndex() {

    const [notes, setNotes] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        noteService.query()
            .then((notes) => {
                console.log(notes)
                setNotes(notes)
            })
            .catch((err) => {
                console.log("Problems getting notes:", err)
                setError("Failed to load notes.")
            })
    }


    function onSaveNote(note) {
        console.log(note);
        noteService
            .save(note)
            .then((savedNote) => {
                loadNotes()
            })
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(notes => notes.filter(note => note.id !== noteId))
                showSuccessMsg(`note removed successfully!`)
            })
            .catch(err => {
                console.log('Problems removing note:', err)
                showErrorMsg(`Problems removing note (${noteId})`)
            })
    }

    if (!notes) return <h1>Loading...</h1>
    return (
        <div className="note-page">
            <NoteHeader />
            <main className="main-layout">
                <SideBar />
                <div className="notes-workspace">
                    <AddNote onSaveNote={(note) => onSaveNote(note)} />
                    <NoteList
                        notes={notes}
                        onRemoveNote={(noteId) => onRemoveNote(noteId)}
                        onsaveNote={(note) => onSaveNote(note)}
                    />
                </div>
            </main>
        </div>)
}

