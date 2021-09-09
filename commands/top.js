const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js');
const { Command } = require('../lib/commands');

const data = new SlashCommandBuilder()
.setName('top')
.setDescription('Make funny top compilation video.')
.addIntegerOption(option => option.setName('number').setDescription('The number of things in the top compilation').setRequired(true))
.addStringOption(option => option.setName('thing').setDescription('The thing to make a top compilation of').setRequired(true))

/**
 * 
 * @param {Interaction} interaction 
 */
execute = (interaction) => {
    let num = interaction.options.getInteger('number');
    let thing = interaction.options.getString('thing');
    interaction.reply(`hi ${interaction.user.username}!!1!1111 ${num} ${thing}`);
}

module.exports = new Command(data, execute);