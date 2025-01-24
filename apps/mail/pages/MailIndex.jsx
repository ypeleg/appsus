

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
    const [statisticsFlag, setStatisticsFlag] = useState(false)

    const [filterByCallback, setFilterByCallback] = useState([])


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

    function setStatistics() {
                  mailsService.query({to: mailsService.getLoggedinUser().email, removedAt: false, sentAt: true}).then(TempMails => {setUnreadInboxMails(TempMails.length)})
            .then(mailsService.query({isStared: true}).then(TempMails => {setStarredMails(TempMails.length)}))
            .then(mailsService.query({from: mailsService.getLoggedinUser().email, sentAt: true }).then(TempMails => {setSentMails(TempMails.length)}))
            .then(mailsService.query({from: mailsService.getLoggedinUser().email, sentAt: false }).then(TempMails => {setDraftMails(TempMails.length)}))
            .then(mailsService.query({removedAt: true}).then(TempMails => {setTrashMails(TempMails.length)}))
    }

    useEffect(() => {
        setStatistics()
        onSetFilterBy({to: mailsService.getLoggedinUser().email, removedAt: false, sentAt: true}, true)
    }, [])


    useEffect(() => {
        if (statisticsFlag) {
            console.log('setting statistics')
            setStatistics()
            setStatisticsFlag(!statisticsFlag)
        }
    }, [statisticsFlag])

    const [selectedMails, setSelectedMails] = useState([])

    useEffect(() => {
        console.log('out filterBy:', filterBy, 'sortAscending:', sortAscending)
        mailsService.query(filterBy, sortAscending).then(mails => setMails(mails)).then(

            () => {
                if (filterByCallback)
                {
                    for (let i = 0; i < filterByCallback.length; i++) {
                        console.log('using')
                        filterByCallback[i]()
                    }
                    setFilterByCallback([])
                }
            }

        )
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
        mailsService.moveToTrash(mailId)
            .then((deletedMail) => {
                console.log('mail removed:', deletedMail)
                setMails(prevMails => prevMails.filter(mail => mailId !== mail.id))

                // inbox
                if (deletedMail.to === mailsService.getLoggedinUser().email) {
                    setUnreadInboxMails(unreadInboxMails - 1)
                }
                // starred
                if (deletedMail.isStared) {
                    setStarredMails(starredMails - 1)
                }
                // sent
                if (deletedMail.sentAt && (deletedMail.from === mailsService.getLoggedinUser().email)) {
                    setSentMails(sentMails - 1)
                }
                // draft
                if (!deletedMail.sentAt && (deletedMail.from === mailsService.getLoggedinUser().email)) {
                    setDraftMails(draftMails - 1)
                }
                setTrashMails(trashMails + 1)

                // showSuccessMsg('Mail has been successfully removed!')
            })
            .catch(() => {
                // showErrorMsg(`couldn't remove mail`)
                navigate('/mail')
            })
    }

    function handleSearchChange({ target }) {

        if (target.value === 'in:draft') {
            if (activePage !== 'draft') setActivePage('draft')
        }
        else if (target.value === 'in:sent') {
            if (activePage !== 'sent') setActivePage('sent')
        }
        else if (target.value === 'in:trash') {
            if (activePage !== 'trash') setActivePage('trash')
        }
        else if (target.value === 'is:starred') {
            if(activePage !== 'starred') setActivePage('starred')
        } else if (target.value === 'in:inbox') {
            if (activePage !== 'inbox') setActivePage('inbox')
        }
        if (activePage !== 'inbox') {
            setActivePage('inbox')
        }
        const {name: field, type} = target
        const value = type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilter => ({...prevFilter, [field]: value}))
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
        // console.log('for mailId:', mailId)
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
            setStarredMails(mails.filter(mail => mail.isStared).length)
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
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = true
                return mail}))
            // mails.map(mail => { mail.isSelected = true} )
        }

        if (criteria === 'none') {
            setSelectedMails([])
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = false
                return mail}))
            // mails.map(mail => { mail.isSelected = false} )
        }

        if (criteria === 'read') {
            setSelectedMails(mails.filter(mail => mail.isRead))
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = mail.isRead
                return mail}))
            // mails.map(mail => { mail.isSelected = mail.isRead} )
        }

        if (criteria === 'unread') {
            // setSelectedMails(mails.filter(mail => !mail.isRead))
            setSelectedMails(mails.filter(mail => !mail.isRead))
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = mail.isRead
                return mail}))
            // mails.map(mail => { mail.isSelected = !mail.isRead} )
        }

        if (criteria === 'starred') {
            console.log('selected starred')
            setSelectedMails(mails.filter(mail => mail.isStared))
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = mail.isStared
                return mail}))
            // setSelectedMails(mails.filter(mail => mail.isStared))
            // mails.map(mail => { mail.isSelected = mail.isStared} )
        }

        if (criteria === 'unstarred') {
            setSelectedMails(mails.filter(mail => !mail.isStared))
            // setSelectedMails(mails.filter(mail => !mail.isStared))
            // mails.map(mail => { mail.isSelected = !mail.isStared} )
            setMails(prevMails => prevMails.map(mail => { mail.isSelected = !mail.isStared
                return mail}))
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
            setUnreadInboxMails(mails.filter(mail => !mail.isRead).length)
            setMails(prevMails => prevMails.map(mail => {
                if (mail.id === mailId) {
                    mail.isRead = !mail.isRead
                }
                return mail
            }))
        })
    }

    function onMarkAsUnRead(ev, mailId) {
        ev.stopPropagation()
        console.log('mark as unread mailId:', mailId)
        mailsService.unReadMail(mailId)
            .then(() => {
                setUnreadInboxMails(mails.filter(mail => !mail.isRead).length)
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

    function filterByLabels(mail) {
        if (mail.labels.includes('primary')) return 'Primary'
        if (mail.labels.includes('promotions')) return 'Promotions'
        if (mail.labels.includes('social')) return 'Social'
        if (mail.labels.includes('info')) return 'Updates'
        return 'Primary'
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
                    <i className = "font-awesome-hover-hint fa-solid fa-bars"></i>
                    <img src="assets/img/gmail-logo.png"></img>
                    <h3>Gmail</h3>

                </section>

                <section className="search">
                    <div className="search-bar">
                        <input name='txt' className="searchbox" type = "text" placeholder = "Search mail" onChange={handleSearchChange}


                               value={
                                   filterByToEdit.txt
                                        // ((activePage === 'inbox')?
                                        //     ((filterByToEdit.txt === '')? 'in:inbox': filterByToEdit.txt) :
                                        //     ((filterByToEdit.txt !== 'in:inbox')? filterByToEdit.txt: 'in:inbox') ) +
                                        // ((activePage === 'draft')? 'in:draft': '') +
                                        // ((activePage === 'sent')? 'in:sent': '') +
                                        // ((activePage === 'trash')? 'in:trash': '') +
                                        // ((activePage === 'starred')? 'is:starred': '')
                               }

                        />
                    </div>
                </section>

                <section className="user-details">
                    <i className="fa-solid fa-sliders"></i>
                    <div className="fa-solid fa-question-circle toolbar-button font-awesome-hover-hint tooltip tooltip-smaller" data-tip = "Help"></div>
                    <i className="fa-solid fa-cloud toolbar-button font-awesome-hover-hint tooltip tooltip-smaller" data-tip = "Homepage"></i>
                    <div className="fa-solid fa-grip-vertical toolbar-button font-awesome-hover-hint tooltip tooltip-smaller" data-tip = "All Apps"></div>
                    <img className="tooltip" data-tip = "Your Account" src="assets/img/user-avatar.png"></img>
                </section>

            </header>


            <main className="main-layout">

                <div className="side-bar">

                    <section className="compose">
                        <button className="tooltip" data-tip="New mail" onClick={ () => {onComposeNewMail()} }><i className="fa-solid fa-pen "></i> <span>Compose</span></button>
                    </section>

                    <div data-tip="Inbox" className={`inbox  side-bar-category ${(activePage === 'inbox') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                            setFilterByCallback([...filterByCallback, () => {setActivePage('inbox')}])
                            // setFilterByCallback([...filterByCallback, () => {setFilterBy({txt: 'in:inbox'})}])
                            onSetFilterBy({to: mailsService.getLoggedinUser().email, removedAt: false, txt: ''}, true)
                            setFilterByToEdit({to: mailsService.getLoggedinUser().email, removedAt: false, txt: ''})
                            // setActivePage('inbox')
                         }}>

                        <i className="fa-solid fa-inbox"></i>
                        <span>Inbox</span>
                        <span>{unreadInboxMails}</span>
                    </div>

                    <div data-tip="Starred" className={`starred  side-bar-category ${(activePage === 'starred') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             setFilterByCallback([...filterByCallback, () => {setActivePage('starred')}])
                             onSetFilterBy({isStared: true}, true)
                             setFilterByToEdit({isStared: true, txt: 'is:starred'})
                         }}>
                        <i className="fa-regular fa-star"></i>
                        <span>Starred</span>
                        <span>{starredMails}</span>
                    </div>

                    <div data-tip="Sent" className={`sent  side-bar-category ${(activePage === 'sent') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             setFilterByCallback([...filterByCallback, () => {setActivePage('sent')}])
                             onSetFilterBy({from: mailsService.getLoggedinUser().email, sentAt: true, removedAt: false}, true)
                             setFilterByToEdit({from: mailsService.getLoggedinUser().email, sentAt: true, removedAt: false, txt: 'in:sent'})
                         }}>

                        <i className="fa-regular fa-paper-plane"></i>
                        <span>Sent</span>
                        <span>{sentMails}</span>
                    </div>

                    <div data-tip="Drafts" className={`draft side-bar-category ${(activePage === 'draft') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             setFilterByCallback([...filterByCallback, () => {setActivePage('draft')}])
                             onSetFilterBy({sentAt: false, removedAt: false}, true)
                             setFilterByToEdit({sentAt: false, removedAt: false, txt: 'in:draft'})
                         }}>
                        <i className="fa-regular fa-file"></i>
                        <span>Drafts</span>
                        <span>{draftMails}</span>
                    </div>

                    <div data-tip="Trash" className={`trash  side-bar-category ${(activePage === 'trash') ? 'mail-side-bar-active' : ''}`}
                         onClick={() => {
                             setFilterByCallback([...filterByCallback, () => {setActivePage('trash')}])
                             onSetFilterBy({removedAt: true}, true)
                             setFilterByToEdit({removedAt: true, txt: 'in:draft'})
                             // setFilterByToEdit({from: mailsService.getLoggedinUser().email, sentAt: true, removedAt: false, txt: 'in:draft'})
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
                                <div className="mail-header-checkbox-with-dropdown tooltip tooltip-smaller tooltip-move-left" data-tip="select by..">
                                    <button className="checkbox-gmail-style">
                                        {/* <input type="checkbox" className="checkbox"/> */}
                                        <input className={`checkbox ${(mails.length) && (selectedMails.length === mails.length)? 'selected': '' }`} type="checkbox" checked={(selectedMails.length === mails.length)} onClick = {onSelectAll}></input>
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

                                <div className="mail-header-checkbox-with-dropdown tooltip tooltip-smaller tooltip-move-right" data-tip="sort by..">
                                    <button className="font-awesome-hover-hint font-awesome-hover-hint-with-children">
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

                                  usersDisplayMap = {mailsService.getUsersDisplayMap()}
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
                                    <button className="font-awesome-hover-hint"
                                            onClick={(ev) => {
                                                onRemove(ev, activeMail.id)
                                                setActiveMail(null)
                                                setActivePage('inbox')
                                            }}
                                    ><i className="fa-solid fa-archive"></i></button>
                                    <button className={`font-awesome-hover-hint ${activeMail.labels.includes('important') ? 'stared' : 'unstared'}`}
                                            onClick={(ev) => {
                                                onTag(ev, activeMail.id)
                                                setActiveMail({...activeMail, labels: (activeMail.labels.includes('important')) ? activeMail.labels.filter(label => label !== 'important') : [...activeMail.labels, 'important']})
                                            }}>
                                        <i className={`fa-bookmark ${activeMail.labels.includes('important') ? 'fa-solid stared' : 'fa-solid unstared'}`}

                                    ></i></button>
                                    <button className="font-awesome-hover-hint"
                                            onClick={(ev) => {
                                                onRemove(ev, activeMail.id)
                                                setActiveMail(null)
                                                setActivePage('inbox')
                                            }}
                                            // TODO: Add user message here
                                    ><i className="fa-solid fa-trash-alt"

                                    ></i></button>
                                    <div className="divider"></div>
                                    <button className="font-awesome-hover-hint"

                                            onClick={(ev) => {
                                                onMarkAsUnRead(ev, activeMail.id)
                                                setActiveMail({...activeMail, isRead: false})
                                                setActivePage('inbox')
                                            }}


                                    ><i className="fa-solid fa-envelope"></i></button>
                                    <button className="font-awesome-hover-hint"


                                    ><i className="fa-solid fa-folder-plus"></i></button>
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

