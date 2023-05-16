const { CommandInteraction } = require('discord.js')
const {
    SlashCommandBuilder,
    ButtonStyle,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionsBitField,
    PermissionFlagsBits,
} = require('discord.js')

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('husband')
        .setDescription('Cria uma votação de husbando')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option
                .setName('campeonato')
                .setDescription('Digite o nome do campeonato')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Husbando League - Segunda Fase',
                        value: 'Husbando League - Segunda Fase',
                    },
                    {
                        name: 'Husbando League - Oitavas de final',
                        value: 'Husbando League - Oitavas de final',
                    },
                    {
                        name: 'Husbando League - Quartas de final',
                        value: 'Husbando League - Quartas de final',
                    },
                    {
                        name: 'Husbando League - Semifinal',
                        value: 'Husbando League - Semifinal',
                    },
                    {
                        name: 'Husbando League - Final',
                        value: 'Husbando League - Final',
                    }
                )
        )
        .addStringOption((option) =>
            option
                .setName('name-1')
                .setDescription('Digite o nome do primeiro husbando')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('name-2')
                .setDescription('Digite o nome do segundo husbando')
                .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option
                .setName('file')
                .setDescription('Envie a imagem do campeonato')
                .setRequired(true)
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

        // Husbando Channel
        const allowedChannel = '1077949771861479446'
        const testChannel = '1078435119322366062'

        if (
            interaction.channel.id !== allowedChannel &&
            interaction.channel.id !== testChannel
        ) {
            await interaction.reply({
                content: `Este comando só pode ser utilizado em <#${allowedChannel}>`,
                ephemeral: true,
            })

            if (interaction instanceof CommandInteraction) {
                return setTimeout(() => interaction.deleteReply(), 10000)
            }

            return
        }

        const campeonato = interaction.options.getString('campeonato')
        const inputOne = interaction.options.getString('name-1')
        const inputTwo = interaction.options.getString('name-2')
        const file = interaction.options.getAttachment('file')

        let voteQuantityHusbandOne = 0
        let voteQuantityHusbandTwo = 0

        const extractNameOne = inputOne.split(' - ')[0]
        const extractNameTwo = inputTwo.split(' - ')[0]

        const voteOne = new ButtonBuilder()
            .setCustomId('voteOne')
            .setLabel(extractNameOne)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔵')

        const voteTwo = new ButtonBuilder()
            .setCustomId('voteTwo')
            .setLabel(extractNameTwo)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔴')

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(campeonato)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
            })
            .setDescription('Vote no melhor husbando!')
            .setImage(file.url)
            .addFields(
                {
                    name: inputOne,
                    value: `Votos: \`${String(voteQuantityHusbandOne)}\``,
                    inline: true,
                },
                {
                    name: inputTwo,
                    value: `Votos: \`${String(voteQuantityHusbandTwo)}\``,
                    inline: true,
                }
            )
            .setTimestamp()

        const row = new ActionRowBuilder().addComponents(voteOne, voteTwo)

        const btn = await interaction.reply({
            embeds: [embed],
            components: [row],
        })

        const filter = (interaction) =>
            interaction.user.id === interaction.user.id

        const collector = btn.createMessageComponentCollector({
            filter,
            time: 86400000,
        })

        // Crie um objeto de estado para armazenar quais opções cada usuário votou
        const userVotes = {}

        collector.on('collect', async (interaction) => {
            // Verifique se o usuário já votou antes
            if (userVotes[interaction.user.id]) {
                // Se o usuário já votou antes, remova o voto anterior
                if (userVotes[interaction.user.id] === 'voteOne') {
                    voteQuantityHusbandOne--
                } else {
                    voteQuantityHusbandTwo--
                }
            }

            // Atualize o objeto de estado com a nova escolha do usuário
            userVotes[interaction.user.id] = interaction.customId

            // Atualize o número de votos para a opção selecionada
            if (interaction.customId === 'voteOne') {
                voteQuantityHusbandOne++
            } else {
                voteQuantityHusbandTwo++
            }

            const updatedEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(campeonato)
                .setAuthor({
                    name: `Último usuário a votar: ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL(),
                })
                .setDescription('Vote no husbando mais pika!')
                .setImage(file.url)
                .addFields(
                    {
                        name: inputOne,
                        value: `Votos: \`${String(voteQuantityHusbandOne)}\``,
                        inline: true,
                    },
                    {
                        name: inputTwo,
                        value: `Votos: \`${String(voteQuantityHusbandTwo)}\``,
                        inline: true,
                    }
                )
                .setTimestamp()

            await interaction.update({
                embeds: [updatedEmbed],
                components: [row],
            })
        })
    },
}
