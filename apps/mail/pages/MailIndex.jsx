

const { Link } = ReactRouterDOM
const { useState, useEffect, useRef } = React


import { MailList } from '../cmps/MailList.jsx'
import { mailsService } from '../services/mails.service.js'


export function MailIndex() {

    const [mails, setMails] = useState([])

    const [filterBy, setFilterBy] = useState(mailsService.getDefaultFilter()) // maxPrice: 100

    useEffect(() => {
        console.log('filterBy:', filterBy)
        mailsService.query(filterBy).then(setMails)
    }, [filterBy])

    function onSetFilterBy(newFilter) {
        setFilterBy(prevFilter => ({...prevFilter, ...newFilter}))
    }

    function removeMail(mailId) {
        mailsService.remove(mailId)
            .then(() => {
                setMails(prevMails => prevMails.filter(mail => mailId !== mail.id))
                showSuccessMsg('Mail has been successfully removed!')
            })
            .catch(() => {
                showErrorMsg(`couldn't remove mail`)
                navigate('/mail')
            })
    }

    return (<div className="mail-page">
        <header className="mail-header">

            <section className="logo">
                <i className = "fa-solid fa-bars"></i>
                <img src="assets/img/gmail-logo.png"></img>
                <h3>Gmail</h3>

            </section>

            {/* <section className = "compose">
                        <button><i className = "fa-solid fa-pen"></i> <span>Compose</span></button>                        
                    </section> */}

            <section className="search">

                <div className="search-bar">
                <input className="searchbox" type = "text" placeholder = "Search" />
                        </div>    

                    </section>

                    {/* <section className = "user-details"> </section>                 */}
                    <section className = "user-details">
                        <div className = "fa-solid fa-grip toolbar-button"> </div>    
                        <img src = "assets/img/user-avatar.png"></img>
                    </section>                
                
                
                </header>

                <main className = "main-layout">
                
                    <div className = "side-bar">

                        <section className = "compose">
                            <button><i className = "fa-solid fa-pen"></i> <span>Compose</span></button>                        
                        </section>
                    
                        <div className = "inbox side-bar-category">
                            <i className = "fa-solid fa-inbox"></i>
                            <span>Inbox</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "starred side-bar-category">                            
                            <i className = "fa-regular fa-star"></i>
                            <span>Starred</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "sent side-bar-category">
                            <i className = "fa-regular fa-paper-plane"></i>
                            <span>Sent</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "draft side-bar-category">
                            <i className = "fa-regular fa-file"></i>                            
                            <span>Drafts</span>
                            <span>1,000</span>
                        </div>    
                        
                        <div className = "trash side-bar-category">
                            <i className = "fa-solid fa-trash"></i>
                            <span>Trash</span>
                            <span>1,000</span>
                        </div>    

                    </div>
                    
                    <div className = "main-table">

                        <div className = "tab-bar">
                            <div className = "primary-tab tab-item tab-active"><i className = "fa-solid fa-inbox"></i><span>Primary</span></div>
                            <div className = "promotions-tab tab-item"><i className = "fa-solid fa-tag"></i><span>Promotions</span></div>
                            <div className = "social-tab tab-item"><i className = "fa-regular fa-user"></i><span>Social</span></div>
                        </div>

                        <div className = "filter-bar">
                            
                            <div className = "date-selection select-box"> Date </div>
                            <div className = "subject-selection select-box"> Subject </div>
                            <div className = "all-selection select-box"> All </div>
                            
                        </div>

                        <MailList mails={mails} onRemove={removeMail} />

                    </div>

                </main>

           </div>)
}

