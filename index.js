const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_TG_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

const app = express();
const port = 3000;

// Настройка сервера на обслуживание статических файлов из папки public
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



let lastChatId = null;
let chats = [];
let messages = []; 

bot.on('message', (msg) => {
    lastChatId = msg.chat.id;
    console.log(msg);
    
    if (!chats.some(chat => chat.id === msg.chat.id)) {
        chats.push({ id: msg.chat.id, username: msg.from.username });
    }
  
    messages.push({ chatId: msg.chat.id, text: msg.text, timestamp: new Date(), type: 'incoming' });
    console.log("Запомненный ID чата:", lastChatId);


});


  

  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json()); // Для разбора JSON-тел запросов
  

  app.post('/sendMessage', (req, res) => {
    const chatId = req.body.chatId;
    const message = req.body.message;
    
    if (chatId && message) {
        bot.sendMessage(chatId, message)
            .then(() => {
                // Здесь мы добавляем сообщение в массив после его успешной отправки
                messages.push({
                    chatId: chatId,
                    text: message,
                    timestamp: new Date().toISOString(), // Сохраняем время в формате ISO для унификации
                    type: 'outgoing' // Указываем, что это исходящее сообщение
                });
                res.send('Сообщение отправлено успешно!');
            })
            .catch((error) => {
                res.status(500).send('Ошибка при отправке сообщения: ' + error.toString());
            });
    } else {
        res.status(400).send('Необходимы chatId и message.');
    }
});



  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/getMessages', (req, res) => {
    const chatId = req.query.chatId;
    const filteredMessages = messages.filter(message => message.chatId == chatId);
    res.json(filteredMessages);
});

  
  app.get('/getChats', (req, res) => {
    res.json(chats);
});
