const mineflayer = require('mineflayer')

const myName = "Elias";

const bot = mineflayer.createBot({
    host: "localhost",
    username: myName,
    version: "1.12"
});

bot.on('chat', (username, message) => {
	if (username === bot.username) return;
	if (message.startsWith(myName)) {
		bot.chat(message);
	}
});
