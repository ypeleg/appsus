
export function SideBar() {

  return (
    <div class="side-bar">

      <div className="inbox side-bar-category side-active">
        <i class="fa-regular fa-lightbulb"></i>
        <span>Notes</span>
      </div>

      <div className="starred side-bar-category">
        <i class="fa-regular fa-bell"></i>
        <span>Reminders</span>
      </div>

      <div className="sent side-bar-category">
        <i class="fa-solid fa-pen"></i>
        <span>Edit Labels</span>
      </div>

      <div className="draft side-bar-category">
        <i class="fa-solid fa-box-archive"></i>
        <span>Archive</span>
      </div>

      <div className="trash side-bar-category">
        <i className="fa-solid fa-trash"></i>
        <span>Trash</span>
      </div>

    </div>
  )

}
