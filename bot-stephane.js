const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const vec3 = require('vec3');
var radarPlugin = require('mineflayer-radar')(mineflayer);

const botName = 'Stephane';
const bot = mineflayer.createBot({
    host: (process.argv.length > 2) ? process.argv[2] : 'localhost',
    username: botName,
    version: '1.12'
});

const radarOptions = {
	host: 'localhost',
	port: 5001,
};

navigatePlugin(bot);
radarPlugin(bot, radarOptions);

var arrived = true;
var arrivedTries = 0; // increments by 1 every interval (2 seconds), to avoid leaving it stuck if it can't find the location
var player = null;
var allPlayers = [];

bot.on('chat', (username, message) => {
});

bot.navigate.on('pathFound', function (path) {
    arrived = false;
    console.log('>> walking (A* Good)');
});

bot.navigate.on('cannotFind', function (closestPath) {
    arrived = false;
    console.log('>> walking (A* Shit)');
    bot.navigate.walk(closestPath);
});

bot.navigate.on('arrived', function () {
    arrived = true;
    console.log('>> arrived');
});

bot.navigate.on('interrupted', function () {
    arrived = true;
    console.log('>> arrived / interrupted');
});

function go() {
	console.log('*', arrived);
	// Anti-getting stuck mechanism
	if (arrived === false) {
		if (arrivedTries >= 5) {
			arrivedTries = 0;
			arrived = true; // Reset so we can start again
			console.log('>> stuck! trying to find target again!');
		}
		arrivedTries += 1;
	}

	// Finding the target mechanism
	try {
		var target = player.position;
		var source = bot.entity.position;
		var distanceX = (target.x > source.x) ? target.x - source.x : source.x - target.x;
		var distanceZ = (target.z > source.z) ? target.z - source.z : source.z - target.z;
		var totalDistance = Math.round(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceZ, 2)));
		if (totalDistance > 4) {
			console.log(' - Target > 4... targetting: ', target);
			var targetSpaced = vec3(target.x, target.y, target.z);
			targetSpaced.x = (target.x > source.x) ? target.x - (Math.floor(Math.random() * 3) + 1) : source.x - (Math.floor(Math.random() * 3) + 1);
			targetSpaced.z = (target.z > source.z) ? target.z - (Math.floor(Math.random() * 3) + 1) : source.z - (Math.floor(Math.random() * 3) + 1);
			console.log(' - Modified target: ', targetSpaced);
			bot.navigate.to(targetSpaced);
		}
	}
	catch (ex) {
		// Potentially the bot is still connecting, no need to crash
		console.log('go_err', ex.message);
	}
}

function look() {
	try {
		var target = player.position;
		var lookAt = vec3(target.x, target.y + 1.7, target.z);
		bot.lookAt(lookAt);
	}
	catch (ex) {
		// Potentially the bot is still connecting, no need to crash
		console.log('look_err', ex.message);
	}
}

function gameLoop() {
	// Get list of all players
	if (allPlayers.join() !== Object.keys(bot.players).sort().join()) {
		allPlayers = Object.keys(bot.players).sort();
		console.log('Player list changed:', allPlayers);
	}

	// Perform actions
	if (allPlayers.indexOf('lemiffe') !== -1) {
		player = bot.players['lemiffe'].entity;
		if (player && player.position !== null) {
			go();
			look();
		}
	}
}

console.log('Booting up :)');
setInterval(gameLoop, 500);
