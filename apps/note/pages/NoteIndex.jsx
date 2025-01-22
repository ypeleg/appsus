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
    }, [])




    function loadNotes() {
        noteService.query()
            .then(notes => {
                console.log(notes);
                setNotes(notes)

            })
            .catch(err => {
                console.log('Problems getting notes:', err)
            })
    }

    function onSaveNote(note) {
        console.log('sss');

        // noteService.save(note)
        //     .then(note => {
        //     })
        //     .catch(err => {
        //         console.log('err:', err)
        //     })
    }


    if (!notes) return <h1>Loading...</h1>
    return (
        <div className="note-page">
            <NoteHeader />
            <main className="main-layout">
                <SideBar />
                <div className="notes-workspace">
                    <AddNote onSaveNote={() => onSaveNote(note)} />
                    <NoteList
                        notes={notes}
                    />
                </div>
            </main>
        </div>)
}

