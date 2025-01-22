import {mailsService} from "../../mail/services/mails.service"

const { useEffect, useState } = React
const { Link, useSearchParams } = ReactRouterDOM


import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"
import { NoteHeader } from "../cmps/NoteHeader.jsx"
import { SideBar } from "../cmps/SideBar.jsx"
import { AddNote } from "../cmps/AddNote.jsx"


export function NoteIndex() {

    const [notes, setNotes] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [notes])

    function loadNotes() {
        noteService.query().then(notes => setNotes(notes))
    }

    function onSaveNote(note) {
        console.log('note', note);
        // const noteToSave = getEmptyNote()
        noteService.save(note)
            .then(() => {
                loadNotes()
                console.log('Note saved!!')
            })
            .catch(err => {
                console.log('Problems saving note:', err)
            })
    }

    if (!notes) return <h1>Loading...</h1>
    return (
        <div className="note-page">
            <NoteHeader />
            <main className="main-layout">
                <SideBar />
                <div className="notes-workspace">
                    <AddNote onSaveNote={onSaveNote} />
                    <NoteList
                        notes={notes}
                    />
                </div>
            </main>
        </div>)
}

