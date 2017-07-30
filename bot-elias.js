// TODO
// Digging
// - Make him move until next block and mine until he has done his task
// - Make him dig more block around him so he can fell, same when moving into other directions
// - Make him not mine water / lava or air + avoid stepping into empty areas
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
const CONSTANTS = {
    DIRECTION: {
        TOP: 'top',
        BOTTOM: 'down',
        RIGHT: 'right',
        LEFT: 'left',
        FORWARD: 'forward',
        BACKWARD: 'backward',
    }
}
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
    const inputs = message.toLowerCase().replace(/  +/g, ' ').split(' ');
    const robot = {
        username: BOT.username.toLowerCase()
    };

    if (inputs[0].startsWith(robot.username)) {
        const command = inputs[1];
        switch (command) {
            case 'dig':
                dig(inputs[2], inputs[3]);
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
    log("Going " + path.length + " meters in the general direction for now.");
});

BOT.navigate.on('pathFound', function (path) {
    log("I can get there in " + path.length + " moves.");
});

BOT.navigate.on('cannotFind', function (closestPath) {
    log("Unable to find path. Getting as close as possible.");
    BOT.navigate.walk(closestPath);
});

BOT.navigate.on('arrived', function () {
    log("I have arrived!");
});

BOT.navigate.on('interrupted', function () {
    log("Stopping.");
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

function dig(direction = 'down', limit = 1) {
    navigateToNextBlockToDig(direction);

    if (BOT.targetDigBlock) {
        log(`Already digging ${bot.targetDigBlock.name}`)
    } else {
        const target = BOT.blockAt(getNextBlockPositionToDig(direction));
        if (target && BOT.canDigBlock(target) && target.type !== 0) {
            console.log(`Starting to dig ${target.name}`)
            BOT.dig(target, onDiggingCompleted)
        } else {
            log('Cannot dig!')
        }
    }

    function onDiggingCompleted(error) {
        if (error) {
            log('Error trying to dig your shit: ' + error);
            return
        }
        log(`Finished digging ${target.name}`)

        setTimeout(() => {
            limit--;
            limit > 0 ? dig(direction, limit) : null;
        }, 1000);
    }

    function getNextBlockPositionToDig(direction) {
        let dx = 0;
        let dy = 0;
        let dz = 0;

        switch (direction) {
            case CONSTANTS.DIRECTION.BOTTOM:
                dy = -1
                break;
            case CONSTANTS.DIRECTION.RIGHT:
                dx = 1
                break;
            case CONSTANTS.DIRECTION.LEFT:
                dx = -1
                break;
            case CONSTANTS.DIRECTION.FORWARD:
                dz = -1
                break;
            case CONSTANTS.DIRECTION.BACKWARD:
                dz = 1
                break;
            default:
                break;
        }

        return new Vec3(BOT.entity.position.x + dx, BOT.entity.position.y + dy, BOT.entity.position.z + dz);
    }

    function navigateToNextBlockToDig(direction) {
        BOT.navigate.to(getNextBlockPositionToDig(direction));
    }
}

function log(message) {
    console.log(message);
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