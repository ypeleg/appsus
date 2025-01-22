
export function MailIndex() {
    return (<div>
                <header className = "mail-header">
                
                    <section className = "compose">
                        <button><i class="fa-solid fa-pen"></i> <span>Compose</span></button>
                    </section>
                    
                    <section className = "search">

                        <div className="search-bar">                            
                            <input className="searchbox" type = "text" placeholder = "Search" />                
                        </div>    

                    </section>

                    <section className = "user-details"> </section>                
                
                </header>

                <main className = "main-layout">
                
                    <div class ="side-bar">

                        <div className = "inbox side-bar-category">
                            <i class="fa-solid fa-inbox"></i>
                            <span>Inbox</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "starred side-bar-category">                            
                            <i class="fa-regular fa-star"></i>
                            <span>Starred</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "sent side-bar-category">
                            <i class="fa-regular fa-paper-plane"></i>
                            <span>Sent</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "draft side-bar-category">
                            <i class="fa-regular fa-file"></i>                            
                            <span>Drafts</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "trash side-bar-category">
                            <i class="fa-solid fa-trash"></i>
                            <span>Trash</span>
                            <span>1,000</span>
                        </div>    

                    </div>
                    
                    <div class ="main-table">

                        <div className = "tab-bar">
                            <div className = "primary-tab tab-item tab-active"><i class="fa-solid fa-inbox"></i><span>Primary</span></div>
                            <div className = "promotions-tab tab-item"><i class="fa-solid fa-tag"></i><span>Promotions</span></div>
                            <div className = "social-tab tab-item"><i class="fa-regular fa-user"></i><span>Social</span></div>
                        </div>

                        <div className = "filter-bar">
                            
                            <div className = "date-selection select-box"> Date </div>
                            <div className = "subject-selection select-box"> Subject </div>
                            <div className = "all-selection select-box"> All </div>
                            
                        </div>
                        
                        <div className = "messages">
                            <article className = "msg">
                                <div className = "unread"> <input className="checkbox" type="checkbox"></input> </div>
                                <div className = "star"><i class="fa-regular fa-star"></i> </div>
                                <div className = "user">user@gmail.com</div>
                                <div className = "msg-details">
                                    <div className = "title">Hello how are you?</div>
                                    <div className = "subtitle">lorem something or something</div>
                                </div>
                                <div className = "date">Nov 13</div>
                            </article>

                            <article className = "msg">
                                <div className = "unread"> <input className="checkbox" type="checkbox"></input> </div>
                                <div className = "star"><i class="fa-regular fa-star"></i> </div>
                                <div className = "user">user@gmail.com</div>
                                <div className = "msg-details">
                                    <div className = "title">Hello how are you?</div>
                                    <div className = "subtitle">lorem something or something</div>
                                </div>
                                <div className = "date">Nov 13</div>
                            </article>
                        </div>    

                    </div>

                </main>

           </div>)
}

