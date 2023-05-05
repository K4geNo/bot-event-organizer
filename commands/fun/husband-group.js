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
        .setName('husband-group')
        .setDescription('Cria uma votação de husbando')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option
                .setName('campeonato')
                .setDescription('Digite o nome do campeonato')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Husbando League - Grupo A',
                        value: 'Husbando League - Grupo A',
                    },
                    {
                        name: 'Husbando League - Grupo B',
                        value: 'Husbando League - Grupo B',
                    },
                    {
                        name: 'Husbando League - Grupo C',
                        value: 'Husbando League - Grupo C',
                    },
                    {
                        name: 'Husbando League - Grupo D',
                        value: 'Husbando League - Grupo D',
                    },
                    {
                        name: 'Husbando League - Grupo E',
                        value: 'Husbando League - Grupo E',
                    },
                    {
                        name: 'Husbando League - Grupo F',
                        value: 'Husbando League - Grupo F',
                    },
                    {
                        name: 'Husbando League - Grupo G',
                        value: 'Husbando League - Grupo G',
                    },
                    {
                        name: 'Husbando League - Grupo H',
                        value: 'Husbando League - Grupo H',
                    },
                    {
                        name: 'Husbando League - Grupo I',
                        value: 'Husbando League - Grupo I',
                    },
                    {
                        name: 'Husbando League - Grupo J',
                        value: 'Husbando League - Grupo J',
                    },
                    {
                        name: 'Husbando League - Grupo K',
                        value: 'Husbando League - Grupo K',
                    },
                    {
                        name: 'Husbando League - Grupo L',
                        value: 'Husbando League - Grupo L',
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
        .addStringOption((option) =>
            option
                .setName('name-3')
                .setDescription('Digite o nome do terceiro husbando')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('name-4')
                .setDescription('Digite o nome do quarto husbando')
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
        const inputThree = interaction.options.getString('name-3')
        const inputFour = interaction.options.getString('name-4')
        const file = interaction.options.getAttachment('file')

        let voteQuantityHusbandOne = 0
        let voteQuantityHusbandTwo = 0
        let voteQuantityHusbandThree = 0
        let voteQuantityHusbandFour = 0

        const voteOne = new ButtonBuilder()
            .setCustomId('voteOne')
            .setLabel('Vote')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔴')

        const voteTwo = new ButtonBuilder()
            .setCustomId('voteTwo')
            .setLabel('Vote')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔵')

        const voteThree = new ButtonBuilder()
            .setCustomId('voteThree')
            .setLabel('Vote')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🟢')

        const voteFour = new ButtonBuilder()
            .setCustomId('voteFour')
            .setLabel('Vote')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🟡')

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
                },
                {
                    name: inputThree,
                    value: `Votos: \`${String(voteQuantityHusbandThree)}\``,
                    inline: true,
                },
                {
                    name: inputFour,
                    value: `Votos: \`${String(voteQuantityHusbandFour)}\``,
                    inline: true,
                }
            )
            .setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            voteOne,
            voteTwo,
            voteThree,
            voteFour
        )

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
                } else if (userVotes[interaction.user.id] === 'voteTwo') {
                    voteQuantityHusbandTwo--
                } else if (userVotes[interaction.user.id] === 'voteThree') {
                    voteQuantityHusbandThree--
                } else if (userVotes[interaction.user.id] === 'voteFour') {
                    voteQuantityHusbandFour--
                }
            }

            // Atualize o objeto de estado com a nova escolha do usuário
            userVotes[interaction.user.id] = interaction.customId

            // Atualize o número de votos para a opção selecionada
            if (interaction.customId === 'voteOne') {
                voteQuantityHusbandOne++
            } else if (interaction.customId === 'voteTwo') {
                voteQuantityHusbandTwo++
            } else if (interaction.customId === 'voteThree') {
                voteQuantityHusbandThree++
            } else if (interaction.customId === 'voteFour') {
                voteQuantityHusbandFour++
            }

            const updatedEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(campeonato)
                .setAuthor({
                    name: `Último usuário a votar: ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL(),
                })
                .setDescription('Vote no husbando mais pika!')
                // .addFields(
                //     {
                //         name: inputOne,
                //         value: `Votos: \`${String(voteQuantityHusbandOne)}\``,
                //     },
                //     { name: '\u200B', value: '\u200B' },
                //     {
                //         name: inputTwo,
                //         value: `Votos: \`${String(voteQuantityHusbandTwo)}\``,
                //     }
                // )
                // .addFields(
                //     { name: '\u200B', value: '\u200B' },
                //     {
                //         name: inputThree,
                //         value: `Votos: \`${String(voteQuantityHusbandThree)}\``,
                //     },
                //     {
                //         name: inputFour,
                //         value: `Votos: \`${String(voteQuantityHusbandFour)}\``,
                //     }
                // )
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    {
                        name: 'Inline field title',
                        value: 'Some value here',
                        inline: true,
                    },
                    {
                        name: 'Inline field title',
                        value: 'Some value here',
                        inline: true,
                    }
                )
                .addFields({
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                })
                .setImage(file.url)
                .setTimestamp()

            await interaction.update({
                embeds: [updatedEmbed],
                components: [row],
            })
        })
    },
}
