const { CommandInteraction } = require('discord.js')
const {
    PermissionsBitField,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens do canal')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Quantidade de mensagens a serem apagadas')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('Usuário para apagar mensagens')
                .setRequired(false)
        ),
    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            await interaction.reply({
                content: 'Você não tem permissão para usar este comando.',
                ephemeral: true,
            })

            if (interaction instanceof CommandInteraction) {
                return setTimeout(() => interaction.deleteReply(), 10000)
            }
        }

        const amount = interaction.options.getInteger('amount')

        if (amount < 1 || amount > 100) {
            await interaction.reply({
                content: 'A quantidade de mensagens deve ser entre 1 e 100.',
                ephemeral: true,
            })

            if (interaction instanceof CommandInteraction) {
                return setTimeout(() => interaction.deleteReply(), 10000)
            }

            return
        }

        await interaction.channel
            .bulkDelete(amount, true)
            .then((messages) => {
                interaction.reply({
                    content: `Apagado com sucesso ${messages.size} mensagens`,
                    ephemeral: true,
                })

                if (interaction instanceof CommandInteraction) {
                    return setTimeout(() => interaction.deleteReply(), 10000)
                }
            })
            .catch((error) => {
                console.error(error)
                interaction.reply({
                    content: 'Erro ao apagar mensagens.',
                    ephemeral: true,
                })

                if (interaction instanceof CommandInteraction) {
                    return setTimeout(() => interaction.deleteReply(), 10000)
                }
            })
    },
}
