

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

export function MailList({ mails, onRemove, onReadMail, showFrom }) {

    return (<div className="messages">
        {mails.map(mail =>

            <article className={`msg ${mail.isRead ? 'read' : 'unread'}`} key={mail.id} onClick={() => {onReadMail(mail.id)}}>

                <div className="fullksizediv tooltip star unread-checkbox " data-tip = "Select"><input className="checkbox" type="checkbox"></input></div>
                <div className={`fullksizediv tooltip star  ${mail.isStared ? 'stared' : 'unstared'}`} data-tip = "Mark with Star"><i className="fa-regular fa-star"></i></div>
                <div className={`fullksizediv tooltip star  ${mail.isStared ? 'stared' : 'unstared'}`} data-tip = "Mark as Important"><i className="fa-regular fa-bookmark"></i></div>

                {/* {showFrom? <div className="from">{mail.from}</div>: <div className="from">To: {mail.to}</div>} */}
                <div className="from">{mail.from}</div>
                <div className="msg-details">
                    <div className="title">{mail.subject}</div>
                    <div className="subtitle"> - {mail.body}</div>
                </div>
                <div className="date">{prettyShortPaddedDate(mail.sentAt)}</div>
                <div className="overlay-buttons">
                    <button className = "tooltip font-awesome-hover-hint" data-tip = "Delete"><i className="fa-regular fa-trash"></i></button>
                    <button className = "font-awesome-hover-hint tooltip" data-tip = "Reply"><i className="fa-regular fa-reply"></i></button>
                    <button className = "font-awesome-hover-hint tooltip" data-tip = "Mark as read"><i className={`fa-regular ${mail.isRead ? 'fa-envelope': 'fa-envelope-open'}`} ></i></button>
                    <button className = "font-awesome-hover-hint tooltip" data-tip = "Star"><i className="fa-regular fa-star"></i></button>
                    {/*<button><i className="fa-regular fa-ellipsis-v"></i></button>*/}
                </div>
            </article>
        )}
    </div>)
}
