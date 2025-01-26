import { NoteFilter } from "./NoteFilter.jsx";

export function NoteHeader({ onFilterNotes }) {

  return (
    <header className="note-header">

      <section className="logo toggleable">
        <i className="fa-solid fa-bars font-awesome-hover-hint fa-solid fa-bars"></i>
        <img src="assets/img/note-logo.png"></img>
        <h3>Keep</h3>
      </section>

      <section className="search">
        <NoteFilter onFilterNotes={onFilterNotes} />
      </section>

      <section className="toolbar">
        <div className="fa-solid fa-refresh toolbar-button"></div>
        <div className="fa-solid fa-bars-progress toolbar-button"></div>
        <div className="fa-solid fa-gear toolbar-button"></div>
      </section>

      <section className="user-details">
        <div className="fa-solid fa-grip toolbar-button"></div>
        <img src="assets/img/user-avatar.png"></img>
      </section>

    </header>
  )


}