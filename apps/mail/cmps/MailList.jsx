

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

export function MailList({ nowRendering, mails, onRemove, onMarkAsRead, onReadMail, showFrom, onReply, onStar, onTag, onSelect }) {

    return (<div className="messages">
        {mails.map(mail =>

            <article className={`msg ${mail.isRead ? 'read' : 'unread'}`} key={mail.id} onClick={() => {onReadMail(mail.id)}}>

                <div onClick={(ev) => onSelect(ev, mail.id)}
                     className="fullksizediv tooltip star unread-checkbox " data-tip = "Select"><input className={`checkbox ${mail.isSelected? 'selected': '' }`} type="checkbox" checked={mail.isSelected}></input></div>

                <div onClick={(ev) => onStar(ev, mail.id)}
                     className={`fullksizediv tooltip star ${mail.isStared ? 'stared' : 'unstared'}`} data-tip = "Mark with Star"><i className="fa-regular fa-star"></i></div>


                {!(nowRendering === 'trash') &&
                    <div onClick={(ev) => onTag(ev, mail.id)}
                         className={`fullksizediv tooltip star ${mail.labels.includes('important') ? 'stared' : 'unstared'}`} data-tip = "Mark as Important"><i className="fa-regular fa-bookmark"></i></div>
                }

                { (nowRendering === 'trash') &&
                    <div onClick={(ev) => onTag(ev, mail.id)}
                         className={`fullksizediv tooltip star`} data-tip = "Delete Forever"><i className="fas fa-trash"></i></div>
                }


                {/* {showFrom? <div className="from">{mail.from}</div>: <div className="from">To: {mail.to}</div>} */}

                {(nowRendering === 'trash') && <div className="from drafts-placeholder"> {mail.to} <span className="draft-notice label">TRASH</span> </div>}
                {(nowRendering === 'draft') && <div className="from drafts-placeholder"> {mail.to} <span className="draft-notice-lite">Draft</span> </div>}
                {(nowRendering === 'sent') && <div className="from sent-placeholder"><b>To:</b> {mail.to}</div>}

                {
                    (!(nowRendering === 'draft')  &&
                    (!(nowRendering === 'sent'))  &&
                    (!(nowRendering === 'trash'))


                    ) &&

                    <div className="from">{mail.from}</div>}


                <div className="msg-details">

                    <div className="title">{(nowRendering === 'sent') && <span className="label">Inbox </span>}{mail.subject}</div>
                    <div className="subtitle"> - {mail.body}</div>
                </div>
                <div className="date">{prettyShortPaddedDate(mail.sentAt)}</div>
                <div className="overlay-buttons">
                    <button onClick = {(ev) => { onRemove(ev, mail.id) } } className = "tooltip font-awesome-hover-hint" data-tip = "Delete"><i className="fa-regular fa-trash"></i></button>
                    <button onClick = {(ev) => { onReply(ev, mail) } } className = "font-awesome-hover-hint tooltip" data-tip = "Reply"><i className="fa-regular fa-reply"></i></button>
                    <button onClick = {(ev) => { onMarkAsRead(ev, mail.id) } } className = "font-awesome-hover-hint tooltip" data-tip = "Mark as read"><i className={`fa-regular ${mail.isRead ? 'fa-envelope': 'fa-envelope-open'}`} ></i></button>
                    <button onClick = {(ev) => { onStar(ev, mail.id) } } className = {`font-awesome-hover-hint tooltip ${mail.isStared ? 'stared' : 'unstared'}`} data-tip = "Star"><i className={`fa-regular fa-star`}></i></button>
                    {/*<button><i className="fa-regular fa-ellipsis-v"></i></button>*/}
                </div>
            </article>
        )}
    </div>)
}
