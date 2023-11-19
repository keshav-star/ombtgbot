const TelegramBot = require('node-telegram-bot-api');
const connectionDB = require('./dbConnection');
const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;
const ombjson = require('./omb.json')
const cron = require('node-cron');

require("dotenv").config();

connectionDB();

const bot = new TelegramBot(token, { polling: false });
let arrayNumber = 0;
// Function to send a daily message

const formatKeyValuePairs = (obj) => {
    return Object.entries(obj)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n');
};

const formatBookRecommendations = (books) => {
    return books.map((book) => `- ${book}`).join('\n');
};

const linkUrl = 'https://google.com';
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
function sendDailyMessage() {

    try {
        const jsonObject = ombjson[arrayNumber];
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/1/19/Field_marshal_SHFJ_Manekshaw.jpg"
        const message = `
            🌟 *Name*: ${jsonObject.name}

📝 *Summary*: ${jsonObject.summary}

🎉 *Events*:
${formatKeyValuePairs(jsonObject.events)} 

📚 *Book Recommendations*:
${formatBookRecommendations(jsonObject.bookrecommendations)}
`;
bot.sendPhoto(chatId, imageUrl, {
    caption: message,
    parse_mode: 'Markdown',
    reply_markup: JSON.stringify(keyboard),
    });
    } catch (error) {
        console.log(error)
    }
    arrayNumber = arrayNumber + 1;
}
console.log("messageSent")

cron.schedule('* */6 * * *', () => {
    sendDailyMessage();
});
// Set up a schedule to send the message daily
// setInterval(sendDailyMessage, 5 * 1000); // 24 hours
