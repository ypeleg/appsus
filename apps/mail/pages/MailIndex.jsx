import {mailUtilService} from "../services/mail-util.service"


const { Link } = ReactRouterDOM
const { useState, useEffect, useRef } = React


import { MailList } from '../cmps/MailList.jsx'
import { ComposeMail } from "../cmps/ComposeMail.jsx"
import { mailsService } from '../services/mails.service.js'


// import {mailUtilService} from "../services/mail-util.service.js"
// import { mailUtilService } from '../services/mail-util.service.js'


export function MailIndex() {

    const [mails, setMails] = useState([])

    const [activeMail, setActiveMail] = useState(null)

    const [filterBy, setFilterBy] = useState(mailsService.getDefaultFilter())

    const [starredMails, setStarredMails] = useState([])
    const [unreadInboxMails, setUnreadInboxMails] = useState([])
    const [sentMails, setSentMails] = useState([])

    const [activePage, setActivePage] = useState('inbox')
    const [activeTab, setActiveTab] = useState('primary')


    // search
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const initialFilterBy = useRef({ ...filterBy })
    // const onSetFilterDebounce = useRef(mailUtilService.debounce(onFilterBy, 500)).current
    const onSetFilterDebounce = useRef(onSetFilterBy).current


    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])


    useEffect(() => {

        mailsService.query({isRead: true}).then(mails => {setUnreadInboxMails(mails.length)})
        mailsService.query({isStared: true}).then(mails => {setStarredMails(mails.length)})
        mailsService.query({from: mailsService.getLoggedinUser().email }).then(mails => {setSentMails(mails.length)})

        onSetFilterBy({to: mailsService.getLoggedinUser().email})

    }, [])


    useEffect(() => {
        console.log('out filterBy:', filterBy)
        mailsService.query(filterBy).then(mails => setMails(mails))
    }, [filterBy])


    function onSetFilterBy(newFilter, reset = false) {
        if (reset) {
            setFilterBy(prevFilter => ({...mailsService.getDefaultFilter(), ...newFilter}))
        } else {
            setFilterBy(prevFilter => ({...prevFilter, ...newFilter}))
        }


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






    function handleSearchChange({ target }) {
        const { name: field, type } = target
        const value = type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function reset() {
        setFilterByToEdit(initialFilterBy.current)
    }


    // var pageToShow = 'main-table'
    // var pageToShow = 'read-msg'



    // const [book, setBook] = useState(null)
    // const [isLoading, setIsLoading] = useState(true)
    // const [isLoadingReview, setIsLoadingReview] = useState(false)
    const [isShowComposeMail, setIsShowComposeMail] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)


    // isShowComposeMail
    // onToggleComposeModal
    // onSaveMail

    function onToggleMaximizedModal(ev) {
        ev.preventDefault()
        setIsMaximized((prevIsMaximized) => !prevIsMaximized)
    }

    function onToggleComposeMail() {
        setIsShowComposeMail((prevIsComposeMail) => !prevIsComposeMail)
    }

    function onSaveMail(mailToAdd) {
        mailsService.save(mailToAdd)
            .then((savedMails) => {
                setMails((prevMails) => [...prevMails, savedMails]);
                console.log("Mail saved:", savedMails);
            })
        // mailsService.save(mailToAdd).then(mails => setMails(mails))
    }



    return (
        <div className="mail-page">

            {isShowComposeMail && (
                <ComposeMail
                    toggleModal={onToggleComposeMail}
                    sendMail={onSaveMail}
                    isMaximized={isMaximized}
                    toggleMaximizedModal={onToggleMaximizedModal}
                />
            )}

            <header className="mail-header">

                <section className="logo">
                    <i className = "hover-hint fa-solid fa-bars hover-hint-strong"></i>
                    <img src="assets/img/gmail-logo.png"></img>
                    <h3>Gmail</h3>

                </section>

                {/* <section className = "compose">
                            <button><i className = "fa-solid fa-pen"></i> <span>Compose</span></button>
                        </section> */}

                <section className="search">
                    <div className="search-bar">
                        <input name='txt' className="searchbox" type = "text" placeholder = "Search mail" onChange={handleSearchChange} value={filterByToEdit.txt} />
                    </div>
                </section>

                {/* <section className = "user-details"> </section>                 */}

                <section className="user-details">
                    <i className="fa-solid fa-sliders"></i>
                    <div className="fa-solid fa-question-circle toolbar-button hover-hint hover-hint-strong"></div>
                    <i className="fa-solid fa-cloud toolbar-button hover-hint hover-hint-strong"></i>
                    <div className="fa-solid fa-grip-vertical toolbar-button hover-hint hover-hint-strong"></div>
                    <img src="assets/img/user-avatar.png"></img>
                </section>

            </header>


            <main className="main-layout">

                <div className="side-bar">

                    {/*<button onClick={onToggleComposeModal}>Add Review</button>*/}


                    <section className="compose">
                        <button onClick={onToggleComposeMail}><i className="far fa-pen"></i> <span>Compose</span></button>
                    </section>

                    <div className={`inbox side-bar-category ${(activePage === 'inbox') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({to: mailsService.getLoggedinUser().email}, true)
                             setActivePage('inbox')
                         }}>

                        <i className="fa-solid fa-inbox"></i>
                        <span>Inbox</span>
                        <span>{unreadInboxMails}</span>
                    </div>

                    <div className={`starred side-bar-category ${(activePage === 'starred') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({isStared: true}, true)
                             setActivePage('starred')
                         }}>
                        <i className="fa-regular fa-star"></i>
                        <span>Starred</span>
                        <span>{starredMails}</span>
                    </div>

                    <div className={`sent side-bar-category ${(activePage === 'sent') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({from: mailsService.getLoggedinUser().email}, true)
                             setActivePage('sent')
                         }}>

                        <i className="fa-regular fa-paper-plane"></i>
                        <span>Sent</span>
                        <span>{sentMails}</span>
                    </div>

                    <div className={`draft side-bar-category ${(activePage === 'draft') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({sentAt: null, createdAt: true}, true)
                             setActivePage('draft')
                         }}>
                        <i className="fa-regular fa-file"></i>
                        <span>Drafts</span>
                        <span>0</span>
                    </div>

                    <div className={`trash side-bar-category ${(activePage === 'trash') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({sentAt: null, createdAt: true}, true)
                             setActivePage('trash')
                         }}>

                        <i className="fa-solid fa-trash"></i>
                        <span>Trash</span>
                        <span></span>
                    </div>

                </div>

                {((!(activePage === 'read-msg')) || (activeMail === null)) &&

                    <div className="main-table">

                        <div className="mail-main-table-header">
                            <div className="mail-header-left-section">
                                <div className="mail-header-checkbox-with-dropdown">
                                    <button className="checkbox-gmail-style">
                                        <input type="checkbox" className="checkbox"/>
                                        <i className="far fa-chevron-down"></i>
                                    </button>
                                    <div className="dropdown-menu-items">
                                        <div className="dropdown-item">All</div>
                                        <div className="dropdown-item">None</div>
                                        <div className="dropdown-item">Read</div>
                                        <div className="dropdown-item">Unread</div>
                                        <div className="dropdown-item">Starred</div>
                                        <div className="dropdown-item">Unstarred</div>
                                    </div>
                                </div>

                                <button className="font-awesome-hover-hint">
                                    <i className="far fa-sync-alt"></i>
                                </button>

                                <button className="font-awesome-hover-hint">
                                    <i className="far fa-ellipsis-v"></i>
                                </button>
                            </div>

                            <div className="mail-header-right-section">
                                <span className="pagination-text">1-50 of 48,994</span>

                                <button className="font-awesome-hover-hint">
                                    <i className="far fa-chevron-left"></i>
                                </button>

                                <button className="font-awesome-hover-hint">
                                    <i className="far fa-chevron-right"></i>
                                </button>

                                <div className="mail-header-checkbox-with-dropdown">
                                    <button className="font-awesome-hover-hint">
                                        <i className="far fa-chevron-down"></i>
                                    </button>
                                    <div className="dropdown-menu-items right-dropdown-menu-items">
                                        <div className="dropdown-item">Newest</div>
                                        <div className="dropdown-item">Oldest</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-bar">
                            <div className={`primary-tab tab-item ${(activeTab === 'primary') ? 'tab-active' : ''}`}
                                 onClick={() => {
                                     onSetFilterBy({labels: ['primary']}, true)
                                     setActiveTab('primary')
                                 }}>
                                <i className="fa-solid fa-inbox"></i><span>Primary</span></div>
                            <div className={`promotions-tab tab-item ${(activeTab === 'promotions') ? 'tab-active' : ''}`}
                                 onClick={() => {
                                     onSetFilterBy({labels: ['promotions']}, true)
                                     setActiveTab('promotions')
                                 }}>
                                <i className="fa-solid fa-tag"></i><span>Promotions</span></div>
                            <div className={`social-tab tab-item ${(activeTab === 'social') ? 'tab-active' : ''}`}
                                 onClick={() => {
                                     onSetFilterBy({labels: ['social']}, true)
                                     setActiveTab('social')
                                 }}><i className="fa-regular fa-user"></i><span>Social</span></div>
                            <div className={`info-tab tab-item ${(activeTab === 'info') ? 'tab-active' : ''}`}
                                 onClick={() => {
                                     onSetFilterBy({labels: ['info']}, true)
                                     setActiveTab('info')
                                 }}><i className="fa-solid fa-info"></i><span>Updates</span></div>
                        </div>

                        {/*<div className="filter-bar">*/}
                        {/*    <div className="date-selection select-box"> Date</div>*/}
                        {/*    <div className="subject-selection select-box"> Subject</div>*/}
                        {/*    <div className="all-selection select-box"> All</div>*/}
                        {/*</div>*/}

                        <MailList mails={mails} onRemove={removeMail} onReadMail=
                            {
                                (mailId) => {
                                    setActiveMail(null)
                                    mailsService.get(mailId).then(mail => setActiveMail(mail)).then(setActivePage('read-msg'))
                                }
                            }/>

                    </div>

                }

                {/*<div className="userMsg">loading...</div>*/}

                <div className={`userMsg ${((activePage === 'read-msg') && (activeMail === null)) && 'shown'} `}>loading...</div>




                {((activePage === 'read-msg') && (activeMail !== null)) &&
                    <div className="read-msg-container">
                        <div className="read-msg-toolbar">
                            <div className="toolbar-left">

                                <div className="first-button" onClick={() => setActivePage('inbox')}>
                                    <button className="font-awesome-hover-hint"><i className="far fa-arrow-left"></i></button>
                                </div>

                                <div className="sec-buttons-button">
                                    <button className="font-awesome-hover-hint"><i className="far fa-archive"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-exclamation-circle"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-trash-alt"></i></button>
                                    <div className="divider"></div>
                                    <button className="font-awesome-hover-hint"><i className="far fa-envelope"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-folder-plus"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-ellipsis-v"></i></button>
                                </div>

                            </div>

                            <div className="toolbar-right">
                                <span>10 of 7,408</span>
                                <button className="font-awesome-hover-hint"><i className="far fa-chevron-left"></i></button>
                                <button className="font-awesome-hover-hint"><i className="far fa-chevron-right"></i></button>
                            </div>
                        </div>

                        <div className="read-msg-header">
                            <div className="subject-line">
                                <h2>{activeMail.subject}</h2>
                                <span className="label">Inbox</span>
                                <div className="header-actions">
                                    <button className="font-awesome-hover-hint"><i className="far fa-print"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-external-link-alt"></i></button>
                                </div>
                            </div>
                        </div>

                        <div className="read-msg-sender">

                            <div className="sender-info">
                                <div className="sender-name-time">
                                    <i className="fas fa-user-circle sender-avatar"></i>
                                    <div className="sender-from-to">
                                        <span className="sender-name">{activeMail.from}</span>
                                        <span className="sender-to">to {(activeMail.to === mailsService.getLoggedinUser().email) ? 'me' : activeMail.to}</span>
                                    </div>

                                </div>
                                <div className="sender-actions">
                                    <span className="timestamp">{activeMail.sentAt}</span>
                                    <button className="font-awesome-hover-hint"><i className="far fa-star"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-reply"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="far fa-ellipsis-v"></i></button>
                                </div>
                            </div>
                        </div>

                        <div className="read-msg-content">
                            <div className="message-text">
                                {activeMail.body}
                            </div>
                        </div>

                        <div className="read-msg-actions">
                            <button className="reply-btn"><i className="far fa-reply"></i>Reply</button>
                            <button className="forward-btn"><i className="far fa-share"></i>Forward</button>
                        </div>
                    </div>
                }

                {(activePage === 'read-msg') &&
                    <div>

                    </div>

                }

            </main>

        </div>)
}

