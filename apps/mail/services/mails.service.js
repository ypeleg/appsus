import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailDB'


_createMails()


export const mailsService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    getDefaultFilter,
}

window.bs = mailsService

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY)
        .then(mails => {

            if (filterBy.subject) {

                mails = mails.filter(mail => RegExp(filterBy.subject, 'i').test(mail.subject))

            }

            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => _setNextPrevMailId(mail))
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

function getEmptyMail(title = '', amount = '', description = '', pageCount = '', language = 'en', authors = '') {
    return {
        title,
        authors,
        description,
        pageCount,
        thumbnail: `/assets/mailsImages/15.jpg`,
        language,
        listPrice: {
            amount,
            currencyCode: "EUR",
            isOnSale: Math.random() > 0.7
        },
        reviews: []
    }
}

function getDefaultFilter(filterBy = { title: '', minPrice: 0, maxPrice: 0 }) {
    return { title: filterBy.title, minPrice: filterBy.minPrice, maxPrice: 0 }
}

function _createMails() {
    const mails = utilService.loadFromStorage(MAIL_KEY) || []
    // const mails = []


    if (mails && mails.length) return

    for (let i = 0; i < 20; i++) {
        const mail = {

            id: utilService.makeId(),
            sentAt: utilService.getRamdomDateInBetween('2021-01-01', '2025-01-22'),
            createdAt: utilService.getRamdomDateInBetween('2021-01-01', '2025-01-22'),

            subject: utilService.makeLorem(2),
            body: utilService.makeLorem(20),

            isRead: false,
            removedAt : null,

            from: 'momo@momo.com',
            to: 'user@appsus.com',

        }
        mails.push(mail)
    }
    utilService.saveToStorage(MAIL_KEY, mails)
}

function _setNextPrevMailId(mail) {
    return storageService.query(MAIL_KEY)
        .then((mails) => {
            const mailIdx = mails.findIndex((currMail) => currMail.id === mail.id)
            const nextMail = mails[mailIdx + 1] ? mails[mailIdx + 1] : mails[0]
            const prevMail = mails[mailIdx - 1] ? mails[mailIdx - 1] : mails[mails.length - 1]
            mail.nextMailId = nextMail.id
            mail.prevMailId = prevMail.id
            return mail
        })
}
