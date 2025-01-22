


const { Link } = ReactRouterDOM
const { useState, useEffect, useRef } = React


import { MailList } from '../cmps/MailList.jsx'
import { mailsService } from '../services/mails.service.js'
// import {mailUtilService} from "../services/mail-util.service.js"
import { mailUtilService } from '../services/mail-util.service.js'

export function MailIndex() {

    const [mails, setMails] = useState([])


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





    return (<div className="mail-page">
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
                <input name='txt' className="searchbox" type = "text" placeholder = "Search" onChange={handleSearchChange} value={filterByToEdit.txt} />
                        </div>    

                    </section>

                    {/* <section className = "user-details"> </section>                 */}
                    <section className = "user-details">
                        <div className = "fa-solid fa-grip toolbar-button hover-hint hover-hint-strong"> </div>
                        <img src = "assets/img/user-avatar.png"></img>
                    </section>                
                
                
                </header>

                <main className = "main-layout">
                
                    <div className = "side-bar">

                        <section className = "compose">
                            <button><i className = "fa-solid fa-pen"></i> <span>Compose</span></button>                        
                        </section>

                        <div className = {`inbox side-bar-category ${(activePage === 'inbox')? 'mail-side-bar-active': ''}`}
                             onClick   = {() => {
                                               onSetFilterBy({to: mailsService.getLoggedinUser().email}, true)
                                               setActivePage('inbox')
                                          }}>

                            <i className = "fa-solid fa-inbox"></i>
                            <span>Inbox</span>
                            <span>{unreadInboxMails}</span>
                        </div>    
                        
                        <div className = {`starred side-bar-category ${(activePage === 'starred')? 'mail-side-bar-active': ''}`}
                             onClick = {() => {
                                               onSetFilterBy({isStared: true}, true)
                                               setActivePage('starred')
                                       }}>
                            <i className = "fa-regular fa-star"></i>
                            <span>Starred</span>
                            <span>{starredMails}</span>
                        </div>    
                        
                        <div className = {`sent side-bar-category ${(activePage === 'sent')? 'mail-side-bar-active': ''}`}
                             onClick = {() => {
                                            onSetFilterBy({from: mailsService.getLoggedinUser().email}, true)
                                            setActivePage('sent')
                                       }}>

                            <i className = "fa-regular fa-paper-plane"></i>
                            <span>Sent</span>
                            <span>{sentMails}</span>
                        </div>    
                        
                        <div className = {`draft side-bar-category ${(activePage === 'draft')? 'mail-side-bar-active' : ''}`}
                             onClick = {() => {
                                            onSetFilterBy({sentAt: null, createdAt: true}, true)
                                            setActivePage('draft')
                                       }}>
                            <i className = "fa-regular fa-file"></i>                            
                            <span>Drafts</span>
                            <span>0</span>
                        </div>    
                        
                        <div className = {`trash side-bar-category ${(activePage === 'trash')? 'mail-side-bar-active' : ''}`}
                             onClick = {() => {
                                 onSetFilterBy({sentAt: null, createdAt: true}, true)
                                 setActivePage('trash')
                             }}>

                            <i className = "fa-solid fa-trash"></i>
                            <span>Trash</span>
                            <span></span>
                        </div>    

                    </div>
                    
                    <div className = "main-table">

                        <div className = "tab-bar">
                            <div className = {`primary-tab tab-item ${(activeTab === 'primary')? 'tab-active': ''}`}
                                 onClick = {() => {
                                     onSetFilterBy({labels: ['primary']}, true)
                                     setActiveTab('primary')
                                 }}>
                                <i className = "fa-solid fa-inbox"></i><span>Primary</span></div>
                            <div className = {`promotions-tab tab-item ${(activeTab === 'promotions')? 'tab-active': ''}`}
                                 onClick = {() => {
                                     onSetFilterBy({labels: ['promotions']}, true)
                                     setActiveTab('promotions')
                                 }}>
                                <i className = "fa-solid fa-tag"></i><span>Promotions</span></div>
                            <div className = {`social-tab tab-item ${(activeTab === 'social')? 'tab-active': ''}`}
                                 onClick = {() => {
                                     onSetFilterBy({labels: ['social']}, true)
                                     setActiveTab('social')
                                 }}><i className = "fa-regular fa-user"></i><span>Social</span></div>
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

