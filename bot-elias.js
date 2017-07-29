const mineflayer = require('mineflayer');
const Vec3 = require('vec3').Vec3
const navigatePlugin = require('mineflayer-navigate')(mineflayer);

let player = {
    position: new Vec3(0, 0, 0),
    username: 'arnaudschlupp'
};
let bot = mineflayer.createBot({
    host: '35.190.221.44',
    username: 'Elias',
    version: '1.12',
});
bot.isFollowing = false;

navigatePlugin(bot);

const onEntityMoved = (entity, player) => {
    if (entity.type === 'player' && entity.username === player.username) {
        if (!player.position.equals(entity.position)) {
            const delta = 1;
            bot.entity.position.set(entity.position.x - delta, entity.position.y, entity.position.z - delta);
            bot.lookAt(entity.position.offset(0, entity.height, 0));
            player.position.set(entity.position.x, entity.position.y, entity.position.z);
        }
    }
}

const random = (min = 1, max = 3) => {
    return Math.abs(Math.floor(Math.random() * max - min));
}

function dig() {
    if (bot.targetDigBlock) {
        bot.chat(`already digging ${bot.targetDigBlock.name}`)
    } else {
        var target = bot.blockAt(bot.entity.position.offset(0, 0, -1))
        if (target && bot.canDigBlock(target)) {
            bot.chat(`starting to dig ${target.name}`)
            bot.dig(target, onDiggingCompleted)
        } else {
            bot.chat('cannot dig')
        }
    }

    function onDiggingCompleted(err) {
        if (err) {
            console.log(err.stack)
            return
        }
        bot.chat(`finished digging ${target.name}`)
    }
}

bot.on('spawn', () => {
    bot.chat('Hi dude!');
});

bot.on('death', () => {
    bot.chat('Urgh! See ya cruel world...');
});

bot.navigate.on('pathPartFound', function (path) {
    bot.chat("Going " + path.length + " meters in the general direction for now.");
});

bot.navigate.on('pathFound', function (path) {
    bot.chat("I can get there in " + path.length + " moves.");
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

bot.on('entityMoved', (entity) => {
    if (bot.isFollowing === true) {
        onEntityMoved(entity, player);
    }
});

bot.on('chat', (username, message) => {
    const user = bot.players[username].entity;

    if (username === bot.username) return;
    if (message.startsWith(bot.username)) {
        if (message.endsWith(`come`)) {
            bot.entity.position = bot.navigate.to(user.position);
        } else if (message.endsWith(`follow me`)) {
            bot.isFollowing = true;
            player.username = username;
        } else if (message.endsWith(`dig`)) {
            dig();
        } else if (message.endsWith(`stop`)) {
            bot.navigate.stop();
            bot.isFollowing = false;
        }
    }
});
