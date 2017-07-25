# Minecraft Bots

An assortment of bots for use in Minecraft

## Installation

- Run npm install

## Deploying

- To deploy simply push to master

## Usage (with minecraft-env for automatic deploys)

- Simply push to master and your bot will be started in a screen
- After a re-deploy it will not restart the script, it will simply pull in the latest changes and run npm install
- If there were changes to a bot's code, nodemon will detect the changes and restart that specific bot

## Usage (manually starting)

To run a bot in the server, start it in a "screen" using `nodemon script.js`

For example:

```
screen -S bot-bob
cd minecraft-bots
nodemon bot-bob.js
ctrl a+d
```

