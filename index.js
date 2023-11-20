const TelegramBot = require('node-telegram-bot-api');
const ombjson = require('./omb.json')
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('static'))
app.use(express.json());
require("dotenv").config();

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

// Function to send a daily message

const formatKeyValuePairs = (obj) => {
    return Object.entries(obj)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n\n');
};

const linkUrl = 'https://omb.netlify.app';
const buttonText = 'Read More';

const keyboard = {
    inline_keyboard: [
        [
            {
                text: buttonText,
                url: linkUrl,
            },
        ],
    ],
};

let today = new Date();
const reference = 78724;
const now = today.getTime() / 1000 / 6 / 60 / 60;
const arrayNumber = Math.floor(now % reference);
console.log(arrayNumber);
if (arrayNumber > ombjson.length) arrayNumber = 0;

function sendDailyMessage() {

    try {
        const jsonObject = ombjson[arrayNumber];
        const imageUrl = jsonObject?.imageurl;
        const message = `
            🌟 *Name*: ${jsonObject.name}

📝 *Summary*: ${jsonObject.summary}

🎉 *Events*:

${formatKeyValuePairs(jsonObject.events)} 

`;
        bot.sendPhoto(chatId, imageUrl, {
            caption: message,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify(keyboard),
        });
    } catch (error) {
        console.log(error)
    }

}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

sendDailyMessage()

cron.schedule('0 9 * * *', () => {
    sendDailyMessage();
});

// Set up a schedule to send the message daily
// setInterval(sendDailyMessage, 5 * 1000); // 24 hours
