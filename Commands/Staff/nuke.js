const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Elimina todos los mensajes de este canal y lo recrea.'),
    
    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const channel = interaction.channel;

        // Verificar permisos del bot en el canal
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({
                content: "❌ No tengo permisos para administrar este canal.",
                ephemeral: true
            });
        }

        await interaction.reply({
            content: "⚠️ Este canal será **eliminado** y recreado. Confirma esta acción.",
            ephemeral: true
        });

        try {
            // Guardar configuración del canal actual
            const channelPosition = channel.position;
            const channelParent = channel.parent;
            const channelName = channel.name;
            const channelTopic = channel.topic;
            const isNSFW = channel.nsfw;

            // Crear un embed para notificar la recreación del canal
            const embed = new EmbedBuilder()
                .setTitle("💥 Canal Reiniciado")
                .setDescription(`Este canal fue reiniciado por <@${interaction.user.id}>.`)
                .setColor(0xFF0000)
                .setTimestamp();

            // Clonar el canal y borrar el actual
            const newChannel = await channel.clone({
                name: channelName,
                topic: channelTopic,
                nsfw: isNSFW,
                parent: channelParent,
                position: channelPosition,
            });

            await channel.delete(); // Eliminar el canal actual
            await newChannel.send({ embeds: [embed] }); // Enviar notificación al canal nuevo
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: "❌ Hubo un problema al reiniciar el canal.",
            });
        }
    },
};
