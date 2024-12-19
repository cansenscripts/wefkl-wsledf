const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compra')
        .setDescription('Entregar producto.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Selecciona un usuario para entregar')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('producto')
                .setDescription('Nombre del producto')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link para descargar')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const usuario = interaction.options.getUser('usuario');
        const producto = interaction.options.getString('producto');
        const link = interaction.options.getString('link');

        const embed = new EmbedBuilder()
        .setTitle('**SISTEMA DE COMPRAS**')
        .setDescription(`❤️ **Gracias**\nAgradecemos que haz adquirido un producto de la store\n\n🛒 **Producto**: ${producto}\n\n📌 **Link**: [Clickea aqui](${link}) o puedes clickear el boton`)
        .setColor('White')
        .setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel('Link')
            .setURL(`${link}`)
            .setStyle(ButtonStyle.Link)
        );

        interaction.reply({ content: 'Compra enviada', ephemeral: true })
        interaction.channel.send({ embeds: [embed], components: [row] })

    },
};
