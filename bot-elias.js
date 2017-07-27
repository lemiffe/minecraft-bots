const mineflayer = require('mineflayer');
const Vec3 = require('vec3').Vec3

const botName = 'Elias';
const bot = mineflayer.createBot({
    host: '35.190.221.44',
    username: botName,
    version: '1.12',
});

bot.spawnPoint = null;

bot.on('chat', (username, message) => {
    const player = bot.players[username].entity;

    if (username === bot.username) return;
    if (message.startsWith(botName)) {
        if (message.endsWith(`come`)) {
            bot.entity.position = bot.players['arnaudschlupp'].entity.position;
        }
    }
});

bot.on('spawn', () => {
    bot.chat('Hi dude!');
})

bot.on('death', () => {
    bot.chat('Urgh! See ya cruel world...');
})

let playerPosition = new Vec3(0, 0, 0);
bot.on('entityMoved', (entity) => {
    if (entity.type === 'player' && entity.username === 'arnaudschlupp') {
        if (!playerPosition.equals(entity.position)) {
            const delta = 1;
            bot.entity.position.set(entity.position.x - delta, entity.position.y, entity.position.z - delta);
            bot.lookAt(entity.position.offset(0, entity.height, 0));
            playerPosition.set(entity.position.x, entity.position.y, entity.position.z);
        }
    }
})

const random = (min = 1, max = 3) => {
    return Math.abs(Math.floor(Math.random() * max - min));
}
