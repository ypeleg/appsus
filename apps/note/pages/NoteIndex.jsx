

export function NoteIndex() {
    return (<div className = "note-page">
                <header className = "note-header">
                


                    <section className = "logo">
                        <i class="fa-solid fa-bars"></i>
                        <img src = "assets/img/note-logo.png"></img>
                        <h3>Keep</h3>
                        
                    </section>
                    
                    <section className = "search">

                        <div className="search-bar">                            
                            <input className="searchbox" type = "text" placeholder = "Search" />                
                        </div>    

                    </section>

                    <section className = "toolbar">
                        <div className = "fa-solid fa-refresh toolbar-button"> </div>    
                        <div className = "fa-solid fa-bars-progress toolbar-button"> </div>    
                        <div className = "fa-solid fa-gear toolbar-button"> </div>    
                    </section>                


                    <section className = "user-details">
                        <div className = "fa-solid fa-grip toolbar-button"> </div>    
                        <img src = "assets/img/user-avatar.png"></img>
                    </section>                
                
                </header>





                <main className = "main-layout">
                
                    <div class ="side-bar">

                        <div className = "inbox side-bar-category side-active">
                            <i class="fa-regular fa-lightbulb"></i>
                            <span>Notes</span>
                        </div>    
                        
                        <div className = "starred side-bar-category">                            
                            <i class="fa-regular fa-bell"></i>
                            <span>Reminders</span>
                        </div>    
                        
                        <div className = "sent side-bar-category">
                            <i class="fa-solid fa-pen"></i>
                            <span>Edit Labels</span>
                        </div>    
                        
                        <div className = "draft side-bar-category">
                            <i class="fa-solid fa-box-archive"></i>                            
                            <span>Archive</span>
                        </div>    
                        
                        <div className = "trash side-bar-category">
                            <i class="fa-solid fa-trash"></i>
                            <span>Trash</span>
                        </div>    

                    </div>

                    <div class="notes-workspace">
                        
                        <div className="new-note">                            

                            <div class ="notes-buttons">
                                <div className = ""> <i class="fa-regular fa-lightbulb"></i> </div>    
                                <div className = ""> <i class="fa-regular fa-bell"></i> </div>    
                            </div>  
                            <input className="newnote" type = "text" placeholder = "Take a note.." />
                          

                        </div>    

                        <div className = "notes">


                            <div className = "note">
                                <h4>Note</h4>
                                <p>some text that is long</p>
                                <div className = "note-bottom-bar">
                                    <i class="fa-regular fa-bell"></i>
                                </div>
                            </div>


                        </div>

                    </div>
                    


                </main>

           </div>)
}

