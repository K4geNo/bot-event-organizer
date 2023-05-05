const {
    Events,
    Client,
    Collection,
    GatewayIntentBits,
    CommandInteraction,
} = require('discord.js')

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
})

client.cooldowns = new Collection()

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            return interaction.reply({
                content: 'Ocorreu um erro ao executar este comando!',
                ephemeral: true,
            })
        }

        const { cooldowns } = client

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection())
        }

        const now = Date.now()
        const timestamps = cooldowns.get(command.data.name)
        const defaultCooldownDuration = 5
        const cooldownAmount =
            (command.cooldown ?? defaultCooldownDuration) * 1000

        if (timestamps.has(interaction.user.id)) {
            const expirationTime =
                timestamps.get(interaction.user.id) + cooldownAmount

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000)

                await interaction.reply({
                    content: `Por favor, aguarde, você ainda está em cooldown! (Tempo restante: ${
                        expiredTimestamp - Math.round(now / 1000)
                    } segundos)`,
                    ephemeral: true,
                })

                if (interaction instanceof CommandInteraction) {
                    return setTimeout(() => interaction.deleteReply(), 5000)
                }
            }
        }

        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`)
            console.error(error)
            await interaction.reply({
                content: 'Ocorreu um erro ao executar este comando!',
                ephemeral: true,
            })
        }
    },
}
