

export const mailUtilService = {
    loadFromStorage,
    saveToStorage,
    getDayName,
    getMonthName,
    animateCSS,
    debounce,
    padNum,

    random: {

        id: (length=6) => [...'x'.repeat(length)].map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join(''),

        randint: (min, max) => { return Math.floor(Math.random() * (max - min + 1)) + min },

        choice: (arr) => { return arr[Math.floor(Math.random() * arr.length)] },

        date: (start, end) => { return new Date(Math.floor(Math.random() * (Date.parse(end) - Date.parse(start) + 1) + Date.parse(start))) },

        lorem: (length = 6) => [...'x'.repeat(length)].map(() => ['The sky','above','the port','was','the color of television','tuned','to','a dead channel','.','All','this happened','more or less','.','I','had','the story','bit by bit','from various people','and','as generally','happens','in such cases','each time','it','was','a different story','.','It','was','a pleasure','to','burn'][Math.floor(Math.random()*32)]).join(' '),

        color: () => '#' + [...'x'.repeat(6)].map(() => '0123456789ABCDEF'[Math.floor(Math.random()*16)]).join(''),

        sample: (arr, n) => [...arr].sort(()=> .5 - Math.random()).slice(0, n)

    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function animateCSS(el, animation = 'bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

function padNum(num) {
    return (num > 9) ? num + '' : '0' + num
}

function getDayName(date, locale) {
    date = new Date(date)
    return date.toLocaleDateString(locale, { weekday: 'long' })
}

function getMonthName(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    return monthNames[date.getMonth()]
}

