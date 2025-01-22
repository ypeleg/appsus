

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { mailsService } from '../services/mails.service.js'


export function MailList({ mails, onRemove }) {

    return (<div className="messages">
        {mails.map(mail =>

            <article className="msg" key = {mail.id}>
                <div className="unread"><input className="checkbox" type="checkbox"></input></div>
                <div className="star"><i className="fa-regular fa-star"></i></div>
                <div className="user">{mail.from}</div>
                <div className="msg-details">
                    <div className="title">{mail.subject}</div>
                    <div className="subtitle">{mail.body}</div>
                </div>
                <div className="date">Nov 13</div>
            </article>

        )}
    </div>)
}
