

import { mailUtilService } from './mail-util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailDB'

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

function getLoggedinUser() {
    return loggedinUser
}



_createMails()


export const mailsService = {
    get,
    save,
    query,
    remove,
    tagMail,
    readMail,
    starMail,
    getLoggedinUser,
    getDefaultEmail,
    getDefaultFilter,
}

window.bs = mailsService

function query(filterBy = {}, sortAsc = true) {
    return storageService.query(MAIL_KEY)
        .then(mails => {

            if (filterBy.txt) {
                mails = mails.filter(mail =>
                    (   RegExp(filterBy.txt, 'i').test(mail.subject)
                    || RegExp(filterBy.txt, 'i').test(mail.body)
                    || RegExp(filterBy.txt, 'i').test(mail.from)
                    || RegExp(filterBy.txt, 'i').test(mail.to) )
                )
            }

            if ((filterBy.isRead !== null) && (filterBy.isRead !== undefined)) {
                mails = mails.filter(mail => mail.isRead === filterBy.isRead)
            }

            if ((filterBy.isStared !== null) && (filterBy.isStared !== undefined)) {
                console.log('all filterby ', filterBy)
                console.log('filterBy.isStared:', filterBy.isStared)
                mails = mails.filter(mail => (mail.isStared))
                console.log('filterBy.isStared:', mails.length)
            }

            if (filterBy.lables && filterBy.lables.length) {
                mails = mails.filter(mail => mail.labels.some(label => filterBy.lables.includes(label)))
            }

            if (filterBy.status) {
                mails = mails.filter(mail => (mail.status === filterBy.status))
            }

            if (filterBy.from) {
                console.log('filterBy.from:', filterBy.from)
                mails = mails.filter(mail => (mail.from === filterBy.from))
            }

            if (filterBy.to) {
                mails = mails.filter(mail => (mail.to === filterBy.to))
            }

            // sent
            if (filterBy.sentAt === true) {
                mails = mails.filter(mail => (mail.sentAt !== null))
            }

            // draft
            if (filterBy.sentAt === false) {
                mails = mails.filter(mail => (mail.sentAt === null))
            }

            // trash
            if (filterBy.removedAt === true) {
                mails = mails.filter(mail => (mail.removedAt !== null))
            }

            // NOT DELETED
            if (filterBy.removedAt === false) {
                mails = mails.filter(mail => ((mail.removedAt === null) || (mail.removedAt === undefined)))
            }


            // // draft
            // if ( ((filterBy.sentAt === null) || (filterBy.sentAt === undefined)) && ((filterBy.createdAt === true) ) ) {
            //     mails = mails.filter(mail => (mail.sentAt === null))
            //     console.log('drafts:' , mails.length)
            // }


            const mailsNotSent = mails.filter(mail => mail.sentAt === null)
            let mailsSent = mails.filter(mail => mail.sentAt !== null)


            console.log(mailsSent[0])

            if (sortAsc) { mailsSent = mailsSent.sort((mail1, mail2) => {
                return Date.parse(mail1.sentAt) - Date.parse(mail2.sentAt)

            })}
            else { mailsSent = mailsSent.sort((mail1, mail2) => {
                return Date.parse(mail2.sentAt) - Date.parse(mail1.sentAt)
                    // mail2.sentAt - mail1.sentAt
            })}

            console.log(mailsSent[0])

            mails = [...mailsNotSent, ...mailsSent]

            return mails
        })
}

function readMail(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => {
            mail.isRead = true
            storageService.put(MAIL_KEY, mail).then(() => storageService.get(MAIL_KEY, mailId))
    })
}

function starMail(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => {
            mail.isStared = !mail.isStared
            storageService.put(MAIL_KEY, mail).then(() => storageService.get(MAIL_KEY, mailId))
    })
}

function tagMail(mailId, tag = 'Important') {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => {
            if (mail.labels.includes(tag)) {
                mail.labels = mail.labels.filter(label => label !== tag)
            } else {
                mail.labels.push(tag)
            }
            storageService.put(MAIL_KEY, mail).then(() => storageService.get(MAIL_KEY, mailId))})
}



function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        // .then(mail => _setNextPrevMailId(mail))
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        return storageService.post(MAIL_KEY, mail)
    }
}

function getDefaultFilter(filterBy = {
    status: '', // 'inbox/sent/trash/draft'
    txt: '',
    isRead: null,
    isStared: null,
    lables: []
}) {
    return {
        status: '',
        txt: '',
        isRead: null,
        isStared: null,
        lables: []
    }

    /* return { txt: filterBy.txt, minDate: filterBy.minDate, maxDate: filterBy.minDate } */
}

function getDefaultEmail() {
    return {
        sentAt: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),

        subject: '',
        body: '',

        isRead: true,
        isStared: false,
        isSelected: true,

        removedAt: null,

        labels: [],

        from: getLoggedinUser().email,
        to: ''


    }
}

function _createMails() {
    // const mails = utilService.loadFromStorage(MAIL_KEY) || []
    const mails = []


    if (mails && mails.length) return

    for (let i = 0; i < 20; i++) {
        const mail = {

            id: mailUtilService.random.id(),
            sentAt: mailUtilService.random.date('2021-01-01', '2025-01-22'),
            createdAt: mailUtilService.random.date('2021-01-01', '2025-01-22'),

            subject: mailUtilService.random.lorem(2),
            body: mailUtilService.random.lorem(20),

            isRead: mailUtilService.random.choice([true, false]),
            isStared: mailUtilService.random.choice([true, false]),

            removedAt : mailUtilService.random.choice([null, mailUtilService.random.date('2021-01-01', '2025-01-22')]),

            labels: mailUtilService.random.sample(['Primary', 'Promotions', 'Social'], mailUtilService.random.randint(0, 3)),

            ...( (mailUtilService.random.randint(0, 1)) ? {from: 'momo@momo.com',   to: 'user@appsus.com'}:
                                                          {from: 'user@appsus.com', to: 'momo@momo.com'}
            )

        }

        // drafts
        if (mail.from === getLoggedinUser().email) {
            if (mailUtilService.random.randint(0, 1)) {
                mail.sentAt = null
                mail.isRead = true
            }
        }

        // sent
        if ((mail.from === getLoggedinUser().email) && (mail.sentAt !== null)) {
            if (mailUtilService.random.randint(0, 1)) {
                mail.isRead = true
            }
        }


        // console.log(mail)
        mails.push(mail)
    }
    mailUtilService.saveToStorage(MAIL_KEY, mails)
}
