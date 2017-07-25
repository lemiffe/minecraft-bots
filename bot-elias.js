const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);

const myName = "Elias";

const bot = mineflayer.createBot({
    host: "localhost",
    username: myName,
    version: "1.12"
});

navigatePlugin(bot);
// bot.navigate.blocksToAvoid[132] = true; // avoid tripwire
// bot.navigate.blocksToAvoid[59] = false; // ok to trample crops

bot.on('chat', (username, message) => {
    const target = bot.players[username].entity;

    if (username === bot.username) return;
    if (message.startsWith(myName)) {
        if (message.endsWith('come')) {
            bot.navigate.to(target.position);
        } else if (message.endsWith('stop')) {
            bot.navigate.stop();
        }
    }
});

bot.navigate.on('pathFound', function (path) {
    bot.chat("found path. I can get there in " + path.length + " moves.");
});

bot.navigate.on('cannotFind', function (closestPath) {
    bot.chat("unable to find path. getting as close as possible");
    bot.navigate.walk(closestPath);
});

bot.navigate.on('arrived', function () {
    bot.chat("I have arrived");
});

bot.navigate.on('interrupted', function () {
    bot.chat("stopping");
});



