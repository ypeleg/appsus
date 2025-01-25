

const {useEffect, useState, useRef} = React
const {useSearchParams, useParams, useNavigate} = ReactRouterDOM


import {UpdateNote} from "./UpdateNote.jsx";
import {ToolsBtnsNote} from "../cmps/ToolsBtnsNote.jsx";
// import {noteService} from "../services/note.service.js";


export function NotePreview({note, onRemoveNote, onSaveNote}) {

    const [isEditing, setIsEditing] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)

    // const {noteId} = useParams()
    // const navigate = useNavigate()

    // useEffect(() => {
    //     if (noteId) {
    //         console.log(noteId);
    //
    //         noteService.get(noteId)
    //             .then(startEditing)
    //             .catch(err => {
    //                 console.log('Problem getting car', err)
    //                 // navigate('/note')
    //             })
    //
    //         console.log(selectedNote);
    //
    //
    //     }
    // }, [])

    // function startEditing(note) {
    //     setSelectedNote(note)
    //     setIsEditing(true)
    // }

    // useEffect(() => {
    //   console.log(noteId);
    // }, [selectedNote])

    // function loadNote() {
    //     noteService.get(noteId)
    //         .then(setSelectedNote)
    //         .catch(err => {
    //             console.log('Problem getting car', err)
    //             navigate('/note')
    //         })
    // }

    function NoteTxt({note}) {
        return (
            <div className="note-layout">
                <div>
                    <h4>{note.info.title}</h4>
                </div>
                <div>
                    <h4>{note.info.txt}</h4>
                </div>

            </div>
        );
    }

    function NoteImg({note}) {
        return (
            <div className="note-layout">
                <h1>{note.info.title}</h1>
                <img src={note.info.url} alt="Note"/>
            </div>
        );
    }

    function NoteVideo({note}) {
        return (
            <div className="note-layout">
                <iframe
                    width="100%"
                    height="200"
                    src={note.info.url}
                    frameBorder="0"
                    // allow="autoplay; encrypted-media"
                    // allowFullScreen
                    title="Video Note"
                ></iframe>
            </div>
        );
    }

    function NoteTodos({note}) {
        return (
            <ul className="note-layout">
                {note.info.todos.map((todo, idx) => (
                    <li key={idx} style={{textDecoration: todo.doneAt ? 'line-through' : 'none'}}>
                        {todo.txt}
                    </li>
                ))}
            </ul>
        );
    }

    // function onOpenEdit() {
    //
    // }

    function onOpenUpdate(note) {
        setIsEditing(true)
        setSelectedNote(note)
    }

    return (

            <div>
                <pre className="note-preview" onClick={() => onOpenUpdate(note)}>
                    <div className="remove fa-solid fa-circle-mark" onClick={() => onRemoveNote(note.id)}>X</div>
                        { note.type === 'NoteTxt' && <NoteTxt note={note}/> }
                        { note.type === 'NoteImg' && <NoteImg note={note}/> }
                        { note.type === 'NoteVideo' && <NoteVideo note={note}/> }
                        { note.type === 'NoteTodos' && <NoteTodos note={note} onSaveNote={(note) => onSaveNote(note)}/> }
                    <ToolsBtnsNote
                        note={note}
                        onsaveNote={(note) => onSaveNote(note)}
                    />
                </pre>
            {isEditing && (
                <UpdateNote
                    note={selectedNote}
                    onClose={() => setIsEditing(false)}
                    onsaveNote={(note) => onSaveNote(note)}
                />
            )}

        </div>

    )
}