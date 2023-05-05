const {
    SlashCommandBuilder,
    ButtonStyle,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionsBitField,
    PermissionFlagsBits,
    CommandInteraction,
} = require('discord.js')

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Cria uma votação de waifu')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option
                .setName('campeonato')
                .setDescription('Digite o nome do campeonato')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Waifus League - Segunda Fase',
                        value: 'Waifus League - Segunda Fase',
                    },
                    {
                        name: 'Waifus League - Oitavas de final',
                        value: 'Waifus League - Oitavas de final',
                    },
                    {
                        name: 'Waifus League - Quartas de final',
                        value: 'Waifus League - Quartas de final',
                    },
                    {
                        name: 'Waifus League - Semifinal',
                        value: 'Waifus League - Semifinal',
                    },
                    {
                        name: 'Waifus League - Final',
                        value: 'Waifus League - Final',
                    }
                )
        )
        .addStringOption((option) =>
            option
                .setName('name-1')
                .setDescription('Digite o nome da primeira waifu')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('name-2')
                .setDescription('Digite o nome da segunda waifu')
                .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option
                .setName('file')
                .setDescription('Envie a imagem da waifu')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.ManageChannels
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

        // Waifu Channel
        const allowedChannel = '1075398782642044938'
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

        // Captura dos dados
        const campeonato = interaction.options.getString('campeonato')
        const inputOne = interaction.options.getString('name-1')
        const inputTwo = interaction.options.getString('name-2')
        const file = interaction.options.getAttachment('file')

        let voteQuantityWaifuOne = 0
        let voteQuantityWaifuTwo = 0

        const extractNameOne = inputOne.split(' - ')[0]
        const extractNameTwo = inputTwo.split(' - ')[0]

        const voteOne = new ButtonBuilder()
            .setCustomId('voteOne')
            .setLabel(extractNameOne)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('💙')

        const voteTwo = new ButtonBuilder()
            .setCustomId('voteTwo')
            .setLabel(extractNameTwo)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('❤️')

        const embed = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle(campeonato)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
            })
            .setDescription('Vote na sua waifu favorita!')
            .setImage(file.url)
            .addFields(
                {
                    name: inputOne,
                    value: `Votos: \`${String(voteQuantityWaifuOne)}\``,
                    inline: true,
                },
                {
                    name: inputTwo,
                    value: `Votos: \`${String(voteQuantityWaifuTwo)}\``,
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
                    voteQuantityWaifuOne--
                } else {
                    voteQuantityWaifuTwo--
                }
            }

            // Atualize o objeto de estado com a nova escolha do usuário
            userVotes[interaction.user.id] = interaction.customId

            // Atualize o número de votos para a opção selecionada
            if (interaction.customId === 'voteOne') {
                voteQuantityWaifuOne++
            } else {
                voteQuantityWaifuTwo++
            }

            const updatedEmbed = new EmbedBuilder()
                .setColor('LuminousVividPink')
                .setTitle(campeonato)
                .setAuthor({
                    name: `Último voto: ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL(),
                })
                .setDescription('Vote na sua waifu favorita!')
                .setImage(file.url)
                .addFields(
                    {
                        name: inputOne,
                        value: `Votos: \`${String(voteQuantityWaifuOne)}\``,
                        inline: true,
                    },
                    {
                        name: inputTwo,
                        value: `Votos: \`${String(voteQuantityWaifuTwo)}\``,
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
