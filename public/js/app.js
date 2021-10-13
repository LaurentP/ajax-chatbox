'use strict'

const CHATBOX_HANDLER_FILE = './handler.php'
const CHATBOX_FLOOD_DELAY = 5000

const chatBoxView = document.querySelector('.chatbox-view')
const chatBoxForm = document.querySelector('.chatbox-form')

let chatBoxFloodCounter = 0

const chatBoxRequest = (request = null) => {
    fetch(CHATBOX_HANDLER_FILE, request)
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (request !== null) {
            chatBoxForm.querySelector('input[name="message"]').value = null
        }
        let chatBoxNewContent = new String()
        for (const row of data) {
            const time = row.created_at.split(' ')[1].substr(0, 5)
            chatBoxNewContent += `<div class="chatbox-row">
                    <span class="chatbox-row-time">${time}</span>
                    <span class="chatbox-row-nickname">${row.nickname}</span>:
                    <span class="chatbox-row-message">${row.message}</span>
                </div>`
        }
        if (chatBoxView.innerHTML !== chatBoxNewContent) {
            chatBoxView.innerHTML = chatBoxNewContent
            chatBoxView.scrollTop = chatBoxView.scrollHeight
        }
    })
}

const chatBoxSend = (form) => {
    if (chatBoxFloodCounter === 1) {
        const delay = CHATBOX_FLOOD_DELAY / 1000
        alert(`You can only send one message every ${delay} seconds.`)
        return
    }
    chatBoxFloodCounter++
    chatBoxRequest({ method: 'POST', body: new FormData(form) })
}

chatBoxForm.querySelector('input[name="nickname"]').value = localStorage.getItem('nickname')

chatBoxForm.addEventListener('submit', e => {
    e.preventDefault()
    chatBoxSend(e.target)
    localStorage.setItem('nickname', e.target.querySelector('input[name="nickname"]').value)
})

const chatBoxShowInterval = setInterval(() => {
    chatBoxRequest()
}, 5000)

const chatBoxFloodInterval = setInterval(() => {
    if (chatBoxFloodCounter > 0) chatBoxFloodCounter--
}, CHATBOX_FLOOD_DELAY)

chatBoxRequest()