
import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'
import { loadFromStorage, saveToStorage } from '../../../services/storage.service.js'

const allNotes = [
  {
    id: 'n101',
    createdAt: 1112222,
    type: 'NoteTxt',
    isPinned: true,
    style: {
      backgroundColor: '#00d'
    },
    info: {
      title: 'Talshri',
      txt: 'Fullstack Me Baby!'
    }
  },
  {
    id: 'n102',
    createdAt: 1112223,
    type: 'NoteImg',
    isPinned: false,
    info: {
      url: 'http://some-img/me',
      title: 'Bobi and Me'
    },
    style: {
      backgroundColor: '#00d'
    }
  },
  {
    id: 'n103',
    createdAt: 1112224,
    type: 'NoteTodos',
    isPinned: false,
    info: {
      title: 'Get my stuff together',
      todos: [
        {
          txt: 'Driving license'
          , doneAt: null
        },
        { txt: 'Coding power', doneAt: 187111111 }
      ]
    }
  }
]

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
  query,
  get,
  remove,
  save,
  getEmptyNote,
  getEmptyTodos,
  getDefaultFilter,
  getFilterFromSearchParams,

}



function query(filterBy = {}) {
  return storageService.query(NOTE_KEY)
    .then(notes => {
      // if (filterBy.txt) {
      //   const regExp = new RegExp(filterBy.txt, 'i')
      //   notes = notes.filter(note => regExp.test(note.vendor))
      // }
      // if (filterBy.minSpeed) {
      //   notes = notes.filter(note => note.speed >= filterBy.minSpeed)
      // }
      return notes
    })
}

function get(noteId) {
  return storageService.get(NOTE_KEY, noteId)
    .then(note => _setNextPrevnoteId(note))
}

function remove(noteId) {
  return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
  console.log('a')
  if (note.id) {
    console.log('b')
    return storageService.put(NOTE_KEY, note)
  } else {
    console.log('c')
    return storageService.post(NOTE_KEY, note)
  }
}

function getEmptyNote(type = 'NoteTxt', isPinned = false, info = {}, style = { backgroundColor: '#00d' }) {
  return {
    // id: utilService.makeId(),
    type,
    createdAt: Date.now(),
    isPinned,
    info,
    style,
  }
}

function getEmptyTodos() {

}

function getDefaultFilter() {
  return {
    txt: '',
    minSpeed: '',
  }
}

function _createNotes() {
  let notes = loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    notes = allNotes
    saveToStorage(NOTE_KEY, notes)
  }
}





function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  const minSpeed = searchParams.get('minSpeed') || ''
  return {
    txt,
    minSpeed
  }
}


function _setNextPrevnoteId(note) {
  return query().then((notes) => {
    const noteIdx = notes.findIndex((currnote) => currnote.id === note.id)
    const nextnote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
    const prevnote = notes[noteIdx - 1] ? notes[noteIdx - 1] : notes[notes.length - 1]
    note.nextnoteId = nextnote.id
    note.prevnoteId = prevnote.id
    return note
  })
}

