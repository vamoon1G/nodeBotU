const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');
let allMessages = [];

setInterval(fetchMessages, 200);

function fetchMessages() {
fetch(`/getMessages?chatId=${chatId}`)
.then(response => response.json())
.then(messages => {

    allMessages = messages;
    displayMessages();
})
.catch(error => console.error('Ошибка:', error));
}
fetchMessages();


document.getElementById('sendMessageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const messageText = document.getElementById('messageText').value;
    const chatId = urlParams.get('chatId'); 
    sendMessage(chatId, messageText); 
});

function sendMessage(chatId, text) {
    const outgoingMessage = { chatId: chatId, text: text, type: 'outgoing', timestamp: new Date().toISOString() };
    allMessages.push(outgoingMessage); 
    displayMessages(); 

    fetch('/sendMessage', {
    
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: chatId, message: text }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сетевой запрос вернул ошибку');
        }
        displayMessage({ text: text, type: 'outgoing', timestamp: new Date() }); 
        document.getElementById('messageText').value = ''; 
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}



function displayMessages() {
    const chat = document.getElementById('chat');
    chat.innerHTML = ''; 
    allMessages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', msg.type); 
        const timeText = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageElement.innerHTML = `<div>${msg.text}</div><div class="message-time">${timeText}</div>`;
        chat.appendChild(messageElement);
    });
    chat.scrollTop = chat.scrollHeight; 
}

