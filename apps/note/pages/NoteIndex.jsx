
const { useEffect, useState } = React

import { AddNote } from "../cmps/AddNote.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { NoteHeader } from "../cmps/NoteHeader.jsx"
import { noteService } from "../services/note.service.js"


export function NoteIndex() {

    const [notes, setNotes] = useState(null)
    const [filterBy, setFilterBy] = useState(noteService.getDefaultFilter())

    useEffect(() => {
        loadNotes()
    }, [])

    useEffect(() => {
        noteService.query(filterBy)
            .then((notes) => {
                console.log(notes)
                setNotes(notes)
            })
            .catch((err) => {
                console.log("Problems getting notes:", err)
                setError("Failed to load notes.")
            })
    }, [filterBy])


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
                console.log(savedNote);

                loadNotes()

                // if (notes.some(note => note.id === savedNote.id)) {
                //     let noteIndex = notes.findIndex(note => savedNote.id === note.id)
                //     let tmpNotes = [...notes]
                //     tmpNotes[noteIndex] = savedNote
                //     setNotes(tmpNotes)
                // } else {
                //     let tmpNotes = [savedNote, ...notes]
                //     setNotes(tmpNotes)
                // }
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

    function filterNotes(filterBy) {
        console.log(filterBy);
        setFilterBy(preFilter => ({ ...preFilter, ...filterBy }))
        // setFilterBy(preFilter => preFilter)
    }

    if (!notes) return <h1>Loading...</h1>
    return (
        <div className="note-page">
            <NoteHeader onFilterNotes={filterNotes} />
            <main className="main-layout">
                <SideBar />
                <div className="notes-workspace">
                    <AddNote onSaveNote={onSaveNote} />
                    <NoteList
                        notes={notes}
                        onRemoveNote={onRemoveNote}
                        onsaveNote={(note) => onSaveNote(note)}
                    />
                </div>
            </main>
        </div>)
}

