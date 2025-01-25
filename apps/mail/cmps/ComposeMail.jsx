

import { mailsService } from "../services/mails.service.js"

const { useState, useRef, useEffect } = React


function TextBox({ handleChange, txt }) {

    function onSetTxt(newTxt) {
        const target = { name: 'txt', value: newTxt };
        handleChange({ target });
    }

    return <textarea
        name='txt'
        cols='30'
        rows='10'
        value={txt}
        onChange={handleChange}
    ></textarea>
}



export function ComposeMail({ defaultMailDetails , sendMail, toggleModal, isMaximized, toggleMaximizedModal }) {

    // let {defaultFrom, defaultTo, defaultBody} = defaultMailDetails

    // console.log('defaultMailDetails', defaultMailDetails)
    
    let defaultParams = {to: '', body: '' , subject: ''}
    if (defaultMailDetails.id !== null) defaultParams.id = defaultMailDetails.id
    if (defaultMailDetails.to !== null) defaultParams.to = defaultMailDetails.to
    if (defaultMailDetails.from !== null) defaultParams.from = defaultMailDetails.from
    if (defaultMailDetails.body !== null) defaultParams.body = defaultMailDetails.body
    if (defaultMailDetails.subject !== null) defaultParams.subject = defaultMailDetails.subject

    defaultParams.createdAt = Date.now()
    defaultParams.sentAt = Date.now()


    const inputRef = useRef()
    const [mail, setMail] = useState(mailsService.getDefaultEmail())


    // console.log('defaultParams,', defaultParams)
    // console.log('defaultMailDetails,', defaultMailDetails)

    useEffect(() => {

        setMail({...mail, ...defaultParams})

        // inputRef.current.focus()
    }, [])


    function onSaveDraft(ev) {
        ev.preventDefault()
        console.log(ev)
        const newMail = { ...mail, sentAt: null }
        sendMail(newMail)
        toggleModal()
    }

    function onSendMail(ev) {
        ev.preventDefault()
        console.log(ev)
        const newMail = { ...mail, sentAt: Date.now() }
        sendMail(newMail)
        toggleModal()
    }

    function handleChange({ target }) {
        const { value, name: field } = target
        setMail((prevMail) => ({ ...prevMail, [field]: value }))
    }

    const { to, subject, body } = mail
    return (
        <section className={`mail-add ` + (!!(isMaximized)? "maximized": "") }>

            <form onSubmit={onSendMail} className='mail-form modal mail-modal'>
                <div className="header mail-modal-header">
                    <span className="header-text">New Message</span>
                    <div>
                        <button className="close-btn" onClick={onSaveDraft}> <i className="fa-regular fa-window-minimize"></i></button>
                        <button className="close-btn maximize-btn" onClick={toggleMaximizedModal}><i className="fa-solid-fr fa-expand"></i></button>

                        <button className="close-btn" onClick={onSaveDraft}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                </div>


                <div className="input-row">
                    {/*<span className="input-label">To</span>*/}
                    <input type="text" placeholder="To" name='to' value={to} onChange={handleChange}/>
                    <span className="cc-bcc">Cc Bcc</span>
                </div>

                <div className="input-row">
                    <input type="text" placeholder="Subject" name='subject' value={subject} onChange={handleChange}/>
                </div>

                <textarea className="message-body" name='body' value={body} onChange={handleChange}>

                </textarea>

                <div className="footer">
                    <button className="send-btn">Send</button>
                </div>

            </form>

            <section className = "screen" onClick={onSaveDraft}>

            </section>

        </section>
    )
}
