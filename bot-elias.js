// TODO
// Digging
// - Make command dig down/up 20 blocks / dig down/up 20
// - Make command dig forward/backward 20 blocks / dig forward/backward 20
// - Make command dig left/right 20 blocks / dig left/right 20
// - Make command dig [block]
// - Put digging pattern in place like dig in a square, a polygon, ...
// Survival
// - Eat
// - Build home, chest, furnace, ...
// - Build equipment and equip it
// - Attack people back and flee fast to home

const mineflayer = require('mineflayer');
const Vec3 = require('vec3').Vec3
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);

// --- Commands
let COMMANDS = {
    follow: false,
};

// --- Player
let PLAYER = {
    
};

// --- Bot
let BOT = mineflayer.createBot({
    host: '35.190.221.44',
    username: 'Elias',
    version: '1.12',
});

// --- Plugins
navigatePlugin(BOT);
blockFinderPlugin(BOT);

// --- Events
BOT.on('chat', (username, message) => {
    if (username === BOT.username) return;

    PLAYER = BOT.players[username].entity;
    const input = message.toLowerCase();
    const robot = {
        username: BOT.username.toLowerCase()
    };

    if (input.startsWith(robot.username)) {
        const command = input.substring(robot.username.length).trim();
        switch (command) {
            case 'dig':
                setBotPositionAboveNearestBlock();
                digDown();
                break;
            case 'come':
                navigateTo(PLAYER);
                break;
            case 'follow':
                setCommand('follow', true);
                break;
            case 'stop':
                setCommand('follow', false);
                break;
            default:
                break;
        }
    }
});

BOT.navigate.on('pathPartFound', function (path) {
    BOT.chat("Going " + path.length + " meters in the general direction for now.");
});

BOT.navigate.on('pathFound', function (path) {
    BOT.chat("I can get there in " + path.length + " moves.");
});

BOT.navigate.on('cannotFind', function (closestPath) {
    BOT.chat("Unable to find path. Getting as close as possible.");
    BOT.navigate.walk(closestPath);
});

BOT.navigate.on('arrived', function () {
    BOT.chat("I have arrived!");
});

BOT.navigate.on('interrupted', function () {
    BOT.chat("Stopping.");
});

BOT.on('entityMoved', (entity) => {
    if (COMMANDS.follow === false) return;
    setBotPositionToEntityPosition(entity, PLAYER);
});

// --- Functions
function navigateTo(user) {
    BOT.navigate.to(user.position);
}

function setBotPositionToEntityPosition(entity, player) {
    if (entity.type === 'player' && entity.username === player.username) {
        const delta = 1;
        BOT.entity.position.set(entity.position.x - delta, entity.position.y, entity.position.z - delta);
    }
}

function setCommand(command, value) {
    Object.assign(COMMANDS, { [command]: value });
}

function setBotPositionAboveNearestBlock() {
    BOT.navigate.to(new Vec3(Math.floor(BOT.entity.position.x), Math.floor(BOT.entity.position.y), Math.floor(BOT.entity.position.z)));
}

function digDown(limit = 20, blockPosition = new Vec3(BOT.entity.position.x, BOT.entity.position.y - 1, BOT.entity.position.z)) {
    if (BOT.targetDigBlock) {
        BOT.chat(`Already digging ${bot.targetDigBlock.name}`)
    } else {
        var target = BOT.blockAt(blockPosition);
        if (target && BOT.canDigBlock(target)) {
            BOT.chat(`starting to dig ${target.name}`)
            BOT.dig(target, onDiggingCompleted)
        } else {
            BOT.chat('cannot dig')
        }
    }

    function onDiggingCompleted(error) {
        if (error) {
            BOT.chat('Error trying to dig your shit: ' + error);
            return
        }
        BOT.chat(`Finished digging ${target.name}`)
        limit--;
        limit > 0 ? digDown(limit) : null;
    }
}

// function dig(blockPosition) {
//     if (BOT.targetDigBlock) {
//         BOT.chat(`Already digging ${bot.targetDigBlock.name}`)
//     } else {
//         var target = BOT.blockAt(blockPosition);
//         if (target && BOT.canDigBlock(target)) {
//             BOT.chat(`starting to dig ${target.name}`)
//             BOT.dig(target, onDiggingCompleted)
//         } else {
//             BOT.chat('cannot dig')
//         }
//     }

//     function onDiggingCompleted(error) {
//         if (error) {
//             BOT.chat('Error trying to dig your shit: ' + error);
//             return
//         }
//         BOT.chat(`Finished digging ${target.name}`)
//     }
// }

// function getBlockPositionAndDigToBlock(blockId = 3, maxDistance = 256) {
//     BOT.findBlock({
//         point: BOT.entity.position,
//         matching: blockId,
//         maxDistance: maxDistance,
//         count: 1,
//     }, (error, blocks) => handleBlockSearch(error, blocks));

//     function handleBlockSearch(error, blocks) {
//         if (error) {
//             BOT.chat('Error trying to find your block: ' + error);
//             return;
//         }
//         if (blocks.length) {
//             console.log(blockPosition, BOT.entity.position);
//             dig(blocks[0].position);
//         } else {
//             BOT.chat("I couldn't find your block");
//         }

//         return;
//     }
// }