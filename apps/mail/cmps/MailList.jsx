
const { useState, useEffect } = React
const { Link } = ReactRouterDOM

// import { mailsService } from '../services/mails.service.js'


function padNum(num) {
    return (num > 9) ? num + '' : '0' + num
}

function prettyShortPaddedDate(date) {
    if (date !== null) {
        // console.log('date:', date)
        date = new Date(date)
        return `${padNum(date.getDate())}/${padNum(date.getMonth() + 1)}`
    } else {
        return ''
    }
}

function displayName(userName, usernameMap) {
    if (userName in usernameMap) { userName = usernameMap[userName] }
    return userName
}

export function MailList({ nowRendering, mails, onRemove, onDeleteForever, onMarkAsRead, onReadMail, showFrom, onReply, onStar, onTag, onSelect, usersDisplayMap, onReEditDraft, onConvertToNote }) {

    return (<div className="messages">
        {mails.map(mail =>

            <article className={`msg ${mail.isRead ? 'read' : 'unread'}`} key={mail.id}

                     onClick={() => {
                                        if (nowRendering === 'draft') onReEditDraft(mail.id)
                                        else onReadMail(mail.id)
                                    }}>

                <div onClick={(ev) => onSelect(ev, mail.id)}
                     className="fullksizediv tooltip star unread-checkbox " data-tip = "Select"><input className={`checkbox ${mail.isSelected? 'selected': '' }`} type="checkbox" checked={mail.isSelected}></input></div>

                <div onClick={(ev) => onStar(ev, mail.id)}
                     className={`fullksizediv tooltip star ${mail.isStared ? 'stared' : 'unstared'}`} data-tip = "Mark with Star"><i className="fa-regular fa-star"></i></div>


                {!(nowRendering === 'trash') &&
                    <div onClick={(ev) => onTag(ev, mail.id)}
                         className={`fullksizediv tooltip star ${mail.labels.includes('important') ? 'stared' : 'unstared'}`} data-tip = "Mark as Important"><i className="fa-regular fa-bookmark"></i></div>
                }

                { (nowRendering === 'trash') &&
                    <div onClick={(ev) => { onDeleteForever(ev, mail.id)}}
                         className={`fullksizediv tooltip star`} data-tip = "Delete Forever"><i className="fa-regular fa-trash"></i></div>
                }


                {/* {showFrom? <div className="from">{mail.from}</div>: <div className="from">To: {mail.to}</div>} */}

                {(nowRendering === 'trash') && <div className="from drafts-placeholder"> {(mail.sentAt) ? displayName(mail.from, usersDisplayMap) : displayName(mail.to, usersDisplayMap)} {(!mail.sentAt) ? <span className="draft-notice-lite">Draft</span>: ''} </div>}
                {(nowRendering === 'draft') && <div className="from drafts-placeholder"> <b>To:</b> <span className="unbold"> {displayName(mail.to, usersDisplayMap)} </span> <span className="draft-notice-lite">Draft</span></div>}
                {(nowRendering === 'sent') && <div className="from sent-placeholder"> <b>To:</b> <span className="unbold"> {displayName(mail.to, usersDisplayMap)} </span> </div>}

                {
                    (!(nowRendering === 'draft')  &&
                    (!(nowRendering === 'sent'))  &&
                    (!(nowRendering === 'trash'))


                    ) &&

                    <div className="from"> {displayName(mail.from, usersDisplayMap)} </div>}


                <div className="msg-details">

                    <div className="title">
                        {!!((nowRendering === 'sent') | (nowRendering === 'starred')) && (<span className="label-small">Inbox</span>)}
                        {!!((nowRendering === 'trash') | (mail.removedAt) ) && (<span className="label-small">Trash</span>)}

                        {(mail.subject && mail.subject.length) ? mail.subject : '(no subject)'}


                        </div>
                    <div className="subtitle"> - {mail.body}</div>
                </div>
                <div className="date">{prettyShortPaddedDate(mail.sentAt)}</div>
                <div className="overlay-buttons">
                    <button onClick = {(ev) => { onConvertToNote(ev, mail.id) } } className = "tooltip font-awesome-hover-hint " data-tip = "Export as Keep Note"><i className="fa-regular fa-paper-plane"></i></button>
                    <button onClick = {(ev) => { onRemove(ev, mail.id) } } className = "tooltip font-awesome-hover-hint " data-tip = "Delete"><i className="fa-regular fa-trash"></i></button>
                    <button onClick = {(ev) => { onReply(ev, mail) } } className = "font-awesome-hover-hint tooltip " data-tip = "Reply"><i className="fa-regular fa-reply"></i></button>
                    <button onClick = {(ev) => { onMarkAsRead(ev, mail.id) } } className = "font-awesome-hover-hint tooltip " data-tip = "Mark as read"><i className={`fa-regular ${mail.isRead ? 'fa-envelope': 'fa-envelope-open'}`} ></i></button>
                    <button onClick = {(ev) => { onStar(ev, mail.id) } } className = {`font-awesome-hover-hint tooltip  ${mail.isStared ? 'stared' : 'unstared'}`} data-tip = "Star"><i className={`fa-regular fa-star`}></i></button>
                    {/*<button><i className="fa-regular fa-ellipsis-v"></i></button>*/}
                </div>
            </article>
        )}
    </div>)
}
