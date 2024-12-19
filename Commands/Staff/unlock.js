const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
} = require("discord.js");
const adminRoleId = '1315542145796542474';  // Si es necesario importar el id del rol


module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Desbloquea el canal para que los miembros puedan enviar mensajes.'),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        try {
            // Desbloquear el canal permitiendo el permiso de enviar mensajes
            const channel = interaction.channel;
            channel.permissionOverwrites.create(interaction.guild.id, {
                SendMessages: true,
            });    

            // Crear el embed para la confirmación
            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle('🔓 Canal Desbloqueado')
                .setDescription('✅ El canal ha sido desbloqueado. Ahora los miembros pueden enviar mensajes en este canal.')
                .setTimestamp()
                .setFooter({ text: 'Comando ejecutado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            // Enviar la confirmación con embed
            await interaction.reply({ embeds: [embed], ephemeral: false });

        } catch (error) {
            console.error("Error al desbloquear el canal:", error);
            return interaction.reply({
                content: "❌ Ocurrió un error al intentar desbloquear el canal.",
                ephemeral: true
            });
        }
    }
};