const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Exibe informações do servidor'),

    async execute(interaction) {
        return interaction.reply(
            `Nome do servidor: ${interaction.guild.name}\nTotal de membros: ${interaction.guild.memberCount}`
        )
    },
}
