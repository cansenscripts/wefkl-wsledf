const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sugerencia')
        .setDescription('Envía una sugerencia.')
        .addStringOption(option => 
            option.setName('sugerencia')
                .setDescription('Escribe tu sugerencia')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Canal donde se permiten las sugerencias
        const allowedChannelId = '1315537584608378880';
        
        // Verificar si el comando se usa en el canal permitido
        if (interaction.channel.id !== allowedChannelId) {
            return interaction.reply({
                content: "Este comando solo se puede usar en el canal de sugerencias.",
                ephemeral: true,
            });
        }

        // Obtener la sugerencia del usuario
        const suggestion = interaction.options.getString('sugerencia');

        // Crear el embed para la sugerencia
        const embed = new EmbedBuilder()
            .setTitle("Nueva Sugerencia")
            .setDescription(`\`\`\`${suggestion}\`\`\``) // Sugerencia en formato de código (letras de máquina de escribir)
            .addFields(
                { name: 'Sugerido por', value: `<@${interaction.user.id}>` }
            )
            .setColor(0xffffff) // Color blanco
            .setTimestamp()
            .setFooter({ text: '¡Gracias por tu sugerencia!' })
            .setAuthor({ 
                name: interaction.user.tag, 
                iconURL: interaction.user.displayAvatarURL() 
            });

        // Enviar la respuesta ephemeral al usuario que hizo la sugerencia
        await interaction.reply({
            content: "¡Gracias por tu sugerencia! Aquí está la sugerencia enviada.",
            ephemeral: true,
        });

        // Enviar el embed en el canal de sugerencias
        const suggestionMessage = await interaction.channel.send({
            embeds: [embed],
        });

        // Agregar las reacciones de votación (👍 y 👎)
        await suggestionMessage.react('👍');
        await suggestionMessage.react('👎');
    },
};
