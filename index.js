const {Client} = require('discord.js');
const commands = require('./lib/commands');
const config = require('./config.js');

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

client.login(config.token);

client.on('ready', () => {
    commands.reload();
    console.log("Bot online!");
})

client.on('interactionCreate', commands.onInteraction);