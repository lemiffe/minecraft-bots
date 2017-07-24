const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
    host: "localhost",
    username: "Spybot",
    version: "1.12"
});

bot.on('chat', (username, message) => {
	if (username === bot.username) return;
	if (username === "bob") return;
	bot.chat(message)
});
