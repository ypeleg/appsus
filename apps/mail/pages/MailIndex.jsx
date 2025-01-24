

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
    const [sortAscending, setSortAscending] = useState(true)
    const [starredMails, setStarredMails] = useState([])
    const [unreadInboxMails, setUnreadInboxMails] = useState([])
    const [sentMails, setSentMails] = useState([])
    const [draftMails, setDraftMails] = useState([])
    const [trashMails, setTrashMails] = useState([])
    const [activePage, setActivePage] = useState('inbox')
    const [activeTab, setActiveTab] = useState('primary')
    const [currentDefaultMailDetails, setCurrentDefaultMailDetails] = useState({})

    function onSetActivePage(page) {
        setActivePage(page)
    }

    // search
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const initialFilterBy = useRef({ ...filterBy })
    // const onSetFilterDebounce = useRef(mailUtilService.debounce(onFilterBy, 500)).current
    const onSetFilterDebounce = useRef(onSetFilterBy).current

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        setIsLoading(true)
        mailsService.query(filterBy, sortAscending)
            .then(mails => setMails(mails))
            .finally(() => setIsLoading(false))
    }, [filterBy])

    useEffect(() => {

        mailsService.query({isRead: true}).then(mails => {setUnreadInboxMails(mails.length)})

        // mailsService.query({isStared: true}).then(mails => {setStarredMails(mails.length)})

        mailsService.query({isStared: true}).then(mails => {setStarredMails(mails.length)})

        mailsService.query({from: mailsService.getLoggedinUser().email, sentAt: true }).then(mails => {setSentMails(mails.length)})

        mailsService.query({from: mailsService.getLoggedinUser().email, sentAt: false }).then(mails => {setDraftMails(mails.length)})

        mailsService.query({removedAt: true }).then(mails => {setTrashMails(mails.length)})

        onSetFilterBy({to: mailsService.getLoggedinUser().email, removedAt: false}, true)

    }, [])

    const [selectedMails, setSelectedMails] = useState([])

    useEffect(() => {
        console.log('out filterBy:', filterBy, 'sortAscending:', sortAscending)
        mailsService.query(filterBy, sortAscending).then(mails => setMails(mails))
    }, [filterBy, sortAscending])

    function onSetFilterBy(newFilter, reset = false) {
        if (reset) {
            setFilterBy(prevFilter => ({...mailsService.getDefaultFilter(), ...newFilter}))
        } else {
            setFilterBy(prevFilter => ({...prevFilter, ...newFilter}))
        }
    }

    function onSortBy(sortAscendingToSet) {
        setSortAscending(prevSort => sortAscendingToSet )
    }

    function onSetSelected(selectedMails) {
        setSelectedMails(selectedMails)
    }

    function onRemove(ev, mailId) {
        ev.stopPropagation()
        // add .deleting class to the mail element
        ev.target.classList.add('deleting')
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
    const [isLoading, setIsLoading] = useState(true)
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
                mailsService.query(filterBy, sortAscending).then(mails => setMails(mails))
                // setMails((prevMails) => [...prevMails, savedMails]);
                // console.log("Mail saved:", savedMails);
            })
        // mailsService.save(mailToAdd).then(mails => setMails(mails))
    }
    // {to: 'someone', body: 'body', subject: 'sub'}

    function onComposeNewMail(mailTo = null,
                              mailSubject = null,
                              mailBody = null,
                              focusOn = null) {
        let defaultParams = {}
        if (mailTo !== null) defaultParams.to = mailTo
        if (mailBody !== null) defaultParams.body = mailBody
        if (mailSubject !== null) defaultParams.subject = mailSubject
        setCurrentDefaultMailDetails({...defaultParams})
        onToggleComposeMail()
    }

    function onReply(ev, targetMail) {
        ev.stopPropagation()
        // console.log('reply mailId:', mailId)
        onComposeNewMail(targetMail.from,
            `Re: ${targetMail.subject}`,
            '' + '\n\n\n' + 'On ' + targetMail.sentAt +
            ' ' + targetMail.from + ' wrote:' + '\n\n\n' + targetMail.body)
    }

    function onForward(ev, targetMail) {
        ev.stopPropagation()
        console.log('for mailId:', mailId)
        onComposeNewMail('', `Fwd: ${targetMail.subject}`,
            '' + '\n\n' + '---------- Forwarded message ---------' +
            '\nFrom: ' + targetMail.from +
            '\nDate: ' + targetMail.sentAt +
            '‪\nSubject: ' + targetMail.subject +
            '\n‪To: ' + targetMail.to +
            '\n\n‪‪' + targetMail.body)
    }

    function onStar(ev, mailId) {
        ev.stopPropagation()
        console.log('star mailId:', mailId)
        mailsService.starMail(mailId)
        .then(() => {
            setMails(prevMails => prevMails.map(mail => {
                if (mail.id === mailId) {
                    mail.isStared = !mail.isStared
                }
                return mail
            }))
        })
    }

    function onTag(ev, mailId) {
        ev.stopPropagation()
        console.log('tag mailId:', mailId)
        mailsService.tagMail(mailId)
        .then(() => {
            setMails(prevMails => prevMails.map(mail => {
                if (mail.id === mailId) {
                    (mail.labels.includes('important')) ?
                     mail.labels = mail.labels.filter(label => label !== 'important') :
                     mail.labels.push('important')}
                return mail
            }))
        })
    }

    function onSelectAll(ev) {                
        ev.stopPropagation()
        if (selectedMails.length) {
            setSelectedMails([])
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = false
                 return mail} ))
        } else {
            setSelectedMails(mails)
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = true 
                return mail} ))
        }
    }

    function onSelectBy(ev, criteria) {        
        ev.stopPropagation()
        
        if (criteria === 'all') {
            setSelectedMails(mails)
            mails.map(mail => { mail.isSelected = true} )
        }

        if (criteria === 'none') {
            setSelectedMails([])
            mails.map(mail => { mail.isSelected = false} )
        }

        if (criteria === 'read') {
            setSelectedMails(mails.filter(mail => mail.isRead))
            mails.map(mail => { mail.isSelected = mail.isRead} )
        }

        if (criteria === 'unread') {
            setSelectedMails(mails.filter(mail => !mail.isRead))
            mails.map(mail => { mail.isSelected = !mail.isRead} )
        }

        if (criteria === 'starred') {
            setSelectedMails(mails.filter(mail => mail.isStared))
            mails.map(mail => { mail.isSelected = mail.isStared} )
        }

        if (criteria === 'unstarred') {
            setSelectedMails(mails.filter(mail => !mail.isStared))
            mails.map(mail => { mail.isSelected = !mail.isStared} )
        }
    }

    function onSelect(ev, mailId) {
        ev.stopPropagation()
        selectedMails.includes(mailId) ?
        setSelectedMails(selectedMails.filter(selectedMail => selectedMail !== mailId)) :
        setSelectedMails([...selectedMails, mailId])
        mails.map(mail => {
            if (mail.id === mailId) {
                mail.isSelected = !mail.isSelected
            }
            return mail
        })
    }

    function onMarkAsRead(ev, mailId) {
        ev.stopPropagation()
        console.log('mark as read mailId:', mailId)
        mailsService.readMail(mailId)
        .then(() => {
            setMails(prevMails => prevMails.map(mail => {
                if (mail.id === mailId) {
                    mail.isRead = !mail.isRead
                }
                return mail
            }))
        })
    }

    function filtersToBox(currentMail) {
        const {to, sentAt, removedAt, from} = currentMail
        if ((to === mailsService.getLoggedinUser().email) && (!removedAt)) { return 'Inbox' }
        if (sentAt && (from === mailsService.getLoggedinUser().email) && (!removedAt)) { return 'Sent' }
        if (!sentAt && (!removedAt)) { return 'Draft' }
        if (removedAt) { return 'Trash' }
        return 'Inbox'
    }

    return (
        <div className="mail-page">

            {isShowComposeMail && (
                <ComposeMail
                    defaultMailDetails={currentDefaultMailDetails}
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

                <section className="search">
                    <div className="search-bar">
                        <input name='txt' className="searchbox" type = "text" placeholder = "Search mail" onChange={handleSearchChange} value={filterByToEdit.txt} />
                    </div>
                </section>

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

                    <section className="compose">
                        <button onClick={ () => {onComposeNewMail()} }><i className="fa-solid fa-pen"></i> <span>Compose</span></button>
                    </section>

                    <div className={`inbox side-bar-category ${(activePage === 'inbox') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                            onSetFilterBy({to: mailsService.getLoggedinUser().email, removedAt: false}, true)
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
                             onSetFilterBy({from: mailsService.getLoggedinUser().email, sentAt: true, removedAt: false}, true)
                             setActivePage('sent')
                         }}>

                        <i className="fa-regular fa-paper-plane"></i>
                        <span>Sent</span>
                        <span>{sentMails}</span>
                    </div>

                    <div className={`draft side-bar-category ${(activePage === 'draft') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({sentAt: false, removedAt: false}, true)
                             setActivePage('draft')
                         }}>
                        <i className="fa-regular fa-file"></i>
                        <span>Drafts</span>
                        <span>{draftMails}</span>
                    </div>

                    <div className={`trash side-bar-category ${(activePage === 'trash') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             onSetFilterBy({removedAt: true}, true)
                             setActivePage('trash')
                         }}>

                        <i className="fa-solid fa-trash"></i>
                        <span>Trash</span>
                        <span>{trashMails}</span>
                    </div>

                </div>

                {((!(activePage === 'read-msg')) || (activeMail === null)) &&

                    <div className="main-table">

                        <div className="mail-main-table-header">
                            <div className="mail-header-left-section">
                                <div className="mail-header-checkbox-with-dropdown">
                                    <button className="checkbox-gmail-style" onClick = {onSelectAll}>
                                        {/* <input type="checkbox" className="checkbox"/> */}
                                        <input className={`checkbox ${(selectedMails.length === mails.length)? 'selected': '' }`} type="checkbox" checked={(selectedMails.length === mails.length)}></input>
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </button>
                                    <div className="dropdown-menu-items">
                                        <div className="dropdown-item" onClick = {(ev) => onSelectBy(ev, 'all')}>All</div>
                                        <div className="dropdown-item" onClick = {(ev) => onSelectBy(ev, 'none')}>None</div>
                                        <div className="dropdown-item" onClick = {(ev) => onSelectBy(ev, 'read')}>Read</div>
                                        <div className="dropdown-item" onClick = {(ev) => onSelectBy(ev, 'unread')}>Unread</div>
                                        <div className="dropdown-item" onClick = {(ev) => onSelectBy(ev, 'starred')}>Starred</div>
                                        <div className="dropdown-item" onClick = {(ev) => onSelectBy(ev, 'unstarred')}>Unstarred</div>
                                    </div>
                                </div>

                                <button className="font-awesome-hover-hint">
                                    <i className="fa-solid fa-sync-alt"></i>
                                </button>

                                <button className="font-awesome-hover-hint">
                                    <i className="fa-solid fa-ellipsis-v"></i>
                                </button>
                            </div>

                            <div className="mail-header-right-section">
                                <span className="pagination-text">1-{(mails.length < 51)? mails.length: 50} of {mails.length}</span>

                                <button className="font-awesome-hover-hint">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>

                                <button className="font-awesome-hover-hint">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>

                                <div className="mail-header-checkbox-with-dropdown">
                                    <button className="font-awesome-hover-hint">
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </button>
                                    <div className="dropdown-menu-items right-dropdown-menu-items">
                                        <div className="dropdown-item" onClick={() => onSortBy(true)}>Newest</div>
                                        <div className="dropdown-item" onClick={() => onSortBy(false)}>Oldest</div>
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

                        <MailList mails={mails} onRemove={onRemove} showFrom={activePage !== 'sent'}

                                  onMarkAsRead = {onMarkAsRead}
                                  nowRendering={activePage}
                                  onSelect = {onSelect}
                                  onReply = {onReply}
                                  onStar = {onStar}
                                  onTag = {onTag}


                                  onReadMail=
                            {
                                (mailId) => {
                                    setActiveMail(null)
                                    mailsService.readMail(mailId)
                                    // setMails(prevMails => ({ ...prevBook, [prop]: value }))
                                    // mailsService.query(filterBy).then(mails => setMails(mails))
                                    // mailsService.query(filterBy).then(mails => setMails(mails))
                                    mailsService.get(mailId).then(mail => {


                                            setMails(prevMails => prevMails.map(mail => {
                                                if (mail.id === mailId) {
                                                    mail.isRead = true
                                                }
                                                return mail
                                            }))

                                            setActiveMail(mail)

                                        }
                                    ).then(setActivePage('read-msg'))

                                }
                            }



                        />

                    </div>

                }

                {/*<div className="userMsg">loading...</div>*/}

                <div className={`userMsg ${   (((activePage === 'read-msg') && (activeMail === null)) || ( isLoading ) )  && 'shown'} `}>loading...</div>




                {((activePage === 'read-msg') && (activeMail !== null)) &&
                    <div className="read-msg-container">
                        <div className="read-msg-toolbar">
                            <div className="toolbar-left">

                                <div className="first-button" onClick={() => setActivePage('inbox')}>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-arrow-left"></i></button>
                                </div>

                                <div className="sec-buttons-button">
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-archive"></i></button>
                                    <button className={`font-awesome-hover-hint ${activeMail.labels.includes('important') ? 'stared' : 'unstared'}`}
                                            onClick={(ev) => {
                                                onTag(ev, activeMail.id)
                                                setActiveMail({...activeMail, labels: (activeMail.labels.includes('important')) ? activeMail.labels.filter(label => label !== 'important') : [...activeMail.labels, 'important']})
                                            }}>
                                        <i className={`fa-bookmark ${activeMail.labels.includes('important') ? 'fa-regular stared' : 'fa-solid unstared'}`}

                                    ></i></button>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-trash-alt"></i></button>
                                    <div className="divider"></div>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-envelope"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-folder-plus"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-ellipsis-v"></i></button>
                                </div>

                            </div>

                            <div className="toolbar-right">
                                <span>10 of 7,408</span>
                                <button className="font-awesome-hover-hint"><i className="fa-solid fa-chevron-left"></i></button>
                                <button className="font-awesome-hover-hint"><i className="fa-solid fa-chevron-right"></i></button>
                            </div>
                        </div>

                        <div className="read-msg-header">
                            <div className="subject-line">
                                <h2>{activeMail.subject}</h2>
                                <span className="label">

                                    {filtersToBox(activeMail)}


                                    {/*Inbox*/}



                                </span>
                                <div className="header-actions">
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-print"></i></button>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-external-link-alt"></i></button>
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
                                    <button className="font-awesome-hover-hint"
                                            onClick={(ev) => {
                                                onStar(ev, activeMail.id)
                                                setActiveMail({...activeMail, isStared: !activeMail.isStared})
                                            }}
                                    ><i className={`fa-solid fa-star  ${activeMail.isStared ? 'stared' : 'unstared'}`}



                                    ></i></button>
                                    {/*<button className="font-awesome-hover-hint" onClick={() => composeNewMail(activeMail.from, `Re: ${activeMail.subject}`, '' + '\n\n\n' + 'On ' + activeMail.sentAt + ' ' + activeMail.from + ' wrote:' + '\n\n\n' + activeMail.body)}>*/}
                                    <button className="font-awesome-hover-hint" onClick={(ev) => onReply(ev, activeMail)}>
                                        <i className="fa-solid fa-reply"></i>
                                    </button>
                                    <button className="font-awesome-hover-hint"><i className="fa-solid fa-ellipsis-v"></i></button>
                                </div>
                            </div>
                        </div>

                        <div className="read-msg-content">
                            <div className="message-text">
                            {activeMail.body}
                            </div>
                        </div>

                        <div className="read-msg-actions">

                            {/*<button className="reply-btn" onClick={() => composeNewMail(activeMail.from, `Re: ${activeMail.subject}`, '' + '\n\n\n' + 'On ' + activeMail.sentAt + ' ' + activeMail.from + ' wrote:' + '\n\n\n' + activeMail.body)}>*/}
                            <button className="reply-btn" onClick={(ev) => onReply(ev, activeMail)}>
                                    <i className="fa-solid fa-reply"></i>Reply
                            </button>

                            {/*<button className="forward-btn" onClick={() => composeNewMail('', `Fwd: ${activeMail.subject}`, '' + '\n\n' +*/}

                            {/*        '---------- Forwarded message ---------' +*/}
                            {/*        '\nFrom: ' + activeMail.from +*/}
                            {/*        '\nDate: ' + activeMail.sentAt +*/}
                            {/*        '‪\nSubject: ' + activeMail.subject +*/}
                            {/*        '\n‪To: ' + activeMail.to +*/}
                            {/*        '\n\n‪‪' + activeMail.body)}>*/}

                            <button className="forward-btn" onClick={(ev) => onForward(ev, activeMail)}>
                                <i className="fa-solid fa-share"></i>Forward
                            </button>

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

