const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Eliminar una cantidad específica de mensajes en el canal.')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a eliminar')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const cantidad = interaction.options.getInteger('cantidad');

        // Verificar si el bot tiene permisos para eliminar mensajes
        if (!interaction.guild.members.me.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                content: "❌ No tengo permisos para gestionar mensajes.",
                ephemeral: true
            });
        }

        try {
            // Eliminar los mensajes
            const messages = await interaction.channel.messages.fetch({ limit: cantidad });

            // Borrar los mensajes
            await interaction.channel.bulkDelete(messages, true);

            // Crear el embed para la confirmación
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🧹 Mensajes Eliminados')
                .setDescription(`✅ Se han eliminado **${cantidad}** mensajes de este canal.`)
                .setTimestamp()
                .setFooter({ text: 'Comando ejecutado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error("Error al eliminar mensajes:", error);
            return interaction.reply({
                content: "❌ Ocurrió un error al intentar eliminar los mensajes.",
                ephemeral: true
            });
        }
    }
};
