

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

// import { mailsService } from '../services/mails.service.js'


export function MailList({ mails, onRemove, onReadMail, showFrom }) {

    return (<div className="messages">
        {mails.map(mail =>

            <article className={`msg ${mail.isRead ? 'read' : 'unread'}`} key={mail.id} onClick={() => {onReadMail(mail.id)}}>
                <div className="star unread-checkbox hover-hint"><input className="checkbox" type="checkbox"></input></div>
                <div className={`star hover-hint ${mail.isStared ? 'stared' : 'unstared'}`}><i className="fa-regular fa-star"></i></div>
                <div className={`star hover-hint ${mail.isStared ? 'stared' : 'unstared'}`}><i className="fa-regular fa-bookmark"></i></div>
                {showFrom? <div className="from">{mail.from}</div>: <div className="from">To: {mail.to}</div>}
                <div className="msg-details">
                    <div className="title">{mail.subject}</div>
                    <div className="subtitle"> - {mail.body}</div>
                </div>
                <div className="date">Nov 13</div>
            </article>
        )}
    </div>)
}
