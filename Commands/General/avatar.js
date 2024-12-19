const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Selecciona un usuario para ver su avatar.')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Obtén el usuario (si no se pasa, usa el que ejecutó el comando)
        const user = interaction.options.getUser('usuario') || interaction.user;
        
        // Obtén la URL del avatar del usuario
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 1024 });

        // Crear el embed
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle(`Avatar de ${user.username}`)
            .setImage(avatarURL)
            .setTimestamp();

        // Crear la fila de botones con el botón para descargar
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Descargar Avatar')
                .setStyle(ButtonStyle.Link)
                .setURL(avatarURL)
        );

        // Responder con el embed y el botón
        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
