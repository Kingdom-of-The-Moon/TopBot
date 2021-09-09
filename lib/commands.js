const config = require('../config.js');
const fs = require('fs')

const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { default: Collection } = require('@discordjs/collection');
const { Interaction } = require('discord.js');
const rest = new REST({version: '9'}).setToken(config.token);

const commands = new Collection();
const deployedCommands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

module.exports = {
    reload: (async () => {
       
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            deployedCommands.push(command.data.toJSON());

            commands.set(command.data.name, command);
        }

        try {
            console.log('Reloading application commands...');
    
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: deployedCommands },
            );
    
            console.log(`Reloaded ${deployedCommands.length} command${deployedCommands.length == 1 ? "" : "s"}`);
        } catch (error) {
            console.warn('Failed to reload application commands!');
            console.error(error);
        }
    }),
    onInteraction: async function (interaction) {
        const command = commands.get(interaction.commandName);

        if (!commands) {
            console.warn(`Command ${interaction.commandName} not found!`);
        } 
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Oh no! There was an error executing this command :<', ephemeral: true });
        }
    },
    Command: class Command {

        /**
         * @type {SlashCommandBuilder}
         */
        data;

        /**
         * @type {Function<Interaction>}
         */
        action;

        /**
         * 
         * @param {SlashCommandBuilder} data 
         * @param {Function<Interaction>} action 
         */
        constructor(data, action) {
            this.data = data;
            this.action = action;
        }
        
        /**
         * @param {Interaction} interaction 
         */
        async execute(interaction) {
            this.action(interaction);
        }
    }
}